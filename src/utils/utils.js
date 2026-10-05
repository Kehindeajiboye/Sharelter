const crypto = require('crypto');

const generateOTP = () => {
  const otp = crypto.randomInt(100000, 1000000); // Generates a random integer between 100000 and 999999
  return otp.toString();
}

const expiredOTP = () => {
    return Date.now() + 5 * 60 * 1000; // Returns the current time plus 5 minutes in milliseconds
}

module.exports = {
  generateOTP,
  expiredOTP
};