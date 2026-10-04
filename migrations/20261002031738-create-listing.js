'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Listings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      listing_id: {
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
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      listing_type: {
        type: Sequelize.ENUM("apartment", "hostel"),
        allowNull: false
      },
      listing_image_main: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      bedroom: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      kitchen: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      listing_images: {
        type: Sequelize.JSON,
        allowNull: true
      },
      flatmate: {
        type: Sequelize.ENUM("male", "female", "any"),
        defaultValue: "any"
      },
      size: {
        type: Sequelize.ENUM("moderate", "large"),
        allowNull: true
      },
      verification_status: {
        type: Sequelize.ENUM("pending","verified"),
        defaultValue: "pending"
      },
      listing_status: {
        type: Sequelize.ENUM("available", "not available"),
        defaultValue: "not available"
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
    await queryInterface.dropTable('Listings');
  }
};