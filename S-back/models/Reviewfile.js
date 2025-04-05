const Reviewfile = (sequelize, DataTypes) => {
  return sequelize.define(
    "reviewfile",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      review_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "review",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      originRfile: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      saveRfile: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};
module.exports = Reviewfile;
