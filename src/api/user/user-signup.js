/**
 * Controller to verify a specified phone number.
 * Created by Bhargav Butani on 09.07.2021
 */
const _ = require("lodash");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongodb").ObjectId;
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");
const jwtOptions = require("../../auth/jwt-options");

module.exports = exports = {
  // router validation
  validation: Joi.object({
    //  device: {
    //      os: Joi.string().allow(""),
    //      type: Joi.string().allow(""),
    //      version: Joi.string().allow(""),
    //      token: Joi.string().allow(""),
    //  },
    email: Joi.string().allow(""),
    //  location: {
    //      latitude: Joi.number().allow(0),
    //      longitude: Joi.number().allow(0)
    //  },
    name: Joi.string().required(),
    phone: Joi.string().required(),
    password: Joi.string().required(),
    //  token: Joi.string().required()
  }),

  // route handler
  handler: async (req, res) => {
    let { email, name, phone, location, device, password } = req.body;
    if (!phone) {
      logger.error("Phone is mandatory.");
      const data4createResponseObject = {
        req: req,
        result: -400,
        message: "Phone is mandatory.",
        payload: {},
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
      return;
    }
    phone = phone.removeSpaces();

    /* For older version, the app would still send name instead of firstName, middleName, lastName */
    if (!name) {
      logger.error("Name is mandatory.");
      const data4createResponseObject = {
        req: req,
        result: -400,
        message: "Name is mandatory.",
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utils.createResponseObject(data4createResponseObject));
      return;
    }

    let user = await global.models.GLOBAL.USER.findOne({ phone: phone });
    if (user !== null) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.EXISTS_PHONE,
        payload: {},
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
      return;
    }

    const data4token = {
      id: user?._id,
      date: new Date(),
      environment: process.env.APP_ENVIRONMENT,
      phone: phone,
      scope: "signup",
      type: enums.USER_TYPE.USER,
    };

    /* Save into mongodb */
    const uid = new ObjectId();
    const userObject = {
      _id: uid,
      // device: {
      //   os: _.get(device, "os", ""),
      //   type: _.get(device, "type", ""),
      //   token: _.get(device, "token", ""),
      //   version: _.get(device, "version", ""),
      // },
      email: email,
      password: password,
      // location: {
      //   coordinates: [_.get(location, "longitude", 0), _.get(location, "latitude", 0)],
      //   type: "Point",
      // },
      modificationDate: Date.now().toString(),
      name: name,
      phone: phone,
      registrationDate: Date.now().toString(),
      status: {
        name: enums.USER_STATUS.ACTIVE,
        modificationDate: Date.now().toString(),
      },
      token: jwt.sign(data4token, jwtOptions.secretOrKey),
    };

    const newUser = await global.models.GLOBAL.USER(userObject);

    try {
      await newUser.save();
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: "signUp in successful!",
        payload: userObject,
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error("/user - Error encountered while trying to add new user:\n" + error);
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.FAILED_REGISTRATION,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
      return;
    }
  },
};
