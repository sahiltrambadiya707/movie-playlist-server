/**
 * MongoDB / Mongoose
 */
const mongoose = require("mongoose");
const logger = require("../logger");
const ConnectionFactory = require("./connection-factory");
const config = require("../../config.json");

module.exports = async () => {
  mongoose.pluralize(null); // So that mongoose doesn't try to pluralize the schema and map accordingly.
  let models;
  try {
    const connectionFactory = new ConnectionFactory(config);
    // GLOBAL Connections
    const connection_IN_MOVIEPLAYLIST = await connectionFactory.getConnection(
      "GLOBAL",
      config.MONGODB.GLOBAL.DATABASE.MOVIEPLAYLIT
    );

    const mongooseConnections = {
      GLOBAL: {
        MOVIEPLAYLIT: connection_IN_MOVIEPLAYLIST,
      },
    };

    /* All the (mongoose) models to be defined here */
    models = {
      GLOBAL: {
        USER: require("../schema/user/user")(mongooseConnections.GLOBAL.MOVIEPLAYLIT),
        MOVIE: require("../schema/movie/movie")(mongooseConnections.GLOBAL.MOVIEPLAYLIT),
        PLAYLIST: require("../schema/playlist/playlist")(mongooseConnections.GLOBAL.MOVIEPLAYLIT),
      },
    };

    return models;
  } catch (error) {
    logger.error(
      "Error encountered while trying to create database connections and models:\n" + error.stack
    );
    return null;
  }
};
