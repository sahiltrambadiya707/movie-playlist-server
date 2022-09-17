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
    playlist: Joi.string().trim().required(),
    movieId: Joi.required(),
    moviePoster: Joi.string().trim().required(),
    movieName: Joi.string().trim().required(),
    privet: Joi.boolean(),
  }),

  // route handler
  handler: async (req, res) => {
    const { movieName, moviePoster, movieId, playlist, privet } = req.body;
    const { _id } = req.user;

    const limitPlaylist = await global.models.GLOBAL.MOVIE.find({
      playlist: playlist,
    }).countDocuments();

    if (limitPlaylist > 30) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: "Your playlist is full...!",
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    const CheckMovie = await global.models.GLOBAL.MOVIE.findOne({
      $and: [{ playlist: playlist }, { movieId: movieId }],
    });

    if (CheckMovie) {
      const data4createResponseObject = {
        req: req,
        result: -1,
        message: "Your Playlist Already Have This Movie",
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    const uid = new ObjectId();
    const movieObject = {
      _id: uid,
      user: _id,
      playlist: playlist,
      movieName: movieName,
      moviePoster: moviePoster,
      movieId: movieId,
      privet: privet,
    };

    const newMovie = await global.models.GLOBAL.MOVIE(movieObject);
    try {
      await newMovie.save();
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { result: movieObject },
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
