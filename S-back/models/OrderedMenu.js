const OrderMenu = (sequelize, DataTypes) => {
  return sequelize.define(
    "orderedMenu",
    {
      shop_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "order",
          shop_order_id: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      menuName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      totalPrice: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      visitTime: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};

module.exports = OrderMenu;
