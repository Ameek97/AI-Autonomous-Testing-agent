const express = require("express");
const saveRepository = require("../controllers/saveRepository");
const updateRepository = require("../controllers/updateRepository");
const getdbRepositories = require("../controllers/getdbRepositories");
const router = express.Router();

router.get("/", getdbRepositories);
router.post("/", saveRepository);
router.patch("/:repositoryId", updateRepository);

module.exports = router;
