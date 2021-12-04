const axios = require("axios");
const HttpError = require("../models/http-error");

const getUserStatus = async (req, res, next) => {
	const userHandle = req.query.handle;
	let userStatus;
	try {
		let res = await axios({
			baseURL: "http://codeforces.com/api",
			url: "/user.status",
			params: {
				handle: userHandle,
				from: 1,
			},
		});
		userStatus = res.data.result;
	} catch (err) {
		const error = new HttpError(
			"Invalid Username or Codeforces api is down.",
			500
		);
		return next(error);
	}
	res.json({ userStatus });
};

module.exports = { getUserStatus };
