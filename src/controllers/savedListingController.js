const { Listing, SavedListing } = require('../../models');
const { LISTING_STATUS, CARD_ATTRIBUTES } = require('../constants/listing');

const saveListing = async (req, res) => {
    const listing = await Listing.findOne({
        where: {
            listing_id: req.params.listing_id,
            status: LISTING_STATUS.PUBLISHED
        }
    });
    if (!listing) {
        return res.status(404).json({
            status: "error",
            message: "Listing not found"
        });
    }

    const [, created] = await SavedListing.findOrCreate({
        where: {
            user_id: req.user.user_id,
            listing_id: listing.listing_id
        }
    });

    return res.status(created ? 201 : 200).json({
        status: "success",
        message: created ? "Listing saved" : "Listing already saved"
    });
}

const unsaveListing = async (req, res) => {
    const removed = await SavedListing.destroy({
        where: {
            user_id: req.user.user_id,
            listing_id: req.params.listing_id
        }
    });

    return res.status(200).json({
        status: "success",
        message: removed ? "Listing removed from saved" : "Listing was not saved"
    });
}

const getSavedListings = async (req, res) => {
    const saved = await SavedListing.findAll({
        where: { user_id: req.user.user_id },
        include: [{
            model: Listing,
            as: 'listing',
            attributes: CARD_ATTRIBUTES,
            where: { status: LISTING_STATUS.PUBLISHED }
        }],
        order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
        status: "success",
        data: saved.map(item => ({
            ...item.listing.toJSON(),
            saved_at: item.createdAt
        }))
    });
}

module.exports = {
    saveListing,
    unsaveListing,
    getSavedListings
}