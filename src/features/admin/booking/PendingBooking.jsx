import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiMoreVertical, FiEye, FiXCircle, FiUserPlus } from "react-icons/fi";
import axiosSecure from "../../../services/axiosSecure";

export default function PendingBooking() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchDriver, setSearchDriver] = useState("");

  const queryClient = useQueryClient();

  // ================= FETCH PENDING BOOKINGS =================
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["pending-bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings?status=pending");
      return res.data.data;
    },
  });

  // ================= FETCH AVAILABLE DRIVERS =================
  const { data: drivers = [] } = useQuery({
    queryKey: ["available-drivers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/drivers?status=available");
      return res.data.data;
    },
  });

  // ================= MUTATIONS =================
  const mutationPublic = useMutation({
    mutationFn: (bookingId) =>
      axiosSecure.patch(`/bookings/to-public/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking updated to Public");
      queryClient.invalidateQueries(["pending-bookings"]);
    },
  });

  const mutationReject = useMutation({
    mutationFn: (bookingId) =>
      axiosSecure.patch(`/bookings/to-rejected/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking Rejected");
      queryClient.invalidateQueries(["pending-bookings"]);
    },
  });

  const mutationAssign = useMutation({
    mutationFn: ({ bookingId, driverId }) =>
      axiosSecure.patch(`/bookings/to-assined-by-admin/${bookingId}`, {
        driverId,
      }),
    onSuccess: () => {
      toast.success("Driver Assigned Successfully");
      queryClient.invalidateQueries(["pending-bookings"]);
      setAssignModalOpen(false);
    },
  });

  // ================= HANDLE ACTIONS =================
  const handlePublic = (bookingId) => mutationPublic.mutate(bookingId);
  const handleReject = (bookingId) => mutationReject.mutate(bookingId);
  const handleAssign = (booking) => {
    setSelectedBooking(booking);
    setAssignModalOpen(true);
  };
  const confirmAssign = () => {
    if (!selectedDriver) return toast.error("Select a driver first");
    mutationAssign.mutate({
      bookingId: selectedBooking._id,
      driverId: selectedDriver._id,
    });
  };

  if (isLoading)
    return <div className="p-6 text-center">Loading bookings...</div>;

  // ================= FILTER DRIVERS BY SEARCH =================
  const filteredDrivers = drivers.filter(
    (d) =>
      d.userId?.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
      d.userId?.email.toLowerCase().includes(searchDriver.toLowerCase()) ||
      d.phoneNumber.includes(searchDriver),
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pending Bookings</h1>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Trip</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">From → To</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <td className="p-3">
                  <div className="font-medium">{booking.userId?.name}</div>
                  <div className="text-gray-500 text-xs">
                    {booking.userId?.email}
                  </div>
                </td>
                <td className="p-3 capitalize">
                  {booking.tripType.replace("_", " ")}
                </td>
                <td className="p-3 uppercase">{booking.vehicleType}</td>
                <td className="p-3">
                  {booking.fromLocation} → {booking.toLocation}
                </td>
                <td className="p-3">
                  {new Date(booking.dateFrom).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    {booking.status}
                  </span>
                </td>
                <td
                  className="p-3 text-right relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === booking._id ? null : booking._id,
                      )
                    }
                  >
                    <FiMoreVertical />
                  </button>
                  {openDropdown === booking._id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg z-50">
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
                        onClick={() => handlePublic(booking._id)}
                      >
                        <FiEye /> Public
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
                        onClick={() => handleAssign(booking)}
                      >
                        <FiUserPlus /> Assign
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 w-full"
                        onClick={() => handleReject(booking._id)}
                      >
                        <FiXCircle /> Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="lg:hidden space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-4 rounded-xl shadow cursor-pointer"
            onClick={() => setSelectedBooking(booking)}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{booking.userId?.name}</div>
                <div className="text-sm text-gray-500">
                  {booking.vehicleType.toUpperCase()}
                </div>
              </div>
              <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                {booking.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {booking.fromLocation} → {booking.toLocation}
            </div>
          </div>
        ))}
      </div>

      {/* ================= ASSIGN DRIVER MODAL ================= */}
      {assignModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setAssignModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Assign Driver</h2>
            <input
              type="text"
              placeholder="Search driver by name/email/phone"
              value={searchDriver}
              onChange={(e) => setSearchDriver(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver._id}
                  className={`p-2 rounded cursor-pointer ${selectedDriver?._id === driver._id ? "bg-blue-100" : "hover:bg-gray-100"}`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="font-medium">{driver.userId?.name}</div>
                  <div className="text-xs text-gray-500">
                    {driver.userId?.email} | {driver.phoneNumber}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setAssignModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={confirmAssign}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
