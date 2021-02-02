const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const SauceCtrl = require("../controllers/sauce");
const Sauce = require("../models/sauce");

router.post("/", auth, multer, SauceCtrl.createSauce);

router.get("/", auth, SauceCtrl.viewAllSauces);

router.get("/:id", auth, SauceCtrl.viewSauce);

router.put("/:id", auth, multer, SauceCtrl.updateSauce);

router.delete("/:id", auth, SauceCtrl.deleteSauce);

router.post("/:id/like", auth, SauceCtrl.likeSauce);

module.exports = router;
