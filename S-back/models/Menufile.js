// const Menufile = (sequelize, DataTypes) => {
//   return sequelize.define(
//     "menufile",
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       menu_id: {
//         type: DataTypes.INTEGER,
//         allowNull: true,
//         references: {
//           model: "menu",
//           key: "id",
//         },
//         onDelete: "CASCADE",
//         onUpdate: "CASCADE",
//       },
//       originMfile: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//       },
//       saveMfile: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//       },
//     },
//     { timestamps: false, freezeTableName: true }
//   );
// };
// module.exports = Menufile;
