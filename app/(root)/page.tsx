import Image from "next/image";
import Header from "@/components/shared/Header";
import { currentUser } from "@clerk/nextjs";
import { fetchPosts } from "@/lib/actions/twit.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TwitCard } from "@/components/cards/TwitCard";
export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(1, 20);

  return (
    <main>
      <Header showBackArrow label="Home" isBorder />
      <section>
        {result.posts.length === 0 ? (
          <Link href={"/compose/tweet"}>Post Twit</Link>
        ) : (
          <>
            {result.posts.map((post) => (
              <TwitCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                postImg={post.postImg}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}
