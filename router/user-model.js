const db = require("../data/dbConfig.js");

module.exports = {
	find,
	findByEmail,
	createUser,
	deleteUser,
	deleteAllUsers,
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

function findByEmail(emailAddress) {
	return db("users")
		.where({ emailAddress: emailAddress })
		.then(user => {
			if (!user.length) {
				return false;
			}
			user = user[0];
			return findUserEvents(user.id).then(events => {
				return {
					user: user,
					events: events,
				};
			});
		});
}
// function findByEmail(emailAddress) {
// 	return db("users")
// 		.where({ emailAddress: emailAddress })
// 		.first()
// 		.then(user => {
// 			console.log("user: ", user);
// 			return db("event_users")
// 				.where({ userId: user.id })
// 				.then(res => {
// 					console.log(res);
// 				});
// 			return res;
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
