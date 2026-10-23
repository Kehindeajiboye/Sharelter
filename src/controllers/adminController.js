const { User, Listing, AuditLog } = require("../../models");
const { v4: uuidv4 } = require("uuid");


const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                is_active: true,
                role: ["tenant", "landlord", "agent"]
            },
            attributes: { exclude: ["password_salt", "password_hash"] }
        })
        res.status(200).json({
            status: true,
            message: "Users fetched successfully",
            data: users
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching users"
        })
    }
}


const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.findAll({
            where: {
                verification_status: "verified"
            },
            attributes: { exclude: ["reason_for_rejection"] }
        })
        res.status(200).json({
            status: true,
            message: "Listings fetched successfully",
            data: listings
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching listings"
        })
    }
}


const getPendingLists = async (req, res) => {
    try {
        const listings = await Listing.findAll({
            where: {
                verification_status: "pending"
            },
            attributes: { exclude: ["reason_for_rejection"] }
        })
        res.status(200).json({
            status: true,
            message: "Pending listings fetched successfully",
            data: listings
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error fetching pending listings"
        })
    }
}

const approveListing = async (req, res) => {
    const { listing_id } = req.params
    try {
        const listing = await Listing.findByPk(listing_id)
        if (!listing) {
            return res.status(404).json({
                status: false,
                message: "Listing not found"
            })
        }
        if (listing.verification_status === "verified") {
            return res.status(400).json({
                status: false,
                message: "Listing is already verified"
            })
        }
        listing.verification_status = "verified"
        await listing.save()

        const audit_id = uuidv4(); // Generate a unique audit_id
        await AuditLog.create({
            audit_id,
            admin_id: req.user.user_id, // Assuming you have the admin's user_id in req.user
            action_taken: "Approved Listing",
            description: `Listing with ID ${listing_id} has been approved by admin ${req.user.user_id}`
        })

        res.status(200).json({
            status: true,
            message: "Listing approved successfully",
            data: listing
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Error approving listing"
        })
    }
}

module.exports = {
    getAllUsers,
    getAllListings,
    getPendingLists,
    approveListing
}