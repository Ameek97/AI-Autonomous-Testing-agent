const express = require("express");
const saveRepository = require("../controllers/saveRepository");
const updateRepository = require("../controllers/updateRepository");

const router = express.Router();

router.post("/", saveRepository);
router.patch("/:repositoryId", updateRepository);

module.exports = router;
