const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../middleware/error-handler");
const clothingItem = require("../models/clothingItem");
const { getStatusByName } = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .populate("owner", "-password")
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, link, weather } = req.body;
  const imageUrl = link;
  const owner = req.user && (req.user._id || req.user.id);

  if (!owner) return new UnauthorizedError("Authorization Required.");
  if (!name || !imageUrl || !weather)
    return new BadRequestError("Name, Image URL, and Weather are required.");

  return clothingItem
    .create({ name, imageUrl, weather, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      return res
        .status(getStatusByName(err.name))
        .send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const ownerId = req.user && (req.user._id || req.user.id);
  const { itemId } = req.params;

  if (!ownerId) return new UnauthorizedError("Authorization Required.");

  return clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== String(ownerId)) {
        return new ForbiddenError("User is not the owner of the item.");
      }
      return clothingItem
        .findByIdAndDelete(itemId)
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return new NotFoundError("Item not found.");
      }
      if (err.name === "CastError") {
        return new BadRequestError("Bad Request.");
      }
      return res
        .status(getStatusByName(err.name))
        .send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const userId = req.user && req.user._id;
  const { itemId } = req.params;
  if (!userId)
    return res.status(401).send({ message: "Authorization required" });

  return clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") return new BadRequestError("Bad Request.");
      return res
        .status(getStatusByName(err.name))
        .send({ message: err.message });
    });
};

const unlikeItem = (req, res) => {
  const userId = req.user && req.user._id;
  const { itemId } = req.params;
  if (!userId) return new UnauthorizedError("Authorization Required.");

  return clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") return new BadRequestError("Bad Request.");
      return res
        .status(getStatusByName(err.name))
        .send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
