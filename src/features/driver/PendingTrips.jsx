import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../services/axiosSecure";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "../../components/Loading";
import { ArrowRight, Calendar, Clock } from "lucide-react";

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

  if (authLoading || isLoading) return <Loading></Loading>;

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
                      <div className="flex items-center">
                        {/* Logic: If previousAmount is 0, this evaluates to false and hides the span.
          Only shows if previousAmount is 1 or higher.
      */}
                        {driverQuote.previousAmount > 0 && (
                          <span className="line-through text-gray-400 mr-2 text-xs">
                            {driverQuote.previousAmount}
                          </span>
                        )}

                        <span className="font-bold text-blue-600">
                          {driverQuote.currentAmount}
                        </span>
                        <span className="text-[10px] ml-1 text-gray-400 font-medium">
                          TK
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
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
      {/* <div className="lg:hidden space-y-4">
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
      </div> */}
      {/* ================= MOBILE / TABLET CARDS ================= */}
      <div className="lg:hidden space-y-4 px-2">
        {bookings.map((booking) => {
          const driverQuote = getDriverQuote(booking);

          return (
            <div
              key={booking._id}
              className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
            >
              {/* Top Header: Name and Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                    {booking.userId?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none">
                      {booking.userId?.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      {booking.vehicleType} •{" "}
                      {booking.tripType.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                    driverQuote
                      ? "bg-green-50 text-green-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {driverQuote?.status || "New Request"}
                </span>
              </div>

              {/* Route visualization */}
              <div className="relative pl-7 space-y-4 mb-5 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-100">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-indigo-500 bg-white"></div>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {booking.fromLocation}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-red-400 bg-white"></div>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {booking.toLocation}
                  </p>
                </div>
              </div>

              {/* Date and Time Row */}
              <div className="flex items-center gap-4 py-3 border-t border-b border-gray-50 mb-5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600 font-semibold">
                    {new Date(booking.dateFrom).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600 font-semibold">
                    {formatTime12Hour(booking.timeFrom)}
                  </span>
                </div>
              </div>

              {/* Footer: Price and Action */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    My Bid
                  </p>
                  <div className="flex items-baseline gap-1">
                    {driverQuote ? (
                      <>
                        <span className="text-lg font-black text-indigo-600">
                          {driverQuote.currentAmount}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          TK
                        </span>
                        {driverQuote.previousAmount > 0 && (
                          <span className="text-xs text-gray-300 line-through ml-1">
                            {driverQuote.previousAmount}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-300 italic">
                        No offer yet
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setOfferModalOpen(true);
                    setAmount(driverQuote?.currentAmount || "");
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    driverQuote
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  }`}
                >
                  {driverQuote ? "Edit Bid" : "Send Bid"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* ================= FIXED MODAL ================= */}
      {offerModalOpen && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOfferModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {getDriverQuote(selectedBooking) ? "Update Offer" : "Send Offer"}
            </h2>

            {/* Trip Details Summary */}
            <div className="space-y-2 text-sm mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p>
                <strong className="text-gray-700">Rider:</strong>{" "}
                {selectedBooking.userId?.name}
              </p>
              <p>
                <strong className="text-gray-700">Route:</strong>{" "}
                {selectedBooking.fromLocation} → {selectedBooking.toLocation}
              </p>
              <p>
                <strong className="text-gray-700">Date & Time:</strong>{" "}
                {new Date(selectedBooking.dateFrom).toLocaleDateString()}{" "}
                {formatTime12Hour(selectedBooking.timeFrom)} →{" "}
                {new Date(selectedBooking.dateTo).toLocaleDateString()}{" "}
                {formatTime12Hour(selectedBooking.timeTo)}
              </p>
            </div>

            {/* Amount Input with Up/Down Buttons & Zero Fix */}
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Your Demand (TK)
            </label>
            <div className="flex items-center gap-2 mb-4">
              {/* Minus Button */}
              <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-bold text-2xl transition-all border border-gray-300 active:scale-95"
                onClick={() => {
                  const current = Number(amount) || 0;
                  const newVal = Math.max(0, current - 100); // Stop at 0
                  setAmount(newVal.toString());
                }}
              >
                −
              </button>

              <input
                type="number"
                min="0"
                placeholder="0"
                onKeyDown={(e) =>
                  ["-", "e", "E"].includes(e.key) && e.preventDefault()
                }
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setAmount("");
                  } else {
                    // FIX: Convert to Number then String to strip "0500" leading zeros
                    const numericVal = Number(val);
                    if (numericVal >= 0) {
                      setAmount(numericVal.toString());
                    }
                  }
                }}
                className="border-2 border-gray-300 p-2 flex-grow text-center rounded-lg text-lg font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />

              {/* Plus Button */}
              <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-bold text-2xl transition-all border border-gray-300 active:scale-95"
                onClick={() => {
                  const current = Number(amount) || 0;
                  const newVal = current + 100;
                  setAmount(newVal.toString());
                }}
              >
                +
              </button>
            </div>

            {/* Admin Commission Calculation */}
            {amount && Number(amount) > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg mb-6 border border-blue-100">
                <p className="text-sm text-blue-800 flex justify-between">
                  <span>Admin Commission (5%):</span>
                  <span className="font-bold">
                    {(Number(amount) * 0.05).toFixed(2)} TK
                  </span>
                </p>
                <p className="text-sm text-gray-800 mt-1 flex justify-between border-t border-blue-200 pt-1 font-semibold">
                  <span>Total with Commission:</span>
                  <span className="text-red-600">
                    {(Number(amount) * 1.05).toFixed(2)} TK
                  </span>
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setOfferModalOpen(false)}
              >
                Close
              </button>

              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md active:scale-95"
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

// _________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________
