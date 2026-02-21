export default function BookingCard({ booking, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white shadow rounded-xl p-4 cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{booking.userId?.name}</h2>

        <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
          {booking.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        {booking.fromLocation} → {booking.toLocation}
      </p>

      <div className="text-sm mt-2 flex justify-between">
        <span className="uppercase">{booking.vehicleType}</span>

        <span>{new Date(booking.dateFrom).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
