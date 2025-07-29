'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-create-enseignant.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Enseignants', {
      idEnseignant: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      specialite: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'Users',
          key: 'id'
        }
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Enseignants');
  }
};
