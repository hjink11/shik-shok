const OwnerWallet = (sequelize, DataTypes) => {
  return sequelize.define(
    "ownerWallet", // 테이블 이름을 'ownerWallet'로 설정
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "owner",
          key: "id",
        },

        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      totalMoney: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chargedMoney: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chargeTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      withdrawMoney: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      withdrawTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );
};

module.exports = OwnerWallet;
