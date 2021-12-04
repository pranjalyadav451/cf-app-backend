const mongoose = require("mongoose");

const { pingCf, is_valid } = require("../util/pingCf");
const Contest = require("../models/contest");
const cf = require("../util/codeforcesConfig");
const processContest = require("../util/processContest");

mongoose
	.connect(
		`mongodb+srv://pranjal:pranjal@cluster0.2recm.mongodb.net/cf-app?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("Connection Success from Contests!!!");
	})
	.catch((err) => {
		console.log(err);
	});

const seedAllContests = async () => {
	let allContests = await pingCf(cf.methods.contestList);
	let LIM = allContests.length;

	let processedContests = [];

	if (!is_valid(allContests)) {
		console.log("API ERROR !!!");
	} else {
		for (let i = 0; i < LIM; i++) {
			if (allContests[i].phase === "FINISHED") {
				let processedContest = processContest(allContests[i]);
				processedContests.push(processedContest);
			}
		}
	}
	console.log(processedContests);
	try {
		await Contest.insertMany(processedContests).then(() => {
			console.log("All Finished Contests saved");
		});
	} catch (err) {
		console.log("fuck off");
	}
};

seedAllContests();
module.exports = { seedAllContests };
