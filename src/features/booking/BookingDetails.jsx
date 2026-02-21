import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosSecure from "../../services/axiosSecure";
import Loader from "../../components/common/Loader";

export default function BookingDetails() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load booking
  useEffect(() => {
    axiosSecure
      .get(`/bookings/${id}`)
      .then((res) => {
        setBooking(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load booking");
        setLoading(false);
      });
  }, [id]);

  // Accept Quote
  const handleAccept = async (quoteId) => {
    try {
      await axiosSecure.patch(`/quotes/${quoteId}/accept`);

      setBooking((prev) => ({
        ...prev,
        status: "payment_pending",
        selectedQuoteId: quoteId,
      }));
    } catch {
      alert("Failed to accept quote");
    }
  };

  // Reject Quote
  const handleReject = async (quoteId) => {
    try {
      await axiosSecure.patch(`/quotes/${quoteId}/reject`);

      setBooking((prev) => ({
        ...prev,
        driverQuotes: prev.driverQuotes.map((q) =>
          q._id === quoteId ? { ...q, status: "rejected" } : q,
        ),
      }));
    } catch {
      alert("Reject failed");
    }
  };

  if (loading) return <Loader />;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Booking Info */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">Trip Information</h2>

        <p>
          <b>Route:</b> {booking.fromLocation} → {booking.toLocation}
        </p>

        <p>
          <b>Date:</b> {booking.dateFrom} to {booking.dateTo}
        </p>

        <p>
          <b>Status:</b>{" "}
          <span className="badge badge-info">{booking.status}</span>
        </p>
      </div>

      {/* Quotes */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">Driver Quotes</h2>

        {booking.driverQuotes?.length === 0 && (
          <p className="text-gray-500">Waiting for drivers...</p>
        )}

        <div className="space-y-3">
          {booking.driverQuotes?.map((quote) => (
            <div
              key={quote._id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p>
                  <b>Driver:</b> {quote.driverName || "Unknown"}
                </p>

                <p>Amount: ৳{quote.amount}</p>

                {quote.status === "rejected" && (
                  <p className="text-red-500 text-sm">Rejected</p>
                )}
              </div>
              {/* Payment Button */}
              {booking.status === "payment_pending" && (
                <div className="bg-white p-5 rounded-xl shadow">
                  <h3 className="font-bold mb-2">Payment Required</h3>

                  <p className="text-gray-600 mb-3">
                    Please complete payment to confirm your booking.
                  </p>

                  <Link
                    to={`/dashboard/payments/${booking._id}`}
                    className="btn btn-primary w-full"
                  >
                    Proceed to Payment
                  </Link>
                </div>
              )}

              {/* Actions */}
              {booking.status === "quoted" && quote.status === "pending" && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleAccept(quote._id)}
                    className="btn btn-sm btn-success"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(quote._id)}
                    className="btn btn-sm btn-error"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Driver Info */}
      {booking.status === "confirmed" && booking.driver && (
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">Driver Information</h2>

          <p>Name: {booking.driver.name}</p>

          <p>Phone: {booking.driver.phone}</p>
        </div>
      )}
    </div>
  );
}
