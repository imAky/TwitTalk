"use client";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import Logo from "./Logo";

const Topbar = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const userImage = user?.imageUrl;
  return (
    <section className="topbar">
      <div>Top Bar</div>
    </section>
  );
};

export default Topbar;
