// routes/correctionRoutes.js
const express = require('express');
const router = express.Router();
const correctionController = require('../controllers/correctionController');
const upload = require('../middlewares/upload');
const { authenticateToken, checkRole } = require('../middlewares/auth');

// Middleware pour vérifier le JWT et le rôle Enseignant/Coordinateur
router.use(authenticateToken, checkRole(['Enseignant', 'Coordinateur']));

/**
 * @swagger
 * /api/corrections/soumissions/{id}:
 *   post:
 *     summary: Ajouter une correction à une soumission
 *     tags: [Corrections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la soumission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentaires:
 *                 type: string
 *               note:
 *                 type: number
 *     responses:
 *       201:
 *         description: Correction ajoutée
 */
router.post('/soumissions/:id', correctionController.createCorrection);

/**
 * @swagger
 * /api/corrections/{id}/fichiers:
 *   put:
 *     summary: Joindre un fichier à une correction
 *     tags: [Corrections]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la correction
 *       - in: formData
 *         name: fichier
 *         type: file
 *         description: Fichier à joindre
 *     responses:
 *       200:
 *         description: Fichier joint avec succès
 */
router.put('/:id/fichiers', upload.single('fichier'), correctionController.uploadCorrectionFile);

/**
 * @swagger
 * /api/corrections/{id}/commentaires:
 *   put:
 *     summary: Modifier les commentaires d'une correction
 *     tags: [Corrections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la correction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commentaires:
 *                 type: string
 *     responses:
 *       200:
 *         description: Commentaires mis à jour
 */
router.put('/:id/commentaires', correctionController.updateComments);

/**
 * @swagger
 * /api/corrections/soumissions/{id}:
 *   get:
 *     summary: Voir une correction
 *     tags: [Corrections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la soumission
 *     responses:
 *       200:
 *         description: Détails de la correction
 */
router.get('/soumissions/:id', correctionController.getCorrection);

module.exports = router;