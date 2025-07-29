const { Groupe, User, Etudiant } = require('../../models');

module.exports = {
  // Créer un groupe
  create: async (req, res) => {
    try {
      const groupe = await Groupe.create({
        ...req.body,
        coordinateurId: req.user.id
      });
      res.status(201).json(groupe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Ajouter un membre
  addMember: async (req, res) => {
    try {
      const etudiant = await Etudiant.findOne({
        where: { matricule: req.body.matricule }
      });

      if (!etudiant) {
        return res.status(404).json({ error: 'Étudiant non trouvé' });
      }

      await Groupe.addMember(req.params.groupeId, etudiant.userId);
      res.json({ message: 'Membre ajouté avec succès' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Lister les groupes d'un enseignant
  getByEnseignant: async (req, res) => {
    try {
      const groupes = await Groupe.findAll({
        where: { coordinateurId: req.user.id },
        include: ['membres']
      });
      res.json(groupes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};