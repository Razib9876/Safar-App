import React from "react";
import SocialLogin from "../../features/auth/SocialLogin";
import SafarLogo from "../common/SafarLogo";

const LeftSide = () => {
  return (
    <div className="w-full md:w-1/2 bg-[#1F2A44] p-6 md:p-10 flex flex-col justify-center text-white   items-center ">
      <div className="mb-8">
        <SafarLogo />
      </div>
    </div>
  );
};

export default LeftSide;
