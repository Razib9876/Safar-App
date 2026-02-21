import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCompletedBookings = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/bookings?status=completed`,
  );

  return res.data.data || [];
};

export default function CompletedBookings() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const modalRef = useRef();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["completed-bookings"],
    queryFn: fetchCompletedBookings,
  });

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedBooking(null);
      }
    };

    if (selectedBooking) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedBooking]);

  if (isLoading)
    return <div className="p-6 text-center">Loading completed bookings...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Completed Bookings</h1>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Trip</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">From → To</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-gray-500 font-medium"
                >
                  No completed bookings found
                </td>
              </tr>
            )}

            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedBooking(booking)}
              >
                <td className="p-3">
                  <div className="font-medium">{booking.userId?.name}</div>
                  <div className="text-gray-500 text-xs">
                    {booking.userId?.email}
                  </div>
                </td>

                <td className="p-3 capitalize">
                  {booking.tripType.replace("_", " ")}
                </td>

                <td className="p-3 uppercase">{booking.vehicleType}</td>

                <td className="p-3">
                  {booking.fromLocation} → {booking.toLocation}
                </td>

                <td className="p-3">
                  {new Date(booking.dateFrom).toLocaleDateString()}
                </td>

                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="lg:hidden space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-4 rounded-xl shadow cursor-pointer transition-transform hover:scale-[1.01]"
            onClick={() => setSelectedBooking(booking)}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{booking.userId?.name}</div>
                <div className="text-sm text-gray-500">
                  {booking.vehicleType.toUpperCase()}
                </div>
              </div>

              <span className="text-xs bg-green-100 px-2 py-1 rounded">
                {booking.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              {booking.fromLocation} → {booking.toLocation}
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center text-gray-500 font-medium p-4">
            No completed bookings found
          </div>
        )}
      </div>

      {/* ================= PROFESSIONAL MODAL ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative transform transition-transform scale-95 animate-scaleUp"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-3 right-3 text-gray-500 text-lg hover:text-gray-700 transition"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-5 border-b pb-2">
              Booking Details
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>User:</strong> {selectedBooking.userId?.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.userId?.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedBooking.phoneNumber}
              </p>
              <p>
                <strong>Trip:</strong>{" "}
                {selectedBooking.tripType.replace("_", " ")}
              </p>
              <p>
                <strong>Vehicle:</strong> {selectedBooking.vehicleType}
              </p>
              <p>
                <strong>From:</strong> {selectedBooking.fromLocation}
              </p>
              <p>
                <strong>To:</strong> {selectedBooking.toLocation}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  {selectedBooking.status}
                </span>
              </p>
              <p>
                <strong>Payment:</strong> {selectedBooking.paymentStatus}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ANIMATION ================= */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
