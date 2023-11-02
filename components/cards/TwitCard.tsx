import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  postImg: string | null;
  author: {
    name: string;
    username: string;
    image: string;
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
    <article className="">
      <div className="">
        <div>
          <Link href={author.id} className="relative h-11 w-11">
            <p>{author.name}</p>
          </Link>
        </div>
        <div></div>
      </div>
    </article>
  );
};
