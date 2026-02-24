import { useState } from "react";
import { ChevronDown } from "lucide-react";
import faqBg from "../../assets/images/faq/car.png";

const faqData = [
  {
    id: "q1",
    question: "What is special about comparing rental car deals?",
    answer:
      "Comparing rental car deals helps you find the best option that fits your budget and requirements. By comparing prices and services, you can secure better vehicles, lower rates, and additional benefits.",
  },
  {
    id: "q2",
    question: "How do I find the car rental deals?",
    answer:
      "You can find car rental deals by researching online and comparing multiple rental companies. Sign up for newsletters and follow companies for special promotions.",
  },
  {
    id: "q3",
    question: "How do I find such low rental car prices?",
    answer:
      "Book in advance, compare companies, use discount codes, and consider off-airport rental locations to secure lower prices.",
  },
];

function Faq() {
  const [activeId, setActiveId] = useState("q1");

  const toggleQuestion = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="relative py-24 bg-white bg-no-repeat bg-left bg-[length:auto]"
      style={{
        backgroundImage: `url(${faqBg})`,
        backgroundPosition: "0 70%",
      }}
    >
      <div className="-mt-44 sm:mt-0 max-w-6xl mx-auto px-6">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Everything you need to know about our car rental booking process.
            Clear answers to common questions.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqData.map((item, index) => {
            const isOpen = activeId === item.id;

            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl shadow-sm bg-white transition-all duration-300"
              >
                <button
                  onClick={() => toggleQuestion(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${item.id}`}
                  className={`w-full flex justify-between items-center px-6 md:px-8 py-6 text-left rounded-xl transition-all duration-300
                    ${
                      isOpen
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  <span className="text-lg md:text-xl font-semibold">
                    {index + 1}. {item.question}
                  </span>

                  <ChevronDown
                    className={`w-6 h-6 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`faq-${item.id}`}
                  className={`grid transition-all duration-500 ease-in-out
                    ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                  `}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 md:px-8 pb-6 text-gray-600 text-base leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq;
