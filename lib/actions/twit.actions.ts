"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import User from "../models/user.models";
import Twit from "../models/twit.model";

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
