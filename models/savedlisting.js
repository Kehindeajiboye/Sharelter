'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavedListing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SavedListing.belongsTo(models.Listing, { foreignKey: 'listing_id', targetKey: 'listing_id', as: 'listing' });
    }
  }
  SavedListing.init({
    user_id: DataTypes.STRING,
    listing_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SavedListing',
  });
  return SavedListing;
};