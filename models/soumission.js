// models/soumission.js
module.exports = (sequelize, DataTypes) => {
  const Soumission = sequelize.define('Soumission', {
    idSoumission: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fichiers: {
      type: DataTypes.TEXT, // ou DataTypes.JSON pour stocker plusieurs fichiers
      allowNull: false
    },
    commentaires: {
      type: DataTypes.TEXT
    },
    dateSoumission: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    tacheId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Taches',
        key: 'idTache'
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
  }, {
    // Optionnel : renommer automatiquement les timestamps
    createdAt: 'dateSoumission',
    updatedAt: false // Désactivé car dateSoumission est gérée manuellement
  });

  Soumission.associate = (models) => {
    Soumission.belongsTo(models.Tache, { 
      foreignKey: 'tacheId',
      as: 'tache' // Optionnel : alias pour la relation
    });
    Soumission.belongsTo(models.Groupe, { 
      foreignKey: 'groupeId',
      as: 'groupe' 
    });
    Soumission.hasOne(models.Correction, { 
      foreignKey: 'soumissionId',
      as: 'correction' 
    });
  };

  return Soumission;
};