import mongoose from "mongoose";

const twitSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  postImg: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Twit",
    },
  ],
});

const Twit = mongoose.models.Twit || mongoose.model("Twit", twitSchema);

export default Twit;
