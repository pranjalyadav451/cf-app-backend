const Contest = require("../models/contest");
const { seedAllQuestions } = require("../Seed/seedAllQuestions");
const processContest = require("../util/processContest");
const { pingCf, is_valid } = require("../util/pingCf");
const cf = require("../util/codeforcesConfig");

const getPastContestIds = (pastContests) => {
	const contestIds = [];
	for (let contest of pastContests) {
		contestIds.push(contest.contestId);
	}
	return contestIds;
};

const updateDatabase = async () => {
	console.log("\n\nupdating DB");
	let pastContestIds = [],
		allContests = [],
		contestsToSave = [];

	// gettting the past Contests and creating a set of past contestIds
	try {
		const pastFinishedContests = await Contest.find({});
		// console.log(pastFinishedContests);

		pastContestIds = new Set(getPastContestIds(pastFinishedContests));
	} catch (err) {
		console.log("Some error in updating the database");
	}

	// console.log(pastContestIds);
	// getting allContests from codeforces.com
	try {
		allContests = await pingCf(cf.methods.contestList);
		if (!is_valid(allContests)) return;
	} catch (err) {
		console.log(err);
		console.log("Error in getting contests from codeforces.");
	}

	// console.log(allContests);

	let currentFinishedContests = allContests.filter((contest) => {
		return contest.phase === "FINISHED";
	});

	// console.log(currentFinishedContests);

	// choosing only the newly FINISHED contests to enter in DB
	for (let contest of currentFinishedContests) {
		if (!pastContestIds.has(contest.id)) {
			contestsToSave.push(processContest(contest));
		}
	}
	console.log(contestsToSave);
	try {
		await Contest.insertMany(contestsToSave).then(() => {
			console.log("New Contests Added : ", contestsToSave.length);
		});
	} catch (err) {
		console.log("Error updating contests");
	}

	try {
		await seedAllQuestions();
	} catch (err) {
		console.log("Error updating questions.");
	}
	console.log("\n\n");
};

module.exports = updateDatabase;
