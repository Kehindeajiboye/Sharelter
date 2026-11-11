const express = require('express');
const { createNewUser, verifyUser, resendVerificationCode, loginUser, startForgetPassword, completeForgetPassword } = require('../controllers/authController');
const upload = require('../middleware/upload');
const router = express.Router();


router.post('/signup', upload.single('avatar'), createNewUser);
router.post('/verify/:email', verifyUser);
router.post('/resend-verification-code/:email', resendVerificationCode);
router.post('/login', loginUser);
router.post('/start-forget-password', startForgetPassword);
router.post('/complete-forget-password', completeForgetPassword);


module.exports = router;