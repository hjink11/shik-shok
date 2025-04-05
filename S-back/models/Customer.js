const Customer = (sequelize, DataTypes) => {
  return sequelize.define(
    'customer',
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
      gender: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING(255),
        unique: true,
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
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      isDelete: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      membershipType: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      timestamps: false,
      freezeTableName: true,
    },
  );
};

module.exports = Customer;
