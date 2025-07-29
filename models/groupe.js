// models/groupe.js
module.exports = (sequelize, DataTypes) => {
  const Groupe = sequelize.define('Groupe', {
    idGroupe: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coordinateurId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  Groupe.associate = (models) => {
    Groupe.belongsTo(models.User, { foreignKey: 'coordinateurId', as: 'coordinateur' });
    Groupe.belongsToMany(models.User, { through: 'GroupeMembres', as: 'membres' });
    Groupe.belongsToMany(models.Module, { through: 'ModuleGroupes' });
    Groupe.hasMany(models.Tache, { foreignKey: 'groupeId' });
    Groupe.hasMany(models.Solution, { foreignKey: 'groupeId' });
    Groupe.hasMany(models.Progression, { foreignKey: 'groupeId' });
  };

  return Groupe;
};