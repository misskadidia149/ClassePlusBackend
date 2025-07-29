// routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const upload = require('../middlewares/upload');
const { authenticateToken, checkRole } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Gestion des documents partagés
 */

router.use(authenticateToken);

// Enseignants/Coordinateurs seulement
router.post('/modules/:moduleId', 
  checkRole(['Enseignant', 'Coordinateur']),
  upload.single('document'),
  documentController.uploadDocument
);

// Tous utilisateurs authentifiés
router.get('/modules/:moduleId', documentController.getModuleDocuments);

// Enseignants/Coordinateurs seulement
router.delete('/:id', 
  checkRole(['Enseignant', 'Coordinateur']),
  documentController.deleteDocument
);

router.get('/:id/download', documentController.downloadDocument);

module.exports = router;