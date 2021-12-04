const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const contestSchema = new Schema({
	contestId: { type: Number, required: true },
	contestName: { type: String, required: true },
	contestType: { type: String, required: true },
	isContestFrozen: { type: String, required: true },
	durationSeconds: { type: mongoose.Types.Decimal128, required: true },
	startTimeSeconds: { type: mongoose.Types.Decimal128, required: true },
	relativeTimeSeconds: { type: mongoose.Types.Decimal128, required: true },
	contestLink: { type: String, required: true },
	contestQuestions: [
		{ type: mongoose.Types.ObjectId, required: true, ref: "Question" },
	],
});
module.exports = new mongoose.model("Contest", contestSchema);
