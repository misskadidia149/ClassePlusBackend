const app = require('./app');
const { sequelize } = require('./models');

// Configuration du port
const PORT = process.env.PORT || 3000;

// Synchronisation des modèles et démarrage du serveur
sequelize.sync({ alter: true }) // Attention : alter en dev seulement !
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🚀 Server ready on http://localhost:${PORT}`);
      console.log('📚 API Documentation:');
      console.log(`- Users: http://localhost:${PORT}/api/users`);
      console.log(`- Soumissions: http://localhost:${PORT}/api/soumissions\n`);
    });
  })
  .catch(err => {
    console.error('❌ Échec de la synchronisation de la DB:', err);
  });