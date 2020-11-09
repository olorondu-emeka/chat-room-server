export default (sequelize, DataTypes) => {
  const Chatroom = sequelize.define(
    'Chatroom',
    {
      adminId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
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
      lastMessageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    Chatroom.hasMany(models.ChatroomMessage, {
      foreignKey: 'chatroomId',
      onDelete: 'CASCADE'
    });
  };
  return Chatroom;
};
