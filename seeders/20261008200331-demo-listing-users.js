'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const base = {
      password_salt: 'dev_salt',
      password_hash: 'dev_hash',
      verification_status: 'verified',
      profile_image_url: 'https://example.com/profile.jpg',
      is_active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await queryInterface.bulkInsert('Users', [
      { ...base, user_id: 'landlord-1', first_name: 'Lara', last_name: 'Landlord', email: 'landlord@example.com', phone: '08000000001', role: 'landlord' },
      { ...base, user_id: 'agent-1', first_name: 'Ade', last_name: 'Agent', email: 'agent@example.com', phone: '08000000002', role: 'agent' },
      { ...base, user_id: 'tenant-1', first_name: 'Tola', last_name: 'Tenant', email: 'tenant@example.com', phone: '08000000003', role: 'tenant' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { user_id: ['landlord-1', 'agent-1', 'tenant-1'] }, {});
  }
};