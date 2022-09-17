const Joi = require("joi");
const jwt = require("jsonwebtoken");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const ObjectId = require("mongodb").ObjectId;
const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");

module.exports = exports = {
  // route handler
  handler: async (req, res) => {
    const { playlistId } = req.params;
    const { _id } = req.user;

    try {
      const deletePlaylist = await global.models.GLOBAL.PLAYLIST.deleteOne({
        $and: [{ _id: ObjectId(playlistId) }, { playlistBy: ObjectId(_id) }],
      });

      await global.models.GLOBAL.MOVIE.deleteMany({
        $and: [{ playlist: ObjectId(playlistId) }, { user: ObjectId(_id) }],
      });

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { result: deletePlaylist },
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
