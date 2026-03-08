import React, { useEffect, useState } from "react";
import Navbar from "../Layout/Navbar";
import BookingForm from "../forms/BookingBannarForm";

const Bannar = () => {
  const images = [
    "/images/BannarImg/bannarImageOne.jpg",
    "/images/BannarImg/sunset-road-trip.jpg",
    "/images/BannarImg/bannarImageThree.jpg",
  ];

  const extendedImages = [...images, images[0]];

  const [imageIndex, setImageIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // When animation finishes
  const handleTransitionEnd = () => {
    if (imageIndex === images.length) {
      setEnableTransition(false);
      setImageIndex(0);
    }
  };

  // Re-enable transition after instant jump
  useEffect(() => {
    if (!enableTransition) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
        });
      });
    }
  }, [enableTransition]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Navbar />

      <div
        className="absolute inset-0 flex"
        style={{
          width: `${extendedImages.length * 100}%`,
          transform: `translateX(-${imageIndex * (100 / extendedImages.length)}%)`,
          transition: enableTransition
            ? "transform 1000ms ease-in-out"
            : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedImages.map((img, idx) => (
          <div
            key={idx}
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${img})`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-20 w-full md:w-11/12 mx-auto pt-24 md:py-16 lg:py-20 xl:py-24 grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-10 items-center text-white">
        <div className="flex flex-col md:flex-row lg:flex-col justify-center md:justify-between items-center lg:items-start px-4 sm:px-6 md:px-8 lg:px-0">
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
