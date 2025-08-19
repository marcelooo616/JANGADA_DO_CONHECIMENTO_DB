'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Module.belongsTo(models.Course, { foreignKey: 'courseId' });
      Module.hasMany(models.Lesson, { foreignKey: 'moduleId', as: 'lessons' });
    }
  }
  Module.init({
    title: DataTypes.STRING,
    order: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Module',
    tableName: 'MODULES'
  });
  return Module;
};