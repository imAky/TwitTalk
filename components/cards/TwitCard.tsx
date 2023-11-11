import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { BiRepost, BiBarChart } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { GoShare } from "react-icons/go";
import { Ri24HoursFill } from "react-icons/ri";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  postImg: string | null;
  author: {
    name: string;
    username: string;
    profile: string;
    id: string;
  };
  community: string;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

export const TwitCard = ({
  id,
  currentUserId,
  parentId,
  content,
  postImg,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: Props) => {
  return (
    <article className="flex flex-row w-full border-[1px] border-dark-2 p-4">
      <div className="h-16 w-16 shrink-0 grow-0 rounded-full relative overflow-hidden">
        <Link href={`/${author.username}`} className="">
          <Image
            src={author.profile}
            alt="profile_icon"
            style={{
              objectFit: "cover",
            }}
            className=" rounded-full border-4 border-dark-4 "
            fill
          />
        </Link>
      </div>
      <div className="mx-2 flex flex-col w-full">
        <div>
          <span className="mr-2 font-bold tracking-wider">{author.name}</span>
          <span className="font-normal text-dark-8 tracking-wide">
            @{author.username}
          </span>
        </div>
        <p className="whitespace-normal break-all text-sm tracking-wide my-2">
          {content}
        </p>
        <div>
          {postImg && (
            <div className="w-full h-96 relative rounded-xl overflow-hidden my-2">
              <Image
                src={postImg}
                alt="post-Image"
                fill
                className="object-cover max-md:object-fill"
              />
            </div>
          )}
        </div>
        <div className="flex flex-row justify-between my-2 items-start text-dark-8 font-semibold text-lg mx-3">
          <FaRegComment size={20} />
          <BiRepost size={20} />
          <AiOutlineHeart size={20} className="hover:text-light-2" />
          <BiBarChart size={20} />
          <GoShare size={20} />
        </div>
      </div>
    </article>
  );
};
