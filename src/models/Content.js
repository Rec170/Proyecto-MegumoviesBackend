const { Schema, model } = require('mongoose');

const ContentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    thumbnail: { type: String, default: '' },
    isMovie: { type: Boolean, required: true }
  },
  { timestamps: true }
);

ContentSchema.index({ title: 'text' });

module.exports = model('Content', ContentSchema);
