const enums = require("../../json/enums.json");
const messages = require("../../json/messages.json");

module.exports = (app, logger) => {
  // define all route imports here/
  // define all route imports here
  const userRoutes = require("../routes/userRoutes/auth-routes");
  const palylistRoutes = require("../routes/playlistRoutes/playlistRoutes");
  const movieRoutes = require("../routes/movieRoutes/movieRoutes");

  // define all routes here
  app.use(["/api/v1/user"], userRoutes);
  app.use(["/api/v1/playlist"], palylistRoutes);
  app.use(["/api/v1/movie"], movieRoutes);

  const { createResponseObject } = require("../utils");

  /* Catch all */
  app.all("*", function (req, res) {
    res.status(enums.HTTP_CODES.BAD_REQUEST).json(
      createResponseObject({
        req: req,
        result: -1,
        message: "Sorry! The request could not be processed!",
        payload: {},
        logPayload: false,
      })
    );
  });

  // Async error handler
  app.use((error, req, res, next) => {
    logger.error(
      `${req.originalUrl} - Error caught by error-handler (router.js): ${error.message}\n${error.stack}`
    );
    const data4responseObject = {
      req: req,
      result: -999,
      message: messages.GENERAL,
      payload: {},
      logPayload: false,
    };

    return res
      .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(createResponseObject(data4responseObject));
  });
};
