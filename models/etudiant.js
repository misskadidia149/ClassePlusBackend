// models/etudiant.js
module.exports = (sequelize, DataTypes) => {
  const Etudiant = sequelize.define('Etudiant', {
    idEtudiant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    matricule: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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

  Etudiant.associate = (models) => {
    Etudiant.belongsTo(models.User, { foreignKey: 'userId' });
    Etudiant.belongsToMany(models.Groupe, { 
      through: 'GroupeMembres', 
      as: 'groupes' 
    });
  };

  return Etudiant;
};