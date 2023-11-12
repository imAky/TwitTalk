import { TwitCard } from "@/components/cards/TwitCard";
import PostTweet from "@/components/forms/PostTweet";
import Header from "@/components/shared/Header";
import { fetchTwitById } from "@/lib/actions/twit.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page({
  params,
}: {
  params: { id: string; username: string };
}) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const twit = await fetchTwitById(params.id);

  return (
    <section>
      <Header showBackArrow label="Post" isBorder={false} />
      <TwitCard
        id={twit._id}
        currentUserId={user.id}
        parentId={twit.parentId}
        content={twit.text}
        postImg={twit.postImg}
        author={twit.author}
        community={twit.community}
        createdAt={twit.createdAt}
        comments={twit.children}
      />

      <PostTweet userId={userInfo._id} />
    </section>
  );
}
