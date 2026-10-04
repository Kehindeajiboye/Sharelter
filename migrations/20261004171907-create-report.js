'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      report_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      reporter_id: {
        type: Sequelize.STRING,
        foreignKey: true,
        references: {
          model: 'Users',
          key: 'user_id'
        }
      },
      reported_user_id: {
        type: Sequelize.STRING,
        foreignKey: true,
        references: {
          model: 'Users',
          key: 'user_id'
        }
      },
      listing_id: {
        type: Sequelize.STRING,
        foreignKey: true,
        references: {
          model: 'Listings',
          key: 'listing_id'
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM ("fraud", "harassment", "extortion", "bad behaviour", "other"),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM ("open", "resolved", "dismissed"),
        defaultValue: "open"
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reports');
  }
};