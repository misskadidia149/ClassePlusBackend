const express = require('express');
const router = express.Router();
const enseignantController = require('../controllers/enseignantController');
const upload = require('../middlewares/upload');
const { authenticateToken, checkRole } = require('../middlewares/auth');

// Toutes les routes nécessitent un token valide et le rôle Enseignant
router.use(authenticateToken, checkRole(['Enseignant', 'Coordinateur']));

// Modules
router.post('/modules', enseignantController.creerModule);
router.post('/modules/:moduleId/etudiants', enseignantController.ajouterEtudiant);
router.get('/modules', enseignantController.getMesModules);

// Tâches
router.post('/taches', enseignantController.creerTache);

// Corrections
router.post('/soumissions/:id/corrections', enseignantController.corrigerTache);
router.put('/corrections/:id/fichier', upload.single('fichier'), enseignantController.joindreCorrection);

// Groupes
router.post('/groupes', enseignantController.creerGroupe);
router.put('/groupes/:id/coordinateur', enseignantController.designerCoordinateur);
router.get('/groupes/:id/progression', enseignantController.voirProgression);

module.exports = router;