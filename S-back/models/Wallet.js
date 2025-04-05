const Wallet = (sequelize, DataTypes) => {
  return sequelize.define(
    "wallet",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customer",
          key: "id",
        },
        unique: true,
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
      },
      withdrawTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};
module.exports = Wallet;
