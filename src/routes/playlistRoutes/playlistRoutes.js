const express = require("express");
const router = express.Router();
const playlistApi = require("../../api/playlist/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

// Get Methods
router.get("/public", playlistApi.getPublicPlaylist.handler);
router.get(
  "/byUser",
  passport.authenticate(["jwt"], { session: false }),
  playlistApi.getUserPlaylist.handler
);

// Post Methods
router.post(
  "/create",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", playlistApi.createPlaylist.validation),
  playlistApi.createPlaylist.handler
);

// Put Methods
router.put(
  "/update/:playlistId",
  passport.authenticate(["jwt"], { session: false }),
  playlistApi.updatePlaylist.handler
);

// Delete Methods
router.delete(
  "/delete/:playlistId",
  passport.authenticate(["jwt"], { session: false }),
  playlistApi.deletePlaylist.handler
);

module.exports = router;
