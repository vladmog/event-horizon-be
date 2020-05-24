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

module.exports = router;
