import HeroPages from "../components/AboutPages/HeroPages";

function Contact() {
  return (
    <section className="w-full">
      <HeroPages name="Contact" />

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Side - Contact Info */}
          <div className="flex-1 flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Need help with Safar?
            </h2>

            <p className="text-gray-600 leading-relaxed max-w-md">
              Safar is a digital ride-booking platform that connects passengers
              with drivers for easy and secure transportation. If you have
              questions about booking rides, driver requests, payments, or
              account issues, our team is ready to help you.
            </p>

            <div className="flex flex-col gap-4 mt-4">
              <a
                href="/"
                className="flex items-center gap-3 text-gray-800 hover:text-primary transition-colors"
              >
                <i className="fa-solid fa-phone text-primary"></i>
                +880 1700-000000
              </a>

              <a
                href="/"
                className="flex items-center gap-3 text-gray-800 hover:text-primary transition-colors"
              >
                <i className="fa-solid fa-envelope text-primary"></i>
                support@safarapp.com
              </a>

              <a
                href="/"
                className="flex items-center gap-3 text-gray-800 hover:text-primary transition-colors"
              >
                <i className="fa-solid fa-location-dot text-primary"></i>
                Bangladesh
              </a>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 bg-white shadow-xl rounded-xl p-8">
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium">
                  Full Name <b className="text-red-500">*</b>
                </label>
                <input
                  type="text"
                  placeholder='E.g: "Your Name"'
                  className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">
                  Email <b className="text-red-500">*</b>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium">
                  Message <b className="text-red-500">*</b>
                </label>
                <textarea
                  placeholder="Write your question or issue related to Safar..."
                  rows="5"
                  className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-envelope-open-text"></i>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Contact Banner */}
      <div className="relative bg-primary py-16 mt-20">
        <div className="absolute inset-0 bg-black"></div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold">
              Book a ride or contact Safar support anytime
            </h2>

            <div className="flex items-center gap-3">
              <i className="fa-solid fa-phone text-2xl"></i>
              <h3 className="text-xl font-semibold">+880 1723830614</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
