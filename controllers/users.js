const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { getStatusByName } = require("../utils/errors");
const User = require("../models/user");

const {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  ConflictError,
} = require("../middleware/error-handler");

const getUsers = (req, res) => {
  const status = 200;
  return User.find({})
    .then((users) => {
      if (!users) {
        return new NotFoundError("No users found.");
      }

      res.status(status).send(users);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        if (!user) {
          return new NotFoundError("User not found.");
        }

        const u = user.toObject();
        delete u.password;
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.status(201).send({ token, user: u });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res
            .status(409)
            .send({ message: "This email is already registered." });
        }

        if (err.name === "ConflictError") {
          return new ConflictError("User already exists.");
        }
        if (err.name === "ValidationError") {
          return new UnauthorizedError("Not Authorized.");
        }
        return res
          .status(getStatusByName(err.name))
          .send({ message: err.message });
      });
  });
};

const getUser = (req, res) => {
  const { userId } = req.user._id;
  return User.findById(userId)
    .then((user) => res.status(200).send(user))
    .orFail()
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return new NotFoundError("User not found.");
      }
      if (err.name === "CastError") {
        return new BadRequestError("Bad Request (Cast Error)");
      }
      return res
        .status(getStatusByName(err.name))
        .send({ message: err.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (password === undefined) {
    return res
      .status(400)
      .send({ message: "You cannot leave the password field empty." });
  }

  if (email === undefined) {
    return res
      .status(400)
      .send({ message: "You cannot leave the email field empty." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (
        err.message === "Cannot read properties of undefined (reading '_id')"
      ) {
        return new BadRequestError("Incorrect email or password.");
      }
      return res.status(getStatusByName(err.name)).send({ message: err });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    throw new UnauthorizedError("Authorization Required.");
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return new NotFoundError("User not found.");
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return new BadRequestError("Bad Request (Cast Error)");
      }
      return res
        .status(getStatusByName(err.name))
        .send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId)
    return res.status(401).send({ message: "Authorization required" });

  const { name, avatar, email } = req.body;
  const update = {};
  if (name !== undefined) update.name = name;
  if (avatar !== undefined) update.avatar = avatar;
  if (email !== undefined) update.email = String(email).trim().toLowerCase();

  return User.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((user) => {
      if (!user) return new NotFoundError("User not found.");
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000)
        return new ConflictError("Email is already registered.");
      if (err.name === "ValidationError" || err.name === "CastError")
        return new BadRequestError("Bad Request");
      return res
        .status(getStatusByName(err.name))
        .send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  createUser,
  getUser,
  login,
  updateUser,
  getCurrentUser,
};
