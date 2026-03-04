const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    membership: { type: String, default: null },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Content' }]
  },
  { timestamps: true }
);

module.exports = model('User', UserSchema);
