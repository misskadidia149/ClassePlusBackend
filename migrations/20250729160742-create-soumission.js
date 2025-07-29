'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-create-soumission.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Soumissions', {
      idSoumission: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      fichiers: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      commentaires: {
        type: Sequelize.TEXT
      },
      dateSoumission: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      tacheId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Taches',
          key: 'idTache'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      groupeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Groupes',
          key: 'idGroupe'
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
  down: async (queryInterface) => {
    await queryInterface.dropTable('Soumissions');
  }
};
