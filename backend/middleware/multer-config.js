// Gestion des fichiers entrants dans les requêtes HTTP
const multer = require("multer");

// Dictionnaire de mime types pour les images
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  // Chemin pour renregistrer les images
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Donne le nom au fichier par rapport à son nom d'origine + timestamp
  filename: (req, file, callback) => {
    const name = file.originalname.split(".")[0].split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image"); // Enregistrement sur le server
