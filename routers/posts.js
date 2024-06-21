const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../middlewares/upload");
const {
  store, // CREA POST
  index, // TUTTI I POST
  show, // SINGOLO POST
  update, // MODIFICO POST
  destroy, // CANCELLO POST
} = require("../controllers/posts.js");
const validator = require("../middlewares/validator.js");
const { paramID } = require("../validations/generic.js");
const { bodyData } = require("../validations/posts.js");
// const authenticateToken = require("../middlewares/auth.js");

// router.use(authenticateToken);

// Modifica il percorso in cui vengono salvate le immagini
router.post("/", upload.single("img"), validator(bodyData), store);

router.get("/", index);

router.get("/:slug", show);

router.put("/:slug", upload.single("img"), validator(bodyData), update);

router.delete("/:slug", destroy);

module.exports = router;
