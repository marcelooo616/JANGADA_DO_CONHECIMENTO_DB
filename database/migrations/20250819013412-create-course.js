'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('COURSES', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      cover_image_url: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      // Chave estrangeira para a tabela Users
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'USERS', // Nome da tabela de referência
          key: 'id'       // Coluna de referência
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Se o usuário for deletado, o curso fica sem instrutor
      },
      // Chave estrangeira para a tabela Categories
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'CATEGORIES', // Nome da tabela de referência
          key: 'id'         // Coluna de referência
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL' // Se a categoria for deletada, o curso fica sem categoria
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
        
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('COURSES');
  }
};
