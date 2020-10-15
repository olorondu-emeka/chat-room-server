export default (sequelize, DataTypes) => {
  const ChatroomMessage = sequelize.define(
    'ChatroomMessage',
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  ChatroomMessage.associate = (models) => {
    ChatroomMessage.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    ChatroomMessage.belongsTo(models.Chatroom, {
      foreignKey: 'chatroomId'
    });
  };
  return ChatroomMessage;
};
