const express = require('express');
const { getAllUsers, getAllListings, getPendingListings } = require('../controllers/adminController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorization');
const router = express.Router();


router.get('/get-all-users', authenticate, authorize('admin'), getAllUsers);
router.get('/get-all-listings', authenticate, authorize('admin'), getAllListings);
router.get('/get-pending-listings', authenticate, authorize('admin'), getPendingListings);