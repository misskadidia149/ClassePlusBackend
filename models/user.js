// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    motdepasse: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Enseignant', 'Etudiant', 'Coordinateur'),
      allowNull: false
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Message, { foreignKey: 'senderId', as: 'sentMessages' });
    User.hasMany(models.Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
    User.hasOne(models.Enseignant, { foreignKey: 'userId' });
    User.hasMany(models.Groupe, { foreignKey: 'coordinateurId' });
    User.belongsToMany(models.Groupe, { through: 'GroupeMembres', as: 'groupes' });
  };

  return User;
};