const mongoose = require("mongoose");
//
const uniqueValidator = require("mongoose-unique-validator");

// Schéma de données pour les utilisateurs
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

// model transforme le schéma en modèle utilisable
module.exports = mongoose.model("User", userSchema);
