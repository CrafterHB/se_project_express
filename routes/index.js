const router = require("express").Router();

const userRouter = require("./users");

const clothingItemRouter = require("./clothingItems");

const { login, createUser } = require("../controllers/users");
const auth = require("../middleware/auth");

router.use("/items", clothingItemRouter);
router.post("/signin", login);
router.post("/signup", createUser);

router.use(auth);
router.use("/:users", userRouter);
module.exports = router;
