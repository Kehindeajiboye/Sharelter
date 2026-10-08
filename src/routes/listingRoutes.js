const express = require('express');

const { devAuthenticate: authenticate } = require('../middleware/devAuthenticate');
const { authorize } = require('../middleware/authorization');
const { LISTER_ROLES } = require('../constants/listing');
const {
    createListing,
    getMyListings,
    updateListing,
    deleteListing,
    submitListing
} = require('../controllers/listingController');

const router = express.Router();

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

module.exports = router;