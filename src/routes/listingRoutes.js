const express = require('express');
// TODO(auth): swap to the real authenticate middleware once it's implemented
const { devAuthenticate: authenticate } = require('../middleware/devAuthenticate');
const { authorize } = require('../middleware/authorization');
const { LISTER_ROLES, SAVER_ROLES } = require('../constants/listing');
const {
    createListing,
    getMyListings,
    updateListing,
    deleteListing,
    submitListing,
    getListings,
    getListingById
} = require('../controllers/listingController');
const {
    saveListing,
    unsaveListing,
    getSavedListings
} = require('../controllers/savedListingController');

const router = express.Router();

/**
 * @swagger
 * /api/listings:
 *   get:
 *     summary: Public feed and search of published, available listings
 *     tags: [Listings]
 *     parameters:
 *       - { in: query, name: q, schema: { type: string }, description: Keyword in title, description or location }
 *       - { in: query, name: location, schema: { type: string } }
 *       - { in: query, name: min_price, schema: { type: number } }
 *       - { in: query, name: max_price, schema: { type: number } }
 *       - { in: query, name: listing_type, schema: { type: string, enum: [apartment, hostel] } }
 *       - { in: query, name: bedrooms, schema: { type: integer }, description: Minimum number of bedrooms }
 *       - { in: query, name: flatmate, schema: { type: string, enum: [male, female, any] } }
 *       - { in: query, name: size, schema: { type: string, enum: [moderate, large] } }
 *       - { in: query, name: sort, schema: { type: string, enum: [newest, price_asc, price_desc], default: newest } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 12, maximum: 50 } }
 *     responses:
 *       200: { description: Listing cards and pagination info (empty list when nothing matches) }
 *       400: { description: Invalid filter }
 */
router.get('/', getListings);

/**
 * @swagger
 * /api/listings:
 *   post:
 *     summary: Create a draft listing (landlord or agent)
 *     tags: [Listings]
 *     responses:
 *       201: { description: Draft created }
 *       400: { description: Validation error }
 *       403: { description: Not a landlord or agent }
 */
router.post('/', authenticate, authorize(...LISTER_ROLES), createListing);

/**
 * @swagger
 * /api/listings/mine:
 *   get:
 *     summary: List the logged-in landlord or agent's own listings
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [draft, submitted, under_review, published, rejected] }
 *     responses:
 *       200: { description: Listings }
 */
router.get('/mine', authenticate, authorize(...LISTER_ROLES), getMyListings);

/**
 * @swagger
 * /api/listings/saved:
 *   get:
 *     summary: The logged-in tenant's saved listings (most recently saved first)
 *     tags: [Saved Listings]
 *     responses:
 *       200: { description: Saved listing cards with saved_at }
 *       403: { description: Not a tenant }
 */
router.get('/saved', authenticate, authorize(...SAVER_ROLES), getSavedListings);

/**
 * @swagger
 * /api/listings/{listing_id}:
 *   get:
 *     summary: Public details of a published listing, with the owner's public profile
 *     tags: [Listings]
 *     parameters:
 *       - { in: path, name: listing_id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Listing details }
 *       404: { description: Not found or not published }
 */
router.get('/:listing_id', getListingById);

/**
 * @swagger
 * /api/listings/{listing_id}:
 *   patch:
 *     summary: Edit your own draft or rejected listing
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: listing_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found or not yours }
 *       409: { description: Listing is locked in its current status }
 *   delete:
 *     summary: Delete your own draft or rejected listing
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: listing_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found or not yours }
 *       409: { description: Listing is locked in its current status }
 */
router.patch('/:listing_id', authenticate, authorize(...LISTER_ROLES), updateListing);
router.delete('/:listing_id', authenticate, authorize(...LISTER_ROLES), deleteListing);

/**
 * @swagger
 * /api/listings/{listing_id}/submit:
 *   post:
 *     summary: Submit your draft or rejected listing for admin review
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: listing_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Submitted }
 *       400: { description: Required fields missing }
 *       404: { description: Not found or not yours }
 *       409: { description: Already submitted, under review or published }
 */
router.post('/:listing_id/submit', authenticate, authorize(...LISTER_ROLES), submitListing);

/**
 * @swagger
 * /api/listings/{listing_id}/save:
 *   post:
 *     summary: Save a published listing
 *     tags: [Saved Listings]
 *     parameters:
 *       - { in: path, name: listing_id, required: true, schema: { type: string } }
 *     responses:
 *       201: { description: Saved }
 *       200: { description: Already saved }
 *       404: { description: Not found or not published }
 *   delete:
 *     summary: Remove a listing from saved
 *     tags: [Saved Listings]
 *     parameters:
 *       - { in: path, name: listing_id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Removed (or was not saved) }
 */
router.post('/:listing_id/save', authenticate, authorize(...SAVER_ROLES), saveListing);
router.delete('/:listing_id/save', authenticate, authorize(...SAVER_ROLES), unsaveListing);

module.exports = router;