const db = require("../data/dbConfig.js");

module.exports = {
	find,
	add,
	remove,
};

function find() {
	return db("events");
}

function add(event) {
	const { name, inviteUrl, userId, userName } = event;
	return db("events")
		.insert({ name, inviteUrl })
		.then(res => {
			console.log(res);
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
