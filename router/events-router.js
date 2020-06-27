const express = require("express");
const router = express.Router();

const db = require("./events-model.js");

// Get all events
router.get("/", (req, res) => {
	db.find()
		.then(events => {
			res.status(200).json(events);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: "Doh!" });
		});
});

// Get all event-users
router.get("/event-users", (req, res) => {
	db.findEventUsers()
		.then(events => {
			res.status(200).json(events);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ message: "Doh!" });
		});
});

// Create new event
router.post("/", (req, res) => {
	const eventAndUser = req.body;
	console.log("eventAndUser", eventAndUser);
	db.add(eventAndUser)
		.then(events => {
			console.log("Create router res: ", events);
			res.status(200).json(events);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// Join an event
router.post("/join", (req, res) => {
	const userIdAndHash = req.body;
	db.join(userIdAndHash)
		.then(events => {
			console.log("Join router res: ", events);
			res.status(200).json(events);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json(err);
		});
});

// manually add someone to an event
router.post("/invite", async (req, res) => {
	const {userId, eventId, adminId} = req.body;
	console.log("userId: ", userId, "eventId", eventId, "adminId", adminId)
	try{
		let usersMet = await db.addUserToEvent(userId, eventId, adminId)
		res.status(200).json({usersMet: usersMet})
	} catch (err) {
		console.log(err)
		res.status(500).json(err)
	}
})

// REMOVE EVENT
router.delete("/:id", (req, res) => {
	const eventId = req.params.id;
	db.remove(eventId)
		.then(resp => {
			if (resp) {
				// resp = 1 = event deleted
				res.status(200).json({ message: "event deleted" });
			} else {
				// resp = 0 = no event found
				res.status(404).json({ message: "event not found" });
			}
		})
		.catch(() => {
			console.log("err", err);
			res.status(500).json(err);
		});
});

// GET EVENT AVAILABILITIES
router.get("/availabilities/:id", (req, res) => {
	const eventId = req.params.id;
	db.getAvailabilities(eventId)
		.then(resp => {
			res.status(200).json(resp);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

// UPDATE AVAILABILITIES OF GIVEN EVENT ID ACCORDING TO ADD ARRAY AND REMOVE ARRAY
router.put("/availabilities/:id", async (req, res) => {
	const eventId = req.params.id;
	const { add, remove } = req.body;

	try {
		let added = await db.addAvailabilities(add);
	} catch (err) {
		console.log("add router err: ", err); // <<causing a sqlite misuse error
	}

	try {
		let rem = await db.deleteAvailabilities(remove);
	} catch (err) {
		console.log("del router err: ", err);
	}

	try {
		let avails = await db.getAvailabilities(eventId);
		res.status(200).json(avails);
		// res.status(200).json({ message: "does this message undo the error" });
	} catch (err) {
		console.log("get router err: ", err);
		res.status(500).json(err);
	}
	// try {
	// 	let resp = await db.deleteAvailabilities(remove);
	// 	res.status(200).json(resp);
	// } catch (err) {
	// 	console.log("err: \n", err);
	// 	res.status(500).json(err);
	// }
});

// EXPERIMENTING WITH THE DELETE ROUTE TO SOLVE SQL MISUSE ERROR

// create addAvailability test API call that adds a predefined avail
// create getAvailability test API call that gets the predefined avail
// create removeAvailability test API call that removes the predefined avail

router.post("/testAvailabilities/add", async (req, res) => {
	let availability = req.body;
	console.log("test post avail: \n\n ", availability);
	try {
		let newAvail = await db.addAvailability(availability);
		res.status(200).json(newAvail);
	} catch (err) {
		res.status(500).json(err);
	}
});
router.get("/testAvailabilities/get/:id", async (req, res) => {
	let id = req.params.id;
	try {
		let avail = await db.getAvailability(id);
		res.status(200).json(avail);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});
router.delete("/testAvailabilities/remove/:id", async (req, res) => {
	// // BY ID
	// let id = req.params.id;
	// try {
	// 	let resp = await db.deleteAvailability(id);
	// 	res.status(200).json(resp);
	// } catch (err) {
	// 	console.log(err);
	// 	res.status(500).json(err);
	// }

	// // BY TRIFACTOR
	let avails = req.body;
	try {
		let resp = await db.deleteAvailabilities(avails);
		res.status(200).json(resp);
	} catch (err) {
		console.log("err: \n", err);
		res.status(500).json(err);
	}
});

module.exports = router;
