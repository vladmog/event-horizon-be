const express = require("express");
const router = express.Router();

const db = require("./user-model.js");

router.get("/get_users", (req, res) => {
	db.find()
		.then(users => {
			console.log(users);
			res.status(200).json(users);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: "Doh!" });
		});
});

router.post("/get_user", (req, res) => {
	const { emailAddress } = req.body;
	console.log(emailAddress);

	db.findByEmail(emailAddress)
		.then(user => {
			res.status(200).json(user);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: "Doh!" });
		});
});

router.get("/cal", (req, res) => {
	// generate a calendar array in json

	let ms = 946713600000; // Start date of Jan 1 2000 in milliseconds
	let yearsToCreate = 200;
	let daysToCreate = 365 * yearsToCreate;

	let currYear;
	let currMonth;

	let years = [];
	let yearIndexes = {};

	let monthIndexes = {
		Jan: 0,
		Feb: 1,
		Mar: 2,
		Apr: 3,
		May: 4,
		Jun: 5,
		Jul: 6,
		Aug: 7,
		Sep: 8,
		Oct: 9,
		Nov: 10,
		Dec: 11,
	};

	for (let i = 0; i < daysToCreate; i++) {
		let d = new Date(ms).toDateString();
		let dArr = d.split(" ");
		let year = dArr[3];
		let month = dArr[1];
		let day = dArr[2];

		// Handle new year
		if (year !== currYear) {
			currYear = year;
			// Cache index of year in yearIndexes object
			// i.e: {2000: 0, 2001: 1, 2002: 2}
			let yearIndex = years.length;
			yearIndexes[currYear] = yearIndex;
			// Create new year array
			years.push([]);
		}

		// Handle new month
		if (month !== currMonth) {
			currMonth = month;
			// Create new month array in current year array
			let yearIndex = yearIndexes[currYear];
			years[yearIndex].push([]);
		}

		// Store date string
		let yearIndex = yearIndexes[year];
		let monthIndex = monthIndexes[month];
		years[yearIndex][monthIndex].push(d);

		// Add a day's worth of milliseconds to date
		ms += 86400000;
	}

	// console.log(years)

	res.status(200).json(years);
});

router.post("/create_user", (req, res) => {
	const userObj = req.body;

	db.createUser(userObj)
		.then(user => {
			console.log("returned user: ", user);
			res.status(200).json(user);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.delete("/", (req, res) => {
	const userId = req.params.id;

	db.deleteAllUsers(userId)
		.then(resp => {
			if (resp) {
				// resp = 1 = user deleted
				res.status(200).json({ message: "users deleted" });
			} else {
				// resp = 0 = no user found
				res.status(404).json({ message: "user not found" });
			}
		})
		.catch(err => {
			console.log("err", err);
			res.status(500).json(err);
		});
});
router.delete("/:id", (req, res) => {
	const userId = req.params.id;

	db.deleteUser(userId)
		.then(resp => {
			if (resp) {
				// resp = 1 = user deleted
				res.status(200).json({ message: "user deleted" });
			} else {
				// resp = 0 = no user found
				res.status(404).json({ message: "user not found" });
			}
		})
		.catch(err => {
			console.log("err", err);
			res.status(500).json(err);
		});
});

router.get("/test/:id", (req, res) => {
	const userId = req.params.id;

	db.findUsersMet(userId)
		.then(resp => {
			console.log(resp);
			res.status(200).json(resp);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
