//commonJs문법
module.exports = (sequelize, DataTypes) => {
  const product =sequelize.define("Product", {
      name: {
        type:DataTypes.STRING(20),
        allowNull: false,
      },
      price: {
        type:DataTypes.INTEGER(10),
        allowNull: false,
      },
      seller: {
        type:DataTypes.STRING(20),
        allowNull: false,
      },
      description: {
        type:DataTypes.STRING(200),
        allowNull: false,
      },
      imageUrl: {
        type:DataTypes.STRING(200),
        allowNull: true,
      },
  });
  return product
}