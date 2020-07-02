const db = require("../data/dbConfig.js");
const um = require("./user-model.js");

module.exports = {
	find,
	findEventUsers,
	findUserEvents,
	findEventById,
	add,
	update, 
	remove,
	join,
	getAvailabilities,
	addAvailabilities,
	addUserToEvent,
	removeUserFromEvent,
	deleteEventAndArtifacts,

	//tests
	getAvailability,
	addAvailability,
	deleteAvailability,
	deleteAvailabilities,
	
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

// for admin event creation
function add(eventAndUser) {
	const { event, user } = eventAndUser;
	console.log("event: ", event);

	// Insert incoming event to "events" table
	return db("events")
		.returning(["id"])
		.insert(event)
		.then(eventId => {
			eventId = eventId[0].id;
			// Insert userId and new eventId into "event_users" table
			return db("event_users")
				.returning(["id"])
				.insert({ eventId, userId: user.id, isAdmin: true })
				.then(event_user_id => {
					event_user_id = event_user_id[0].id;
					return findUserEvents(user.id).then(events => {
						return um.findUsersMet(user.id)
							.then((usersMet) => {
								return {
									usersMet, events
								}
							})
					});
				});
		});
}

async function update (eventId, updates) {
	let updatedRows = await db("events")
		.where({id: eventId})
		.update(updates)
	return updatedRows
}

// to join an event via invite link
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
				.returning(["id"])
				.insert({ eventId: event.id, userId, isAdmin: false })
				.then(event_user_id => {
					event_user_id = event_user_id[0].id;
					// Return all user events
					return findUserEvents(userId).then(events => {
						return events;
					});
				});
		});
}

// for use in inviting users via invite button in invite page
// adds user to db then returns admin's events
async function addUserToEvent(userId, eventId, adminId) {
	// check if user being invited is already part of the event
	let check = await db("event_users")
		.where({eventId: eventId, userId: userId})
	if(check.length){
		// if user already part of event, do nothing
		return false
	}
	// otherwise add user to event and return admin users met
	await db("event_users")
		.returning(["id"])
		.insert({eventId, userId, isAdmin: false})
	let usersMet = await um.findUsersMet(adminId)
	return usersMet
}


// for use in uninviting users via red x button in invite page
// removes user from db then returns admin's events
async function removeUserFromEvent(userId, eventId, adminId) {
	// check if user being removed is part of the event
	let check = await db("event_users")
		.where({eventId: eventId, userId: userId})
	if(!check.length){
		// if user not part of event, do nothing
		return false
	}

	// Delete user availabilities from the event
	await db("event_availabilities")
		.where({eventId: eventId, userId: userId})
		.del()

	// Delete user from event participants
	await db("event_users")
		.where({eventId: eventId, userId: userId})
		.del()

	let usersMet = await um.findUsersMet(adminId)
	let events = await findUserEvents(adminId)
	return {usersMet, events}
}

// deletes an event
function remove(eventId) {
	return db("events").where({ id: eventId }).delete();
	// should also delete event availabilities and participants
}

async function deleteEventAndArtifacts(eventId, adminId){
	// event_availabilities
	await db("event_availabilities")
		.where({eventId: eventId})
		.del()
	// event_users
	await db("event_users")
		.where({eventId: eventId})
		.del()
	// events	
	await db("events")
		.where({id: eventId})
		.del()
	let usersMet = await um.findUsersMet(adminId)
	let events = await findUserEvents(adminId)

	return {
		usersMet, 
		events
	}

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

async function addAvailability(availability) {
	// insert availability and return created record
	try {
		let newIdInArray = await db("event_availabilities")
			.returning(["id"])
			.insert(availability);
		let newId = newIdInArray[0].id;
		let newAvail = await getAvailability(newId);
		return newAvail;
	} catch (err) {
		console.log(err);
		return err;
	}
}

async function getAvailability(id) {
	try {
		let avail = await db("event_availabilities").where({ id: id }).first();
		return avail;
	} catch (err) {
		console.log(err);
		return err;
	}
}

async function deleteAvailability(eventId, userId, availabilityStart) {
	try {
		let res = await db("event_availabilities")
			.where({ eventId: eventId })
			.andWhere({ userId: userId })
			.andWhere({ availabilityStart: availabilityStart })
			.del();
		return res;
	} catch (err) {
		console.log(err);
		return err;
	}
}

async function deleteAvailabilities(arr) {
	if (!arr.length) {
		return 0;
	}
	try {
		let toDelete = arr.map(avail => {
			const { eventId, userId, availabilityStart } = avail;
			let res = db("event_availabilities")
				.where({ eventId: eventId })
				.andWhere({ userId: userId })
				.andWhere({ availabilityStart: availabilityStart })
				.del();
			return res;
		});
		Promise.all(toDelete)
			.then(resp => {
				console.log("Promise.all resp: \n", resp);
				return resp;
			})
			.catch(err => {
				console.log(err);
				return err;
			});
	} catch (err) {
		console.log(err);
		return err;
	}
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

// EXPERIMENTING WITH THE DELETE ROUTE TO SOLVE SQL MISUSE ERROR

// async function getAvailability(eventId, userId, dateString){

// }

// async function deleteAvailability(id) {
// 	try {
// 		let res = db("event_availabilities").where({ id: id }).del();
// 		return res;
// 	} catch (err) {
// 		console.log(err);
// 		return err;
// 	}
// }
