'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OTP.init({
    user_id: DataTypes.STRING,
    code: DataTypes.STRING,
    expire_at: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OTP',
  });
  return OTP;
};