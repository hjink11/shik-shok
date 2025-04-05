const Menu = (sequelize, DataTypes) => {
  return sequelize.define(
    "menu",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shop_menu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "shop",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      menuName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      menudesc: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      originMfile: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      saveMfile: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    { timestamps: false, freezeTableName: true }
  );
};
module.exports = Menu;
