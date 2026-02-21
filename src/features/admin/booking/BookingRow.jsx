import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import toast from "react-hot-toast";

export default function BookingRow({ booking, onClick }) {
  const [open, setOpen] = useState(false);

  const statusColor = {
    pending_quotes: "bg-yellow-100 text-yellow-600",
    confirmed: "bg-green-100 text-green-600",
    cancelled: "bg-red-100 text-red-600",
  };

  const handleAction = (type) => {
    toast.success(`Booking marked as ${type}`);
    setOpen(false);
  };

  return (
    <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={onClick}>
      <td className="p-4">
        <div className="font-medium">{booking.userId?.name}</div>
        <div className="text-xs text-gray-500">{booking.userId?.email}</div>
      </td>

      <td className="p-4 capitalize">{booking.tripType.replace("_", " ")}</td>

      <td className="p-4 text-sm">
        {booking.fromLocation} → {booking.toLocation}
      </td>

      <td className="p-4 uppercase">{booking.vehicleType}</td>

      <td className="p-4">{new Date(booking.dateFrom).toLocaleDateString()}</td>

      <td className="p-4">
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            statusColor[booking.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {booking.status}
        </span>
      </td>

      <td
        className="p-4 text-right relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={() => setOpen(!open)}>
          <FiMoreVertical />
        </button>

        {open && (
          <div className="absolute right-4 mt-2 w-40 bg-white shadow-lg rounded-lg border z-20">
            {["public", "private", "hang_on", "cancel"].map((action) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
              >
                {action.replace("_", " ")}
              </button>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}
