// Package de cryptage et hash de mot de passe
const bcrypt = require("bcrypt");
// Tokens d'authentification pour se connecter une seule fois à leur compte
const jwt = require("jsonwebtoken");

// Importation du modèle
const User = require("../models/User");

// Créer un compte utilisateur
exports.signup = (req, res, next) => {
  bcrypt
    // hash crypté mdp
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Se connecter à un compte utilisateur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password) // Compare le mdp rentré avec le hash enregistré dans la BD
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            // Chiffrer un nouveau TOKEN
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
