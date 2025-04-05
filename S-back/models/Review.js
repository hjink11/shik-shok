const Review = (sequelize, DataTypes) => {
  return sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cus_rev_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "customer",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      shop_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "shop",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      writeTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      owner_review: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      isDelete: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};
module.exports = Review;
