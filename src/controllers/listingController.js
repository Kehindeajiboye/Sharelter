const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { Listing, User } = require('../../models');
const {
    createListingSchema,
    updateListingSchema,
    submitListingSchema,
    searchListingsSchema
} = require('../validations/listingValidation');
const { LISTING_STATUS, EDITABLE_STATUSES, CARD_ATTRIBUTES } = require('../constants/listing');



const HIDDEN_FIELDS = ['id', 'rejection_reason', 'reviewed_by', 'reviewed_at', 'submitted_at', 'verification_status'];

const PUBLIC_OWNER_ATTRIBUTES = ['user_id', 'first_name', 'last_name', 'role', 'verification_status'];

const FLATMATE_MATCHES = {
    male: ['male', 'any'],
    female: ['female', 'any'],
    any: ['any']
};

const SORT_ORDERS = {
    newest: [['reviewed_at', 'DESC'], ['listing_id', 'ASC']],
    price_asc: [['price', 'ASC'], ['listing_id', 'ASC']],
    price_desc: [['price', 'DESC'], ['listing_id', 'ASC']]
};

const escapeLike = (text) => text.replace(/[\\%_]/g, '\\$&');

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

const getListings = async (req, res) => {
    const { error, value } = searchListingsSchema.validate(req.query, { abortEarly: false });
    if (error) {
        return validationError(res, error);
    }

    const where = {
        status: LISTING_STATUS.PUBLISHED,
        listing_status: 'available'
    };

    if (value.q) {
        const term = `%${escapeLike(value.q)}%`;
        where[Op.or] = [
            { title: { [Op.like]: term } },
            { description: { [Op.like]: term } },
            { location: { [Op.like]: term } }
        ];
    }
    if (value.location) {
        where.location = { [Op.like]: `%${escapeLike(value.location)}%` };
    }
    if (value.listing_type) {
        where.listing_type = value.listing_type;
    }
    if (value.size) {
        where.size = value.size;
    }
    if (value.flatmate) {
        where.flatmate = FLATMATE_MATCHES[value.flatmate];
    }
    if (value.bedrooms !== undefined) {
        where.bedroom = { [Op.gte]: value.bedrooms };
    }
    if (value.min_price !== undefined || value.max_price !== undefined) {
        where.price = {};
        if (value.min_price !== undefined) where.price[Op.gte] = value.min_price;
        if (value.max_price !== undefined) where.price[Op.lte] = value.max_price;
    }

    const { count, rows } = await Listing.findAndCountAll({
        where,
        attributes: CARD_ATTRIBUTES,
        order: SORT_ORDERS[value.sort],
        limit: value.limit,
        offset: (value.page - 1) * value.limit
    });

    return res.status(200).json({
        status: "success",
        data: rows,
        pagination: {
            page: value.page,
            limit: value.limit,
            total: count,
            total_pages: Math.ceil(count / value.limit)
        }
    });
}

const getListingById = async (req, res) => {
    const listing = await Listing.findOne({
        where: {
            listing_id: req.params.listing_id,
            status: LISTING_STATUS.PUBLISHED
        },
        attributes: {
            exclude: HIDDEN_FIELDS,
            include: [['reviewed_at', 'published_at']]
        },
        include: [{ model: User, as: 'owner', attributes: PUBLIC_OWNER_ATTRIBUTES }]
    });

    if (!listing) {
        return res.status(404).json({
            status: "error",
            message: "Listing not found"
        });
    }

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
    submitListing,
    getListings,
    getListingById
}