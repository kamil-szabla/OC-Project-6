const Sauce = require("../models/sauce");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  console.log(req.body);
  const url = req.protocol + "://" + req.get("host");

  const sauce = new Sauce({
    userId: req.body.sauce.userId,
    name: req.body.sauce.name,
    manufacturer: req.body.sauce.manufacturer,
    description: req.body.sauce.description,
    imageUrl: url + "/images/" + req.file.filename,
    mainPepper: req.body.sauce.mainPepper,
    heat: req.body.sauce.heat,
    likes: req.body.sauce.likes,
    dislikes: req.body.sauce.dislikes,
    userLiked: req.body.sauce.userLiked,
    userDisliked: req.body.sauce.userDisliked,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Individual Sauce - Product Created!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });

  console.log("New sauce created");
};

exports.viewAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });

  console.log("Display ALL SAUCES");
};

exports.viewSauce = (req, res, next) => {
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

  console.log("Display Individual Sauce - Product");
};

exports.updateSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      req.body.sauce = JSON.parse(req.body.sauce);
      sauce = {
        _id: req.params.id,
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        manufacturer: req.body.sauce.manufacturer,
        imageUrl: url + "/images/" + req.file.filename,
        heat: req.body.sauce.heat,
      };
    } else {
      sauce = {
        _id: req.params.id,
        userId: req.body.userId,
        name: req.body.name,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        manufacturer: req.body.manufacturer,
        heat: req.body.heat,
      };
    }

    Sauce.updateOne({ _id: req.params.id }, sauce)
      .then(() => {
        res.status(201).json({
          message: "Product updated!",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink("images/" + filename, () => {
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "Removed!",
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(400).json({
            error: error,
          });
          console.log(error);
        });
    });
  });

  console.log("Delete Individual Sauce - Product");
};

exports.likeSauce = (req, res, next) => {
  req.body = req.body;
  Sauce.findOne({
    _id: req.params.id,
  }).then((sauce) => {
    if (req.body.like == 1) {
      sauce.usersLiked.push(req.body.userId);
      sauce.likes += req.body.like;
    } else if (
      req.body.like == 0 &&
      sauce.usersLiked.includes(req.body.userId)
    ) {
      sauce.usersLiked.remove(req.body.userId);
      sauce.likes -= 1;
    } else if (req.body.like == -1) {
      sauce.usersDisliked.push(req.body.userId);
      sauce.dislikes += 1;
    } else if (
      req.body.like == 0 &&
      sauce.usersDisliked.includes(req.body.userId)
    ) {
      sauce.usersDisliked.remove(req.body.userId);
      sauce.dislikes -= 1;
    }
    sauce
      .save()
      .then(() => {
        res.status(201).json({
          message: "Preference sended to the system.",
        });
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  });
};
