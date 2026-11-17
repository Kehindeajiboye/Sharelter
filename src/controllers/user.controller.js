const {v4: uuidv4} = require('uuid');
const { User, Report, Listing } = require("../../models");
const { reportSchema } = require('../validations/user.validation');



const reportUser = async (req, res, next) => {

    const { error, value } = reportSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: "error",
            message: error.details.map(detail => detail.message)
        });
    }

    try {
        const { description, type } = value;
        const report_id = uuidv4();
        const { reported_user_id } = req.params;
        const reporter_id = req.user_id;

        const user = await User.findOne({
            where: { user_id: reporter_id }
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        if (reporter_id === reported_user_id) {
            return res.status(400).json({
                status: false,
                message: "You cannot report yourself"
            });
        }

        const reportedUser = await User.findOne({
            where: { user_id: reported_user_id }
        });

        if (!reportedUser) {
            return res.status(404).json({
                status: false,
                message: "Reported user not found"
            });
        }

        const newReport = await Report.create({
            report_id,
            reporter_id,
            reported_user_id,
            description,
            type
        });

        return res.status(201).json({
            status: true,
            message: "Report submitted successfully",
            data: newReport
        });

    } catch (error) {
        next(error);
    }
};

const reportListing = async (req, res, next) => {

    const { error, value } = reportSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: "error",
            message: error.details.map(detail => detail.message)
        });
    }

    try {
        const { description, type } = value;
        const report_id = uuidv4();
        const { listing_id } = req.params;
        const reporter_id = req.user_id;

        const listing = await Listing.findOne({
            where: { listing_id }
        });

        if (!listing) {
            return res.status(404).json({
                status: false,
                message: "Listing not found"
            });
        }

        const newReport = await Report.create({
            report_id,
            reporter_id,
            listing_id,
            description,
            type
        });

        return res.status(201).json({
            status: true,
            message: "Report submitted successfully",
            data: newReport
        });

    } catch (error) {
        next(error);
    }
};





module.exports = { reportUser, reportListing };