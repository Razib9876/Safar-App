import React from "react";
import SafarLogo from "../common/SafarLogo";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 mt-[80px]">
      <div className="max-w-6xl mx-auto px-4 text-white py-8">
        {/* Top Section */}
        <div className="text-center">
          <h3 className="text-3xl font-semibold mb-3">
            Download our Safar app
          </h3>
          <p className="text-gray-400">Safe Journey, Safe Life</p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
            {/* Google Play */}
            <div className="flex items-center border border-gray-700 hover:border-gray-500 transition rounded-lg px-2 py-1 w-56 cursor-pointer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                alt="Google Play"
                className="w-8"
              />
              <div className="text-left ml-3">
                <p className="text-xs text-gray-400">Download on</p>
                <p className="text-sm font-medium">Google Play Store</p>
              </div>
            </div>

            {/* Apple Store */}
            <div className="flex items-center border border-gray-700 hover:border-gray-500 transition rounded-lg px-2 py-1 w-56 cursor-pointer">
              <img
                src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                alt="Apple Store"
                className="w-8"
              />
              <div className="text-left ml-3">
                <p className="text-xs text-gray-400">Download on</p>
                <p className="text-sm font-medium">Apple Store</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400 border-t border-gray-800 pt-2">
          <p className="mt-6 md:mt-0">
            © {new Date().getFullYear()} safar booking service. All rights
            reserved.
          </p>

          <div className="flex gap-6 mt-2 md:mt-0">
            <Link to={"about"}>
              {" "}
              <span className="hover:text-white cursor-pointer">About us</span>
            </Link>
            <Link to={"contact"}>
              <span className="hover:text-white cursor-pointer">
                Contact us
              </span>
            </Link>
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
