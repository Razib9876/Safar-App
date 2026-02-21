import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axiosSecure from "../../services/axiosSecure";
import Loader from "../../components/common/Loader";

export default function Payments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Load Booking */
  useEffect(() => {
    axiosSecure.get(`/bookings/${id}`).then((res) => {
      setBooking(res.data);
      setLoading(false);
    });
  }, [id]);

  /* Dummy Payment */
  const handlePayment = async () => {
    try {
      await axiosSecure.post(`/payments/create`, {
        bookingId: id,
        amount: booking.finalAmount,
      });

      // Update Booking
      await axiosSecure.patch(`/bookings/${id}/confirm`);

      alert("Payment Successful!");

      navigate(`/dashboard/bookings/${id}`);
    } catch {
      alert("Payment Failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>

      <div className="space-y-2">
        <p>
          <b>Route:</b> {booking.fromLocation} → {booking.toLocation}
        </p>

        <p>
          <b>Driver:</b> {booking.driver?.name}
        </p>

        <p>
          <b>Amount:</b> ৳{booking.finalAmount}
        </p>
      </div>

      {/* Dummy Card UI */}
      <div className="mt-5 space-y-3">
        <input
          placeholder="Card Number"
          className="input input-bordered w-full"
        />

        <input placeholder="MM/YY" className="input input-bordered w-full" />

        <input placeholder="CVC" className="input input-bordered w-full" />
      </div>

      <button onClick={handlePayment} className="btn btn-success w-full mt-6">
        Pay Now
      </button>
    </div>
  );
}
