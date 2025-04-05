const Sales = (sequelize, DataTypes) => {
  return sequelize.define(
    "sales",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shop_sales_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "shop",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      totalSales: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      yearSales: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      monthSales: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      daySales: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      hourSales: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      menuSales: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};
module.exports = Sales;
