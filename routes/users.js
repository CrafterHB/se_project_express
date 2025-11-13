const router = require("express").Router();
const { updateUser, getCurrentUser } = require("../controllers/users");

/*router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

Project instructions say to put this in app.js
router.post("/signin", login);
router.post("/signup", createUser); */

//router.patch("/:users/me", updateUser);
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router; // just export router and all routes declared will be exported with it.
