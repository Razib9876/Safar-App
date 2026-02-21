import SelectCar from "../../assets/images/plan/icon1.png";
import Contact from "../../assets/images/plan/icon2.png";
import Drive from "../../assets/images/plan/icon3.png";

function PlanTrip() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[1300px] mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-orange-500 font-semibold text-lg uppercase tracking-wide">
            Plan your trip now
          </h3>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Quick & easy car rental
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div className="text-center p-6 rounded-xl hover:shadow-xl transition duration-300">
            <div className="flex justify-center mb-6">
              <img src={SelectCar} alt="icon_img" className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Select Car
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We offers a big range of vehicles for all your driving needs. We
              have the perfect car to meet your needs.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl hover:shadow-xl transition duration-300">
            <div className="flex justify-center mb-6">
              <img src={Contact} alt="icon_img" className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Operator
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our knowledgeable and friendly operators are always ready to help
              with any questions or concerns.
            </p>
          </div>

          <div className="text-center p-6 rounded-xl hover:shadow-xl transition duration-300">
            <div className="flex justify-center mb-6">
              <img src={Drive} alt="icon_img" className="w-20 h-20" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Let's Drive
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Whether you're hitting the open road, we've got you covered with
              our wide range of cars.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlanTrip;
