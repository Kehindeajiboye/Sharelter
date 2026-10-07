'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Listing.init({
    listing_id: { type: DataTypes.STRING, primaryKey: true },
    user_id: DataTypes.STRING,
    price: { type: DataTypes.DECIMAL, precision: 10, scale: 2 },
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    listing_type: DataTypes.ENUM('apartment', 'hostel'),
    listing_image_main: DataTypes.STRING,
    bedroom: DataTypes.INTEGER,
    kitchen: DataTypes.INTEGER,
    listing_images: DataTypes.JSON,
    flatmate: DataTypes.ENUM('male', 'female', 'any'),
    size: DataTypes.ENUM('moderate', 'large'),
    verification_status: DataTypes.ENUM('pending', 'verified'),
    listing_status: DataTypes.ENUM('available', 'not available')
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};