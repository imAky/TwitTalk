import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const userInfo = await fetchUser(user.id);

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user.username,
    name: userInfo?.name || user.firstName,
    bio: userInfo?.bio || "",
    image: userInfo?.profile || user.imageUrl,
    banner: userInfo?.banner,
    location: userInfo?.location || "",
  };

  return (
    <main className="">
      <div className="fixed bg-dark-5 z-10 inset-0 "></div>

      <div className="fixed inset-0 mx-auto md:w-[650px] w-full mt-32 mb-32 flex items-center justify-center z-20 border-dark-4 border-5">
        <AccountProfile user={userData} btnTitle="Continue" />
      </div>
    </main>
  );
}

export default Page;
