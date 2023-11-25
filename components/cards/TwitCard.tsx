// import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";
import { BiRepost, BiBarChart } from "react-icons/bi";

import { GoShare } from "react-icons/go";
import { Ri24HoursFill } from "react-icons/ri";
import { fetchUser } from "@/lib/actions/user.actions";
import { MdDeleteForever } from "react-icons/md";
import DeleteButton from "@/components/shared/DeleteButton";
import LikeButton from "@/components/shared/LikeButton";
import { formatTimeDifference } from "@/lib/utils";
import { AddOrRemoveLike } from "@/lib/actions/twit.actions";

import { useRouter, usePathname } from "next/navigation";
import { ObjectId } from "mongoose";

interface Props {
  id: string;
  currentUserId: string | undefined;
  parentId: string | undefined;
  content: string;
  postImg: string | undefined;

  community: string | undefined;
  createdAt: Date;

  cardname: string;
  cardusername: string;
  carduserId: string;
  cardprofile: string;
}
//
const TwitCard = ({
  id,
  currentUserId,
  parentId,
  content,
  postImg,
  community,
  createdAt,

  cardname,
  cardusername,
  carduserId,
  cardprofile,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [likeStatus, setlikeStatus] = useState(false);
  const [totalLikes, settotalLikes] = useState(0);
  const [totalComment, settotalComment] = useState(0);
  const [likesList, setlikesList] = useState([]);

  const fetchTweetDetails = async () => {
    // Update the author object with fetched user data

    try {
      let likeStatus = false;
      let totalLikes = 0;
      let likesList = [];
      let totalComment = 0;
      console.log(currentUserId);
      if (currentUserId) {
        const data = await AddOrRemoveLike(id, currentUserId, pathname, true);
        if (data) {
          likeStatus = data.likeStatus;
          totalLikes = data.totalLikes;
          likesList = data.likesList;
          totalComment = data.totalComment;
        }
      } else {
        const data = await AddOrRemoveLike(id, currentUserId, pathname, false);
        if (data) {
          likeStatus = data.likeStatus;
          totalLikes = data.totalLikes;
          likesList = data.likesList;
          totalComment = data.totalComment;
        }
      }
      setlikeStatus(likeStatus);
      settotalLikes(totalLikes);
      setlikesList(likesList);
      settotalComment(totalComment);
    } catch (err) {
      console.error("Error fetching tweet details", err);
      // Handle error, maybe set a default state or display an error message
    }
  };
  useEffect(() => {
    fetchTweetDetails();
  }, []);
  const handleLike = async () => {
    try {
      if (currentUserId) {
        const data = await AddOrRemoveLike(id, currentUserId, pathname, false);
        if (data) {
          setlikeStatus(data.likeStatus);
          settotalLikes(data.totalLikes);
          setlikesList(data.likesList);
          settotalComment(data.totalComment);
        }
      } else {
        alert("You need to sign!");
        router.push("/sign-in");
      }
    } catch (err: any) {
      console.error(`Error on fetching ${err.message}`);
    }
  };
  const formettedDate = formatTimeDifference(createdAt, false);
  return (
    <article className="flex flex-row w-full border-[1px] border-dark-2 p-4 ">
      <div className="h-12 w-12 shrink-0 grow-0 rounded-full relative overflow-hidden">
        <Link href={`/${cardusername}`} className="">
          <Image
            src={cardprofile}
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
        <div className="flex flex-row justify-between">
          <Link href={`/${cardusername}`}>
            <span className="mr-2 font-bold tracking-wider hover:decoration-4 hover:decoration-slate-50 hover:cursor-pointer">
              {cardname}
            </span>
            <span className="font-normal text-dark-8 tracking-wide">
              @{cardusername}
            </span>
            <span className="px-2 font-normal text-dark-8 tracking-wide">
              {formettedDate}
            </span>
          </Link>
          <div>
            <DeleteButton id={id} />{" "}
          </div>
        </div>
        <Link href={`/${cardusername}/status/${id}`}>
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
        </Link>
        <div className="flex flex-row justify-between my-2 items-start text-dark-8 font-semibold text-lg mx-3">
          <Link href={`/${cardusername}/status/${id}`}>
            <div className="flex items-center gap-4">
              <FaRegComment
                size={20}
                className="hover:text-sky-600 hover:drop-shadow-2xl hover:font-bold transition-all"
              />
              <span>{totalComment}</span>
            </div>
          </Link>
          <BiRepost
            size={24}
            className="hover:text-emerald-600 hover:drop-shadow-2xl hover:font-bold transition-all"
          />
          <LikeButton
            likeStatus={likeStatus}
            handleLike={handleLike}
            totalLikes={totalLikes}
          />
          <BiBarChart
            size={20}
            className="hover:text-sky-600 hover:drop-shadow-2xl hover:font-bold transition-all"
          />
          <GoShare
            size={20}
            className="hover:text-blue-600 hover:drop-shadow-2xl hover:font-bold transition-all"
          />
        </div>
      </div>
    </article>
  );
};

export default TwitCard;
