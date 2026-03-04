const { Schema, model } = require('mongoose');

const EpisodeSchema = new Schema(
  {
    contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
    season: { type: Number, required: true },
    episodeNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '' }
  },
  { timestamps: true }
);

EpisodeSchema.index({ contentId: 1, season: 1, episodeNumber: 1 }, { unique: true });

module.exports = model('Episode', EpisodeSchema);
