'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-create-correction.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Corrections', {
      idCorrection: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      commentaires: {
        type: Sequelize.TEXT
      },
      fichiersJoint: {
        type: Sequelize.TEXT
      },
      dateCorrection: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      soumissionId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
        references: {
          model: 'Soumissions',
          key: 'idSoumission'
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
    await queryInterface.dropTable('Corrections');
  }
};
