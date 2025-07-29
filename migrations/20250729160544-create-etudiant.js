'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-create-etudiant.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Etudiants', {
      idEtudiant: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      matricule: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
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
    await queryInterface.dropTable('Etudiants');
  }
};
