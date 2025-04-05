const express = require("express");
const router = express.Router();

const controller = require("../controller/Cmain");
const income = require("../controller/Income");
const review = require("../controller/Review");
const menu = require("../controller/Cmenu");
const userController = require("../controller/UserController");
const shopController = require("../controller/ShopController");
const moneyController = require("../controller/MoneyController");

const orderController = require("../controller/OrderController");


//s3설정
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
//버전업

const upload = multer({ dest: "uploads/" });

//-추가한 upload1로 이름을
const upload1 = multer({
  storage: multer.memoryStorage(),
});

// GET /api-server
router.get("/", controller.getIndex);

// GET /api-server/owner
router.get("/owner", controller.getOwner);

// POST /api-server/income/orderMenu
router.post("/income/orderMenu", income.orderMenu);
// POST /api-server/income/orderVisitor
router.post("/income/orderVisitor", income.orderVisitor);
// POST /api-server/income/reVisitor
router.post("/income/reVisitor", income.reVisitor);

// POST /api-server/income
// router.post("/income", income.income);

// GET /api-server/owner-review
router.get("/owner-review", review.getOwnerReview);

// PATCH /api-server/owner-review/:id
router.patch("/owner-review/:id", review.updateOwnerReview);

// PATCH /api-server/owner-review (고객리뷰 삭제요청)
router.patch("/owner-review", review.CusReviewDelete);

// DELETE /api-server/owner-review/:id
router.delete("/owner-review/:id", review.deleteOwnerReview);

// GET /api-server/menu-list

router.post("/menu-list", menu.getMenus);


// POST /api-server/menu-register
router.post("/menu-register", upload.single("image"), menu.createMenus);

// PATCH /api-server/menu-change
router.patch("/menu-change", upload.single("image"), menu.updateMenus);

// DELETE /api-server/menu-delete
router.delete("/menu-delete", menu.deleteMenu);

// 회원가입
router.post("/signup", userController.signUp);

// 로그인
router.post("/login", userController.login);

// 로그인한 사용자 정보 가져오기
router.get("/me", userController.getLoggedInUserProfile);

// 사용자 탈퇴
router.delete("/delete/:nickname", userController.deleteUser);

// 사용자 프로필 수정
router.put("/update", userController.updateUserProfile);

// 로그아웃 (DELETE 메소드 사용)
router.delete("/logout", userController.logout);

// 현재 비밀번호 확인 라우트 추가
router.post("/check-password", userController.checkPassword);

// 점주 회원 10개, 상점 10개 생성
router.get("/createOwner", userController.createOwners);

//고객 회원 10개 생성
router.get("/createCustomer", userController.createCustomers);

//모든상점 조회
router.get("/getShop", shopController.getShop);


router.get("/getOwner/:shopLoginId", shopController.getOwner);

router.post("/addOrder", orderController.addOrder);


//사용자 리뷰 get /api-sever/review
router.get("/review", review.getReview);
//사용자 리뷰 등록 post /api-sever/review
router.post("/review", upload1.single("image"), review.postReview);

//리뷰 위한 손님주문목록 조회
router.get("/customerOrderAllHistory", review.OrderAll);

// 머니 충전 라우트
router.post("/charge", moneyController.chargeMoney);

module.exports = router;
