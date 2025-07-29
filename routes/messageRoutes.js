const express = require('express');
const router = express.Router();
const messageController = require('../controllers/communication/messageController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware(), messageController.send);
router.get('/inbox', authMiddleware(), messageController.getInbox);
router.post('/:id/reply', authMiddleware(), messageController.reply);

module.exports = router;