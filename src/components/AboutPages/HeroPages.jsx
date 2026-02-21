import { Link } from "react-router-dom";

function HeroPages({ name }) {
  return (
    <section className="relative w-full h-[250px] md:h-[300px] flex items-center bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('src/assets/images/hero/heroes-bg.png')",
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative max-w-[1300px] mx-auto px-6 w-full">
        <div className="text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-3">{name}</h3>

          <p className="text-sm md:text-base">
            <Link
              to="/"
              className="text-orange-400 hover:text-orange-500 transition"
            >
              Home
            </Link>{" "}
            / {name}
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroPages;
