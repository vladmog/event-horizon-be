const db = require("../data/dbConfig.js");

module.exports = {
	find,
	findByEmail,
	createUser,
	deleteUser,
};

function find() {
	return db("users");
}

function findByEmail(emailAddress) {
	return db("users").where({ emailAddress: emailAddress }).first();
}

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
