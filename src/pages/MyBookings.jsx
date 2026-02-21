import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../services/axiosSecure";
import toast from "react-hot-toast";
import HeroPages from "../components/AboutPages/HeroPages";

// ================= PAYMENT METHODS =================
const paymentMethods = [
  "bkash",
  "nagad",
  "rocket",
  "upay",
  "tap",
  "surecash",
  "visa",
  "mastercard",
  "amex",
  "unionpay",
  "dbbl_nexus",
  "maestro",
  "cash",
  "internet_banking",
];

// ================= RESTRICTED STATUS =================
const restrictedStatuses = [
  "confirmed",
  "on_trip",
  "completed",
  "cancelled",
  "rejected",
];

export default function MyBookings() {
  const queryClient = useQueryClient();

  const [userEmail, setUserEmail] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("");

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // ================= AUTH =================
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) setUserEmail(user.email);
      else toast.error("Please login");
    });
    return () => unsubscribe();
  }, []);

  // ================= FETCH BOOKINGS =================
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/by-email?email=${encodeURIComponent(userEmail)}`,
      );
      return res.data.data || [];
    },
  });

  // ================= CANCEL BOOKING =================
  const cancelMutation = useMutation({
    mutationFn: (bookingId) =>
      axiosSecure.patch(`/bookings/to-rejected/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries(["my-bookings", userEmail]);
    },
    onError: () => toast.error("Cancel failed"),
  });

  // ================= CONFIRM BOOKING =================
  const confirmMutation = useMutation({
    mutationFn: ({ bookingId, quoteId }) =>
      axiosSecure.patch(`/bookings/${bookingId}/confirm-booking/${quoteId}`),
  });

  // ================= PAYMENT INITIATE =================
  const paymentMutation = useMutation({
    mutationFn: (payload) => axiosSecure.post(`/payments/initiate`, payload),
    onSuccess: () => {
      toast.success("Payment successful");
      setShowPaymentModal(false);
      setShowQuoteModal(false);
      resetPaymentState();
      queryClient.invalidateQueries(["my-bookings", userEmail]);
    },
    onError: () => toast.error("Payment failed"),
  });

  // ================= DERIVED =================
  const canModify = (status) => !restrictedStatuses.includes(status);

  const resetPaymentState = () => {
    setSelectedMethod(null);
    setSelectedQuote(null);
    setAmount("");
  };

  // ================= DRIVER RESPONSE =================
  const handleDriverResponse = async (booking) => {
    setSelectedBooking(booking);

    try {
      // ✅ FIXED: API now returns a direct array of quotes
      const res = await axiosSecure.get(
        `/bookings/${booking._id}/driver-quotes`,
      );

      setQuotes(res.data.data || []);
      setShowQuoteModal(true);
    } catch (error) {
      console.error("Failed to load driver quotes:", error);
      toast.error("Failed to load quotes");
    }
  };

  // ================= CONFIRM + PAY =================
  const handlePaymentSubmit = async () => {
    if (!selectedMethod) return toast.error("Select payment method");
    if (!amount) return toast.error("Enter amount");

    try {
      await confirmMutation.mutateAsync({
        bookingId: selectedBooking._id,
        quoteId: selectedQuote._id,
      });

      await paymentMutation.mutateAsync({
        bookingId: selectedBooking._id,
        amount: Number(amount),
        paymentMethod: selectedMethod,
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed");
    }
  };

  if (isLoading)
    return <div className="p-6 text-center">Loading bookings...</div>;

  return (
    <>
      <HeroPages name="My Bookings" />
      <div className="pt-10 pr-10 pl-10">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Trip</th>
                <th className="p-3">Route</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 capitalize">
                    {b.tripType.replace("_", " ")} ({b.vehicleType})
                  </td>
                  <td className="p-3">
                    {b.fromLocation} → {b.toLocation}
                  </td>
                  <td className="p-3">{b.status}</td>
                  <td className="p-3">{b.paymentStatus}</td>
                  <td className="p-3 text-right space-x-2">
                    {canModify(b.status) && (
                      <>
                        <button
                          onClick={() => cancelMutation.mutate(b._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>

                        {b.driverQuote?.length > 0 && (
                          <button
                            onClick={() => handleDriverResponse(b)}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Driver Response
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="lg:hidden space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="bg-white shadow rounded-xl p-4 border">
              <p className="font-semibold capitalize">
                {b.tripType.replace("_", " ")} ({b.vehicleType})
              </p>
              <p>
                {b.fromLocation} → {b.toLocation}
              </p>
              <p>Status: {b.status}</p>
              <p>Payment: {b.paymentStatus}</p>

              {canModify(b.status) && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => cancelMutation.mutate(b._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>

                  {b.driverQuote?.length > 0 && (
                    <button
                      onClick={() => handleDriverResponse(b)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Driver Response
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ================= QUOTE MODAL ================= */}
        {showQuoteModal && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setShowQuoteModal(false)}
          >
            <div
              className="bg-white w-full max-w-lg rounded-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Driver Quotes</h2>

              {quotes.length === 0 ? (
                <p>No quotes found.</p>
              ) : (
                quotes.map((q) => (
                  <div
                    key={q._id}
                    className="border p-3 rounded mb-3 flex justify-between"
                  >
                    <div>
                      <p>Status: {q.status}</p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {q.previousAmount &&
                        q.previousAmount !== q.currentAmount
                          ? `${q.previousAmount} → ${q.currentAmount}`
                          : q.currentAmount}
                      </p>

                      <button
                        onClick={() => {
                          setSelectedQuote(q);
                          setAmount(q.currentAmount);
                          setShowPaymentModal(true);
                        }}
                        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= PAYMENT MODAL ================= */}
        {showPaymentModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPaymentModal(false)}
          >
            <div
              className="bg-white w-full max-w-md rounded-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Select Payment Method</h2>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {paymentMethods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMethod(m)}
                    className={`border p-2 rounded text-sm ${
                      selectedMethod === m ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {selectedMethod && (
                <>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border w-full p-2 rounded mb-3"
                    placeholder="Enter amount"
                  />

                  <input
                    type="password"
                    className="border w-full p-2 rounded mb-3"
                    placeholder="Enter password"
                  />

                  <button
                    onClick={handlePaymentSubmit}
                    className={`w-full py-2 rounded text-white ${
                      selectedMethod === "bkash"
                        ? "bg-pink-600"
                        : selectedMethod === "nagad"
                          ? "bg-orange-600"
                          : "bg-green-600"
                    }`}
                  >
                    Pay with {selectedMethod}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
