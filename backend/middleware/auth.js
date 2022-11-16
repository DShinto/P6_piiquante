const jwt = require("jsonwebtoken");

// fonction exportée
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extraction du token Bearer + split pour récupérer ce qu'il y a après l'espace
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); // Vérification du Token en le décodant, méthode verify
    const userId = decodedToken.userId; // Récupération de l'Id
    // request transmis aux routes
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
