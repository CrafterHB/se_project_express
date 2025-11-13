const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.use(auth);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", (req, res, next) =>
  require("../controllers/clothingItems").likeItem(req, res, next)
);
router.delete("/:itemId/likes", (req, res, next) =>
  require("../controllers/clothingItems").unlikeItem(req, res, next)
);

module.exports = router; // just export router and all routes declared will be exported with it.
