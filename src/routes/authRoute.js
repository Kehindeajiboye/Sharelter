const express = require('express');
const { createNewUser, verifyUser, resendVerificationCode, loginUser } = require('../controllers/authController');
const router = express.Router();


router.post('/signup', createNewUser);
router.post('/verify/:email', verifyUser);
router.post('/resend-verification-code/:email', resendVerificationCode);
router.post('/login', loginUser);


module.exports = router;