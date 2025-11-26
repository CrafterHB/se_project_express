const router = require("express").Router();

const userRouter = require("./users");

const clothingItemRouter = require("./clothingItems");

const { login, createUser } = require("../controllers/users");
const auth = require("../middleware/auth");

const {
  signin,
  createUserCheck,
  checkID,
} = require("../middleware/validation");

router.use("/items", clothingItemRouter);
router.post("/signin", signin, login);
router.post("/signup", createUserCheck, createUser);

router.use(auth);
router.use("/:users", userRouter);
module.exports = router;
