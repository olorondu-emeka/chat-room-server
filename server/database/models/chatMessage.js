export default (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    'ChatMessage',
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );
  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };
  return ChatMessage;
};
