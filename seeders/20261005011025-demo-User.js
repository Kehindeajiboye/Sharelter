'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        user_id: 'user-1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'example@example.com',
        phone: '1234567890',
        password_salt: 'random_salt',
        password_hash: 'hashed_password',
        role: 'admin',
        verification_status: 'verified',
        profile_image_url: 'https://example.com/profile.jpg',
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
