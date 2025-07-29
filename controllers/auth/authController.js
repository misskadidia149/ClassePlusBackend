
// Nouveau (adapté à votre structure)
const { User } = require('../../models');  // Remonte de 2 niveaux
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const SALT_ROUNDS = 10;

module.exports = {
  /**
   * Authentification d'un utilisateur
   * @route POST /api/auth/login
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1. Vérification de l'existence de l'utilisateur
      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ 
          error: 'Identifiants incorrects' 
        });
      }

      // 2. Vérification du mot de passe
      const passwordMatch = await bcrypt.compare(password, user.motdepasse);
      
      if (!passwordMatch) {
        return res.status(401).json({ 
          error: 'Identifiants incorrects' 
        });
      }

      // 3. Génération du token JWT
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // 4. Réponse sans le mot de passe
      const userResponse = {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      };

      res.json({
        token,
        user: userResponse
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: 'Erreur lors de l\'authentification' 
      });
    }
  },

  /**
   * Rafraîchissement du token
   * @route POST /api/auth/refresh-token
   */
  refreshToken: async (req, res) => {
    try {
      const authHeader = req.headers['authorization'];
      const oldToken = authHeader && authHeader.split(' ')[1];

      if (!oldToken) {
        return res.status(401).json({ 
          error: 'Token non fourni' 
        });
      }

      // Vérification du token expiré mais avec allowExpired
      jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: true }, (err, user) => {
        if (err) {
          return res.status(403).json({ 
            error: 'Token invalide' 
          });
        }

        // Génération d'un nouveau token
        const newToken = jwt.sign(
          {
            id: user.id,
            role: user.role,
            email: user.email
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({ token: newToken });
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ 
        error: 'Erreur lors du rafraîchissement du token' 
      });
    }
  },

  /**
   * Déconnexion (gestion côté client généralement)
   * @route POST /api/auth/logout
   */
  logout: (req, res) => {
    // Dans une implémentation avancée, on pourrait invalider le token
    res.json({ message: 'Déconnexion réussie' });
  },

  /**
   * Vérification de l'état d'authentification
   * @route GET /api/auth/check
   */
  checkAuth: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['motdepasse'] }
      });
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Utilisateur non trouvé' 
        });
      }

      res.json({ 
        isAuthenticated: true, 
        user 
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur de vérification' 
      });
    }
  },

  /**
   * Middleware de vérification d'authentification
   * (À placer dans un fichier séparé middlewares/auth.js)
   */
  authenticateToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Accès non autorisé' 
      });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          error: 'Token invalide ou expiré' 
        });
      }

      req.user = user;
      next();
    });
  },

  /**
   * Middleware de vérification de rôle
   * (À placer dans un fichier séparé middlewares/role.js)
   */
  checkRole: (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          error: 'Permissions insuffisantes' 
        });
      }
      next();
    };
  }
};