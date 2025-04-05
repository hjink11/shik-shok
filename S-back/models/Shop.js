const Shop = (sequelize, DataTypes) => {
  return sequelize.define(
    "shop",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        references: {
          model: "owner",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      shopName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      businessNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shopAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shopPhone: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      shopType: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      shopOwner: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};
module.exports = Shop;
