const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Set up Auth0 configuration
const authConfig = {
	domain: "eventhorizon.auth0.com",
	audience: "https://event-horizon-app.herokuapp.com/",
};

// Define middleware that validates incoming bearer tokens
// using JWKS from YOUR_DOMAIN
const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
	}),

	audience: authConfig.audience,
	issuer: `https://${authConfig.domain}/`,
	algorithm: ["RS256"],
});

const UserRouter = require("./router/user-router.js");
router.use("/user", checkJwt, UserRouter);

router.use("/dev", UserRouter);

module.exports = router;
