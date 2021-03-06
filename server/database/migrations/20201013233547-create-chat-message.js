import { get24hrTime } from '../../helper';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ChatMessages', {
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
      recipientId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: get24hrTime()
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
    await queryInterface.dropTable('ChatMessages');
  }
};
