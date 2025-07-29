const { Module, Enseignant, Tache } = require('../models');

module.exports = {
  // Créer un module (réservé aux enseignants/coordinateurs)
  create: async (req, res) => {
    try {
      const module = await Module.create({
        ...req.body,
        enseignantId: req.user.id
      });
      res.status(201).json(module);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lister tous les modules avec leurs tâches
  getAll: async (req, res) => {
    try {
      const modules = await Module.findAll({
        include: [
          { model: Enseignant, include: [User] },
          { model: Tache }
        ]
      });
      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Ajouter un groupe à un module
  addGroupe: async (req, res) => {
    try {
      const module = await Module.findByPk(req.params.moduleId);
      await module.addGroupe(req.body.groupeId);
      res.json({ message: 'Groupe ajouté au module' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};