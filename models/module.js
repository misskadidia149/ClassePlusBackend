// models/module.js
module.exports = (sequelize, DataTypes) => {
  const Modle = sequelize.define('Module', {
    idModule: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    enseignantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Enseignants',
        key: 'idEnseignant'
      }
    }
  });

  Modle.associate = (models) => {
    Modle.belongsTo(models.Enseignant, { foreignKey: 'enseignantId' });
    Modle.hasMany(models.Tache, { foreignKey: 'moduleId' });
    Modle.belongsToMany(models.Groupe, { through: 'ModuleGroupes' });
  };

  return Modle;
};