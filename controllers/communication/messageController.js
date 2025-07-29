const { Message, User } = require('../../models');

module.exports = {
  // Envoyer un message
  send: async (req, res) => {
    try {
      const message = await Message.create({
        content: req.body.content,
        senderId: req.user.id,
        receiverId: req.body.receiverId
      });
      
      // Optionnel : notification en temps réel
      // io.to(receiverId).emit('new_message', message);

      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Boîte de réception
  getInbox: async (req, res) => {
    try {
      const messages = await Message.findAll({
        where: { receiverId: req.user.id },
        include: [
          { model: User, as: 'sender', attributes: ['id', 'nom', 'prenom'] }
        ],
        order: [['dateEnvoi', 'DESC']]
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Répondre à un message
  reply: async (req, res) => {
    try {
      const original = await Message.findByPk(req.params.id);
      const reply = await Message.create({
        content: req.body.content,
        senderId: req.user.id,
        receiverId: original.senderId
      });
      res.status(201).json(reply);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};