'use strict';
 
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
    },
    {}
  );
  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Message.belongsToMany(models.Chatroom, {
      foreignKey: 'messageId',
      otherKey: 'chatroomId',
      through: 'ChatroomMessages',
      as: 'chatrooms',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
  return Message;
};