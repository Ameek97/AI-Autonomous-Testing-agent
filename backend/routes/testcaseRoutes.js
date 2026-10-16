const express = require("express");
const gettestcases = require("./../controllers/gettestcases");

const router = express.Router();

router.get("/:repoid", gettestcases);

module.exports = router;