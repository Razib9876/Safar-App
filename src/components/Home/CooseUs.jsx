import MainImg from "../../assets/images/chooseUs/main.png";
import Box1 from "../../assets/images/chooseUs/icon1.png";
import Box2 from "../../assets/images/chooseUs/icon2.png";
import Box3 from "../../assets/images/chooseUs/icon3.png";
import BgImg from "../../assets/images/chooseUs/bg.png";

function ChooseUs() {
  return (
    <section className="choose-section relative py-32 lg:py-40 overflow-hidden ">
      {/* Background Image spanning top + bottom */}
      <div
        className="absolute left-0 bottom-0 top-0 h-full w-full bg-no-repeat bg-left-bottom  "
        style={{ backgroundImage: `url(${BgImg})` }}
      ></div>

      {/* Top - Main Image */}
      <div className="flex justify-center relative gap-14 -mt-24 lg:-mt-36 z-20">
        <img
          src={MainImg}
          alt="car_img"
          className="w-80 md:w-[600px] lg:w-[700px] object-contain"
        />
      </div>

      {/* Bottom - Content */}
      <div className="flex justify-center relative z-20">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16 max-w-7xl w-full px-6 md:px-12">
          {/* Left Column - Text */}
          <div className="flex-1 flex flex-col gap-6 py-12 md:py-16">
            <h4 className="text-primary text-lg font-semibold -mt-10 sm:mt-0">
              Why Choose Us
            </h4>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-snug">
              Best valued deals you will ever find
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Discover the best deals you'll ever find with our unbeatable
              offers. We're dedicated to providing you with the best value for
              your money, so you can enjoy top-quality services and products
              without breaking the bank. Our deals are designed to give you the
              ultimate renting experience, so don't miss out on your chance to
              save big.
            </p>
          </div>

          {/* Right Column - Boxes */}
          <>
            <div className="-mt-16 sm:mt-0 flex-1 flex flex-col gap-6">
              <a
                href="#home"
                className="inline-flex items-center text-primary font-medium hover:text-primary-dark transition-colors duration-300 mt-2"
              >
                Find Details &nbsp;
                <i className="fa-solid fa-angle-right"></i>
              </a>
              {[Box1, Box2, Box3].map((box, idx) => {
                const titles = [
                  "Cross Country Drive",
                  "All Inclusive Pricing",
                  "No Hidden Charges",
                ];
                const texts = [
                  "Take your driving experience to the next level with our top-notch vehicles for your cross-country adventures.",
                  "Get everything you need in one convenient, transparent price with our all-inclusive pricing policy.",
                  "Enjoy peace of mind with our no hidden charges policy. We believe in transparent and honest pricing.",
                ];
                return (
                  <div
                    key={idx}
                    className="flex gap-4 bg-white/90 p-4 md:p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm"
                  >
                    <img
                      src={box}
                      alt="icon-img"
                      className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">
                        {titles[idx]}
                      </h4>
                      <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                        {texts[idx]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        </div>
      </div>
    </section>
  );
}

export default ChooseUs;
