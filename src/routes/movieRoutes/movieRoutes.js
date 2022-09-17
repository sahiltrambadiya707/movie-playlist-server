const express = require("express");
const router = express.Router();
const movieApi = require("../../api/movie/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/public/:playlistId", movieApi.getPublicMovie.handler);
router.get(
  "/byUser/:playlistId",
  passport.authenticate(["jwt"], { session: false }),
  movieApi.getUserMovie.handler
);

// Post Methods
router.post(
  "/create",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", movieApi.createMovie.validation),
  movieApi.createMovie.handler
);

// Put Methods
router.put(
  "/update/:playlistId/:movieId",
  passport.authenticate(["jwt"], { session: false }),
  movieApi.updateMovie.handler
);

// Delete Methods
router.delete(
  "/delete/:playlistId/:movieId",
  passport.authenticate(["jwt"], { session: false }),
  movieApi.deleteMovie.handler
);

module.exports = router;
