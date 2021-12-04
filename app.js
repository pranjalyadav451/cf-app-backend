const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const nodeCron = require("node-cron");

const contestRoutes = require("./routes/contest-routes");
const questionsRoutes = require("./routes/questions-routes");
const codeforcesRoutes = require("./routes/codeforces-routes");
const HttpError = require("./models/http-error");
const updateDatabase = require("./Update/updateDatabase");

const app = express();
dotenv.config();

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

	next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/codeforces", codeforcesRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/questions", questionsRoutes);

app.use((req, res, next) => {
	const error = new HttpError("Could not find this route.", 404);
	throw error;
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ message: error.message || "An unknown error occurred!" });
});

// Adding Code to update db at some time interval
// nodeCron.schedule("0 */10 * * * *", async () => {
// 	updateDatabase();
// });

mongoose
	.connect(
		`mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.2recm.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		app.listen(process.env.PORT || 5000, () => {
			console.log("App listening on Port 5000");
		});
	})
	.catch((err) => {
		console.log(err);
	});
