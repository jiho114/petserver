module.exports = (sequelize, DataTypes) =>{
  const user=sequelize.define("User", {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id : {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    pw : {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    name : {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    phone : {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email : {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    birth : {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    marketingChecked : {
      type: DataTypes.STRING(10),
      allowNull: false,
    }
  },{
    timestamps: false, //createdeAt, updatedAt생성방지
  });
  return user;
}