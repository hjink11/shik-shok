const OrderSummary = (sequelize, DataTypes) => {
  return sequelize.define(
    "ordersummary",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sum_cus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customer",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      sum_shop_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "shop",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      orderSum: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      sumTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sumOrderTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};
module.exports = OrderSummary;
