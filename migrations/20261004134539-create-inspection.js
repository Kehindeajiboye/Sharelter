'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inspections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      inspection_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.STRING,
        foreignKey: true,
        references: {
          model: 'Users',
          key: 'user_id'
        }
      },
      seller_id: {
        type: Sequelize.STRING,
        foreignKey: true,
        references: {
          model: 'Users',
          key: 'user_id'
        }
      },
      scheduled_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      scheduled_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM ("pending",  "approved", "rejected"),
        defaultValue: "pending"
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
    await queryInterface.dropTable('Inspections');
  }
};