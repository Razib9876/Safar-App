import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axiosSecure from "../../../services/axiosSecure";
import toast from "react-hot-toast";

const CustomerPaymentModal = ({ booking, quote, onClose, onSuccess }) => {
  const [method, setMethod] = useState(null);
  const [password, setPassword] = useState("");

  const confirmMutation = useMutation({
    mutationFn: () =>
      axiosSecure.patch(
        `/bookings/${booking._id}/confirm-booking/${quote._id}`,
      ),
  });

  const paymentMutation = useMutation({
    mutationFn: (data) => axiosSecure.post(`/payments/initiate`, data),
  });

  const displayAmount = Math.round(quote.currentAmount * 1.05);

  const handleSubmit = async () => {
    if (!method || !password) return toast.error("Please fill all fields");

    const loadingToast = toast.loading("Processing your payment...");
    try {
      // Step 1: Confirm Booking
      await confirmMutation.mutateAsync();

      // Step 2: Pay
      await paymentMutation.mutateAsync({
        bookingId: booking._id,
        quoteId: quote._id,
        paymentMethod: method,
        amount: displayAmount,
        password: password,
      });

      toast.success("Payment Successful!", { id: loadingToast });
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 space-y-6 shadow-2xl scale-in-center">
        <header className="flex justify-between items-center border-b pb-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors text-sm"
          >
            ← Back
          </button>
          <h2 className="text-lg font-black">Checkout</h2>
        </header>

        <div className="grid grid-cols-3 gap-3">
          {["bkash", "nagad", "rocket"].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`py-3 rounded-xl border-2 transition-all capitalize text-xs font-bold ${
                method === m
                  ? "border-black bg-black text-white shadow-lg"
                  : "border-gray-100 bg-gray-50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl space-y-2 border border-gray-100">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Driver Quote</span>
            <span>{quote.currentAmount} TK</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Service Fee (5%)</span>
            <span>{displayAmount - quote.currentAmount} TK</span>
          </div>
          <div className="flex justify-between font-black text-xl pt-2 border-t mt-2">
            <span>Total</span>
            <span>{displayAmount} TK</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-black outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={confirmMutation.isPending || paymentMutation.isPending}
          className="w-full py-4 bg-black text-white rounded-xl font-bold shadow-xl hover:bg-gray-800 disabled:bg-gray-300 transition-all"
        >
          {confirmMutation.isPending || paymentMutation.isPending
            ? "Processing..."
            : `Confirm Payment`}
        </button>
      </div>
    </div>
  );
};

export default CustomerPaymentModal;
