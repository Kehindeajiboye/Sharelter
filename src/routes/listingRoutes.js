const express = require('express');
// TODO: swap to the real authenticate middleware once it's implemented
const { devAuthenticate: authenticate } = require('../middleware/devAuthenticate');
const { authorize } = require('../middleware/authorization');

const router = express.Router();

/**
 * @swagger
 * /api/listings/ping:
 *   get:
 *     summary: Check the listings router and auth wiring
 *     tags: [Listings]
 *     responses:
 *       200:
 *         description: Router and auth are wired up
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Logged in, but not a landlord or agent
 */
router.get('/ping', authenticate, authorize('landlord', 'agent'), (req, res) => {
    res.json({
        message: 'listings router OK',
        user: req.user
    });
});

module.exports = router;