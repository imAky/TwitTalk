"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import User from "../models/user.models";
import Twit from "../models/twit.model";
import Community from "../models/community.model";
import mongoose from "mongoose";

interface Params {
  text: string;
  postImg?: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createTwit({
  text,
  postImg,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();
    const createdTwit = await Twit.create({
      text,
      postImg,
      author,
    });

    await User.findByIdAndUpdate(author, {
      $push: { twit: createdTwit._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create tweet: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();
  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Twit.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "community",
        model: Community,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });
    const totalPostsCount = await Twit.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;
    return { posts, isNext };
  } catch (error: any) {
    console.log("Failed to Load Post: Retry");
  }
}

export async function fetchTwitById(twitId: string) {
  connectToDB();

  try {
    const twit = await Twit.findById(twitId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name username profile",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Twit,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return twit;
  } catch (error: any) {
    console.log("Failed to Fetching Twit", error);
    throw new Error("Unable to Fetch  Twit");
  }
}

export async function addCommentToTwit(
  twitId: string,
  commentText: string,
  commentImg: string | undefined,
  userId: string,
  path: string
) {
  connectToDB();
  try {
    // finding real twit
    const realTwit = await Twit.findById(twitId);

    if (!realTwit) {
      throw new Error("Twit Not Found");
    }

    //Fetch the User information
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User Not Found");
    }

    // creat new Comment Twit
    const commentTwit = new Twit({
      text: commentText,
      postImg: commentImg,
      author: userId,
      parentId: twitId,
    });
    console.log(userId);

    const savedCommentTwit = await commentTwit.save();

    realTwit.children.push(savedCommentTwit._id);
    await realTwit.save();
    revalidatePath(path);
  } catch (error: any) {
    console.error("Error while adding comment", error);
    throw new Error("Unable to add comment ");
  }
}
