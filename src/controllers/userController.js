const { User, SavedListing } = require("../../models");
const { updateUserSchema } = require("../validations/userValidation");

const updateUser = async (req, res) => {
  const user = req.user;
  const { error, value } = updateUserSchema.validate(req.body);
  try {
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const userExists = await User.findOne({ where: { user_id: user.user_id } });
    if (!userExists) {
      return res.status(404).json({
        status: false,
        error: "User not found",
      });
    }
    //   await userExists.update(value);(this also works but I prefer the below method)

    await User.update(value, { where: { user_id: user.user_id } });
    return res.status(200).json({
      status: true,
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

const saveDraft = async (req, res) => {
  const user = req.user;
  const { listing_id } = req.params;
  try {
    const checkSavedListing = await SavedListing.findOne({
      where: { user_id: user.user_id, listing_id },
    });
    if (checkSavedListing) {
      return res.status(400).json({
        status: false,
        message: "Listing already saved",
      });
    }
    await SavedListing.create({ user_id: user.user_id, listing_id });
    return res.status(200).json({
      status: true,
      message: "Listing saved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

const deleteDraft = async (req, res) => {
  const user = req.user;
  const { listing_id } = req.params;

  try {
    const checkSavedListing = await SavedListing.findOne({
      where: { user_id: user.user_id, listing_id },
    });

    if (!checkSavedListing) {
      return res.status(404).json({
        status: false,
        message: "Listing not found",
      });
    }

    await SavedListing.destroy({
      where: { user_id: user.user_id, listing_id },
    });

    return res.status(200).json({
      status: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

const getSavedListings = async (req, res) => {
  const user = req.user;

  try {
    const savedListings = await SavedListing.findAll({
      where: { user_id: user.user_id },
    });

    return res.status(200).json({
      status: true,
      data: savedListings,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};



module.exports = {
  updateUser,
  saveDraft,
  deleteDraft,
  getSavedListings,
};
