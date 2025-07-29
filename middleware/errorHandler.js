// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'Erreur de fichier: ' + err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur'
  });
};