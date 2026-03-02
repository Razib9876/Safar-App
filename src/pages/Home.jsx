import React from "react";
import Bannar from "../components/others/Bannar";
import Faq from "../components/Home/Faq";
import ChooseUs from "../components/Home/CooseUs";

const Home = () => {
  return (
    <div className="space-y-[80px]">
      <Bannar />
      <ChooseUs />
      <Faq />
    </div>
  );
};

export default Home;
