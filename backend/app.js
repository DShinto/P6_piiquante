const express = require("express");
const rateLimit = require("express-rate-limit");
// Connexion BD
const mongoose = require("mongoose");
// Chemin de notre server
const path = require("path");
// Sécuriser en-tête HTTP
const helmet = require("helmet");
// dossier environnement pour éviter de partager des données sensibles
require("dotenv").config();

// Importation des routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Connection à la base de données
mongoose
  .connect(process.env.MONGOOSE_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

// Limiter le nombre de demandes d'un même utilisateur
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// définir divers en-têtes HTTP
app.use(helmet());
// Analyse des requêtes JSON entrantes et les placent dans req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Accéder à notre APi de n'importe quelle origine "*"
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization" // Ajouter les headers mentionnés aux requêtes envoyées vers notre API
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS" // Envoyer des requêtes avec les méthodes mentionnées
  );
  res.setHeader("Cross-Origin-Resource-Policy", "same-site"); // Seules les demnades provenant du même site peuvent lire la ressource
  next();
});

// limitation de débit des demandes répétées à l'API
app.use(limiter);
// server configuré pour renvoyer des fichiers statiques pour une route donnée
app.use("/images", express.static(path.join(__dirname, "images")));
// Utilisation des routes
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
