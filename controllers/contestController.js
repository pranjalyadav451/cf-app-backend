const Contest = require("../models/contest");
const HttpError = require("../models/http-error");

const getAllContests = async (req, res, next) => {
	const pageNumber = req.params.pageNumber;
	let contests = await Contest.find({})
		.sort({ contestId: "desc" })
		.skip((pageNumber - 1) * 20)
		.limit(20);
	res.json({
		contests: contests.map((contest) => {
			return contest.toObject({ getters: true });
		}),
	});
};

const getContestInfoById = async (req, res, next) => {
	const contestId = req.params.contestId;
	let contestInfo;

	try {
		contestInfo = await Contest.findOne({ contestId: contestId }).populate(
			"contestQuestions"
		);
	} catch (err) {
		const error = new HttpError(
			"Fetching places failed, please try again later.",
			500
		);
		return next(error);
	}
	console.log(contestInfo);
	res.json({
		contestInfo: contestInfo.contestQuestions.map((question) =>
			question.toObject({ getters: true })
		),
	});
	// res.send("hello there")
};

module.exports = { getAllContests, getContestInfoById };
