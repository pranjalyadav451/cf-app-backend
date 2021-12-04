const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    contestId: {type: Number, required: true},
    questionIndex: {type: String, required: true},
    questionName: {type: String, required: true},
    questionType: {type: String, required: true},
    questionRating: {type: Number, required: false},
    questionPoints: {type: Number, required: false},
    questionTags: [{type: String, required: true}],
    questionLink: {type: String, required: true},
    fromContest: {type: mongoose.Types.ObjectId, required: true, ref: "Contest"},

})

module.exports = new mongoose.model("Question", questionSchema);