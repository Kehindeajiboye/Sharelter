const express = require('express');
const { updateUser, saveDraft, deleteDraft, getSavedListings } = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');
const { authorize } = require('../middleware/authorization');
const router = express.Router();


router.put('/update-user',authenticate,authorize('tenant'),updateUser);
router.post('/save-draft/:listing_id', authenticate, authorize('tenant'), saveDraft);
router.delete('/delete-draft/:listing_id', authenticate, authorize('tenant'), deleteDraft);
router.get('/saved-listings', authenticate, authorize('tenant'), getSavedListings);

module.exports = router;