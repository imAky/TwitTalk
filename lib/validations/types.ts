import { Document, Schema, Types } from "mongoose";

export interface UserDocument extends Document {
  id: string;
  username: string;
  name: string;
  bio?: string;
  location?: string;
  createdAt: Date;
  profile?: string;
  banner?: string;
  twit: Types.ObjectId[] | TwitDocument[]; // Array of Twit references or Twit objects
  onboarded: boolean;
  community: Types.ObjectId[] | CommunityDocument[]; // Array of Community references or Community objects
  followers: Types.ObjectId[] | UserDocument[]; // Array of User references or User objects
  following: Types.ObjectId[] | UserDocument[]; // Array of User references or User objects
  notifications: string[];
}

export interface TwitDocument extends Document {
  text: string;
  postImg?: string;
  author: {
    name: string;
    username: string;
    id: string;
    profile: string;
  };
  community?: string | undefined;
  createdAt: Date;
  parentId?: string;
  children: Types.ObjectId[];
  likes: Types.ObjectId[] | UserDocument[];
  views: Types.ObjectId[] | UserDocument[];
  cardname: string;
  cardusername: string;
  carduserId: string;
  cardprofile: string;
}

export interface CommunityDocument extends Document {
  id: string;
  username: string;
  name: string;
  image?: string;
  bio?: string;
  createdBy?: Types.ObjectId | UserDocument;
  Twits: Types.ObjectId[] | TwitDocument[];
  members: Types.ObjectId[] | UserDocument[];
}
