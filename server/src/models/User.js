import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'teacher', 'parent'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);

