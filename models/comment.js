module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.TEXT, // 댓글 내용은 긴 문자열을 허용
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Users 테이블을 참조
          key: "id", // Users 테이블의 id 컬럼
        },
        onDelete: "CASCADE", // 유저 삭제 시 댓글도 삭제
        onUpdate: "CASCADE", // 유저 ID 변경 시 댓글도 업데이트
      },
      item_id: {
        type: DataTypes.INTEGER, // 댓글이 달린 대상(게시글, 상품 등)의 ID
        allowNull: false,
      },
    },
    {
      timestamps: true, // createdAt, updatedAt 자동 생성
      underscored: true, // snake_case로 필드명 변경
    }
  );
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: "user_id", targetKey: "id" });
  };
  return Comment;
};
