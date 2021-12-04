const { pingCf, is_valid } = require("../util/pingCf");
const cf = require("../util/codeforcesConfig");
const processQuestion = require("../util/processQuestion");
const Contest = require("../models/contest");
const Question = require("../models/question");
const mongoose = require("mongoose");

async function getQuestionsForContest(contestId, contestRef) {
	// Example -> https://codeforces.com/api/contest.standings?contestId=566&from=1&count=5&showUnofficial=true
	let queryParams = {
		contestId: contestId,
		from: 1,
		count: 1,
		showUnofficial: false,
	};

	let contestInfo = await pingCf(cf.methods.contestStandings, queryParams);
	if (!is_valid(contestInfo)) return;

	let allQuestions = contestInfo.problems;
	if (!is_valid(allQuestions)) return;

	let processsedQuestions = [];
	for (let prob of allQuestions) {
		if (is_valid(prob))
			processsedQuestions.push(processQuestion(prob, contestRef));
	}
	return processsedQuestions;
}

const seedAllQuestions = async () => {
	const allContests = await Contest.find({});

	for (let contest of allContests) {
		if (contest.contestQuestions.length === 0) {
			try {
				let contestQuestions = await getQuestionsForContest(
					contest.contestId,
					contest.id
				);
				const sess = await mongoose.startSession();
				sess.startTransaction();
				for (let contestQuestion of contestQuestions) {
					const question = new Question(contestQuestion);
					contest.contestQuestions.push(question);
					await question.save({ session: sess });
				}
				await contest.save({ session: sess });
				await sess.commitTransaction();

				console.log("Success With Contest : ", contest.contestId);
			} catch (err) {
				console.log("Problem With Contest : ", contest.contestId);
			}
		}
	}
};

if (require.main === module) {
	mongoose
		.connect(
			`mongodb+srv://pranjal:pranjal@cluster0.2recm.mongodb.net/cf-app?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		)
		.then(() => {
			console.log("Connection Success from Questions!!!");
		})
		.catch((err) => {
			console.log(err);
		});
	seedAllQuestions();
}

module.exports = { getQuestionsForContest, seedAllQuestions };
