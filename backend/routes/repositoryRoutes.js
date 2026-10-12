const express = require("express");
const saveRepository = require("../controllers/saveRepository");

const router = express.Router();

router.post("/", saveRepository);

module.exports = router;
