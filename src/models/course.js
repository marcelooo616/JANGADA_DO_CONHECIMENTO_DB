'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     // RELAÇÕES:
      // Um Curso pertence a um Usuário (instrutor)
      Course.belongsTo(models.User, { foreignKey: 'userId', as: 'instructor' });
      // Um Curso pertence a uma Categoria
      Course.belongsTo(models.Category, { foreignKey: 'categoryId' });
      // Um Curso tem vários Módulos
      Course.hasMany(models.Module, { foreignKey: 'courseId', as: 'modules' });
    }
  }
  Course.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    cover_image_url: DataTypes.STRING,
    status: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'COURSES'
  });
  return Course;
};