// models/progression.js
module.exports = (sequelize, DataTypes) => {
  const Progression = sequelize.define('Progression', {
    idProgression: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    étape: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Modules',
        key: 'idModule'
      }
    },
    groupeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Groupes',
        key: 'idGroupe'
      }
    }
  });

  Progression.associate = (models) => {
    Progression.belongsTo(models.Module, { foreignKey: 'moduleId' });
    Progression.belongsTo(models.Groupe, { foreignKey: 'groupeId' });
  };

  return Progression;
};