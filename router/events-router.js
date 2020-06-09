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
		await db.removeAvailabilities(remove);
		await db.addAvailabilities(add);
		let resp = await db.getAvailabilities(eventId);
		res.status(200).json(resp);
	} catch (err) {
		console.log("router err: ", err);
		res.status(500).json(err);
	}
});

module.exports = router;
