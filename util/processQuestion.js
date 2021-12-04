const { generateProbLink } = require("./generateLink");
const processQuestion = (prob, contestRef) => {
	const { contestId, name, index, type, points, rating, tags } = prob;
	return {
		contestId,
		questionName: name,
		questionType: type,
		questionRating: rating,
		questionPoints: points,
		questionTags: tags,
		questionIndex: index,
		questionLink: generateProbLink(contestId, index),
		fromContest: contestRef,
	};
};

module.exports = processQuestion;
