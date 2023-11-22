"use server";

import { error } from "console";
import { connectToDB } from "../mongoose";
import User from "../models/user.models";
import { revalidatePath } from "next/cache";
import Twit from "../models/twit.model";

interface Params {
  userId: string;
  username: string;
  name: string;
  location?: string;
  bio: string;
  profile: string;
  banner: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  location,
  bio,
  profile,
  banner,
  path,
}: Params): Promise<void> {
  connectToDB();
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        location,
        bio,
        profile,
        banner,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/setting/profile") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  connectToDB();
  try {
    return await User.findOne({ id: userId });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function findUserByUsername(username: string) {
  connectToDB();
  try {
    const foundUser = await User.findOne({
      username: username.toLowerCase(),
    })
      .populate({
        path: "twit",
        model: Twit,
      })
      .exec();
    return foundUser;
  } catch (error: any) {
    throw new Error(`Failed to fetch User by username: ${error.message}`);
  }
}
export async function findUserAndList(
  username: string,
  followerList: boolean = false,
  followingListL: boolean = false
) {
  connectToDB();

  try {
    const foundUser = await User.findOne({
      username: username.toLowerCase(),
    });

    if (followerList) {
      const followerIds = foundUser.followers.map((follower) => follower._id); // Extract follower IDs
      const followers = await User.find({ _id: { $in: followerIds } }); // Fetch followers by IDs
      return followers;
    }

    if (followingListL) {
      const followingIds = foundUser.following.map(
        (following) => following._id
      ); // Extract following IDs
      const followings = await User.find({ _id: { $in: followingIds } }); // Fetch followings by IDs

      return followings;
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch User by username: ${error.message}`);
  }
}

export const fetchAllUser = async (
  page: number,
  pageSize: number
): Promise<{ userData: any[]; totalCount: number }> => {
  connectToDB();
  try {
    const skip = (page - 1) * pageSize;
    const userData = await User.find().skip(skip).limit(pageSize);
    const totalCount = await User.countDocuments();
    return { userData, totalCount };
  } catch (error: any) {
    console.log("Error fetching users", error);
    throw new Error(`Error : ${error.message}`);
  }
};
// Assuming userAId and userBId are the ObjectIds of user A and user B
export const Updatefollower = async (userAId: string, userBId: string) => {
  connectToDB();
  try {
    // Add userAId to userB's followers array
    console.log("updatefollower", userAId, "And", userBId);
    await User.findByIdAndUpdate(userBId, {
      $addToSet: { followers: userAId },
    });
  } catch (err: any) {
    console.log(`Encounter Error : ${err.message}`);
  }
};

export const Updatefollowing = async (userAId: string, userBId: string) => {
  connectToDB();
  try {
    // Add userBId to userA's following array
    console.log("updatefollowing", userAId, "And", userBId);
    await User.findByIdAndUpdate(userAId, {
      $addToSet: { following: userBId },
    });
  } catch (err: any) {
    console.log(`Encounter Error : ${err.message}`);
  }
};
// Assuming userAId and userBId are the ObjectIds of user A and user B
// Remove userAId from userB's followers array
export const RemoveFollower = async (userAId: string, userBId: string) => {
  connectToDB();
  try {
    console.log("removefollower", userAId, "And", userBId);
    await User.findByIdAndUpdate(userBId, {
      $pull: { followers: userAId },
    });
  } catch (err: any) {
    console.log(`Encounter Error : ${err.message}`);
  }
};

export const RemoveFollowing = async (userAId: string, userBId: string) => {
  connectToDB();
  try {
    // Remove userBId from userA's following array
    console.log("removefollowing", userAId, "And", userBId);
    await User.findByIdAndUpdate(userAId, {
      $pull: { following: userBId },
    });
  } catch (err: any) {
    console.log(`Encounter Error : ${err.message}`);
  }
};
