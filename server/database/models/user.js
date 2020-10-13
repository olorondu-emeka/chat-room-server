'use strict';
 
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: DataTypes.STRING,
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      roleId: {
        type: DataTypes.INTEGER
      }
    },
    {}
  );
  User.associate = (models) => {
    User.hasMany(models.Message, {
      foreignKey: 'userId'
    });
    User.belongsToMany(models.Chatroom, {
      foreignKey: 'userId',
      otherKey: 'chatroomId',
      through: 'ChatroomMembers',
      as: 'chatrooms',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };
  return User;
};