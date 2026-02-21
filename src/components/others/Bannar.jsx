import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Layout/Navbar";
import BookingForm from "../forms/BookingBannarForm";

import bannarImageOne from "../../assets/BannarImg/bannarImageOne.jpg";
import bannarImageTwo from "../../assets/BannarImg/sunset-road-trip.jpg";
import bannarImageThree from "../../assets/BannarImg/bannarImageThree.jpg";

const Bannar = () => {
  const images = [bannarImageOne, bannarImageTwo, bannarImageThree];

  const extendedImages = [...images, images[0]];

  const [imageIndex, setImageIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const sliderRef = useRef(null);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Infinite reset logic
  useEffect(() => {
    if (imageIndex === images.length) {
      const timeout = setTimeout(() => {
        setTransitionEnabled(false);
        setImageIndex(0);
      }, 1000); // match transition duration

      return () => clearTimeout(timeout);
    } else {
      setTransitionEnabled(true);
    }
  }, [imageIndex, images.length]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Navbar />

      {/* Sliding Background */}
      <div
        ref={sliderRef}
        className="absolute inset-0 flex"
        style={{
          width: `${extendedImages.length * 100}%`,
          transform: `translateX(-${imageIndex * (100 / extendedImages.length)}%)`,
          transition: transitionEnabled
            ? "transform 1000ms ease-in-out"
            : "none",
        }}
      >
        {extendedImages.map((img, idx) => (
          <div
            key={idx}
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${img})`,
            }}
          ></div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Area */}
      <div
        className="
          relative z-20
          w-full md:w-11/12 mx-auto
          pt-24 md:py-16 lg:py-20 xl:py-24
          grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr]
          gap-10 items-center text-white
        "
      >
        {/* LEFT SIDE TEXT */}
        <div
          className="
            flex flex-col md:flex-row lg:flex-col
            justify-center md:justify-between
            items-center lg:items-start
            px-4 sm:px-6 md:px-8 lg:px-0
          "
        >
          <div>
            <h1
              className="font-bold leading-tight"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.75rem)" }}
            >
              Looking to hire <br /> a vehicle?
            </h1>
          </div>

          <div>
            <p
              className="mt-4"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.25rem)" }}
            >
              You’ve come to the right place.
            </p>

            <ul
              className="mt-4 space-y-2"
              style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.125rem)" }}
            >
              <li>✔ Free cancellations on most bookings</li>
              <li>✔ 60,000+ locations</li>
              <li>✔ Customer support in 30+ languages</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:px-8 lg:px-4 flex justify-center lg:justify-end">
          <div className="w-full">
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bannar;
