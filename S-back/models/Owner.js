const Owner = (sequelize, DataTypes) => {
  return sequelize.define(
    "owner",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      userid: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      pw: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      join_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isDelete: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      businessNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ownerShopname: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ownerShopaddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      ownerShoptype: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      membershipType: {
        type: DataTypes.STRING(255),
        defaultValue: "없음",
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};

module.exports = Owner;
