module.exports=(sequelize, DataTypes) =>{
  const Comment = sequelize.define("Comment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT, //댓글 내용 긴문자열 허용
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  },
  {
    timestamps: true,
    underscored: true, //snake_case로 필드명 변경
  }
);
Comment.associate = (models) => {
  Comment.belongsTo(models.User, {foreignKey:"user_id", targetKey:"id"})
};
return Comment;
}