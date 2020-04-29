const express = require("express");
const router = express.Router();

const db = require("./user-model.js");

router.get("/get_users", (req, res) => {
	db.find()
		.then(users => {
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

router.post("/create_user", (req, res) => {
	const userObj = req.body;

	db.createUser(userObj)
		.then(user => {
			console.log("returned user: ", user);
			res.status(200).json(user);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

router.delete("/:id", (req, res) => {
	const userId = req.params.id;

	db.deleteUser(userId)
		.then(resp => {
			// resp = 1 = user deleted
			if (resp) {
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

module.exports = router;
