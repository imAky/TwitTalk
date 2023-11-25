"use client";
import Image from "next/image";
import Header from "@/components/shared/Header";
import { currentUser, useAuth } from "@clerk/nextjs";
import { fetchAllPosts } from "@/lib/actions/twit.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import TwitCard from "@/components/cards/TwitCard";
import { useEffect, useRef, useState } from "react";

import {
  TwitDocument,
  UserDocument,
  CommunityDocument,
} from "../../lib/validations/types";

export default function Home() {
  const [result, setResult] = useState<TwitDocument[]>([]);

  const [userInfo, setuserInfo] = useState<any>();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMorePost, setMorePost] = useState(true);
  const loader = useRef<HTMLDivElement>(null);
  const { userId } = useAuth();
  const [currUserId, setcurrUserId] = useState<string | undefined>(undefined);
  const path = usePathname();

  const currentUserFetch = async () => {
    if (userId) {
      const currUserInfo = await fetchUser(userId);
      setcurrUserId(currUserInfo._id);
      if (!currUserInfo?.onboarded) redirect("/onboarding");
    }
  };

  const fetchPostData = async () => {
    if (hasMorePost === false || loading === true) return;
    setLoading(true);

    try {
      const PAGE_SIZE = 3;

      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchAllPosts(nextPage, PAGE_SIZE)
          .then(({ postData, totalPostCount }) => {
            if (postData.length === 0) {
              setMorePost(false);
            }

            setResult((prevPosts) => {
              const existingPostsIds = prevPosts.map((post) => post._id);

              const uniqueNewPots = postData.filter(
                (newPost) => !existingPostsIds.includes(newPost._id)
              );

              return [...prevPosts, ...uniqueNewPots];
            });
          })
          .catch((error: any) => {
            console.log("Error fetching users:", error);
          });

        return nextPage;
      });
    } catch (error) {
      console.log("Error fetching users :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
    currentUserFetch();
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPostData();
      }
    }, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader]);

  return (
    <main>
      <Header showBackArrow label="Home" isBorder />

      <section>
        {result?.length === 0 ? (
          redirect("/compose/tweet")
        ) : (
          <>
            {result?.map((post) => (
              <TwitCard
                key={post._id}
                id={post._id}
                currentUserId={currUserId}
                parentId={post.parentId}
                content={post.text}
                postImg={post.postImg}
                community={post.community}
                createdAt={post.createdAt}
                cardname={post?.author.name}
                cardusername={post?.author.username}
                carduserId={post?.author.id}
                cardprofile={post?.author.profile}
              />
            ))}
          </>
        )}
      </section>
      <div ref={loader} style={{ height: "10px", background: "transparent" }}>
        {loading && <p>Loading...</p>}
      </div>
    </main>
  );
}
