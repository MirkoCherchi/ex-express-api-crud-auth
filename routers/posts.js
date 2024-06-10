const express = require("express");
const router = express.Router();
const {
  store, // CREA POST
  index, // TUTTI I POST
  show, // SINGOLO POST
  update, // MODIFICO POST
  destroy, // CANCELLO POST
} = require("../controllers/posts.js");

router.post("/", store);

router.get("/", index);

router.get("/:slug", show);

router.put("/:slug", update);

router.delete("/:slug", destroy);

module.exports = router;
