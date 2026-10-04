'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Report.init({
    report_id: DataTypes.STRING,
    reporter_id: DataTypes.STRING,
    reported_user_id: DataTypes.STRING,
    listing_id: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.ENUM,
    status: DataTypes.ENUM
  }, {
    sequelize,
    modelName: 'Report',
  });
  return Report;
};