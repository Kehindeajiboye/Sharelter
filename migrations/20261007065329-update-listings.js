'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Listings', 'title', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Listings', 'status', {
      type: Sequelize.ENUM("draft", "submitted", "under_review", "published", "rejected"),
      defaultValue: "draft"
    });
    await queryInterface.addColumn('Listings', 'rejection_reason', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('Listings', 'submitted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Listings', 'reviewed_at', {
      type: Sequelize.DATE,
      allowNull: true
    });
    await queryInterface.addColumn('Listings', 'reviewed_by', {
      type: Sequelize.STRING,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    });
    await queryInterface.changeColumn('Listings', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.changeColumn('Listings', 'price', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true
    });
    await queryInterface.changeColumn('Listings', 'location', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('Listings', 'listing_type', {
      type: Sequelize.ENUM("apartment", "hostel"),
      allowNull: true
    });
    await queryInterface.changeColumn('Listings', 'listing_image_main', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Listings', 'title');
    await queryInterface.removeColumn('Listings', 'status');
    await queryInterface.removeColumn('Listings', 'rejection_reason');
    await queryInterface.removeColumn('Listings', 'submitted_at');
    await queryInterface.removeColumn('Listings', 'reviewed_at');
    await queryInterface.removeColumn('Listings', 'reviewed_by');
    await queryInterface.changeColumn('Listings', 'description', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('Listings', 'price', {
      type: Sequelize.DECIMAL,
      allowNull: false
    });
    await queryInterface.changeColumn('Listings', 'location', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.changeColumn('Listings', 'listing_type', {
      type: Sequelize.ENUM("apartment", "hostel"),
      allowNull: false
    });
    await queryInterface.changeColumn('Listings', 'listing_image_main', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};