import HeroPages from "../components/AboutPages/HeroPages";
import PlanTrip from "../components/AboutPages/PlantTrip";
import AboutMain from "../assets/images/about/optimus-drive-blog-image.jpg";
import Box1 from "../assets/images/about/icon1.png";
import Box2 from "../assets/images/about/icon2.png";
import Box3 from "../assets/images/about/icon3.png";

function About() {
  return (
    <>
      <section className="w-full">
        <HeroPages name="About" />

        <div className="max-w-[1300px] mx-auto px-6 py-16">
          {/* ABOUT MAIN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT IMAGE */}
            <div className="w-full">
              <img
                src={AboutMain}
                alt="safar ride sharing platform"
                className="w-full h-auto rounded-xl shadow-lg object-cover"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex flex-col gap-6">
              <h3 className="text-orange-500 font-semibold text-lg uppercase tracking-wide">
                About Safar
              </h3>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
                Book rides, connect with drivers, and travel smarter with Safar
              </h2>

              <p className="text-gray-600 leading-relaxed">
                Safar is a modern ride-sharing and car-with-driver reservation
                platform that connects passengers with verified drivers.
                Passengers can request trips, receive driver quotes, select the
                best offer, and confirm their journey through a simple and
                secure booking system. Our goal is to make transportation
                easier, reliable, and accessible for everyone.
              </p>

              {/* ICON BOXES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                {/* BOX 1 */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <img src={Box1} alt="ride requests" className="w-12 h-12" />
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">Fast</h4>
                    <p className="text-gray-600 text-sm">Ride Requests</p>
                  </div>
                </div>

                {/* BOX 2 */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <img src={Box2} alt="driver quotes" className="w-12 h-12" />
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">Driver</h4>
                    <p className="text-gray-600 text-sm">Quote System</p>
                  </div>
                </div>

                {/* BOX 3 */}
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <img src={Box3} alt="secure booking" className="w-12 h-12" />
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">Secure</h4>
                    <p className="text-gray-600 text-sm">Trip Booking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <PlanTrip />
          </div>
        </div>
      </section>

      <div className="relative w-full bg-gray-900 py-16">
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative max-w-[1300px] mx-auto px-6 text-center text-white">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Request a ride or reserve a car with driver in minutes
          </h2>

          <div className="flex items-center justify-center gap-4 text-orange-400">
            <i className="fa-solid fa-phone text-2xl"></i>
            <h3 className="text-xl md:text-2xl font-semibold">
              +880 1700-000000
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
