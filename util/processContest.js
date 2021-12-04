const { generateContestLink } = require("./generateLink");
const processContest = (contest) => {
	const {
		id,
		name,
		// phase,
		type,
		frozen,
		durationSeconds,
		relativeTimeSeconds,
		startTimeSeconds,
	} = contest;
	return {
		contestId: id,
		contestName: name,
		// contestPhase: phase,
		contestType: type,
		isContestFrozen: frozen,
		durationSeconds,
		relativeTimeSeconds,
		startTimeSeconds,
		contestLink: generateContestLink(id),
	};
};

module.exports = processContest;
