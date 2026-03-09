import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiMoreVertical,
  FiEye,
  FiXCircle,
  FiClock,
  FiLock,
  FiArrowLeft,
  FiUser,
  FiTruck,
  FiMapPin,
  FiCalendar,
  FiPhone,
  FiSearch,
  FiCheck,
  FiX,
  FiMail,
  FiZap,
} from "react-icons/fi";

// Note: Ensure axiosSecure is defined or replace with your axios instance
const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function AdminBookings() {
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [assigningDriver, setAssigningDriver] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchDriver, setSearchDriver] = useState("");

  // ================= FETCH DATA =================
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["pending-bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings?status=pending");
      return res.data.data;
    },
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ["available-drivers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/drivers?status=available");
      return res.data.data;
    },
    enabled: assigningDriver, // Only fetch drivers when assigning
  });

  // ================= MUTATIONS =================
  const mutationUpdate = useMutation({
    mutationFn: ({ id, status, driverId }) => {
      let endpoint = `/bookings/to-public/${id}`;
      if (status === "Private")
        endpoint = `/bookings/to-assined-by-admin/${id}`;
      if (status === "Cancel") endpoint = `/bookings/to-rejected/${id}`;

      return axiosSecure.patch(endpoint, { driverId });
    },
    onSuccess: (_, variables) => {
      toast.success(`Booking set to ${variables.status}`);
      queryClient.invalidateQueries(["pending-bookings"]);
      closeAllModals();
    },
    onError: () => toast.error("Failed to update booking"),
  });

  // ================= HANDLERS =================
  const closeAllModals = () => {
    setSelectedBooking(null);
    setAssigningDriver(false);
    setSelectedDriver(null);
    setSearchDriver("");
  };

  const handleAction = (status, booking) => {
    if (status === "Private") {
      setAssigningDriver(true);
    } else {
      mutationUpdate.mutate({ id: booking._id, status });
    }
  };

  const confirmAssignment = () => {
    if (!selectedDriver) return toast.error("Please select a driver");
    mutationUpdate.mutate({
      id: selectedBooking._id,
      status: "Private",
      driverId: selectedDriver._id,
    });
  };

  const filteredDrivers = drivers.filter(
    (d) =>
      d.userId?.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
      d.phoneNumber.includes(searchDriver),
  );

  if (isLoading)
    return <div className="p-6 text-center font-bold">Loading bookings...</div>;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Parent container with 0 padding on mobile, restored on small screens */}
      <div className="px-0 sm:px-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand Section */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <FiZap size={28} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                Logistics <span className="text-orange-600">Control Tower</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
                System_Status: Active • Tracking {bookings.length} Requests
              </p>
            </div>
          </div>

          {/* Metric Badge */}
          <div className="flex items-center">
            <div className="px-6 py-3 bg-slate-900 rounded-2xl border-r-4 border-orange-600 shadow-xl">
              <span className="text-white text-[11px] font-black uppercase tracking-[0.2em]">
                Priority_Queue: {bookings.length}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto bg-white shadow-sm rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-4 font-bold text-gray-600">User</th>
              <th className="p-4 font-bold text-gray-600">Trip</th>
              <th className="p-4 font-bold text-gray-600">Vehicle</th>
              <th className="p-4 font-bold text-gray-600">Route</th>
              <th className="p-4 font-bold text-gray-600">Status</th>
              <th className="p-4 text-right font-bold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="border-t hover:bg-blue-50/30 cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <td className="p-4">
                  <div className="font-bold">{booking.userId?.name}</div>
                  <div className="text-gray-500 text-xs">
                    {booking.userId?.email}
                  </div>
                </td>
                <td className="p-4 capitalize">
                  {booking.tripType?.replace("_", " ")}
                </td>
                <td className="p-4 uppercase font-bold text-blue-600">
                  {booking.vehicleType}
                </td>
                <td className="p-4">
                  {booking.fromLocation} → {booking.toLocation}
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 text-[10px] font-black uppercase rounded-full bg-yellow-100 text-yellow-700">
                    {booking.status}
                  </span>
                </td>
                <td
                  className="p-4 text-right relative"
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
                    <div className="absolute right-4 mt-2 w-44 bg-white shadow-2xl rounded-xl z-50 border py-2">
                      <button
                        className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 w-full text-sm font-semibold"
                        onClick={() => handleAction("Public", booking)}
                      >
                        <FiEye className="text-blue-600" /> Public
                      </button>
                      <button
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 w-full text-sm font-semibold"
                        onClick={() => handleAction("Private", booking)}
                      >
                        <FiLock className="text-slate-600" /> Private
                      </button>
                      <button
                        className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 w-full text-sm font-bold"
                        onClick={() => handleAction("Cancel", booking)}
                      >
                        <FiXCircle /> Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE VIEW (REMOVED FOR BREVITY, SAME AS TABLE LOGIC) ================= */}
      {/* ================= MOBILE VIEW ================= */}
      <div className="lg:hidden w-full space-y-4 px-0">
        {" "}
        {/* Use px-0 if you want it edge-to-edge */}
        {bookings.map((booking) => (
          <div
            key={booking._id}
            onClick={() => setSelectedBooking(booking)}
            className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:bg-gray-50 transition-colors"
          >
            {/* Top Row: User Info & Actions */}
            <div className="flex justify-between items-start w-full mb-3">
              <div className="max-w-[70%]">
                <h3 className="font-bold text-slate-900 truncate">
                  {booking.userId?.name}
                </h3>
                <p className="text-[11px] text-slate-500 truncate">
                  {booking.userId?.email}
                </p>
              </div>
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === booking._id ? null : booking._id,
                    )
                  }
                  className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
                >
                  <FiMoreVertical size={18} />
                </button>

                {openDropdown === booking._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-xl z-50 border-2 border-slate-50 py-1">
                    <button
                      className="flex items-center gap-3 px-4 py-3 w-full text-sm font-semibold border-b border-slate-50"
                      onClick={() => handleAction("Public", booking)}
                    >
                      <FiEye className="text-blue-600" /> Public
                    </button>
                    <button
                      className="flex items-center gap-3 px-4 py-3 w-full text-sm font-semibold border-b border-slate-50"
                      onClick={() => handleAction("Private", booking)}
                    >
                      <FiLock className="text-slate-600" /> Private
                    </button>
                    <button
                      className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold text-red-600"
                      onClick={() => handleAction("Cancel", booking)}
                    >
                      <FiXCircle /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Row: Specs */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  Vehicle
                </span>
                <span className="text-xs font-black text-blue-700 uppercase">
                  {booking.vehicleType}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">
                  Status
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-yellow-100 text-yellow-700">
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Bottom Row: Route (Stacked for better fit) */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="w-[1px] h-3 bg-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="truncate font-semibold text-slate-700">
                    {booking.fromLocation}
                  </span>
                  <span className="truncate font-semibold text-slate-700">
                    {booking.toLocation}
                  </span>
                </div>
                <FiTruck className="text-slate-300 ml-auto" size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* ================= INDUSTRIAL MODAL ================= */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-2 sm:p-4"
          onClick={closeAllModals}
        >
          <div
            className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-6 border-b bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800 uppercase">
                {assigningDriver
                  ? "Select Private Driver"
                  : `Booking #${selectedBooking._id.slice(-6).toUpperCase()}`}
              </h2>
              <button
                onClick={closeAllModals}
                className="w-10 h-10 rounded-full hover:bg-red-500 hover:text-white transition-all flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-grow space-y-6">
              {assigningDriver ? (
                /* --- DRIVER SELECTION UI --- */
                <div className="space-y-4">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all"
                      placeholder="Search driver by name or phone..."
                      value={searchDriver}
                      onChange={(e) => setSearchDriver(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDrivers.map((driver) => (
                      <div
                        key={driver._id}
                        onClick={() => setSelectedDriver(driver)}
                        className={`p-4 border-2 rounded-3xl flex items-center gap-4 cursor-pointer transition-all ${selectedDriver?._id === driver._id ? "border-blue-600 bg-blue-50" : "border-slate-100 hover:border-blue-200"}`}
                      >
                        <img
                          src={driver.photo}
                          className="w-14 h-14 rounded-2xl object-cover"
                          alt=""
                        />
                        <div className="flex-grow">
                          <p className="font-bold text-slate-800">
                            {driver.userId?.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {driver.phoneNumber}
                          </p>
                        </div>
                        {selectedDriver?._id === driver._id && (
                          <FiCheck className="text-blue-600 text-xl" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* --- EXISTING INDUSTRIAL MODAL CONTENT --- */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column (User & Vehicle Info) */}
                  <div className="space-y-6">
                    {/* Customer Section */}
                    <section className="bg-slate-50 p-5 rounded-[25px] border border-slate-100 relative group">
                      <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-3">
                        Customer
                      </h3>
                      <div className="space-y-1">
                        <p className="font-black text-slate-800 text-base">
                          {selectedBooking.userId?.name}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <FiMail className="shrink-0" />{" "}
                          {selectedBooking.userId?.email}
                        </p>
                      </div>

                      {/* Action Buttons for Admin */}
                      <div className="mt-4 pt-4 border-t border-slate-200 flex gap-3">
                        <a
                          href={`tel:${selectedBooking.phoneNumber}`}
                          className="flex items-center justify-center gap-2 flex-1 bg-white border border-slate-200 py-2 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                        >
                          <FiPhone className="text-sm" />
                          <span className="text-[10px] font-bold uppercase">
                            Call Admin
                          </span>
                        </a>
                      </div>
                    </section>

                    {/* Vehicle & Trip Type Section */}
                    <section className="bg-indigo-50/50 p-5 rounded-[25px] border border-indigo-100">
                      <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-3">
                        Logistics Specs
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white p-3 rounded-xl border border-indigo-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            Vehicle
                          </p>
                          <p className="text-xs font-black text-slate-700 uppercase">
                            {selectedBooking.vehicleType}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-indigo-100">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            Trip
                          </p>
                          <p className="text-xs font-black text-slate-700 uppercase">
                            {selectedBooking.tripType?.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* Schedule Section */}
                    <section className="bg-amber-50/50 p-5 rounded-[25px] border border-amber-100">
                      <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-3">
                        Schedule
                      </h3>
                      <div className="flex items-center gap-3">
                        <FiCalendar className="text-amber-600" />
                        <div>
                          <p className="text-sm font-bold text-slate-700">
                            {new Date(selectedBooking.dateFrom).toDateString()}
                          </p>
                          <p className="text-xs font-medium text-amber-700/70">
                            {selectedBooking.timeFrom}
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column (Route & Logs) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[35px] shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <FiTruck size={100} />
                      </div>
                      <p className="text-blue-400 font-black text-[10px] tracking-widest mb-4">
                        LOGISTICS ROUTE
                      </p>
                      <div className="flex items-center justify-between gap-4 relative z-10">
                        <div className="flex-1">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase mb-1">
                            Origin
                          </span>
                          <h4 className="text-xl font-bold">
                            {selectedBooking.fromLocation}
                          </h4>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-[2px] bg-blue-500/30 mb-1"></div>
                          <FiTruck className="text-blue-500 text-2xl" />
                          <div className="w-12 h-[2px] bg-blue-500/30 mt-1"></div>
                        </div>
                        <div className="flex-1 text-right">
                          <span className="text-[9px] font-bold text-slate-400 block uppercase mb-1">
                            Destination
                          </span>
                          <h4 className="text-xl font-bold">
                            {selectedBooking.toLocation}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Driver Bidding Logs Section would follow here */}
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-6 border-t bg-gray-50/80 flex flex-wrap gap-4 justify-end">
              {assigningDriver ? (
                <>
                  <button
                    onClick={() => setAssigningDriver(false)}
                    className="px-8 py-4 font-bold text-slate-500"
                  >
                    BACK
                  </button>
                  <button
                    disabled={!selectedDriver || mutationUpdate.isPending}
                    onClick={confirmAssignment}
                    className="px-10 py-4 bg-blue-600 text-white rounded-[22px] text-[11px] font-black shadow-xl disabled:bg-slate-300"
                  >
                    {mutationUpdate.isPending
                      ? "ASSIGNING..."
                      : "CONFIRM ASSIGNMENT"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAction("Public", selectedBooking)}
                    className="px-6 py-4 bg-blue-600 text-white rounded-[22px] text-[11px] font-black shadow-xl"
                  >
                    PUBLISH PUBLIC
                  </button>
                  <button
                    onClick={() => setAssigningDriver(true)}
                    className="px-6 py-4 bg-slate-800 text-white rounded-[22px] text-[11px] font-black shadow-xl"
                  >
                    SET AS PRIVATE
                  </button>
                  <button
                    onClick={() => handleAction("Cancel", selectedBooking)}
                    className="px-6 py-4 bg-rose-500 text-white rounded-[22px] text-[11px] font-black shadow-xl"
                  >
                    TERMINATE TRIP
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
