// Création d'un routeur avec la méthode router d'express
const express = require("express");
const router = express.Router();

// Importation du controller
const userCtrl = require("../controllers/user");

// Routes users
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
