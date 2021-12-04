const Question = require("../models/question");
const Contest = require("../models/contest");
const { is_valid } = require("../util/pingCf");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const questionSortingOrder = (filter) => {
	switch (filter.sortingOption) {
		case "highToLow":
			return { questionRating: "desc", contestId: "desc" };
		case "lowToHigh":
			return { questionRating: "asc", contestId: "desc" };
		case "earliestFirst":
			return { contestId: "asc", questionRating: "desc" };
		case "latestFirst":
			return { contestId: "desc", questionRating: "desc" };
		default:
			return { questionRating: "desc", contestId: "desc" };
	}
};
const getQuestionsByFilter = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(
			new HttpError("Invalid inputs passed, please check your data.", 422)
		);
	}
	const pageNumber = req.params.pageNumber;
	const filter = req.body;
	let questions, result;
	console.log(filter);

	if (!is_valid(filter) || !is_valid(pageNumber)) {
		return next(new HttpError("Bad Request!!!", 404));
	}

	try {
		if (filter.tagOptions.length === 0) {
			questions = Question.find({});
		} else {
			if (filter.tagCombination === "AND") {
				questions = Question.find({
					questionTags: {
						$all: filter.tagOptions,
						$nin: filter.excludedTagOptions,
					},
				});
			} else if (filter.tagCombination === "OR") {
				questions = Question.find({
					questionTags: {
						$in: filter.tagOptions,
						$nin: filter.excludedTagOptions,
					},
				});
			}
		}

		// getting the questions from only the last X contests
		if (filter.lastContests > 0) {
			const pastContests = await Contest.find({})
				.sort({ contestId: "desc" })
				.limit(parseInt(filter.lastContests));

			const pastContestsId = pastContests.map((contest) => {
				return contest.contestId;
			});
			questions.find({ contestId: { $in: pastContestsId } });
		}

		result = await questions
			.find({
				questionRating: {
					$gte: filter.minRating,
					$lte: filter.maxRating,
				},
			})
			.sort(questionSortingOrder(filter))
			.skip((pageNumber - 1) * 20)
			.limit(20);
		console.log(result);
	} catch {
		const error = new HttpError("Something bad happened on our side", 500);
		return next(error);
	}
	res.json({
		questions: result.map((question) =>
			question.toObject({ getters: true })
		),
	});
};

module.exports = { getQuestionsByFilter };
