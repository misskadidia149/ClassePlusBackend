// routes/soumissionRoutes.js
const express = require('express');
const router = express.Router();
const soumissionController = require('../controllers/soumissionController');
const upload = require('../middlewares/upload');
const { authenticateToken, checkRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Soumissions
 *   description: Gestion des travaux rendus
 */

// Étudiants seulement
router.post('/',
  authenticateToken,
  checkRole(['Etudiant']),
  upload.array('fichiers', 5), // Max 5 fichiers
  soumissionController.submitWork
);

// Enseignants/Étudiants du groupe
router.get('/taches/:tacheId',
  authenticateToken,
  checkRole(['Etudiant', 'Enseignant', 'Coordinateur']),
  soumissionController.getTaskSubmissions
);

// Propriétaire ou enseignant seulement
router.get('/:id',
  authenticateToken,
  soumissionController.getSubmissionDetails
);

// Étudiant propriétaire seulement
router.delete('/:id',
  authenticateToken,
  checkRole(['Etudiant']),
  soumissionController.deleteSubmission
);

module.exports = router;