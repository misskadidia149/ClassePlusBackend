'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-create-tache.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Taches', {
      idTache: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      titre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fichierJoint: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Taches');
  }
};
