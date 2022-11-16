// Création d'un routeur avec la méthode router d'express
const express = require("express");
const router = express.Router();

// Middleware d'authentification
const auth = require("../middleware/auth");
// Middleware de gestion file system
const multer = require("../middleware/multer-config");

// Importation du controller
const saucesCtrl = require("../controllers/sauce");

// Routes des sauces
router.get("/", auth, saucesCtrl.getAllSauces);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeDislike);

module.exports = router;
