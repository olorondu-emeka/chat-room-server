export default (sequelize, DataTypes) => {
  const ChatroomMessageCheckpoint = sequelize.define(
    'ChatroomMessageCheckpoint',
    {
      chatroomId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      lastMessageId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );

  return ChatroomMessageCheckpoint;
};
