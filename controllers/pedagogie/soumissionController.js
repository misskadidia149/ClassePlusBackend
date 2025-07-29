const { Soumission, Tache, Groupe, Correction } = require('../models');
const fs = require('fs');
const path = require('path');

module.exports = {
  // Soumettre un travail
  create: async (req, res) => {
    try {
      const { tacheId, groupeId, commentaires } = req.body;
      const fichiers = req.files?.map(file => file.path);

      const soumission = await Soumission.create({
        fichiers: JSON.stringify(fichiers),
        commentaires,
        tacheId,
        groupeId
      });

      res.status(201).json(soumission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Voir une soumission avec correction
  getOne: async (req, res) => {
    try {
      const soumission = await Soumission.findByPk(req.params.id, {
        include: [
          { model: Tache },
          { model: Groupe, include: ['membres'] },
          { model: Correction }
        ]
      });
      res.json(soumission);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Liste des soumissions par groupe
  getByGroupe: async (req, res) => {
    try {
      const soumissions = await Soumission.findAll({
        where: { groupeId: req.params.groupeId },
        include: [Tache]
      });
      res.json(soumissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};