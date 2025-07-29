const { Progression, Groupe, Module } = require('../../models');

module.exports = {
  // Mettre à jour la progression d'un groupe
  update: async (req, res) => {
    try {
      const [updated] = await Progression.update(
        { étape: req.body.étape },
        { 
          where: { 
            groupeId: req.params.groupeId,
            moduleId: req.params.moduleId 
          } 
        }
      );

      if (updated) {
        const progression = await Progression.findOne({
          where: {
            groupeId: req.params.groupeId,
            moduleId: req.params.moduleId
          }
        });
        res.json(progression);
      } else {
        res.status(404).json({ error: 'Progression non trouvée' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Historique de progression pour un groupe
  getByGroupe: async (req, res) => {
    try {
      const progressions = await Progression.findAll({
        where: { groupeId: req.params.groupeId },
        include: [Module],
        order: [['date', 'DESC']]
      });
      res.json(progressions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};