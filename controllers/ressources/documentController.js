const { Module, Document } = require('../../models');
const fs = require('fs');
const path = require('path');

module.exports = {
  // Partager un document dans un module
  upload: async (req, res) => {
    try {
      const document = await Document.create({
        nom: req.file.originalname,
        chemin: req.file.path,
        moduleId: req.params.moduleId,
        uploadedBy: req.user.id
      });
      res.status(201).json(document);
    } catch (error) {
      // Nettoyer le fichier en cas d'erreur
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(400).json({ error: error.message });
    }
  },

  // Lister les documents d'un module
  getByModule: async (req, res) => {
    try {
      const documents = await Document.findAll({
        where: { moduleId: req.params.moduleId },
        include: [{ model: User, attributes: ['nom', 'prenom'] }]
      });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Télécharger un document
  download: async (req, res) => {
    try {
      const document = await Document.findByPk(req.params.id);
      if (!document) return res.status(404).json({ error: 'Document non trouvé' });

      const filePath = path.join(__dirname, '..', document.chemin);
      res.download(filePath, document.nom);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};