const { v4: uuidv4 } = require('uuid');
const { sequelize, Listing, User, AuditLog } = require('../../models');
const { rejectListingSchema } = require('../validations/listingValidation');
const { LISTING_STATUS } = require('../constants/listing');


const REVIEWABLE_STATUSES = [LISTING_STATUS.SUBMITTED, LISTING_STATUS.UNDER_REVIEW];

const writeAudit = (req, action, description, transaction) => {
    return AuditLog.create({
        audit_id: uuidv4(),
        admin_id: req.user.user_id,
        action_taken: action,
        description: description.slice(0, 255)
    }, { transaction });
}


const lockListing = (req, transaction) => {
    return Listing.findByPk(req.params.listing_id, { transaction, lock: transaction.LOCK.UPDATE });
}

const sendResult = (res, result) => {
    if (result.error) {
        return res.status(result.error.code).json({
            status: "error",
            message: result.error.message
        });
    }
    return res.status(200).json({
        status: "success",
        data: result.listing
    });
}

const getReviewQueue = async (req, res) => {
    const status = req.query.status;
    if (status && !REVIEWABLE_STATUSES.includes(status)) {
        return res.status(400).json({
            status: "error",
            message: `Status must be one of: ${REVIEWABLE_STATUSES.join(', ')}`
        });
    }

    const listings = await Listing.findAll({
        where: { status: status || REVIEWABLE_STATUSES },
        include: [{
            model: User,
            as: 'owner',
            attributes: ['user_id', 'first_name', 'last_name', 'email', 'role', 'verification_status']
        }],
        order: [['submitted_at', 'ASC']]
    });

    return res.status(200).json({
        status: "success",
        data: listings
    });
}

const startReview = async (req, res) => {
    const result = await sequelize.transaction(async (transaction) => {
        const listing = await lockListing(req, transaction);
        if (!listing) {
            return { error: { code: 404, message: "Listing not found" } };
        }
        if (listing.status !== LISTING_STATUS.SUBMITTED) {
            return { error: { code: 409, message: `Only submitted listings can be taken for review; this one is ${listing.status}` } };
        }

        await listing.update({
            status: LISTING_STATUS.UNDER_REVIEW,
            reviewed_by: req.user.user_id
        }, { transaction });
        await writeAudit(req, 'listing.review_started', `Started review of listing ${listing.listing_id}`, transaction);

        return { listing };
    });

    return sendResult(res, result);
}

const approveListing = async (req, res) => {
    const result = await sequelize.transaction(async (transaction) => {
        const listing = await lockListing(req, transaction);
        if (!listing) {
            return { error: { code: 404, message: "Listing not found" } };
        }
        if (!REVIEWABLE_STATUSES.includes(listing.status)) {
            return { error: { code: 409, message: `Listing is ${listing.status} and cannot be approved` } };
        }


        const owner = await User.findByPk(listing.user_id, { transaction });
        if (!owner || owner.verification_status !== 'verified') {
            return { error: { code: 409, message: "The owner's account must be verified before this listing can be published" } };
        }

        await listing.update({
            status: LISTING_STATUS.PUBLISHED,
            verification_status: 'verified',
            listing_status: 'available',
            rejection_reason: null,
            reviewed_by: req.user.user_id,
            reviewed_at: new Date()
        }, { transaction });
        await writeAudit(req, 'listing.approved', `Approved listing ${listing.listing_id}`, transaction);

        return { listing };
    });

    return sendResult(res, result);
}

const rejectListing = async (req, res) => {
    const { error, value } = rejectListingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            status: "error",
            message: error.details.map(detail => detail.message)
        });
    }

    const result = await sequelize.transaction(async (transaction) => {
        const listing = await lockListing(req, transaction);
        if (!listing) {
            return { error: { code: 404, message: "Listing not found" } };
        }
        if (!REVIEWABLE_STATUSES.includes(listing.status)) {
            return { error: { code: 409, message: `Listing is ${listing.status} and cannot be rejected` } };
        }

        await listing.update({
            status: LISTING_STATUS.REJECTED,
            rejection_reason: value.reason,
            reviewed_by: req.user.user_id,
            reviewed_at: new Date()
        }, { transaction });
        await writeAudit(req, 'listing.rejected', `Rejected listing ${listing.listing_id}: ${value.reason}`, transaction);

        return { listing };
    });

    return sendResult(res, result);
}

module.exports = {
    getReviewQueue,
    startReview,
    approveListing,
    rejectListing
}