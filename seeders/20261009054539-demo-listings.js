'use strict';

const listing = (id, user_id, fields) => ({
  listing_id: id,
  user_id,
  kitchen: 1,
  listing_image_main: `https://example.com/${id}.jpg`,
  verification_status: 'verified',
  status: 'published',
  listing_status: 'available',
  reviewed_by: 'user-1',
  submitted_at: new Date('2026-09-30'),
  createdAt: new Date('2026-09-30'),
  updatedAt: new Date(),
  ...fields,
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Listings', [
      listing('demo-1', 'landlord-1', { title: '2 bedroom flat in Yaba', description: 'Spacious 2 bedroom flat with steady water and a large compound.', location: 'Yaba, Lagos', listing_type: 'apartment', price: 850000, bedroom: 2, flatmate: 'any', size: 'large', reviewed_at: new Date('2026-10-01') }),
      listing('demo-2', 'agent-1', { title: 'Female hostel near UNILAG', description: 'Quiet female-only hostel, five minutes walk from the UNILAG main gate.', location: 'Akoka, Lagos', listing_type: 'hostel', price: 250000, bedroom: 1, flatmate: 'female', size: 'moderate', reviewed_at: new Date('2026-10-02') }),
      listing('demo-3', 'agent-1', { title: 'Male hostel room in Yaba', description: 'Shared male hostel room with study area and 24 hour security.', location: 'Yaba, Lagos', listing_type: 'hostel', price: 200000, bedroom: 1, flatmate: 'male', size: 'moderate', reviewed_at: new Date('2026-10-03') }),
      listing('demo-4', 'landlord-1', { title: '3 bedroom duplex in Lekki', description: 'Fully serviced 3 bedroom duplex with parking for two cars.', location: 'Lekki, Lagos', listing_type: 'apartment', price: 3500000, bedroom: 3, flatmate: 'any', size: 'large', reviewed_at: new Date('2026-10-04') }),
      listing('demo-5', 'landlord-1', { title: 'Mini flat in Surulere', description: 'Neat mini flat off Adeniran Ogunsanya, close to shops and transport.', location: 'Surulere, Lagos', listing_type: 'apartment', price: 600000, bedroom: 1, flatmate: 'any', size: 'moderate', reviewed_at: new Date('2026-10-05') }),
      listing('demo-6', 'landlord-1', { title: 'Studio in Yaba (rented)', description: 'Studio apartment that has already been let to a tenant.', location: 'Yaba, Lagos', listing_type: 'apartment', price: 500000, bedroom: 1, flatmate: 'any', size: 'moderate', listing_status: 'not available', reviewed_at: new Date('2026-10-06') }),
      listing('demo-7', 'landlord-1', { title: 'Draft flat in Yaba', description: 'This listing is still a draft and must never appear publicly.', location: 'Yaba, Lagos', listing_type: 'apartment', price: 700000, bedroom: 2, flatmate: 'any', size: 'large', status: 'draft', verification_status: 'pending', listing_status: 'not available', reviewed_by: null, reviewed_at: null, submitted_at: null }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Listings', { listing_id: ['demo-1', 'demo-2', 'demo-3', 'demo-4', 'demo-5', 'demo-6', 'demo-7'] }, {});
  }
};