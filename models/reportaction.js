'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportAction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ReportAction.init({
    report_id: DataTypes.STRING,
    admin_id: DataTypes.STRING,
    report_action: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ReportAction',
  });
  return ReportAction;
};