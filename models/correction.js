// models/correction.js
module.exports = (sequelize, DataTypes) => {
  const Correction = sequelize.define('Correction', {
    idCorrection: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    commentaires: {
      type: DataTypes.TEXT
    },
    fichiersJoint: {
      type: DataTypes.TEXT // ou JSON pour stocker plusieurs fichiers
    },
    dateCorrection: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    soumissionId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'Solutions',
        key: 'idSoumission'
      }
    }
  });

  Correction.associate = (models) => {
    Correction.belongsTo(models.Solution, { foreignKey: 'soumissionId' });
  };

  return Correction;
};