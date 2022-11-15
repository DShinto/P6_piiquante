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
// définir divers en-têtes HTTP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(helmet());
// Analyse des requêtes JSON entrantes et les placent dans req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

// limitation de débit des demandes répétées à l'API
app.use(limiter);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
