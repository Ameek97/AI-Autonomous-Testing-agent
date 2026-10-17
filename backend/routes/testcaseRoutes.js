const express = require("express");
const gettestcases = require("./../controllers/gettestcases");
const executeTestCase = require("../controllers/executeTestCase");

const router = express.Router();

router.post("/execute", executeTestCase);
router.get("/:repoid", gettestcases);

module.exports = router;