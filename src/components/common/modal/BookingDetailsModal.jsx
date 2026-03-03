import React, { useState, useMemo } from "react";
import CustomerPaymentModal from "./CustomerPaymentModal";

const BookingDetailsModal = ({ booking, onClose, refetch }) => {
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [sortType, setSortType] = useState("new");

  const sortedQuotes = useMemo(() => {
    const quotes = [...(booking.driverQuote || [])];
    if (sortType === "low")
      return quotes.sort((a, b) => a.currentAmount - b.currentAmount);
    if (sortType === "high")
      return quotes.sort((a, b) => b.currentAmount - a.currentAmount);
    return quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [booking.driverQuote, sortType]);

  const isConfirmed = booking.status === "confirmed";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-black">Trip Bids</h2>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p>
              <b>From:</b> {booking.fromLocation}
            </p>
            <p>
              <b>To:</b> {booking.toLocation}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span className="badge badge-sm">{booking.status}</span>
            </p>
          </div>

          <div className="flex gap-2">
            {["low", "high", "new"].map((t) => (
              <button
                key={t}
                onClick={() => setSortType(t)}
                className={`btn btn-xs capitalize ${sortType === t ? "btn-neutral" : "btn-outline"}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {sortedQuotes.map((q) => (
              <div
                key={q._id}
                className="border p-4 rounded-2xl flex justify-between items-center group hover:border-black transition-all"
              >
                <div>
                  <h4 className="font-bold">{q.driverId?.name}</h4>
                  <p className="text-xs text-gray-500">
                    {q.driverId?.activeVehicle?.model} (
                    {q.driverId?.activeVehicle?.capacity} Seats)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black">
                    {Math.round(q.currentAmount * 1.05)} TK
                  </p>
                  {!isConfirmed && (
                    <button
                      onClick={() => setSelectedQuote(q)}
                      className="btn btn-sm bg-black text-white mt-2"
                    >
                      Select & Pay
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL 2: OPENED FROM WITHIN THIS MODAL */}
        {selectedQuote && (
          <CustomerPaymentModal
            booking={booking}
            quote={selectedQuote}
            onClose={() => setSelectedQuote(null)}
            onSuccess={() => {
              setSelectedQuote(null); // Close Payment Modal
              onClose(); // Close Details Modal
              refetch(); // Refresh Table Data
            }}
          />
        )}
      </div>
    </div>
  );
};

export default BookingDetailsModal;
