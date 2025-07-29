const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/etudiantController');
const upload = require('../middlewares/upload');
const { authenticateToken, checkRole } = require('../middlewares/auth');

// Toutes les routes nécessitent un token valide et le rôle Etudiant
router.use(authenticateToken, checkRole(['Etudiant']));

// Groupes
router.get('/mes-groupes', etudiantController.getMesGroupes);

// Tâches
router.get('/mes-taches', etudiantController.getMesTaches);

// Soumissions
router.post('/soumissions', upload.array('fichiers'), etudiantController.soumettreTravail);
router.get('/mes-soumissions', etudiantController.getMesSoumissions);

// Corrections
router.get('/corrections/:id', etudiantController.getCorrection);

// Modules
router.get('/mes-modules', etudiantController.getMesModules);

// Messagerie
router.post('/messages', etudiantController.envoyerMessage);

module.exports = router;