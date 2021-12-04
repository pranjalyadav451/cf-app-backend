const express = require("express");
const codeforcesController = require("../controllers/codeforcesController");
const check = require("express-validator");

const router = express.Router();

router.get("/user", [], codeforcesController.getUserStatus);
// router.get("/:contestId", contestController.getContestInfoById);
module.exports = router;
