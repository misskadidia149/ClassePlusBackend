const { Enseignant, User, Module, Tache, Groupe, Soumission, Correction, Progression } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = {
  /**
   * Créer un module pédagogique
   * @route POST /api/enseignants/modules
   */
  creerModule: async (req, res) => {
    try {
      const { nom, code } = req.body;

      const module = await Module.create({
        nom,
        code,
        enseignantId: req.user.id
      });

      res.status(201).json(module);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Ajouter un étudiant à un module
   * @route POST /api/enseignants/modules/:moduleId/etudiants
   */
  ajouterEtudiant: async (req, res) => {
    try {
      const module = await Module.findByPk(req.params.moduleId);
      const etudiant = await User.findOne({
        where: {
          id: req.body.etudiantId,
          role: 'Etudiant'
        }
      });

      if (!module || !etudiant) {
        return res.status(404).json({ error: 'Module ou étudiant non trouvé' });
      }

      // Vérifier que l'enseignant est bien propriétaire du module
      if (module.enseignantId !== req.user.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }

      await module.addUser(etudiant);
      res.json({ message: 'Étudiant ajouté avec succès' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Créer une tâche pour un groupe
   * @route POST /api/enseignants/taches
   */
  creerTache: async (req, res) => {
    try {
      const { titre, description, deadline, moduleId, groupeId } = req.body;

      // Vérifier que le module appartient à l'enseignant
      const module = await Module.findOne({
        where: {
          id: moduleId,
          enseignantId: req.user.id
        }
      });

      if (!module) {
        return res.status(403).json({ error: 'Module non trouvé ou non autorisé' });
      }

      const tache = await Tache.create({
        titre,
        description,
        deadline,
        moduleId,
        groupeId,
        enseignantId: req.user.id
      });

      res.status(201).json(tache);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Corriger une soumission d'étudiant
   * @route POST /api/enseignants/soumissions/:id/corrections
   */
  corrigerTache: async (req, res) => {
    try {
      const soumission = await Soumission.findByPk(req.params.id, {
        include: [Tache]
      });

      if (!soumission) {
        return res.status(404).json({ error: 'Soumission non trouvée' });
      }

      // Vérifier que la tâche appartient à l'enseignant
      if (soumission.Tache.enseignantId !== req.user.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }

      const correction = await Correction.create({
        ...req.body,
        soumissionId: req.params.id,
        enseignantId: req.user.id
      });

      // Mettre à jour la progression
      await Progression.create({
        moduleId: soumission.Tache.moduleId,
        groupeId: soumission.groupeId,
        étape: 'Corrigé',
        date: new Date()
      });

      res.status(201).json(correction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Joindre un fichier à une correction
   * @route PUT /api/enseignants/corrections/:id/fichier
   */
  joindreCorrection: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier fourni' });
      }

      const correction = await Correction.findByPk(req.params.id, {
        include: [{
          model: Soumission,
          include: [Tache]
        }]
      });

      if (!correction) {
        return res.status(404).json({ error: 'Correction non trouvée' });
      }

      // Vérification des permissions
      if (correction.Soumission.Tache.enseignantId !== req.user.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }

      await correction.update({
        fichiersJoint: req.file.path
      });

      res.json(correction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Voir la progression d'un groupe
   * @route GET /api/enseignants/groupes/:id/progression
   */
  voirProgression: async (req, res) => {
    try {
      const groupe = await Groupe.findByPk(req.params.id, {
        include: [
          {
            model: Progression,
            include: [Module]
          },
          {
            model: Soumission,
            include: [Tache, Correction]
          }
        ]
      });

      if (!groupe) {
        return res.status(404).json({ error: 'Groupe non trouvé' });
      }

      // Vérifier que l'enseignant a des modules en commun avec le groupe
      const enseignantsModules = await Module.findAll({
        where: { enseignantId: req.user.id }
      });

      const hasAccess = groupe.Soumissions.some(s => 
        enseignantsModules.some(m => m.id === s.Tache.moduleId)
      );

      if (!hasAccess) {
        return res.status(403).json({ error: 'Non autorisé' });
      }

      res.json(groupe);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Créer un nouveau groupe
   * @route POST /api/enseignants/groupes
   */
  creerGroupe: async (req, res) => {
    try {
      const groupe = await Groupe.create({
        nom: req.body.nom,
        coordinateurId: req.user.id // L'enseignant devient coordinateur
      });

      res.status(201).json(groupe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Désigner un coordinateur de groupe
   * @route PUT /api/enseignants/groupes/:id/coordinateur
   */
  designerCoordinateur: async (req, res) => {
    try {
      const groupe = await Groupe.findByPk(req.params.id);

      if (!groupe) {
        return res.status(404).json({ error: 'Groupe non trouvé' });
      }

      // Seul le coordinateur actuel peut désigner un nouveau coordinateur
      if (groupe.coordinateurId !== req.user.id) {
        return res.status(403).json({ error: 'Non autorisé' });
      }

      const nouveauCoordinateur = await User.findOne({
        where: {
          id: req.body.userId,
          role: { [Op.in]: ['Enseignant', 'Coordinateur'] }
        }
      });

      if (!nouveauCoordinateur) {
        return res.status(404).json({ error: 'Utilisateur éligible non trouvé' });
      }

      await groupe.update({ coordinateurId: nouveauCoordinateur.id });
      
      // Mettre à jour le rôle si nécessaire
      if (nouveauCoordinateur.role !== 'Coordinateur') {
        await nouveauCoordinateur.update({ role: 'Coordinateur' });
      }

      res.json(groupe);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Lister tous les modules de l'enseignant
   * @route GET /api/enseignants/modules
   */
  getMesModules: async (req, res) => {
    try {
      const modules = await Module.findAll({
        where: { enseignantId: req.user.id },
        include: [
          {
            model: Tache,
            include: [Soumission]
          },
          {
            model: Groupe
          }
        ]
      });

      res.json(modules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
