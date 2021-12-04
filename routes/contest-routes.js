const express = require("express");
const contestController = require("../controllers/contestController");
const check = require("express-validator");

const router = express.Router();

router.get("/all/:pageNumber", [], contestController.getAllContests);
router.get("/:contestId", contestController.getContestInfoById);
module.exports = router;
