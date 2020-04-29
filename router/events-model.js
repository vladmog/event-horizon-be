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

// function findEventsByUserId

function add(event) {
	const { name, inviteUrl, userId, userName } = event;
	// Insert incoming event to "events" table
	return db("events")
		.insert({ name, inviteUrl })
		.then(eventId => {
			eventId = eventId[0];
			// Insert userId and new eventId into "event_users" table
			return db("event_users")
				.insert({ eventId, userId, isAdmin: true })
				.then(event_user_id => {
					event_user_id = event_user_id[0];
					return findEventById(eventId).then(event => {
						return event;
					});
				});
		});
}

function remove(eventId) {
	return db("events").where({ id: eventId }).delete();
}

// events
//   x name;
//   x inviteUrl;
//     date;      NULLABLE
//     time;      NULLABLE

// event_users
//     eventId;
//     userId;
//     isAdmin;
