const mongoose = require("mongoose");

module.exports = (connection) => {
  const playlist = new mongoose.Schema(
    {
      playlistBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      playlistName: { type: String },
      privet: { type: Boolean, default: false },
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );

  // Export
  return connection.model("playlist", playlist, "playlist");
};
