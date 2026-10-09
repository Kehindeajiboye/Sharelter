'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inspection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Inspection.init({
    inspection_id: { type: DataTypes.STRING, primaryKey: true },
    user_id: DataTypes.STRING,
    seller_id: DataTypes.STRING,
    scheduled_date: DataTypes.DATE,
    scheduled_time: DataTypes.TIME,
    status: DataTypes.ENUM('pending', 'approved', 'rejected')
  }, {
    sequelize,
    modelName: 'Inspection',
  });
  return Inspection;
};