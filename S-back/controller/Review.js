const { where, Op } = require("sequelize");
const db = require("../models");
const {
  Shop,
  Review,
  Reviewfile,
  Customer,
  Order,
  OrderSummaryMenu,
  sequelize,
} = db;

//--- 업로드 용
//---파일
const dotenv = require("dotenv");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
dotenv.config();
//-- AWS 1붙임
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

const upload1 = multer({
  storage: multer.memoryStorage(),
});

// 업로드
const uploadFile = async (file) => {
  try {
    if (file) {
      const fileContent = file.buffer; // 파일 경로 대신 버퍼로 수정
      const decodeFile = Buffer.from(file.originalname, "binary").toString(
        "utf-8"
      );

      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${Date.now()}-${decodeFile}`, // 파일 이름 설정
        Body: fileContent,
        ACL: "public-read",
      };

      const command = new PutObjectCommand(uploadParams);
      const data = await s3Client.send(command);
      const fileInfo = {
        key: uploadParams.Key,
        location: `https://${uploadParams.Bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${uploadParams.Key}`,
      };
      // 등록된 파일의 key 값과 location 확인
      console.log("File uploaded successfully:"); //, data임 원래
      console.log("Key:", fileInfo.Key);
      console.log("Location:", fileInfo.location);
      return fileInfo;
    }
  } catch (error) {
    console.error("Error uploading data: ", error);
    if (res) {
      res.status(500).send(error);
    }
  }
};

//----함수 GET 과 POST
exports.getReview = async (req, res) => {
  try {
    console.log(req.query); // test용 1

    // orderId로 검색
    const order = await OrderSummaryMenu.findOne({
      where: {
        id: req.query.orderId,
      },
    });
    if (!order) {
      return res.status(404).json({ message: "해당 주문을 찾을 수 없습니다." });
    }
    // orderTime 가져옴
    // const { user_id, orderTime } = order;
    const user_id = order.sum_cus_id;
    const orderTime = order.sumOrderTime;

    //orderTime으로 검색
    const review = await Order.findAll({
      where: {
        orderTime: orderTime,
        // user_id: user_id,
        cus_order_id: user_id,
      },
    });
    console.log("검색결과", req.query);

    res.status(200).json({ review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

exports.postReview = async (req, res) => {
  const t = await sequelize.transaction(); // 트랜잭션 시작

  try {
    const fileInfo = req.file ? await uploadFile(req.file) : null; // 파일 업로드 처리
    const { reviewText, star, orderId, shopId, cus_order_id } = req.body;
    //--- 확인용들
    console.log("글", reviewText);
    console.log("별", star);
    console.log("회원", cus_order_id);
    console.log("주문ID", orderId);
    console.log("가게ID", shopId);
    console.log("파일", req.file);
    console.log("파일인포", fileInfo); //키, 로케이션

    // 1️ -- Review 테이블에 리뷰 저장
    const newReview = await Review.create(
      {
        cus_rev_id: cus_order_id, // 고객 ID 숫자
        shop_id: shopId, // 가게 ID  숫자
        score: star, // 별점  숫자
        content: reviewText, // 리뷰 내용
        writeTime: new Date(), // 작성 시간
      },
      { transaction: t }
    );
    console.log("생성된 리뷰 ID:", newReview.id);

    // --2️---- Reviewfile 테이블에 파일 정보 저장 (파일이 있을 경우)
    if (fileInfo) {
      await Reviewfile.create(
        {
          review_id: newReview.id, // 리뷰 ID 연결
          originRfile: req.file.originalname, // 원본 파일명
          saveRfile: fileInfo.location, // S3 업로드된 파일 URL
        },
        { transaction: t }
      );
      console.log("리뷰 파일 저장 완료");
    }

    await t.commit(); // 트랜잭션 커밋
    res.status(201).json({ message: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

//-----

exports.getOwnerReview = async (req, res) => {
  try {
    // 세션에서 userId 가져오기
    // if (!req.session.userId) {
    //   return res.status(401).json({ message: "로그인 필요" });
    // }

    console.log("shopId", req.query.shopId); // test 용

    // 가게 아이디로 리뷰 조회
    // - 리뷰, 리뷰파일, 회원 조회
    const review = await Review.findAll({
      where: { shop_id: req.query.shopId },
      include: [
        {
          model: Reviewfile,
          as: "reviewfile",
        },
        {
          model: Customer,
          as: "customer",
          attributes: ["nickname"], // 닉네임만 가져오기
        },
      ],
      order: [["id", "DESC"]],
    });

    const reviews = review.map((review) => ({
      id: review.id,
      cus_rev_id: review.cus_rev_id,
      shop_id: review.shop_id,
      score: review.score,
      content: review.content,
      writeTime: review.writeTime,
      owner_review: review.owner_review,
      isDelete: review.isDelete,
      reviewfile: review.reviewfile ? review.reviewfile.saveRfile : null,
      customer_nickname: review.customer.nickname,
    }));

    console.log(reviews);

    res.status(200).json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

//patch /api-sever/owner-review/:id
exports.updateOwnerReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { owner_review } = req.body;
    console.log(req.body);
    console.log(req.body.data);

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }

    review.owner_review = owner_review;
    await review.save();

    res.status(200).json({ message: "리뷰가 수정되었습니다.", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// DELETE /api-server/owner-review/:id
exports.deleteOwnerReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }
    //destory가 아니라 null로
    review.owner_review = null;
    await review.save();

    res.status(200).json({ message: "리뷰가 삭제되었습니다.", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// PATCH /api-server/owner-review (고객리뷰 삭제요청)
exports.CusReviewDelete = async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }

    review.isDelete = "yes";
    await review.save();

    res.status(200).json({ message: "리뷰삭제 요청 완료", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

//----------- 회원 주문목록 전체
exports.OrderAll = async (req, res) => {
  try {
    // console.log("여기---", req.query);
    // const orderList = await Order.findAll({
    //   where: { cus_order_id: req.query.id },
    // });
    //------ 추가
    const orderSum = await OrderSummaryMenu.findAll({
      where: { sum_cus_id: req.query.id },
      order: [["id", "DESC"]],
    });
    console.log("-------orderSum", orderSum);
    // -------------------------

    // console.log("조회값=", orderList);
    // res.status(200).json({ orderList, orderSum });
    res.status(200).json({ orderSum });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
