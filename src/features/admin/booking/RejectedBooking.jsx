import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../services/axiosSecure";
import toast from "react-hot-toast";
import {
  FiAlertCircle,
  FiUser,
  FiTruck,
  FiMapPin,
  FiGlobe,
  FiUserPlus,
  FiSearch,
  FiX,
  FiCheckCircle,
  FiChevronRight,
} from "react-icons/fi";

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

  // Fetch available drivers
  const { data: drivers = [] } = useQuery({
    queryKey: ["available-drivers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/drivers?status=available");
      return res.data.data;
    },
  });

  const publicMutation = useMutation({
    mutationFn: (bookingId) =>
      axiosSecure.patch(`/bookings/to-public/${bookingId}`),
    onSuccess: () => {
      toast.success("Broadcasted to Public Pool");
      queryClient.invalidateQueries(["rejected-bookings"]);
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ bookingId, driverId }) =>
      axiosSecure.patch(`/bookings/to-assined-by-admin/${bookingId}`, {
        driverId,
      }),
    onSuccess: () => {
      toast.success("Manual Assignment Confirmed");
      queryClient.invalidateQueries(["rejected-bookings"]);
      setAssignModalOpen(false);
      setSelectedDriver(null);
    },
  });

  if (isLoading)
    return (
      <div className="p-12 text-center animate-pulse font-mono text-slate-400">
        SYNCING_REJECTED_QUEUE...
      </div>
    );

  const filteredDrivers = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
      d.phoneNumber.includes(searchDriver),
  );

  return (
    <div className="w-full max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
            <FiAlertCircle size={24} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
            Incident <span className="text-red-600">Queue</span>
          </h1>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
          Exception Management • {bookings.length} Unresolved Rejections
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Booking List */}
        <div className="lg:col-span-8 space-y-4">
          {bookings.length === 0 ? (
            <div className="p-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] text-center">
              <p className="font-mono text-slate-400 uppercase tracking-widest text-xs">
                Queue_Cleared: No_Action_Required
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking._id}
                onClick={() => setSelectedBooking(booking)}
                className={`group relative bg-white border-2 transition-all rounded-[24px] overflow-hidden ${
                  selectedBooking?._id === booking._id
                    ? "border-red-500 ring-4 ring-red-500/10 shadow-xl"
                    : "border-slate-100 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-1 rounded-md uppercase border border-red-100">
                          {booking.status}
                        </span>
                        <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-1 rounded-md uppercase border border-blue-100">
                          {booking.vehicleType}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ID: {booking._id.slice(-8)}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-800 uppercase mb-1">
                        {booking.userId?.name}
                      </h3>
                      <div className="flex items-center gap-2 text-slate-500 text-xs font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <FiMapPin className="text-red-400 shrink-0" />
                        <span className="truncate">
                          {booking.fromLocation.split(",")[0]}
                        </span>
                        <FiChevronRight className="text-slate-300" />
                        <span className="truncate">
                          {booking.toLocation.split(",")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Sidebar (On Card) */}
                    <div className="flex md:flex-col gap-2 justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          publicMutation.mutate(booking._id);
                        }}
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all"
                        title="Move to Public Pool"
                      >
                        <FiGlobe size={14} /> Public
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                          setAssignModalOpen(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all"
                      >
                        <FiUserPlus size={14} /> Reassign
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Context Sidebar (Detail View) */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl overflow-hidden relative">
              <FiAlertCircle
                size={120}
                className="absolute -right-8 -top-8 text-white/5 rotate-12"
              />
              <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-6">
                Resolution Sidebar
              </h4>

              {selectedBooking ? (
                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase">
                      Selected Subject
                    </p>
                    <p className="text-xl font-black italic truncate">
                      {selectedBooking.userId?.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {selectedBooking.phoneNumber}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[9px] font-black text-slate-500 uppercase mb-2">
                        Full Route Manifest
                      </p>
                      <p className="text-xs font-bold leading-relaxed">
                        {selectedBooking.fromLocation}
                      </p>
                      <div className="my-2 h-px bg-white/10" />
                      <p className="text-xs font-bold leading-relaxed text-red-400">
                        {selectedBooking.toLocation}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase">
                        Trip
                      </p>
                      <p className="text-xs font-bold capitalize">
                        {selectedBooking.tripType.replace("_", " ")}
                      </p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                      <p className="text-[9px] font-black text-slate-500 uppercase">
                        Vehicle
                      </p>
                      <p className="text-xs font-bold uppercase">
                        {selectedBooking.vehicleType}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  Select an incident from the queue to view full manifest and
                  telemetry data.
                </p>
              )}
            </div>

            {/* System Intelligence Box */}
            <div className="bg-white border-2 border-slate-100 rounded-[32px] p-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Protocol Advice
              </h4>
              <ul className="space-y-4 text-xs font-bold text-slate-600">
                <li className="flex gap-3">
                  <FiCheckCircle className="text-emerald-500 shrink-0" /> Mark
                  "Public" if no priority driver is found.
                </li>
                <li className="flex gap-3">
                  <FiCheckCircle className="text-blue-500 shrink-0" /> Manual
                  Assignment bypasses quoting system.
                </li>
                <li className="flex gap-3">
                  <FiCheckCircle className="text-red-500 shrink-0" /> Rejection
                  requires immediate resolution to avoid client churn.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ================= INDUSTRIAL ASSIGN DRIVER MODAL ================= */}
      {assignModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">
                  Override Protocol
                </p>
                <h2 className="text-2xl font-black text-slate-800 uppercase italic">
                  Assign_Operator
                </h2>
              </div>
              <button
                onClick={() => setAssignModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <FiX />
              </button>
            </div>

            <div className="p-8">
              <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by Operator Name or Phone..."
                  value={searchDriver}
                  onChange={(e) => setSearchDriver(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl text-sm font-bold focus:ring-4 ring-blue-500/10 transition-all outline-none"
                />
              </div>

              <div className="max-h-80 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver._id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`group p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                      selectedDriver?._id === driver._id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${
                        selectedDriver?._id === driver._id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {driver.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-slate-800 uppercase text-sm">
                        {driver.name}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {driver.phoneNumber}
                      </div>
                    </div>
                    {selectedDriver?._id === driver._id && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <FiCheckCircle size={14} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                disabled={!selectedDriver || assignMutation.isPending}
                onClick={() => handleAssignDriver(selectedBooking._id)}
                className="mt-8 w-full py-5 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98]"
              >
                {assignMutation.isPending
                  ? "INITIALIZING_ASSIGNMENT..."
                  : "Confirm Manual Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
