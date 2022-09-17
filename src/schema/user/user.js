/**
 * This is the model for an user.
 * The model will validate the inputs and also do unique checks on its own.
 *
 * NOTE: As soon as we define something as unique, mongoose creates an index on that field. So if any field
 * which was previously marked as "unique" is now unmarked to be unique, make sure to delete the corresponding
 * index in MongoDB.
 *
 * Created by Bhargav Butani on 07.07.2021.
 */
const enums = require("../../../json/enums.json");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = require("mongodb").ObjectId;

module.exports = (connection) => {
  const addressSchema = new mongoose.Schema(
    {
      line1: String,
      line2: String,
      city: String,
      country: String,
      countryCode: String,
      landmark: String,
      location: {
        coordinates: [Number],
        type: { $type: String, default: "Point" },
      },
      pin: String,
      primary: { $type: Boolean, default: false },
      state: String,
    },
    { typeKey: "$type" }
  );

  const userSchema = new mongoose.Schema(
    {
      _id: String,
      imagePath: String,
      // address: [addressSchema],
      device: {
        os: String,
        token: String,
        version: String,
        type: String,
        version: Number,
      },
      email: String,
      location: {
        coordinates: [Number],
        type: { $type: String, default: "Point" },
      },
      modificationDate: Date,
      name: String,
      phone: { $type: String, sparse: true, unique: true },
      password: { $type: String },
      registrationDate: { $type: Date },
      status: {
        name: {
          $type: String,
          enum: [
            enums.USER_STATUS.ACTIVE,
            enums.USER_STATUS.BLOCKED,
            enums.USER_STATUS.DISABLED,
            enums.USER_STATUS.INACTIVE,
            enums.USER_STATUS.INVITED,
          ],
        },
        modificationDate: Date,
      },
    },
    { typeKey: "$type" }
  );

  // Export
  return connection.model("user", userSchema, "user");
};
