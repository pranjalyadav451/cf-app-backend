const {is_valid} = require("./pingCf");
const {cfConfig} = require("./codeforcesConfig");

function generateProbLink(contestId, probIndex) {
    if (is_valid(contestId) && is_valid(probIndex)) {
        let probName = cfConfig.baseProbLink + `${contestId}/${probIndex}`;
        return probName;
    }
}

function generateContestLink(contestId) {
    if (is_valid(contestId)) {
        return cfConfig.baseContestLink + `${contestId}`;
    }
}


module.exports = {generateProbLink, generateContestLink};
