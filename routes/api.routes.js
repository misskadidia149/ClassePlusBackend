const express = require('express');
const app = express();

// Import des middlewares
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const roleCheck = require('./middleware/roleCheck');
const upload = require('./middleware/upload');

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware.authenticateToken); // JWT sur toutes les routes

// Import des routes
const authRoutes = require('./routes/authRoutes');
const enseignantRoutes = require('./routes/enseignantRoutes');
const etudiantRoutes = require('./routes/etudiantRoutes');
// ... autres imports de routes ...

// Routes publiques (sans vérification de rôle)
app.use('/api/auth', authRoutes);

// Routes protégées avec contrôle de rôle
app.use('/api/enseignants', roleCheck(['Enseignant', 'Coordinateur']), enseignantRoutes);
app.use('/api/etudiants', roleCheck(['Etudiant']), etudiantRoutes);
app.use('/api/documents', roleCheck(['Enseignant', 'Coordinateur']), documentRoutes);

// Routes avec uploads (exemple)
app.post('/api/soumissions', 
  roleCheck(['Etudiant']),
  upload.array('fichiers', 3), // 3 fichiers max
  soumissionController.create
);

// Middleware de gestion d'erreurs (DOIT être le dernier middleware)
app.use(errorHandler);

module.exports = app;