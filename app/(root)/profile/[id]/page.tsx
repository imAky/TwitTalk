import AnimateSVG from "@/components/shared/AnimatesSVG";
import Header from "@/components/shared/Header";
import React from "react";

const Profile = () => {
  return (
    <div>
      <Header showBackArrow label="Amit Kumar" isBorder />
      <AnimateSVG width={25} height={25} swidth={8} />
    </div>
  );
};

export default Profile;
