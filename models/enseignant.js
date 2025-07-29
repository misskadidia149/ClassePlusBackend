// models/enseignant.js
module.exports = (sequelize, DataTypes) => {
  const Enseignant = sequelize.define('Enseignant', {
    idEnseignant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    specialite: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  Enseignant.associate = (models) => {
    Enseignant.belongsTo(models.User, { foreignKey: 'userId' });
    Enseignant.hasMany(models.Module, { foreignKey: 'enseignantId' });
  };

  return Enseignant;
};