// routes/progressionRoutes.js
const express = require('express');
const router = express.Router();
const progressionController = require('../controllers/progressionController');
const { authenticateToken, checkRole } = require('../middlewares/auth');

// Middleware commun pour toutes les routes
router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Progression
 *   description: Suivi pédagogique des étudiants
 */

/**
 * @swagger
 * /api/progression/groupes/{groupeId}:
 *   get:
 *     summary: Obtenir la progression d'un groupe
 *     tags: [Progression]
 *     parameters:
 *       - in: path
 *         name: groupeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du groupe
 *     responses:
 *       200:
 *         description: Détails de la progression
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Progression'
 *       403:
 *         description: Accès refusé
 */
router.get('/groupes/:groupeId', 
  checkRole(['Enseignant', 'Coordinateur']), 
  progressionController.getGroupeProgression
);

/**
 * @swagger
 * /api/progression/modules/{moduleId}:
 *   get:
 *     summary: Progression des groupes dans un module
 *     tags: [Progression]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du module
 *     responses:
 *       200:
 *         description: Liste des progressions
 */
router.get('/modules/:moduleId', 
  checkRole(['Enseignant', 'Coordinateur']), 
  progressionController.getModuleProgressions
);

/**
 * @swagger
 * /api/progression/etapes:
 *   post:
 *     summary: Marquer une étape comme complétée
 *     tags: [Progression]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moduleId:
 *                 type: string
 *               groupeId:
 *                 type: string
 *               etape:
 *                 type: string
 *                 enum: [débuté, en_cours, terminé, validé]
 *             example:
 *               moduleId: "1"
 *               groupeId: "abc123"
 *               etape: "terminé"
 *     responses:
 *       201:
 *         description: Étape enregistrée
 */
router.post('/etapes', 
  checkRole(['Enseignant', 'Coordinateur']),
  progressionController.markProgressStep
);

/**
 * @swagger
 * /api/progression/etudiants/{etudiantId}:
 *   get:
 *     summary: Progression individuelle d'un étudiant
 *     tags: [Progression]
 *     parameters:
 *       - in: path
 *         name: etudiantId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'étudiant
 *     responses:
 *       200:
 *         description: Progression de l'étudiant
 */
router.get('/etudiants/:etudiantId',
  checkRole(['Enseignant', 'Coordinateur', 'Etudiant']),
  progressionController.getStudentProgress
);

// Schémas Swagger (à mettre dans votre fichier de documentation principal)
/**
 * @swagger
 * components:
 *   schemas:
 *     Progression:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         moduleId:
 *           type: string
 *         groupeId:
 *           type: string
 *         etape:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "1"
 *         moduleId: "5"
 *         groupeId: "grp-2023"
 *         etape: "en_cours"
 *         date: "2023-08-25T14:30:00Z"
 */

module.exports = router;