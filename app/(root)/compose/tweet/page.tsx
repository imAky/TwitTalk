import PostTweet from "@/components/forms/PostTweet";
import Header from "@/components/shared/Header";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <div className="relative overflow-y-auto overflow-x-hidden h-screen">
      <div className=" sticky top-0 left-0 w-full  bg-dark-1 z-30 mt-0 bg-opacity-60 backdrop-blur-md">
        <Header showBackArrow label="" />
      </div>

      <PostTweet userId={userInfo._id} />
    </div>
  );
}

export default Page;
