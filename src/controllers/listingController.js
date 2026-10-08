const { v4: uuidv4 } = require('uuid');
const { Listing } = require('../../models');
const { createListingSchema, updateListingSchema, submitListingSchema } = require('../validations/listingValidation');
const { LISTING_STATUS, EDITABLE_STATUSES } = require('../constants/listing');

const validationError = (res, error) => {
    return res.status(400).json({
        status: "error",
        message: error.details.map(detail => detail.message)
    });
}


const findOwnListing = async (req, res) => {
    const listing = await Listing.findByPk(req.params.listing_id);
    if (!listing || listing.user_id !== req.user.user_id) {
        res.status(404).json({
            status: "error",
            message: "Listing not found"
        });
        return null;
    }
    return listing;
}

const createListing = async (req, res) => {
    const { error, value } = createListingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return validationError(res, error);
    }

    const listing = await Listing.create({
        ...value,
        listing_id: uuidv4(),
        user_id: req.user.user_id,
        status: LISTING_STATUS.DRAFT
    });

    return res.status(201).json({
        status: "success",
        data: listing
    });
}

const getMyListings = async (req, res) => {
    const where = { user_id: req.user.user_id };

    if (req.query.status) {
        if (!Object.values(LISTING_STATUS).includes(req.query.status)) {
            return res.status(400).json({
                status: "error",
                message: `Status must be one of: ${Object.values(LISTING_STATUS).join(', ')}`
            });
        }
        where.status = req.query.status;
    }

    const listings = await Listing.findAll({ where, order: [['updatedAt', 'DESC']] });

    return res.status(200).json({
        status: "success",
        data: listings
    });
}

const updateListing = async (req, res) => {
    const { error, value } = updateListingSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return validationError(res, error);
    }

    const listing = await findOwnListing(req, res);
    if (!listing) return;


    const onlyAvailability = Object.keys(value).every(key => key === 'listing_status');
    if (listing.status === LISTING_STATUS.PUBLISHED && onlyAvailability) {
        await listing.update(value);
        return res.status(200).json({
            status: "success",
            data: listing
        });
    }

    if (!EDITABLE_STATUSES.includes(listing.status)) {
        return res.status(409).json({
            status: "error",
            message: `Listing cannot be edited while it is ${listing.status}`
        });
    }


    await listing.update({ ...value, status: LISTING_STATUS.DRAFT });

    return res.status(200).json({
        status: "success",
        data: listing
    });
}

const deleteListing = async (req, res) => {
    const listing = await findOwnListing(req, res);
    if (!listing) return;

    if (!EDITABLE_STATUSES.includes(listing.status)) {
        return res.status(409).json({
            status: "error",
            message: `Listing cannot be deleted while it is ${listing.status}`
        });
    }

    await listing.destroy();

    return res.status(200).json({
        status: "success",
        message: "Listing deleted"
    });
}

const submitListing = async (req, res) => {
    const listing = await findOwnListing(req, res);
    if (!listing) return;

    if (!EDITABLE_STATUSES.includes(listing.status)) {
        return res.status(409).json({
            status: "error",
            message: `Listing is already ${listing.status}`
        });
    }


    const filledFields = Object.fromEntries(
        Object.entries(listing.get({ plain: true })).filter(([, value]) => value !== null)
    );
    const { error } = submitListingSchema.validate(filledFields, { abortEarly: false, allowUnknown: true });
    if (error) {
        return validationError(res, error);
    }

    await listing.update({
        status: LISTING_STATUS.SUBMITTED,
        submitted_at: new Date(),
        rejection_reason: null
    });

    return res.status(200).json({
        status: "success",
        data: listing
    });
}

module.exports = {
    createListing,
    getMyListings,
    updateListing,
    deleteListing,
    submitListing
}