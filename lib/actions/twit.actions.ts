"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import User from "../models/user.models";
import Twit from "../models/twit.model";
import Community from "../models/community.model";

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
      communityId: null,
      path,
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
  try {
    connectToDB();

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
