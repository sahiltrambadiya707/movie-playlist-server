const Joi = require("joi");
const jwt = require("jsonwebtoken");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const ObjectId = require("mongodb").ObjectId;
const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");

module.exports = exports = {
  // route validation
  validation: Joi.object({
    playlistName: Joi.string().trim().required(),
    privet: Joi.boolean(),
  }),

  // route handler
  handler: async (req, res) => {
    const { playlistName, privet } = req.body;
    const { _id } = req.user;

    const limitPlaylist = await global.models.GLOBAL.PLAYLIST.find({
      playlistBy: _id,
    }).countDocuments();

    if (limitPlaylist > 10) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: "Your playlist create limit is over",
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    const uid = new ObjectId();
    const playlistObject = {
      _id: uid,
      playlistName: playlistName,
      privet: privet,
      playlistBy: _id,
    };

    const newPlaylist = global.models.GLOBAL.PLAYLIST(playlistObject);
    try {
      await newPlaylist.save();
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: "playlist created successful!",
        payload: { result: playlistObject },
        logPayload: false,
      };
      res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error(`${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`);
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
