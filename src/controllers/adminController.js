const { User, Listing, AuditLog } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../utils/utils");


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
    const t = await sequelize.transaction(); // Start a transaction
    try {
        const listing = await Listing.findByPk(listing_id, { transaction: t })

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

        const user = await User.findByPk(listing.user_id, { transaction: t })

        listing.verification_status = "verified"
        await listing.save({ transaction: t })

        const audit_id = uuidv4(); // Generate a unique audit_id

        await AuditLog.create({
            audit_id,
            admin_id: req.user.user_id, // Assuming you have the admin's user_id in req.user
            action_taken: "Approved Listing",
            description: `Listing with ID ${listing_id} has been approved by admin ${req.user.user_id}`
        }, { transaction: t })

        await t.commit(); // Commit the transaction

        const payload = {
            firstName: user.first_name
        }

        await sendEmail(user.email, "Sharelter", payload, "listingApproved")

        res.status(200).json({
            status: true,
            message: "Listing approved successfully",
            data: listing
        })
    } catch (error) {
        await t.rollback(); // Rollback the transaction in case of error
        res.status(500).json({
            status: false,
            message: "Error approving listing"
        })
    }
}


const rejectListing = async (req, res) => {
    const { listing_id } = req.params
    const { reason_for_rejection } = req.body
    const t = await sequelize.transaction();

    try {
        const listing = await Listing.findByPk(listing_id, { transaction: t })
        
        if (!listing) {
            return res.status(404).json({
                status: false,
                message: "Listing not found"
            })
        }

        const user = await User.findByPk(listing.user_id, { transaction: t })

        if (!reason_for_rejection) {
            return res.status(400).json({
                status: false,
                message: "Reason for rejection is required"
            })
        }

        if (listing.verification_status === "verified") {
            return res.status(400).json({
                status: false,
                message: "Listing is already verified"
            })
        }

        if (listing.verification_status === "rejected") {
            return res.status(400).json({
                status: false,
                message: "Listing is already rejected"
            })
        }
        listing.verification_status = "rejected"
        listing.reason_for_rejection = reason_for_rejection
        await listing.save({ transaction: t })

        const audit_id = uuidv4(); // Generate a unique audit_id

        await AuditLog.create({
            audit_id,
            admin_id: req.user.user_id, // Assuming you have the admin's user_id in req.user
            action_taken: "Rejected Listing",
            description: `Listing with ID ${listing_id} has been rejected by admin ${req.user.user_id}`
        }, { transaction: t })

        await t.commit(); // Commit the transaction

        const payload = {
            firstName: user.first_name,
            verification_status: listing.verification_status,
            reason_for_rejection: listing.reason_for_rejection
        }

        await sendEmail(user.email, "Sharelter", payload, "listingRejected")

        res.status(200).json({
            status: true,
            message: "Listing rejected successfully",
            data: listing
        })
    } catch (error) {
        await t.rollback(); // Rollback the transaction in case of error
        res.status(500).json({
            status: false,
            message: "Error rejecting listing"
        })
    }
}



const suspendListing = async (req, res) => {
    const { listing_id } = req.params
    const t = await sequelize.transaction();

    try {
        const listing = await Listing.findByPk(listing_id, { transaction: t })

        if (!listing) {
            return res.status(404).json({
                status: false,
                message: "Listing not found"
            })
        }

        const user = await User.findByPk(listing.user_id, { transaction: t })

        if (!listing.suspended) {
            return res.status(500).json({
                status: false,
                message: "Listing is already suspended"
            })
        }

        if (listing.verification_status === "rejected") {
            return res.status(400).json({
                status: false,
                message: "Listing is already rejected"
            })
        }

        listing.suspended = false
        await listing.save({ transaction: t })

        const audit_id = uuidv4(); // Generate a unique audit_id

        await AuditLog.create({
            audit_id,
            admin_id: req.user.user_id,
            action_taken: "Suspended Listing",
            description: `Listing with ID ${listing_id} has been suspended by admin ${req.user.user_id}`
        }, { transaction: t })

        await t.commit(); // Commit the transaction

        const payload = {
            firstName: user.first_name
        }

        await sendEmail(user.email, "Sharelter", payload, "listingSuspended")

        res.status(200).json({
            status: true,
            message: "Listing suspended successfully",
            data: listing
        })


    } catch (error) {
        await t.rollback(); // Rollback the transaction in case of error
        res.status(500).json({
            status: false,
            message: "Error suspending listing"
        })
    }
}


module.exports = {
    getAllUsers,
    getAllListings,
    getPendingLists,
    rejectListing,
    approveListing,
    suspendListing
}