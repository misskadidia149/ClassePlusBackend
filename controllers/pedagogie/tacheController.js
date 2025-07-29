const { Tache, Module, Soumission } = require('../models');

module.exports = {
  // Créer une tâche
  create: async (req, res) => {
    try {
      const tache = await Tache.create({
        ...req.body,
        enseignantId: req.user.id // L'enseignant connecté
      });
      res.status(201).json(tache);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lister les tâches d'un module
  getByModule: async (req, res) => {
    try {
      const taches = await Tache.findAll({
        where: { moduleId: req.params.moduleId },
        include: [
          { model: Module },
          { 
            model: Soumission,
            include: [Correction] 
          }
        ]
      });
      res.json(taches);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mettre à jour une tâche
  update: async (req, res) => {
    try {
      const [updated] = await Tache.update(req.body, {
        where: { idTache: req.params.id }
      });
      if (updated) {
        const tache = await Tache.findByPk(req.params.id);
        res.json(tache);
      } else {
        res.status(404).json({ error: 'Tâche non trouvée' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};