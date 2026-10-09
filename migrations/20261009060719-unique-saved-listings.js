'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('SavedListings', {
      fields: ['user_id', 'listing_id'],
      type: 'unique',
      name: 'saved_listings_user_listing_unique'
    });
  },

    async down(queryInterface, Sequelize) {
    await queryInterface.addIndex('SavedListings', ['user_id'], { name: 'saved_listings_user_id' });
    await queryInterface.removeConstraint('SavedListings', 'saved_listings_user_listing_unique');
  }
};