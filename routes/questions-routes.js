const express = require("express");
const questionController = require("../controllers/questionController");
const { check } = require("express-validator");

const router = express.Router();

router.post(
	"/filter/:pageNumber",
	[
		check("tagCombination").isIn(["AND", "OR"]),
		check("minRating").if((value) => {
			return value <= 4000 && value >= 800;
		}),
		check("maxRating").if((value) => {
			return value <= 4000 && value >= 800;
		}),
	],
	questionController.getQuestionsByFilter
);

module.exports = router;
