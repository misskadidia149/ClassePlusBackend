'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-create-progression.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Progressions', {
      idProgression: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      étape: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      moduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Modules',
          key: 'idModule'
        }
      },
      groupeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Groupes',
          key: 'idGroupe'
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
    await queryInterface.dropTable('Progressions');
  }
};
