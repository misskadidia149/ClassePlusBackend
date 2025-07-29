// routes/annonceRoutes.js
const express = require('express');
const router = express.Router();
const annonceController = require('../controllers/annonceController');
const { authenticateToken, checkRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Annonces
 *   description: Gestion des annonces pédagogiques
 */

router.use(authenticateToken);

// Enseignants/Coordinateurs seulement
router.post('/modules/:moduleId', 
  checkRole(['Enseignant', 'Coordinateur']),
  annonceController.createAnnonce
);

// Tous utilisateurs
router.get('/modules/:moduleId', annonceController.getModuleAnnonces);

// Enseignants/Coordinateurs seulement
router.delete('/:id', 
  checkRole(['Enseignant', 'Coordinateur']),
  annonceController.deleteAnnonce
);

module.exports = router;