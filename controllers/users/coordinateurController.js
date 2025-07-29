const { User, Groupe, Module } = require('../../models');

module.exports = {
  // Désigner un coordinateur de groupe
  assignCoordinateur: async (req, res) => {
    try {
      const groupe = await Groupe.findByPk(req.params.groupeId);
      await groupe.update({ coordinateurId: req.body.userId });
      
      // Option : changer le rôle de l'utilisateur si nécessaire
      await User.update(
        { role: 'Coordinateur' },
        { where: { id: req.body.userId } }
      );

      res.json(groupe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Statistiques globales (accès réservé)
  getStats: async (req, res) => {
    try {
      const stats = {
        groupes: await Groupe.count(),
        etudiants: await User.count({ where: { role: 'Etudiant' } }),
        modules: await Module.count(),
        soumissions: await Soumission.count()
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};