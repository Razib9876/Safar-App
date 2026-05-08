import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LeftSide from "../components/Layout/AuthLeftSight";

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div
      className="
    min-h-screen bg-center bg-cover flex md:items-center justify-center relative md:px-4
    bg-none md:bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')]
  "
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Main Wrapper */}
      <div className="w-2/2 flex justify-center md:items-center md:px-4 ">
        {/* Auth Card */}
        <div
          className="
        relative w-full max-w-4xl 
         backdrop-blur-xl shadow-2xl 
        md:rounded-2xl overflow-hidden 
        flex flex-col md:flex-row
        md:h-[80vh] lg:h-[75vh]
        h-auto
        bg-[#1F2A44]
        sm:h-screen
        sm:justify-between
      "
        >
          {/* LEFT SIDE */}
          <LeftSide />

          {/* RIGHT SIDE */}
          <div className=" rounded-t-3xl md:rounded-none w-full md:w-1/2 bg-white px-4 md:px-6 py-6 relative overflow-hidden flex items-center justify-center ">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -80 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="w-full "
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>
        {`
      
      @media (min-width: 0px) and (max-width: 767px) {
        div[class*="w-2/2 flex justify-center"] {
          
        }
      }
    `}
      </style>
    </div>
  );
};
export default AuthLayout;
