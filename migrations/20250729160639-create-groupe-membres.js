'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-create-groupe-membres.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('GroupeMembres', {
      groupeId: {
        type: Sequelize.UUID,
        references: {
          model: 'Groupes',
          key: 'idGroupe'
        },
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        primaryKey: true
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
    await queryInterface.dropTable('GroupeMembres');
  }
};
