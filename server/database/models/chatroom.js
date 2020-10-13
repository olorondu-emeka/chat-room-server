'use strict';
 
module.exports = (sequelize, DataTypes) => {
  const Chatroom = sequelize.define(
    'Chatroom',
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      numberOfMembers: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  Chatroom.associate = (models) => {
    Chatroom.belongsToMany(models.User, {
      foreignKey: 'chatroomId',
      otherKey: 'userId',
      through: 'ChatroomMembers',
      as: 'users',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Chatroom.belongsToMany(models.Message, {
      foreignKey: 'chatroomId',
      otherKey: 'messageId',
      through: 'ChatroomMessages',
      as: 'messages',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return Chatroom;
};