'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    user_id: { type: DataTypes.STRING, primaryKey: true },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password_salt: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'tenant', 'landlord', 'agent'),
    verification_status: DataTypes.ENUM('pending', 'verified', 'rejected'),
    profile_image_url: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};