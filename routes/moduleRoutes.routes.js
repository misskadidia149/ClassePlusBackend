const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware('Enseignant'), moduleController.create);
router.get('/', moduleController.getAll);
router.post('/:moduleId/groupes', authMiddleware('Enseignant'), moduleController.addGroupe);

module.exports = router;