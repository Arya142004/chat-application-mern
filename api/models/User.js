const mongoose = require("mongoose");

const Userschema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    password: String,
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", Userschema);

module.exports = UserModel;
