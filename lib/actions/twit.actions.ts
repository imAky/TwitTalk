"use server";

import {
  TwitDocument,
  UserDocument,
  CommunityDocument,
} from "../validations/types";

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

// Adjust the path accordingly

export const fetchAllPosts = async (
  pageNumber: number,
  pageSize: number
): Promise<{ postData: TwitDocument[]; totalPostCount: number }> => {
  // Connect to your database or perform necessary setup
  connectToDB();

  try {
    const skipAmount = (pageNumber - 1) * pageSize;

    const postsQuery = Twit.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({
        path: "author",
        model: "User" as any, // Casting 'User' as any to avoid TS error, ensure it matches your Mongoose model name
      })
      .populate({
        path: "community",
        model: "Community" as any, // Casting 'Community' as any to avoid TS error, ensure it matches your Mongoose model name
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: "User" as any, // Casting 'User' as any to avoid TS error, ensure it matches your Mongoose model name
          select: "_id name parentId image",
        },
      });

    const totalPostCount = await Twit.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    // Executing query and converting results to TwitDocument[]
    const postData: TwitDocument[] =
      (await postsQuery.exec()) as TwitDocument[];
    return { postData, totalPostCount };
  } catch (error: any) {
    console.log("Error fetching posts", error);
    throw new Error(`Error: ${error.message}`);
  }
};

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

export async function DeletePostById(twitId: string, pathname: string) {
  try {
    const deletedPost = await Twit.findByIdAndDelete(twitId);
    if (!deletedPost) {
      console.log("Post Not Found");
    }
  } catch (err: any) {
    console.log(`Error in Deleting Post : ${err.message}`);
  } finally {
    revalidatePath(pathname);
  }
}

export async function AddOrRemoveLike(
  id: string,
  currentUserId: string | undefined,
  pathname: string,
  Initial: Boolean
) {
  connectToDB();
  try {
    let twit = await Twit.findById(id);
    let likeStatus = false; // Default: user hasn't liked the twit yet
    let totalLikes; // Total number of likes
    let likesList; // List of users who liked the twit
    let totalComment = 0;

    if (Initial && currentUserId) {
      const userIndex = twit.likes.indexOf(currentUserId);
      if (userIndex == -1) {
        likeStatus = false;
      } else {
        likeStatus = true;
      }
    } else if (currentUserId) {
      const userIndex = twit.likes.indexOf(currentUserId);
      if (userIndex === -1) {
        // User hasn't liked the twit, add the like
        twit.likes.push(currentUserId);
        likeStatus = true; // Set like status to true as user liked the twit
      } else {
        // User already liked the twit, remove the like
        twit.likes.splice(userIndex, 1);
        likeStatus = true;
      }
      // Save the updated twit
      twit = await twit.save();
    }
    totalLikes = twit.likes.length;
    likesList = twit.likes;
    totalComment = twit.children.length;

    revalidatePath(pathname); // Revalidate path outside the try block
    console.log(
      likeStatus,
      "and",
      totalLikes,
      "and",
      likesList,
      "and",
      totalComment
    );
    return {
      likeStatus,
      totalLikes,
      likesList,
      totalComment,
    };
  } catch (err) {
    console.error("Error adding/removing like", err);
    // throw new Error("Failed to add/remove like");
  }
}

//
