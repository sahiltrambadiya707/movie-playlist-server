const mongoose = require("mongoose");

module.exports = (connection) => {
  const movie = new mongoose.Schema(
    {
      playlist: { type: mongoose.Schema.Types.ObjectId, ref: "playlist" },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      movieName: { type: String },
      moviePoster: { type: String },
      movieId: { type: String },
      privet: { type: Boolean, default: false },
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );

  // Export
  return connection.model("movie", movie, "movie");
};
