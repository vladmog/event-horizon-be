const db = require("../data/dbConfig.js");

module.exports = {
	find,
	findByEmail,
	createUser,
	deleteUser,
	deleteAllUsers,
	findUsersMet,
};

function find() {
	return db("users");
}

function findUserEvents(userId) {
	return db("event_users as eu")
		.where({ userId: userId })
		.join("events as e", "eu.eventId", "e.id")
		.select(
			"e.id",
			"eu.isAdmin",
			"e.name",
			"e.eventHash",
			"e.startDate",
			"e.endDate",
			"e.time",
			"e.adminId"
		);
}

async function findUsersMet(userId) {
	// Obtain eventIds user has been part of
	let eventIds = await db("event_users as eu")
		.where({ userId: userId })
		.select("eu.eventId");

	// Reformat [{eventId: 1}, {eventId: 2}] => [1,2]
	eventIds = eventIds.map(obj => {
		return obj.eventId;
	});

	// Find all users that given user has attended events with
	let usersMet = await db("event_users as eu")
		.join("users as u", "eu.userId", "u.id")
		.whereIn("eu.eventId", eventIds)
		// .whereNot("eu.userId", userId)
		.select(
			"u.id",
			"u.userName",
			"u.emailAddress",
			"eu.id",
			"eu.eventId",
			"eu.isAdmin",
			"eu.userId"
		);

	return usersMet;
}

async function findByEmail(emailAddress) {
	// Get user object
	let user = await db("users").where({ emailAddress: emailAddress });

	// Return false if user not found
	if (!user.length) {
		return false;
	}
	// Reformat [{user}] => {user}
	user = user[0];

	// Get user events
	let events = await findUserEvents(user.id);

	// Get user acquaintances
	let usersMet = await findUsersMet(user.id);

	return {
		user: user,
		events: events,
		usersMet: usersMet,
	};
}

// // PRE ASYNC
// function findByEmail(emailAddress) {
// 	return db("users")
// 		.where({ emailAddress: emailAddress })
// 		.then(user => {
// 			if (!user.length) {
// 				return false;
// 			}
// 			user = user[0];
// 			return findUserEvents(user.id).then(events => {
// 				return {
// 					user: user,
// 					events: events,
// 				};
// 			});
// 		});
// }

function createUser(userObj) {
	return db("users")
		.insert(userObj)
		.then(() => {
			return findByEmail(userObj.emailAddress);
		});
}

function deleteUser(userId) {
	return db("users").where({ id: userId }).delete();
}
function deleteAllUsers(userId) {
	return db("users").delete();
}
