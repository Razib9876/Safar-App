import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../services/axiosSecure";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// 24-hour to 12-hour AM/PM
const formatTime12Hour = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

export default function PendingBooking() {
  const queryClient = useQueryClient();
  const [driverId, setDriverId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  // ================= FETCH DRIVER ID =================
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          const res = await axiosSecure.get(
            `/drivers/by-email?email=${encodeURIComponent(user.email)}`,
          );
          setDriverId(res.data.data?._id || null);
        } catch (err) {
          toast.error("Failed to fetch driver info");
        } finally {
          setAuthLoading(false);
        }
      } else {
        setAuthLoading(false);
        toast.error("Please login to see bookings");
      }
    });
    return () => unsubscribe();
  }, []);

  // ================= FETCH BOOKINGS =================
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["available-bookings", driverId],
    enabled: !!driverId, // only fetch if driverId exists
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/available-for-driver?driverId=${driverId}`,
      );
      return res.data.data;
    },
  });

  // ================= SEND / UPDATE OFFER =================
  const mutationSendOffer = useMutation({
    mutationFn: ({ bookingId, amount }) =>
      axiosSecure.post(`/bookings/${bookingId}/driver-quote`, {
        driverId,
        amount: Number(amount),
      }),
    onSuccess: () => {
      toast.success("Offer sent successfully");
      queryClient.invalidateQueries(["available-bookings", driverId]);
      setOfferModalOpen(false);
      setAmount("");
    },
    onError: () => {
      toast.error("Failed to send offer");
    },
  });

  const handleSendOffer = () => {
    if (!amount) return toast.error("Enter your amount");

    toast((t) => (
      <div>
        <p className="mb-2">Are you sure to send this offer?</p>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => {
              mutationSendOffer.mutate({
                bookingId: selectedBooking._id,
                amount,
              });
              toast.dismiss(t.id);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    ));
  };

  if (authLoading || isLoading)
    return <div className="p-6 text-center">Loading bookings...</div>;

  // ================= HELPER: GET DRIVER QUOTE =================
  const getDriverQuote = (booking) => {
    if (!booking.driverQuote || booking.driverQuote.length === 0) return null;
    const quotes = booking.driverQuote.filter((dq) => dq.driverId === driverId);
    return quotes.length ? quotes[quotes.length - 1] : null;
  };

  // ================= UI =================
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Bookings</h1>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Rider</th>
              <th className="p-3">Trip</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">From → To</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const driverQuote = getDriverQuote(booking);
              return (
                <tr key={booking._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{booking.userId?.name}</td>
                  <td className="p-3 capitalize">
                    {booking.tripType.replace("_", " ")}
                  </td>
                  <td className="p-3 uppercase">{booking.vehicleType}</td>
                  <td className="p-3">
                    {booking.fromLocation} → {booking.toLocation}
                  </td>
                  <td className="p-3">
                    {new Date(booking.dateFrom).toLocaleDateString()} |{" "}
                    {formatTime12Hour(booking.timeFrom)} →{" "}
                    {new Date(booking.dateTo).toLocaleDateString()} |{" "}
                    {formatTime12Hour(booking.timeTo)}
                  </td>
                  <td className="p-3">{driverQuote?.status || "-"}</td>
                  <td className="p-3">
                    {driverQuote ? (
                      <>
                        {driverQuote.previousAmount && (
                          <span className="line-through mr-1">
                            {driverQuote.previousAmount}
                          </span>
                        )}
                        <span>{driverQuote.currentAmount}</span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setOfferModalOpen(true);
                        setAmount(driverQuote?.currentAmount || "");
                      }}
                    >
                      {driverQuote ? "Update Offer" : "Send Offer"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE / TABLET CARDS ================= */}
      <div className="lg:hidden space-y-4">
        {bookings.map((booking) => {
          const driverQuote = getDriverQuote(booking);
          return (
            <div
              key={booking._id}
              className="bg-white shadow rounded-xl p-4 border hover:shadow-lg"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-lg">
                  {booking.userId?.name}
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {driverQuote?.status || "-"}
                </span>
              </div>

              <div className="mt-2 text-sm">
                <p>
                  <strong>Trip:</strong> {booking.tripType.replace("_", " ")}
                </p>
                <p>
                  <strong>Vehicle:</strong> {booking.vehicleType.toUpperCase()}
                </p>
                <p>
                  <strong>Route:</strong> {booking.fromLocation} →{" "}
                  {booking.toLocation}
                </p>
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {new Date(booking.dateFrom).toLocaleDateString()} |{" "}
                  {formatTime12Hour(booking.timeFrom)} →{" "}
                  {new Date(booking.dateTo).toLocaleDateString()} |{" "}
                  {formatTime12Hour(booking.timeTo)}
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  {driverQuote ? (
                    <>
                      {driverQuote.previousAmount && (
                        <span className="line-through mr-1">
                          {driverQuote.previousAmount}
                        </span>
                      )}
                      <span>{driverQuote.currentAmount}</span>
                    </>
                  ) : (
                    "-"
                  )}
                </p>
              </div>

              <div className="mt-4 text-right">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setOfferModalOpen(true);
                    setAmount(driverQuote?.currentAmount || "");
                  }}
                >
                  {driverQuote ? "Update Offer" : "Send Offer"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL ================= */}
      {offerModalOpen && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOfferModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              {getDriverQuote(selectedBooking) ? "Update Offer" : "Send Offer"}
            </h2>

            <div className="space-y-2 text-sm mb-4">
              <p>
                <strong>Rider:</strong> {selectedBooking.userId?.name}
              </p>
              <p>
                <strong>Route:</strong> {selectedBooking.fromLocation} →{" "}
                {selectedBooking.toLocation}
              </p>
              <p>
                <strong>Date & Time:</strong>{" "}
                {new Date(selectedBooking.dateFrom).toLocaleDateString()}{" "}
                {formatTime12Hour(selectedBooking.timeFrom)} →{" "}
                {new Date(selectedBooking.dateTo).toLocaleDateString()}{" "}
                {formatTime12Hour(selectedBooking.timeTo)}
              </p>
            </div>

            <input
              type="number"
              placeholder="Enter your amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 w-full rounded mb-3"
            />

            {amount && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>With 5% Admin Commission:</strong>{" "}
                {(Number(amount) * 1.05).toFixed(2)} TK
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setOfferModalOpen(false)}
              >
                Close
              </button>

              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleSendOffer}
              >
                {getDriverQuote(selectedBooking)
                  ? "Update Offer"
                  : "Send Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
