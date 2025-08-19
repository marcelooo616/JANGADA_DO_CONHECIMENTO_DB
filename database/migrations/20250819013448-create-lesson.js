'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('LESSONS', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      content: { 
        type: Sequelize.TEXT
      },
      video_url: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      moduleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'MODULES',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
   await queryInterface.dropTable('LESSONS');
  }
};
