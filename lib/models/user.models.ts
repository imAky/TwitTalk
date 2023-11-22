import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profile: String,
  banner: String,
  twit: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Twit",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  community: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  notifications: [
    {
      type: String,
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
