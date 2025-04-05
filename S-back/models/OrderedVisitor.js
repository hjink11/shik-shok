const OrderedVisitor = (sequelize, DataTypes) => {
  return sequelize.define(
    "orderedVisitor",
    {
      shop_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      visitors: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isTakeout: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      visitTime: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};

module.exports = OrderedVisitor;
