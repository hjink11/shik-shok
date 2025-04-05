const db = require("../models");
// const Shop = db.Shop;
const Owner = db.Owner;

//---  수정
const { Shop, Review, Sequelize } = require("../models");

exports.getShop = async (req, res) => {
  try {
    const shop = await Shop.findAll();
    console.log("샵 조회 확인 = ", shop);
    // res.status(200).send({ shop });

    // 각 shop의 평균 score 계산
    const shopsWithAvgScore = await Promise.all(
      shop.map(async (shop) => {
        const avgScoreResult = await Review.findOne({
          attributes: [
            [Sequelize.fn("AVG", Sequelize.col("score")), "averageScore"],
          ],
          where: { shop_id: shop.id },
          raw: true, // 결과를 단순 객체로 반환
        });

        return {
          ...shop.get({ plain: true }), // shop 데이터를 일반 객체로 변환
          averageScore: avgScoreResult
            ? Math.floor(avgScoreResult.averageScore)
            : 0, // 리뷰가 없을 경우 0 반환
        };
      })
    );
    console.log("평균--", shopsWithAvgScore);
    res.status(200).send({ shop, shopsWithAvgScore });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "서버 오류가 발생했습니다." });
  }
};

//=========

// exports.getShop = async (req, res) => {
//   try {
//     const shop = await Shop.findAll();
//     console.log("샵 조회 확인 = ", shop);
//     res.status(200).send({ shop });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "서버 오류가 발생했습니다." });
//   }
// };

exports.getOwner = async (req, res) => {
  const { shopLoginId } = req.params;

  console.log("겟오너 아이디 값 = ", shopLoginId);
  try {
    const owner = await Owner.findOne({
      where: {
        id: shopLoginId,
      },
    });
    console.log("오너 조회 확인 = ", owner);
    res.status(200).send({ owner });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "서버 오류가 발생했습니다." });
  }
};
