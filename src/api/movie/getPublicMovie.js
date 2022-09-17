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
    req.query.page = req.query.page ? req.query.page : 1;
    req.query.limit = req.query.limit ? req.query.limit : 10;
    let limit = parseInt(req.query.limit);
    let skip = (parseInt(req.query.page) - 1) * limit;
    const { playlistId } = req.params;

    try {
      const getPublicMovie = await global.models.GLOBAL.MOVIE.find({
        $and: [{ playlist: ObjectId(playlistId) }, { privet: { $ne: true } }],
      }).sort({ createdAt: -1 });

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { result: getPublicMovie },
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
