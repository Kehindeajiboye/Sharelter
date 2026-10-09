const express = require('express');
// TODO(auth): swap to the real authenticate middleware once it's implemented
const { devAuthenticate: authenticate } = require('../middleware/devAuthenticate');
const { authorize } = require('../middleware/authorization');
const {
    getReviewQueue,
    startReview,
    approveListing,
    rejectListing
} = require('../controllers/adminListingController');

const router = express.Router();

router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * /api/admin/listings:
 *   get:
 *     summary: Listings waiting for admin review (oldest first)
 *     tags: [Admin - Listings]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [submitted, under_review] }
 *     responses:
 *       200: { description: Review queue }
 */
router.get('/', getReviewQueue);

/**
 * @swagger
 * /api/admin/listings/{listing_id}/review:
 *   post:
 *     summary: Take a submitted listing for review
 *     tags: [Admin - Listings]
 *     parameters:
 *       - { in: path, name: listing_id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Now under review }
 *       409: { description: Listing is not submitted }
 * /api/admin/listings/{listing_id}/approve:
 *   post:
 *     summary: Approve and publish a listing
 *     tags: [Admin - Listings]
 *     parameters:
 *       - { in: path, name: listing_id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Published }
 *       409: { description: Not reviewable, or owner not verified }
 * /api/admin/listings/{listing_id}/reject:
 *   post:
 *     summary: Reject a listing with a reason
 *     tags: [Admin - Listings]
 *     parameters:
 *       - { in: path, name: listing_id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason: { type: string, minLength: 10 }
 *     responses:
 *       200: { description: Rejected }
 *       400: { description: Reason missing or too short }
 *       409: { description: Not reviewable }
 */
router.post('/:listing_id/review', startReview);
router.post('/:listing_id/approve', approveListing);
router.post('/:listing_id/reject', rejectListing);

module.exports = router;