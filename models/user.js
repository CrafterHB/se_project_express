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
        return Promise.reject(Error("Incorrect email or password."));
      }

      return this.findOne({ email })
        .select("+password")
        .then(() => {
          bcrypt
            .compare(password, user.password)
            .then((matched) => {
              if (!matched) {
                return Promise.reject(Error("Incorrect email or password."));
              }

              return matched;
            })
            .catch((err) => {
              const msg = `Error: ${err}`;
              return Promise.reject(Error(msg));
            });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

module.exports = mongoose.model("user", userSchema);
