const { Correction, Soumission } = require('../models');

module.exports = {
  // Ajouter une correction
  addCorrection: async (req, res) => {
    try {
      const { soumissionId, commentaires } = req.body;
      const fichiers = req.files?.map(file => file.path);

      const correction = await Correction.create({
        commentaires,
        fichiersJoint: JSON.stringify(fichiers),
        soumissionId
      });

      res.status(201).json(correction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Modifier une correction
  update: async (req, res) => {
    try {
      const [updated] = await Correction.update(req.body, {
        where: { idCorrection: req.params.id }
      });
      if (updated) {
        const correction = await Correction.findByPk(req.params.id);
        res.json(correction);
      } else {
        res.status(404).json({ error: 'Correction non trouvée' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};