require("dotenv").config();
const jwt = require("jsonwebtoken");


const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Authorization token is required");
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                throw new Error("Invalid or expired token");
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: error.message || "Unauthorized"
        });
    }
}


module.exports = {
    authenticate
}