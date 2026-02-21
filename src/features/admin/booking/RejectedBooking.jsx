import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../services/axiosSecure";
import toast from "react-hot-toast";
import { FiMoreVertical } from "react-icons/fi";

export default function RejectedBooking() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchDriver, setSearchDriver] = useState("");

  const queryClient = useQueryClient();

  // Fetch rejected bookings
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["rejected-bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings?status=rejected");
      return res.data.data;
    },
  });

  // Fetch available drivers (for assign modal)
  const { data: drivers = [] } = useQuery({
    queryKey: ["available-drivers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/drivers?status=available");
      return res.data.data;
    },
  });

  // Mutation: make public
  const publicMutation = useMutation({
    mutationFn: (bookingId) =>
      axiosSecure.patch(`/bookings/to-public/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking is now Public");
      queryClient.invalidateQueries(["rejected-bookings"]);
    },
  });

  // Mutation: assign driver
  const assignMutation = useMutation({
    mutationFn: ({ bookingId, driverId }) =>
      axiosSecure.patch(`/bookings/to-assined-by-admin/${bookingId}`, {
        driverId,
      }),
    onSuccess: () => {
      toast.success("Driver assigned successfully");
      queryClient.invalidateQueries(["rejected-bookings"]);
      setAssignModalOpen(false);
      setSelectedDriver(null);
    },
  });

  const handleAssignDriver = (bookingId) => {
    if (!selectedDriver) return toast.error("Please select a driver!");
    assignMutation.mutate({ bookingId, driverId: selectedDriver._id });
  };

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  // Filter drivers by search
  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
      d.email.toLowerCase().includes(searchDriver.toLowerCase()) ||
      d.phoneNumber.includes(searchDriver),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rejected Bookings</h1>

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-4 rounded-xl shadow cursor-pointer"
            onClick={() => setSelectedBooking(booking)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{booking.userId?.name}</div>
                <div className="text-sm text-gray-500">
                  {booking.vehicleType.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-red-100 px-2 py-1 rounded">
                  {booking.status}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    publicMutation.mutate(booking._id);
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs"
                >
                  Public
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBooking(booking);
                    setAssignModalOpen(true);
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs"
                >
                  Assign
                </button>
              </div>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              {booking.fromLocation} → {booking.toLocation}
            </div>
          </div>
        ))}
      </div>

      {/* ================= ASSIGN DRIVER MODAL ================= */}
      {assignModalOpen && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setAssignModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAssignModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Assign Driver</h2>

            <input
              type="text"
              placeholder="Search driver..."
              value={searchDriver}
              onChange={(e) => setSearchDriver(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />

            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver._id}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedDriver?._id === driver._id
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="font-medium">{driver.name}</div>
                  <div className="text-sm text-gray-500">{driver.email}</div>
                  <div className="text-sm text-gray-500">
                    {driver.phoneNumber}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleAssignDriver(selectedBooking._id)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg w-full"
            >
              Assign Selected Driver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
