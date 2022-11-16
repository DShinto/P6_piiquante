// Package de cryptage et hash de mot de passe
const bcrypt = require("bcrypt");
// Permet de créer et vérifier les tokens d'authentification
const jwt = require("jsonwebtoken");

// Importation du modèle
const User = require("../models/User");

// Créer un compte utilisateur
exports.signup = (req, res, next) => {
  // fonction asynchrone (prend du temps)
  bcrypt
    // hash crypté mdp et on exécute 10 tours du logiciel de hashage
    .hash(req.body.password, 10)
    .then((hash) => {
      // Nouveau user à enregistrer dans la BD
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        // Pour enregistrer dans la BD
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
        return res
          .status(401)
          .json({ error: "Paire identifiant/mot de passe incorrecte !" });
      }
      bcrypt
        .compare(req.body.password, user.password) // Compare le mdp rentré avec le hash enregistré dans la BD
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Paire identifiant/mot de passe incorrecte !" });
          }
          // Token vérifié à chaque requête pour confirmer à l'API
          res.status(200).json({
            userId: user._id,
            // Chiffrer un nouveau TOKEN avec la clé secrête et expire dans 24h
            // UserId encodé pour la création de nouvelles sauces pour éviter de modifier avec un autre utilisateur
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
