import Image from "next/image";
import Link from "next/link";
import {
  Updatefollower,
  Updatefollowing,
  RemoveFollower,
  RemoveFollowing,
  fetchUser,
} from "@/lib/actions/user.actions";
import { revalidatePath } from "next/cache";
import { useState } from "react";

const UserList = ({ user, currList, currUserId, path }) => {
  const [isFollowing, setIsFollowing] = useState(currList.includes(user._id));

  const handleClick = async () => {
    if (isFollowing) {
      await RemoveFollowing(currUserId, user?._id.toString());
      await RemoveFollower(currUserId, user?._id.toString());
    } else {
      await Updatefollower(currUserId, user?._id.toString());
      await Updatefollowing(currUserId, user?._id.toString());
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="flex flex-row p-4 item-center hover:bg-gray-900">
      <div className="h-12 w-12 shrink-0 grow-0 rounded-full relative overflow-hidden p-2">
        <Link href={`/${user.username}`} className="">
          <Image
            src={user.profile}
            alt="profile_icon"
            style={{
              objectFit: "cover",
            }}
            className=" rounded-full border-4 border-dark-4 "
            fill
          />
        </Link>
      </div>
      <div className="flex-grow mx-1">
        <div className="flex flex-col px-2 ">
          <Link href={`/${user.username}`}>
            <span className=" hover:underline mr-2 font-bold tracking-wider hover:decoration-2 hover:decoration-slate-50 hover:cursor-pointer">
              {user.name}
            </span>
          </Link>
          <Link href={`/${user.username}`}>
            <span className="font-normal text-dark-8 tracking-wide ">
              @{user.username}
            </span>
          </Link>
        </div>
        <p>
          {user?.bio ? user.bio.slice(0, 100) : "No Bio"}
          <Link href={`/${user.username}`}>
            {" "}
            <span className="text-blue-600 text-5xl font-block tracking-wide">
              {user?.bio ? "....." : "profile"}
            </span>
          </Link>
        </p>
      </div>

      <div>
        {/*  */}
        {/* bg-slate-50 tracking-wide hover:opacity-80  text-gray-700 px-4 py-2 rounded-full text-sm font-semibold group */}
        <button
          onClick={handleClick}
          className={`bg-slate-50 tracking-wide hover:opacity-80  text-gray-700 px-4 py-2 rounded-full text-sm font-semibold group ${
            isFollowing &&
            ` bg-gray-700 text-slate-50  border-[1px] border-gray-50 hover:border-red-600 hover:text-red-500`
          }`}
        >
          {/* bg-gray-900 text-slate-50 border-[1px] border-gray-50 hover:border-red-600 hover:text-red-500 */}
          <span className={`${isFollowing && `group-hover:hidden`}`}>
            {isFollowing ? "Following" : "Follow"}
          </span>
          <span
            className={`hidden ${isFollowing && `group-hover:inline-block`}`}
          >
            Unfollow
          </span>
        </button>
      </div>
    </div>
  );
};

export default UserList;
