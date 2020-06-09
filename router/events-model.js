const db = require("../data/dbConfig.js");
const um = require("./user-model.js");

module.exports = {
	find,
	findEventUsers,
	add,
	remove,
	join,
	getAvailabilities,
	addAvailabilities,
	removeAvailability,
	removeAvailabilities,
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

function join(userIdAndHash) {
	const { userId, eventHash } = userIdAndHash;
	// Locate event with corresponding hash
	return db("events")
		.where({ eventHash: eventHash })
		.then(event => {
			event = event[0];
			console.log("in join event: ", event);
			// Add user as participant of event
			return db("event_users")
				.insert({ eventId: event.id, userId, isAdmin: false })
				.then(event_user_id => {
					event_user_id = event_user_id[0];
					// Return all user events
					return findUserEvents(userId).then(events => {
						return events;
					});
				});
		});
}

function remove(eventId) {
	return db("events").where({ id: eventId }).delete();
}

async function findEventUsers(eventId) {
	let eventUsers = await db("event_users as eu")
		.where({ eventId: eventId })
		.join("users as u", "eu.userId", "u.id")
		.select(
			"u.id",
			"u.userName",
			"u.emailAddress",
			"eu.id",
			"eu.eventId",
			"eu.isAdmin",
			"eu.userId"
		);
	return eventUsers;
}

async function getAvailabilities(eventId) {
	let eventAvailabilities = await db("event_availabilities").where({
		eventId: eventId,
	});

	let eventUsers = await findEventUsers(eventId);

	return { eventAvailabilities, eventUsers };
	// return eventAvailabilities;
}

async function addAvailabilities(availabilities) {
	let res = await db("event_availabilities").insert(availabilities);

	return res;
}

async function removeAvailability(availability) {
	try {
		let res = await db("event_availabilities as ea")
			.where({ availabilityStart: availability.availabilityStart })
			.where({ eventId: availability.eventId })
			.where({ userId: availability.userId })
			.del();
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
}

async function removeAvailabilities(remove) {
	// remove = [{},{},{}]
	// {
	// 	availabilityStart
	// 	durationMinutes
	// 	eventId
	// 	userId
	// }
	remove.forEach(availability => {
		removeAvailability(availability);
	});

	return true; // placeholder
	await db("event_availabilities ea").whereIn();
}

// DELETE FROM table WHERE id IN (SELECT id FROM somewhere_else)

// // Find all users that given user has attended events with        R E F E R E N C E   O N L Y
// let usersMet = await db("event_users as eu")
// .join("users as u", "eu.userId", "u.id")
// .whereIn("eu.eventId", eventIds)
// // .whereNot("eu.userId", userId)
// .select(
// 	"u.id",
// 	"u.userName",
// 	"u.emailAddress",
// 	"eu.id",
// 	"eu.eventId",
// 	"eu.isAdmin",
// 	"eu.userId"
// );

// events
//   x name;
//   x eventHash;
//     date;      NULLABLE
//     time;      NULLABLE

// event_users
//     eventId;
//     userId;
//     isAdmin;
