const { User, Etudiant, Groupe, Tache, Soumission, Correction, Module } = require('../models');
const { Op } = require('sequelize');
const upload = require('../middlewares/upload');

module.exports = {
  /**
   * Obtenir les groupes de l'étudiant
   * @route GET /api/etudiants/mes-groupes
   */
  getMesGroupes: async (req, res) => {
    try {
      const etudiant = await Etudiant.findOne({
        where: { userId: req.user.id },
        include: [
          {
            model: Groupe,
            as: 'groupes',
            include: [
              {
                model: User,
                as: 'coordinateur',
                attributes: ['id', 'nom', 'prenom']
              },
              {
                model: Module,
                attributes: ['id', 'nom']
              }
            ]
          }
        ]
      });

      if (!etudiant) {
        return res.status(404).json({ error: 'Étudiant non trouvé' });
      }

      res.json(etudiant.groupes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Obtenir les tâches assignées à l'étudiant
   * @route GET /api/etudiants/mes-taches
   */
  getMesTaches: async (req, res) => {
    try {
      // 1. Trouver les groupes de l'étudiant
      const etudiant = await Etudiant.findOne({
        where: { userId: req.user.id },
        include: [{
          model: Groupe,
          as: 'groupes',
          attributes: ['id']
        }]
      });

      if (!etudiant) {
        return res.status(404).json({ error: 'Étudiant non trouvé' });
      }

      const groupeIds = etudiant.groupes.map(g => g.id);

      // 2. Récupérer les tâches de ces groupes
      const taches = await Tache.findAll({
        where: { groupeId: { [Op.in]: groupeIds } },
        include: [
          {
            model: Module,
            attributes: ['id', 'nom', 'code']
          },
          {
            model: Groupe,
            attributes: ['id', 'nom']
          },
          {
            model: Soumission,
            where: { groupeId: { [Op.in]: groupeIds } },
            required: false,
            include: [Correction]
          }
        ],
        order: [['deadline', 'ASC']]
      });

      res.json(taches);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Soumettre un travail (solution)
   * @route POST /api/etudiants/soumissions
   */
  soumettreTravail: async (req, res) => {
    try {
      const { tacheId, commentaires } = req.body;

      // 1. Vérifier que la tâche existe et est dans un groupe de l'étudiant
      const tache = await Tache.findByPk(tacheId, {
        include: [Groupe]
      });

      if (!tache) {
        return res.status(404).json({ error: 'Tâche non trouvée' });
      }

      const estDansGroupe = await Etudiant.findOne({
        where: { userId: req.user.id },
        include: [{
          model: Groupe,
          where: { id: tache.groupeId },
          required: true
        }]
      });

      if (!estDansGroupe) {
        return res.status(403).json({ error: 'Vous ne faites pas partie de ce groupe' });
      }

      // 2. Vérifier les fichiers
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Au moins un fichier est requis' });
      }

      const fichiers = req.files.map(file => ({
        nom: file.originalname,
        chemin: file.path,
        type: file.mimetype
      }));

      // 3. Créer la soumission
      const soumission = await Soumission.create({
        tacheId,
        groupeId: tache.groupeId,
        fichiers: JSON.stringify(fichiers),
        commentaires,
        dateSoumission: new Date()
      });

      // 4. Mettre à jour la progression
      await Progression.create({
        moduleId: tache.moduleId,
        groupeId: tache.groupeId,
        étape: 'Soumis',
        date: new Date()
      });

      res.status(201).json(soumission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Obtenir les soumissions de l'étudiant
   * @route GET /api/etudiants/mes-soumissions
   */
  getMesSoumissions: async (req, res) => {
    try {
      // 1. Trouver les groupes de l'étudiant
      const etudiant = await Etudiant.findOne({
        where: { userId: req.user.id },
        include: [{
          model: Groupe,
          as: 'groupes',
          attributes: ['id']
        }]
      });

      if (!etudiant) {
        return res.status(404).json({ error: 'Étudiant non trouvé' });
      }

      const groupeIds = etudiant.groupes.map(g => g.id);

      // 2. Récupérer les soumissions
      const soumissions = await Soumission.findAll({
        where: { groupeId: { [Op.in]: groupeIds } },
        include: [
          {
            model: Tache,
            include: [Module]
          },
          {
            model: Correction,
            include: [{
              model: User,
              as: 'enseignant',
              attributes: ['nom', 'prenom']
            }]
          }
        ],
        order: [['dateSoumission', 'DESC']]
      });

      res.json(soumissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Consulter une correction
   * @route GET /api/etudiants/corrections/:id
   */
  getCorrection: async (req, res) => {
    try {
      const correction = await Correction.findByPk(req.params.id, {
        include: [
          {
            model: Soumission,
            include: [
              {
                model: Tache,
                include: [Module]
              },
              {
                model: Groupe,
                include: [{
                  model: User,
                  as: 'membres',
                  where: { id: req.user.id },
                  required: true
                }]
              }
            ]
          },
          {
            model: User,
            as: 'enseignant',
            attributes: ['nom', 'prenom']
          }
        ]
      });

      if (!correction) {
        return res.status(404).json({ error: 'Correction non trouvée' });
      }

      res.json(correction);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Obtenir les modules de l'étudiant
   * @route GET /api/etudiants/mes-modules
   */
  getMesModules: async (req, res) => {
    try {
      const etudiant = await Etudiant.findOne({
        where: { userId: req.user.id },
        include: [
          {
            model: Groupe,
            as: 'groupes',
            include: [
              {
                model: Module,
                include: [{
                  model: User,
                  as: 'enseignant',
                  attributes: ['nom', 'prenom']
                }]
              }
            ]
          }
        ]
      });

      if (!etudiant) {
        return res.status(404).json({ error: 'Étudiant non trouvé' });
      }

      // Extraire et dédupliquer les modules
      const modules = [];
      etudiant.groupes.forEach(groupe => {
        groupe.Modules.forEach(module => {
          if (!modules.some(m => m.id === module.id)) {
            modules.push(module);
          }
        });
      });

      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Envoyer un message (à un enseignant ou coordinateur)
   * @route POST /api/etudiants/messages
   */
  envoyerMessage: async (req, res) => {
    try {
      const { destinataireId, contenu } = req.body;

      // Vérifier que le destinataire est valide
      const destinataire = await User.findOne({
        where: {
          id: destinataireId,
          role: { [Op.in]: ['Enseignant', 'Coordinateur'] }
        }
      });

      if (!destinataire) {
        return res.status(400).json({ error: 'Destinataire invalide' });
      }

      const message = await Message.create({
        senderId: req.user.id,
        receiverId: destinataireId,
        content: contenu,
        dateEnvoi: new Date()
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};