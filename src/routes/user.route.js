const express = require('express');
const { authenticate } = require('../middleware/authenticate');
const { reportUser } = require('../controllers/user.controller');
const router = express.Router();


router.post('/report', authenticate, reportUser);

module.exports = router;