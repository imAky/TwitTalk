"use server";

import { error } from "console";
import { connectToDB } from "../mongoose";
import User from "../models/user.models";
import { revalidatePath } from "next/cache";

interface Params {
  userId: string;
  username: string;
  name: string;
  location?: string;
  bio: string;
  website?: string;
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
  website,
  profile,
  banner,
  path,
}: Params): Promise<void> {
  try {
    connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        location,
        bio,
        website,
        profile,
        banner,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
