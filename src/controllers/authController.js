const { Op } = require("sequelize");
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid");
const { User, OTP } = require("../../models");
const { signupSchema } = require("../validations/authValidation");
const { generateOTP, expiredOTP } = require("../utils/utils");

const createNewUser = async (req, res) => {
    const { error, value } = signupSchema.validate(req.body, { abortEarly: false });
    console.log("Validation result:", { error, value });


    if (error) {
        return res.status(400).json({
            status: "error",
            message: error.details.map(detail => detail.message)
        });
    }


    try {
        const checkIfExists = await User.findAll({
            where: {
                email: value.email
            }
        })

        if (checkIfExists.length > 0) {
            return res.status(400).json({
                status: false,
                message: "User already exists"
            })
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value.password, salt);
        const user_id = uuidv4();

        const newUser = await User.create({
            user_id,
            first_name: value.first_name,
            last_name: value.last_name,
            email: value.email,
            phone: value.phone,
            password_salt: salt,
            password_hash: hash,
            role: value.role
        })

        const otp = generateOTP();
        const otpExpiry = expiredOTP();

        await OTP.create({
            user_id: newUser.user_id,
            code: otp,
            expire_at: otpExpiry
        })
        
        return res.status(201).json({
            status: true,
            message: "Check your email for verification code",
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message || "Server error"
        })
    }
}