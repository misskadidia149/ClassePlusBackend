// models/tache.js
module.exports = (sequelize, DataTypes) => {
  const Tache = sequelize.define('Tache', {
    idTache: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fichierJoint: {
      type: DataTypes.STRING
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

  Tache.associate = (models) => {
    Tache.belongsTo(models.Module, { foreignKey: 'moduleId' });
    Tache.belongsTo(models.Groupe, { foreignKey: 'groupeId' });
    Tache.hasOne(models.Solution, { foreignKey: 'tacheId' });
  };

  return Tache;
};