export default (sequelize, DataTypes) => {
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
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );

  User.associate = (models) => {
    User.hasOne(models.Session, {
      foreignKey: 'userId'
    });
    User.hasMany(models.ChatroomMessage, {
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
  User.findByEmail = async (email) => {
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ['password'] }
    });
    if (user) return user.dataValues;
    return null;
  };
  User.findById = async (id) => {
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] }
    });
    if (user) return user.dataValues;
    return null;
  };
  return User;
};
