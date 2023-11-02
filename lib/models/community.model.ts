import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
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
    require: true,
  },
  image: String,
  bio: String,
  cretedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  Twits: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Twit",
    },
  ],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Community =
  mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;
