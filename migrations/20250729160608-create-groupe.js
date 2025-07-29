'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-create-groupe.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Groupes', {
      idGroupe: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coordinateurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('Groupes');
  }
};
