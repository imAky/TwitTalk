"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, UserProfile, useAuth } from "@clerk/nextjs";
import UserCard from "./UserCard";
import { bottombarLinks } from "@/constants";
import Logo from "./Logo";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/clerk-react";
import BlackTriangle from "./BlackTraingle";
import Feather from "./Feather";

const Bottombar = () => {
  const [isToggle, setToggle] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const fullName = `${user?.firstName} ${user?.lastName}`;
  const userImage = user?.imageUrl;
  const userName = user?.username;

  const { userId } = useAuth();

  return (
    <>
      <section className="bottombar">
        <div className="bottom-container border-t border-t-red-800 shadow-red-800 bg-blend-darken">
          {bottombarLinks.map((link) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;

            if (link.route === "/profile")
              link.route = `${link.route}/${userId}`;

            return (
              <div
                className="hover:bg-dark-4 hover:rounded-full transition-all duration-300"
                key={link.label}
              >
                <div className="py-4 px-4 ">
                  <Link
                    href={link.route}
                    key={link.label}
                    className={`${isActive && "bg-dark-2"}`}
                  >
                    {" "}
                    {link.icon}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        <div className="sm:hidden absolute bottom-20 right-8">
          <Link href="/compose/tweet">
            <div className="bg-primary-1  hover:bg-primary-2 rounded-full flex items-center justify-center h-12 w-12">
              <Feather />
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Bottombar;
