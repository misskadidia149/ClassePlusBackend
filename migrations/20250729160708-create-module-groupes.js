'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-create-module-groupes.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ModuleGroupes', {
      moduleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Modules',
          key: 'idModule'
        },
        primaryKey: true
      },
      groupeId: {
        type: Sequelize.UUID,
        references: {
          model: 'Groupes',
          key: 'idGroupe'
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
    await queryInterface.dropTable('ModuleGroupes');
  }
};
