'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       Lesson.belongsTo(models.Module, { foreignKey: 'moduleId' });
    }
  }
  Lesson.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    video_url: DataTypes.STRING,
    order: DataTypes.INTEGER,
    moduleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lesson',
    tableName: 'LESSONS'
  });
  return Lesson;
};