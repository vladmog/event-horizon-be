const db = require("../data/dbConfig.js");

module.exports = {
	find,
	findEventUsers,
	add,
	remove,
};

function find() {
	return db("events");
}

function findEventUsers() {
	return db("event_users");
}

function findEventById(eventId) {
	return db("events").where({ id: eventId });
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

function add(eventAndUser) {
	const { event, user } = eventAndUser;
	console.log("event: ", event);

	// Insert incoming event to "events" table
	return db("events")
		.insert(event)
		.then(eventId => {
			eventId = eventId[0];
			// Insert userId and new eventId into "event_users" table
			return db("event_users")
				.insert({ eventId, userId: user.id, isAdmin: true })
				.then(event_user_id => {
					event_user_id = event_user_id[0];
					return findUserEvents(user.id).then(events => {
						return events;
					});
				});
		});
}

function remove(eventId) {
	return db("events").where({ id: eventId }).delete();
}

// events
//   x name;
//   x eventHash;
//     date;      NULLABLE
//     time;      NULLABLE

// event_users
//     eventId;
//     userId;
//     isAdmin;
