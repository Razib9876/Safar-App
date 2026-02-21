import { useState } from "react";
import axiosSecure from "../../services/axiosSecure";

export default function SendQuoteModal({ trip, close }) {
  const [amount, setAmount] = useState("");

  const submitQuote = async () => {
    if (!amount) return alert("Enter amount");

    await axiosSecure.post("/driver/send-quote", {
      bookingId: trip._id,
      amount,
    });

    alert("Quote sent");

    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-5 rounded w-96">
        <h3 className="font-bold mb-3">Send Quote</h3>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter amount"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={close} className="btn btn-sm">
            Cancel
          </button>

          <button onClick={submitQuote} className="btn btn-sm btn-success">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
