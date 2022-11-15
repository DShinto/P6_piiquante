const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Extraction du token + split pour récupérer ce qu'il y a après l'espace
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY); // Vérification du Token e, le décodant
    const userId = decodedToken.userId; // Récupération de l'Id
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
