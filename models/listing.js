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
    listing_id: DataTypes.STRING,
    user_id: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    listing_type: DataTypes.ENUM,
    listing_image_main: DataTypes.STRING,
    bedroom: DataTypes.INTEGER,
    kitchen: DataTypes.INTEGER,
    listing_images: DataTypes.JSON,
    flatmate: DataTypes.ENUM,
    size: DataTypes.ENUM,
    verification_status: DataTypes.ENUM,
    listing_status: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};