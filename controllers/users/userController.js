const { User, Etudiant, Enseignant } = require('../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  // Authentification
  login: async (req, res) => {
    try {
      const { email, motdepasse } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user || !bcrypt.compareSync(motdepasse, user.motdepasse)) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token, role: user.role });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Création d'un étudiant
  createEtudiant: async (req, res) => {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.motdepasse, 10);
      
      const user = await User.create({
        ...req.body,
        motdepasse: hashedPassword,
        role: 'Etudiant'
      });

      const etudiant = await Etudiant.create({
        matricule: `ETU${Date.now().toString().slice(-4)}`,
        userId: user.id
      });

      res.status(201).json({ user, etudiant });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Récupérer le profil
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [
          { model: Etudiant, required: false },
          { model: Enseignant, required: false }
        ]
      });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};