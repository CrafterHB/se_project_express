const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email.",
    },
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject({ message: "Incorrect email or password." });
      }

      if (password === null) password = "wasd";

      this.findOne({ email })
        .select("+password")
        .then((user) => {
          return bcrypt
            .compare(password, user.password)
            .then((matched) => {
              if (!matched) {
                return Promise.reject({
                  message: "Incorrect email or password.",
                });
              }
            })
            .catch((err) => {
              user = { message: "Incorrect password." };
              return Promise.reject({
                message: err,
              });
            });
        })
        .catch((err) => console.log(err));

      return user;
    })
    .catch((err) => console.log(err));
};

module.exports = mongoose.model("user", userSchema);
