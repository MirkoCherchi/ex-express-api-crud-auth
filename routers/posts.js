const express = require("express");
const router = express.Router();
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

router.post("/", validator(bodyData), store);

router.get("/", index);

router.get("/:slug", show);

router.put("/:slug", validator(bodyData), update);

router.delete("/:slug", destroy);

module.exports = router;
