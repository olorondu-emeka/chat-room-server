import { get24hrTime } from '../../helper';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChatroomMessages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      senderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      chatroomId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Chatrooms',
          key: 'id'
        }
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: get24hrTime(
          new Date().getHours(),
          new Date().getMinutes()
        )
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('ChatroomMessages');
  }
};
