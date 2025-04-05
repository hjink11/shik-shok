const Sequelize = require("sequelize");
const Shop = require("./Shop");
const Wallet = require("./Wallet");
const OwnerWallet = require("./OwnerWallet"); // OwnerWallet 모델 임포트

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

//db 불러오기기
const CustomerModel = require("./Customer")(sequelize, Sequelize);
const OwnerModel = require("./Owner")(sequelize, Sequelize);
const ShopModel = require("./Shop")(sequelize, Sequelize);
const MenuModel = require("./Menu")(sequelize, Sequelize);
// const MenufileModel = require("./Menufile")(sequelize, Sequelize);
const OrderModel = require("./Order")(sequelize, Sequelize);
const OrderedMenuModel = require("./OrderedMenu")(sequelize, Sequelize);
const OrderSummaryModel = require("./OrderSummary")(sequelize, Sequelize);
const WalletModel = require("./Wallet")(sequelize, Sequelize);
const ReviewModel = require("./Review")(sequelize, Sequelize);
const ReviewfileModel = require("./Reviewfile")(sequelize, Sequelize);
const SalesModel = require("./Sales")(sequelize, Sequelize);
const OrderedVisitorModel = require("./OrderedVisitor")(sequelize, Sequelize);

//db 관계 설정
//메뉴-메뉴 첨부파일
// MenuModel.hasOne(MenufileModel, {
//   foreignKey: "menu_id",
// });

//고객-지갑
CustomerModel.hasOne(WalletModel, {
  foreignKey: "customer_id",
});
//고객-주문요약
CustomerModel.hasOne(OrderSummaryModel, {
  foreignKey: "sum_cus_id",
});

//고객 - 주문

//고객-주문
CustomerModel.hasMany(OrderModel, {
  foreignKey: "cus_order_id",
});

//리뷰-리뷰 첨부파일
ReviewModel.hasOne(ReviewfileModel, {
  foreignKey: "review_id",
});
//점주-가게
OwnerModel.hasMany(ShopModel, {
  foreignKey: "owner_id",
});

//가게-주문요약
ShopModel.hasOne(OrderSummaryModel, {
  foreignKey: "sum_shop_id",
});

//가게-리뷰
ShopModel.hasMany(ReviewModel, {
  foreignKey: "shop_id",
});

//가게-매출
ShopModel.hasMany(SalesModel, {
  foreignKey: "shop_sales_id",
});

//가게-주문
ShopModel.hasMany(OrderModel, {
  foreignKey: "shop_order_id",
});

//가게-메뉴
ShopModel.hasMany(MenuModel, {
  foreignKey: "shop_menu_id",
});

//고객-리뷰
CustomerModel.hasMany(ReviewModel, {
  foreignKey: "cus_rev_id",
});
// ---- 추가
ReviewModel.belongsTo(CustomerModel, {
  foreignKey: "cus_rev_id",
  as: "customer",
});

OrderModel.hasMany(OrderedMenuModel, { foreignKey: "shop_order_id" });
OrderedMenuModel.belongsTo(OrderModel, { foreignKey: "shop_order_id" });

OrderModel.hasMany(OrderedMenuModel);
OrderedMenuModel.belongsTo(OrderModel);
OrderModel.hasMany(OrderedVisitorModel);
OrderedVisitorModel.belongsTo(OrderModel);

// OwnerWallet 모델 추가
const OwnerWalletModel = OwnerWallet(sequelize, Sequelize); // OwnerWallet 모델 등록
db.OwnerWallet = OwnerWalletModel; // db 객체에 OwnerWallet 추가
OwnerModel.hasOne(OwnerWalletModel, {
  foreignKey: "owner_id", // Owner와 OwnerWallet 간의 관계 설정
});

//db 객체에 모델 추가
db.Customer = CustomerModel;
db.Owner = OwnerModel;
db.Shop = ShopModel;
db.Menu = MenuModel;
// db.Menufile = MenufileModel;
db.Order = OrderModel;
db.OrderedMenu = OrderedMenuModel;
db.OrderSummaryMenu = OrderSummaryModel;
db.Wallet = WalletModel;
db.Review = ReviewModel;
db.Reviewfile = ReviewfileModel;
db.Sales = SalesModel;
db.OrderedMenu = OrderedMenuModel;
db.OrderedVisitor = OrderedVisitorModel;
module.exports = db;
