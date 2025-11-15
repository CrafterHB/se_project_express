const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.use(auth);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", unlikeItem);

module.exports = router; // just export router and all routes declared will be exported with it.
