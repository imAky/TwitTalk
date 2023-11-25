"use client";
import TwitCard from "@/components/cards/TwitCard";
import PostComment from "@/components/forms/PostComment";
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
    <section className="relative">
      <Header showBackArrow label="Post" isBorder={false} />
      <TwitCard
        id={twit._id}
        currentUserId={userInfo?._id}
        parentId={twit.parentId}
        content={twit.text}
        postImg={twit.postImg}
        community={twit.community}
        createdAt={twit.createdAt}
        comments={twit.children}
        cardname={twit?.author.name}
        cardusername={twit?.author.username}
        carduserId={twit.author.id}
        cardprofile={twit?.author.profile}
      />

      <PostComment
        twitId={params.id}
        currentUserImg={userInfo.profile}
        currentUserId={userInfo._id}
      />

      <div className="">
        {twit.children.length == 0 ? (
          <div>No Comment</div>
        ) : (
          twit.children.map((childItem: any) => (
            <TwitCard
              key={childItem._id}
              id={childItem._id}
              currentUserId={userInfo?._id}
              parentId={childItem.parentId}
              content={childItem.text}
              postImg={childItem.postImg}
              community={childItem.community}
              createdAt={childItem.createdAt}
              comments={childItem.children}
              cardname={childItem?.author.name}
              cardusername={childItem?.author.username}
              carduserId={childItem?.author.id}
              cardprofile={childItem?.author.profile}
            />
          ))
        )}
      </div>
    </section>
  );
}
