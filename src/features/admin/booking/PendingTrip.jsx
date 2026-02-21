import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiMoreVertical,
  FiEye,
  FiXCircle,
  FiClock,
  FiLock,
} from "react-icons/fi";

const fetchBookings = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`);
  return res.data.data;
};

export default function AdminBookings() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchBookings,
  });

  if (isLoading)
    return <div className="p-6 text-center">Loading bookings...</div>;

  const handleAction = (type, booking) => {
    toast.success(`${type} updated for ${booking.userId?.name}`);
    setOpenDropdown(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>

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
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-t hover:bg-gray-50 cursor-pointer"
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
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    {booking.status}
                  </span>
                </td>

                {/* ACTION DROPDOWN */}
                <td
                  className="p-3 text-right relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === booking._id ? null : booking._id,
                      )
                    }
                  >
                    <FiMoreVertical />
                  </button>

                  {openDropdown === booking._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
                        onClick={() => handleAction("Public", booking)}
                      >
                        <FiEye /> Public
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
                        onClick={() => handleAction("Private", booking)}
                      >
                        <FiLock /> Private
                      </button>

                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
                        onClick={() => handleAction("Hang On", booking)}
                      >
                        <FiClock /> Hang On
                      </button>

                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 w-full"
                        onClick={() => handleAction("Cancel", booking)}
                      >
                        <FiXCircle /> Cancel
                      </button>
                    </div>
                  )}
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
            className="bg-white p-4 rounded-xl shadow cursor-pointer"
            onClick={() => setSelectedBooking(booking)}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{booking.userId?.name}</div>
                <div className="text-sm text-gray-500">
                  {booking.vehicleType.toUpperCase()}
                </div>
              </div>

              <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                {booking.status}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              {booking.fromLocation} → {booking.toLocation}
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedBooking(null)} // close modal on outside click
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Booking Details</h2>

            <div className="space-y-2 text-sm">
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
                <strong>Trip:</strong> {selectedBooking.tripType}
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
                <strong>Status:</strong> {selectedBooking.status}
              </p>
              <p>
                <strong>Payment:</strong> {selectedBooking.paymentStatus}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleAction("Public", selectedBooking)}
              >
                Public
              </button>
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                onClick={() => handleAction("Private", selectedBooking)}
              >
                Private
              </button>

              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleAction("Hang On", selectedBooking)}
              >
                Hang On
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleAction("Cancel", selectedBooking)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
