import React from "react";

const RightSidebar = () => {
  return (
    <section className="rightsidebar max-lg:hidden">
      <div className="bg-dark-4 rounded-xl p-4 h-80 w-80 mt-6 ml-5">
        <h1 className="p-3 font-semibold font-light-2 tracking-wider text-xl leading-4">
          What's happening
        </h1>
        <div className="trendblock"></div>
      </div>
      <div className="bg-dark-4 rounded-xl p-4 h-72 w-80 mt-6 ml-5">
        <h1 className="p-3 font-semibold font-light-2 tracking-wider text-xl leading-4">
          Who to follow
        </h1>
        <div className="followblock"></div>
      </div>
    </section>
  );
};

export default RightSidebar;
