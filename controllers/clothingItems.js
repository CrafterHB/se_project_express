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
  const { name, imageUrl, weather } = req.body;
  const owner = req.user && req.user._id;

  if (!owner)
    return res.status(401).send({ message: "Authorization required" });
  if (!name || !imageUrl || !weather)
    return res
      .status(400)
      .send({ message: "name, imageUrl and weather are required" });

  clothingItem
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
  const ownerId = req.user && req.user._id;
  const { itemId } = req.params;

  if (!ownerId)
    return res.status(401).send({ message: "Authorization required" });

  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== String(ownerId)) {
        return res.status(403).send({ message: "Forbidden: not the owner" });
      }
      return clothingItem
        .findByIdAndDelete(itemId)
        .then(() => res.status(200).send({ message: "Item deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(getStatusByName(err.name))
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(getStatusByName(err.name))
          .send({ message: err.message });
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

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError")
        return res
          .status(getStatusByName(err.name))
          .send({ message: err.message });
      return res
        .status(getStatusByName(err.name))
        .send({ message: err.message });
    });
};

const unlikeItem = (req, res) => {
  const userId = req.user && req.user._id;
  const { itemId } = req.params;
  if (!userId)
    return res.status(401).send({ message: "Authorization required" });

  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) return res.status(404).send({ message: "Item not found" });
      return res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError")
        return res
          .status(getStatusByName(err.name))
          .send({ message: err.message });
      return res
        .status(getStatusByName(err.name))
        .send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
