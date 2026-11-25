const express = require('express');
const { getAllUsers, getAllListings, getPendingListings, approveListing, rejectListing, getPendingReports, suspendListing, unsuspendListing } = require('../controllers/adminController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorization');
const router = express.Router();


router.get('/get-all-users', authenticate, authorize('admin'), getAllUsers);
router.get('/get-all-listings', authenticate, authorize('admin'), getAllListings);
router.get('/get-pending-listings', authenticate, authorize('admin'), getPendingListings);
router.get('/get-pending-reports', authenticate, authorize('admin'), getPendingReports);
router.patch('/approve-listing/:listingId', authenticate, authorize('admin'), approveListing);
router.patch('/reject-listing/:listingId', authenticate, authorize('admin'), rejectListing);
router.patch('/suspend-listing/:listingId', authenticate, authorize('admin'), suspendListing);
router.patch('/unsuspend-listing/:listingId', authenticate, authorize('admin'), unsuspendListing);

module.exports = router;

