import { TwitCard } from "@/components/cards/TwitCard";
import Header from "@/components/shared/Header";
import { findUserByUsername } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaCalendarDays } from "react-icons/fa6";
import { format } from "date-fns";

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const userInfoAll = await findUserByUsername(params.username);
  if (!userInfoAll?.onboarded) redirect("/onboarding");

  const formattedCreatedAt = format(
    new Date(userInfoAll.createdAt),
    "dd MMMM yyyy"
  );

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <section className="">
      <Header
        showBackArrow={true}
        label={userInfoAll.name}
        isBorder={true}
        isSticky={true}
      />
      <div className="">
        <div className="w-full h-[250px] relative overflow-hidden">
          <Image
            src={userInfoAll.banner}
            alt="header_photo"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </div>
        <div className="w-32 h-32 relative rounded-full overflow-hidden -mt-14 ml-6">
          <Image
            src={userInfoAll.profile}
            alt="profile_icon"
            fill
            style={{
              objectFit: "cover",
            }}
            className="rounded-full border-4 border-dark-4"
          />
        </div>
      </div>
      <div className="ml-8 my-2 ">
        <h1 className="font-black tracking-wider text-3xl text-slate-200">
          {userInfoAll?.name}
        </h1>
        <h2 className=" tracking-wider text-gray-500 font-normal my-1">
          @{userInfoAll?.username}
        </h2>
      </div>

      <p className="m-2 break-all p-2 mx-4 leading-6 text-slate-100 ">
        {userInfoAll.bio}
      </p>

      <p className="flex gap-2 items-center ml-8 text-sm">
        <span className="text-sm text-gray-500">{userInfoAll.location}</span>
        <FaCalendarDays className="text-sm text-gray-500" />
        <span className="text-sm text-gray-500">
          {" "}
          Joined {formattedCreatedAt}
        </span>
      </p>

      <div className="flex gap-4 ml-6 my-4">
        <Link href={`/${params.username}/following`}>
          <p className="hover:underline decoration-gray-500">
            <span className="font-semibold">
              {userInfoAll.following.length}
            </span>{" "}
            <span className="text-sm text-gray-500 text-semibold tracking-wide">
              Following
            </span>
          </p>
        </Link>
        <Link href={`/${params.username}/followers`}>
          <p className="hover:underline decoration-gray-500">
            <span className="font-semibold">
              {userInfoAll.followers.length}
            </span>{" "}
            <span className="text-sm text-gray-500 text-semibold tracking-wide">
              Followers
            </span>
          </p>
        </Link>
      </div>
      <div className="">
        {userInfoAll.twit.length == 0 ? (
          <div className="flex items-center justify-center py-6 border-t-2 border-t-dark-2 tracking-wide font-semibold ">
            No Content
            <Link
              href="/compose/tweet"
              className="cursor-pointer px-2 text-sky-500"
            >
              Click
            </Link>
            to Add Post
          </div>
        ) : (
          userInfoAll.twit.map((Item: any) => (
            <TwitCard
              key={Item._id}
              id={Item._id}
              currentUserId={user.id}
              parentId={Item.parentId}
              content={Item.text}
              postImg={Item.postImg}
              author={userInfoAll}
              community={Item.community}
              createdAt={Item.createdAt}
              comments={Item.children}
            />
          ))
        )}
      </div>
    </section>
  );
}
