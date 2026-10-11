require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_APP_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const readEmail = async (payload, views) => {
    const filePath = path.join(__dirname, `../views/${views}.hbs`);
    console.log("File path:", filePath);
    const readFile = fs.readFileSync(filePath, 'utf8');
    const compile = hbs.compile(readFile);
    const result = compile(payload);
    return result;
}

const sendEmail = async (mailTo, subject, payload, views) => {
    try {
        const handlebarsTemplate = await readEmail(payload, views);
        const mailOptions = {
            from: process.env.GMAIL_APP_USER,
            to: mailTo,
            subject,
            html: handlebarsTemplate
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

const generateOTP = () => {
    const otp = crypto.randomInt(100000, 1000000); // Generates a random integer between 100000 and 999999
    return otp.toString();
}

const expiredOTP = () => {
    return Date.now() + 5 * 60 * 1000; // Returns the current time plus 5 minutes in milliseconds
}

module.exports = {
    generateOTP,
    expiredOTP,
    sendEmail
};