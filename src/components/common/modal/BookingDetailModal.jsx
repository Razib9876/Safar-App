import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function BookingModal({ booking, onClose }) {
  const handleAction = (type) => {
    toast.success(`Booking updated to ${type}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4">
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Booking Details</h2>

        <div className="space-y-2 text-sm">
          <p>
            <strong>User:</strong> {booking.userId?.name}
          </p>
          <p>
            <strong>Email:</strong> {booking.userId?.email}
          </p>
          <p>
            <strong>Phone:</strong> {booking.phoneNumber}
          </p>
          <p>
            <strong>Trip:</strong> {booking.tripType}
          </p>
          <p>
            <strong>Vehicle:</strong> {booking.vehicleType}
          </p>
          <p>
            <strong>From:</strong> {booking.fromLocation}
          </p>
          <p>
            <strong>To:</strong> {booking.toLocation}
          </p>
          <p>
            <strong>Status:</strong> {booking.status}
          </p>
          <p>
            <strong>Payment:</strong> {booking.paymentStatus}
          </p>
          <p>
            <strong>Amount:</strong> {booking.totalAmount}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={() => handleAction("public")}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Public
          </button>

          <button
            onClick={() => handleAction("private")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Private
          </button>

          <button
            onClick={() => handleAction("hang_on")}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Hang On
          </button>

          <button
            onClick={() => handleAction("cancel")}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
