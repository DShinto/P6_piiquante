const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Like et dislike sauces
exports.likeDislike = async (req, res, next) => {
  try {
    const sauceToUpdate = await Sauce.findOne({ _id: req.params.id });
    const userId = req.body.userId;
    console.log(sauceToUpdate);
    const { usersLiked, usersDisliked } = sauceToUpdate;
    console.log(usersLiked, usersDisliked);
    switch (req.body.like) {
      case 1:
        console.log("like");
        if (!usersLiked.find((id) => id === userId)) {
          usersLiked.push(userId);
        }
        if (usersDisliked.find((id) => id === userId)) {
          usersDisliked.remove(userId);
        }
        break;
      case 0:
        console.log("cancel");
        if (usersLiked.find((id) => id === userId)) {
          usersLiked.remove(userId);
        }
        if (usersDisliked.find((id) => id === userId)) {
          usersDisliked.remove(userId);
        }
        Sauce.updateOne();
        break;
      case -1:
        console.log("dislike");
        if (!usersDisliked.find((id) => id === userId)) {
          usersDisliked.push(userId);
        }
        if (usersLiked.find((id) => id === userId)) {
          usersLiked.remove(userId);
        }
        break;
      default:
        return res.status(400).json({ error: "bad request" });
    }
    sauceToUpdate.usersLiked = usersLiked;
    sauceToUpdate.usersDisliked = usersDisliked;
    sauceToUpdate.likes = usersLiked.length;
    sauceToUpdate.dislikes = usersDisliked.length;
    console.log(sauceToUpdate);
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $push: { likes: sauceToUpdate.likes },
        $push: { usersLiked: sauceToUpdate.usersLiked },
        $push: { dislikes: sauceToUpdate.dislikes },
        $push: { usersDisliked: sauceToUpdate.usersDisliked },
      }
    )
      .then(() => res.status(200).json({ message: "reqête reçue !" }))
      .catch((error) => res.status(400).json({ error }));
  } catch (error) {
    console.log(error);
  }
};
