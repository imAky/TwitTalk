"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, UserProfile, useAuth } from "@clerk/nextjs";
import UserCard from "./UserCard";
import { sidebarLinks } from "@/constants";
import Logo from "./Logo";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/clerk-react";
import BlackTriangle from "./BlackTraingle";
import Feather from "./Feather";
import { fetchUser } from "@/lib/actions/user.actions";

interface User {
  username: string;
  name: string;
  id: string;
  profile: string;
}

const LeftSidebar = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggle, setToggle] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  const { signOut } = useClerk();
  // const { user, isSignedIn, isLoaded } = useUser();

  // const fullName = `${user?.firstName} ${user?.lastName}`;
  // const userImage = user?.imageUrl;
  // const userName = user?.username;

  useEffect(() => {
    async function getUser() {
      try {
        if (userId) {
          const userData = await fetchUser(userId);
          console.log(userData);
          setUserInfo(userData);
        }
      } catch (error: any) {
        console.log(`Failed to Fetch User Data ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }

    getUser();
  }, []);

  return (
    <>
      <section className="custom-scrollbar leftsidebar">
        <div className="flex w-full flex-1 flex-col gap-4 px-4 lg:pr-16 ">
          <div className="leftsidebar_link">
            <Logo />
          </div>
          {sidebarLinks.map((link) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;

            let linkRoute = link.route;

            if (link.route === "/profile") {
              linkRoute = `/${userInfo?.username}`;
            }

            return (
              <div
                key={link.label}
                className="hover:bg-dark-2 hover:rounded-full p-1"
              >
                <Link
                  href={linkRoute}
                  className={`leftsidebar_link ${isActive && "bg-dark-2"}`}
                >
                  {link.icon}
                  <p className="text-light-2 text-lg leading-tight font-normal max-lg:hidden">
                    {link.label}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="pb-32 px-4 py-2 ">
          <Link href="/compose/tweet">
            <div className="bg-primary-1 hover:bg-primary-2 text-center font-semibold text-lg cursor-pointer rounded-full leading-9 py-2 max-lg:hidden">
              Post
            </div>
          </Link>
          <div className="bg-primary-1  hover:bg-primary-2 rounded-full flex items-center justify-center h-12 w-12 lg:hidden">
            <Feather />
          </div>
        </div>

        {
          <div className="group">
            {isToggle && (
              <div className="absolute ml-4 w-96 bg-dark-1 bottom-24 rounded-lg border-1 border-red-800 shadow shadow-red-800 bg-blend-darker mr-4">
                <div className=" hover:bg-dark-2 rounded-md transition-all duration-300">
                  <div
                    className="pl-6 pt-5 pb-1 mr-24 font-semibold tracking-wide font-light-2 leading-8"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Add an existing account
                  </div>
                </div>
                <div
                  className=" hover:bg-dark-2 rounded-md transition-all duration-300"
                  onClick={() => {
                    signOut();
                    router.push("/sign-in");
                  }}
                >
                  <p className="pl-6 pb-5 pt-1 mr-24 font-semibold tracking-wide font-light-2 leading-8">
                    Log out @{userInfo?.username}
                  </p>
                </div>

                <BlackTriangle />
              </div>
            )}

            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div
                className="group flex items-center px-4 bg-dark-1 rounded-full lg:hover:bg-dark-2 cursor-pointer py-2"
                onClick={() => {
                  setToggle(!isToggle);
                }}
              >
                <div className="cursor-pointer h-12 w-12 relative rounded-full py-0">
                  {userInfo?.profile && (
                    <Image
                      src={userInfo?.profile}
                      alt="userImage"
                      fill
                      className="rounded-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col p-2 items-center pl-3 max-lg:hidden">
                  <div className="font-bold tracking-wide font-light-2">
                    {userInfo?.name}
                  </div>
                  <div className=" text-dark-3 font-medium">{`@${userInfo?.username}`}</div>
                </div>
                <div className="ml-auto tx-2xl font-bold tracking-widest max-lg:hidden">
                  ...
                </div>
              </div>
            )}
          </div>
        }
      </section>
    </>
  );
};

export default LeftSidebar;
