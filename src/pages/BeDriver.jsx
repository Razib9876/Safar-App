import React from "react";
import BeADriverForm from "../components/forms/BeDriverForm";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import HeroPages from "../components/AboutPages/HeroPages";

const BeDriver = () => {
  return (
    <>
      <HeroPages name="About" />
      <div className="min-h-screen bg-white flex flex-col items-center w-full">
        {/* ================= TOP SECTION ================= */}
        <section className="w-full flex flex-col lg:flex-row items-center justify-center py-8 gap-12 relative">
          {/* Left SIDE — FORM (VERY BIG) */}
          <div className="w-full lg:w-[70%] flex justify-center z-20">
            <div className="w-full max-w-3xl">
              <BeADriverForm />
            </div>
          </div>

          {/* Right SIDE — ANIMATION (SMALL BUT CLEAN) */}

          <div className=" w-auto h-96">
            <DotLottieReact
              src="https://lottie.host/6724392c-06e2-4bbf-b741-226efd1bb4f5/dCawlXMRXZ.lottie"
              autoplay
            />
          </div>
        </section>

        {/* ================= INFORMATION SECTION ================= */}
        <section className="w-full bg-gray-50 px-4 md:px-12 lg:px-20 py-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12">
            Why Become Our Verified Driver?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                ✔ High Earning Potential
              </h3>
              <p className="text-gray-600 mt-2">
                Earn more during peak hours, and get exclusive bonuses for
                top-tier drivers.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                ✔ Weekly Payments
              </h3>
              <p className="text-gray-600 mt-2">
                Get paid automatically every week with fast & secure
                transactions.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                ✔ Full Control of Your Time
              </h3>
              <p className="text-gray-600 mt-2">
                Work whenever you want. No forced schedules. Total freedom.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                ✔ Safety First
              </h3>
              <p className="text-gray-600 mt-2">
                Our top-level verification system makes sure you and passengers
                stay safe.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                ✔ 24/7 Support
              </h3>
              <p className="text-gray-600 mt-2">
                Anytime you need help, our support team is there.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                ✔ Trusted Platform
              </h3>
              <p className="text-gray-600 mt-2">
                Thousands of drivers trust our ecosystem to earn consistently.
              </p>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS SECTION ================= */}
        <section className="w-full bg-white py-16 px-4 md:px-12 lg:px-20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center mb-12">
            What Our Drivers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-700 italic">
                “The best platform I have worked with. Payments are always on
                time!”
              </p>
              <h4 className="mt-3 font-semibold text-gray-900">
                — Shakil (Dhaka)
              </h4>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-700 italic">
                “Great support and flexible working hours. Highly recommended!”
              </p>
              <h4 className="mt-3 font-semibold text-gray-900">
                — Rahim (Chittagong)
              </h4>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-700 italic">
                “Verification was smooth, and now I earn double compared to
                before.”
              </p>
              <h4 className="mt-3 font-semibold text-gray-900">
                — John (Sylhet)
              </h4>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BeDriver;
