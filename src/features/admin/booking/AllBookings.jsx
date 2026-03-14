import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FiEye,
  FiTruck,
  FiCalendar,
  FiPhone,
  FiX,
  FiMail,
  FiLoader,
  FiUser,
  FiMapPin,
  FiActivity,
  FiDownload,
  FiTrash2,
  FiCheck,
  FiGlobe,
  FiUserPlus,
} from "react-icons/fi";
import { toast } from "react-hot-toast"; // Assuming you use a toast library, otherwise use alert

const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export default function AdminLogisticsMaster() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // ================= FETCH DATA =================
  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/bookings");
      return Array.isArray(res.data) ? res.data : res.data.data;
    },
  });

  // ================= LOGIC =================
  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  const closeAllModals = () => {
    setSelectedBooking(null);
  };

  const handleDownloadManifest = (id) => {
    console.log(`Generating Manifest for: ${id}`);
    // Future PDF logic here
  };

  // --- Footer Action Handlers ---
  const handlePublic = async (id) => {
    try {
      await axiosSecure.patch(`/bookings/to-public/${id}`);
      toast?.success("Booking moved to public pool");
      refetch();
      closeAllModals();
    } catch (err) {
      console.error(err);
      alert("Failed to update status to public");
    }
  };

  const handleAssign = async (id) => {
    const driverId = prompt("Enter Driver ID:");
    const amount = prompt("Enter Assignment Amount:");

    if (!driverId || !amount) return;

    try {
      await axiosSecure.patch(`/bookings/to-assined-by-admin/${id}`, {
        driverId,
        amount: Number(amount),
      });
      toast?.success("Driver assigned successfully");
      refetch();
      closeAllModals();
    } catch (err) {
      console.error(err);
      alert("Failed to assign driver");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axiosSecure.patch(`/bookings/${id}/cancel`, {
          cancellationReason: "Cancelled by Admin",
        });
        toast?.success("Booking cancelled");
        refetch();
        closeAllModals();
      } catch (err) {
        console.error(err);
        alert("Failed to cancel booking");
      }
    }
  };

  // --- Quote Action Handlers ---
  const handleAcceptQuote = async (bookingId, quoteId) => {
    // Note: Your controller 'confirmBookingWithDriver' uses /:id/confirm-booking/:quoteId
    try {
      await axiosSecure.patch(
        `/bookings/${bookingId}/confirm-booking/${quoteId}`,
      );
      toast?.success("Quote accepted and booking confirmed");
      refetch();
      closeAllModals();
    } catch (err) {
      console.error(err);
      alert("Failed to accept quote");
    }
  };

  const handleRejectQuote = async (bookingId, quoteId) => {
    try {
      await axiosSecure.patch(
        `/bookings/${bookingId}/quotes/${quoteId}/reject`,
      );
      toast?.success("Quote rejected");
      refetch();
      // Update selected booking view locally if needed
      if (selectedBooking) {
        const updatedQuotes = selectedBooking.driverQuote.filter(
          (q) => q._id !== quoteId,
        );
        setSelectedBooking({ ...selectedBooking, driverQuote: updatedQuotes });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reject quote");
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <FiLoader className="text-4xl text-blue-600 animate-spin" />
        <p className="font-bold text-slate-500 animate-pulse">
          Syncing Fleet Data...
        </p>
      </div>
    );

  return (
    <div>
      {/* Header & Filters */}
      <div className="px-0 sm:px-6 mb-10">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-orange-500 shadow-xl border border-slate-800">
              <FiGlobe size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                Global <span className="text-orange-600">Fleet Manager</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
                Fleet_Overview • Syncing_{new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Industrial Segmented Control */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            {["all", "pending", "confirmed", "paid"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  statusFilter === status
                    ? "bg-orange-600 text-white shadow-lg scale-105"
                    : "text-slate-500 hover:text-orange-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* ================= TABLE ================= */}
      <div className="hidden md:block overflow-x-auto bg-white shadow-sm rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
                Route
              </th>
              <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
                Client
              </th>
              <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
                Asset
              </th>
              <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
                Driver
              </th>
              <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
                Financials
              </th>
              <th className="p-5 text-right font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.map((booking) => (
              <tr
                key={booking._id}
                className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                onClick={() => setSelectedBooking(booking)}
              >
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">
                      {booking.fromLocation?.split(",")[0]} →{" "}
                      {booking.toLocation?.split(",")[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {booking.dateFrom
                        ? new Date(booking.dateFrom).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="font-bold text-slate-700">
                    {booking.userId?.name || "Unknown"}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {booking.phoneNumber}
                  </div>
                </td>
                <td className="p-5">
                  <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-black uppercase">
                    {booking.vehicleType}
                  </span>
                </td>
                <td className="p-5">
                  {booking.driverId ? (
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="font-bold text-slate-700">
                        {booking.driverId.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs italic">
                      Unassigned ({booking.driverQuote?.length || 0} Quotes)
                    </span>
                  )}
                </td>
                <td className="p-5">
                  <div className="font-black text-slate-800">
                    ${booking.totalAmount || "0"}
                  </div>
                  <div
                    className={`text-[9px] uppercase font-bold ${
                      booking.paymentStatus === "paid"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {booking.paymentStatus}
                  </div>
                </td>
                <td className="p-5 text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ================= MOBILE CARDS (Hidden on Desktop) ================= */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            onClick={() => setSelectedBooking(booking)}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <span
                  className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${booking.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {booking.status}
                </span>
                <h3 className="font-black text-slate-800 mt-2">
                  {booking.fromLocation?.split(",")[0]} →{" "}
                  {booking.toLocation?.split(",")[0]}
                </h3>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-slate-900">
                  ${booking.totalAmount || "0"}
                </p>
                <p
                  className={`text-[10px] font-bold uppercase ${booking.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}
                >
                  {booking.paymentStatus}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Client
                </p>
                <p className="text-xs font-bold text-slate-700">
                  {booking.userId?.name || "Unknown"}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Vehicle
                </p>
                <p className="text-xs font-bold text-slate-700 uppercase">
                  {booking.vehicleType}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Driver Status
                </p>
                {booking.driverId ? (
                  <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <FiCheck size={12} /> {booking.driverId.name}
                  </p>
                ) : (
                  <p className="text-xs font-medium text-slate-400 italic">
                    Unassigned ({booking.driverQuote?.length || 0} Quotes)
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* ================= MODAL ================= */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={closeAllModals}
        >
          <div
            className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                  <FiActivity size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight">
                    Booking Manifest
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                    TXN: {selectedBooking._id}
                  </p>
                </div>
              </div>
              <button
                onClick={closeAllModals}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
              >
                <FiX />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#fcfcfd]">
              {/* Left Column */}
              <div className="lg:col-span-4 space-y-6">
                <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
                    Customer Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiUser className="text-slate-400" />
                      <span className="font-bold">
                        {selectedBooking.userId?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiMail className="text-slate-400" />
                      <span className="text-sm">
                        {selectedBooking.userId?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiPhone className="text-slate-400" />
                      <span className="text-sm font-medium">
                        {selectedBooking.phoneNumber}
                      </span>
                    </div>
                  </div>
                </section>

                <section className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">
                    Trip Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/10 p-3 rounded-xl">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        Trip Type
                      </p>
                      <p className="text-xs font-black capitalize">
                        {selectedBooking.tripType?.replace("_", " ")}
                      </p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-xl">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">
                        Vehicle
                      </p>
                      <p className="text-xs font-black uppercase">
                        {selectedBooking.vehicleType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <FiCalendar className="text-blue-400" />
                    <div>
                      <p className="text-sm font-black">
                        {new Date(selectedBooking.dateFrom).toDateString()}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">
                        {selectedBooking.timeFrom} - {selectedBooking.timeTo}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-8 space-y-6">
                {selectedBooking.driverId ? (
                  <div className="bg-green-50/50 p-6 rounded-[32px] border border-green-100 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 flex items-center gap-4">
                      <img
                        src={selectedBooking.driverId.photo}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white"
                        alt="Driver"
                      />
                      <div>
                        <p className="text-[10px] font-black text-green-700 uppercase mb-1">
                          Assigned Driver
                        </p>
                        <p className="text-lg font-black">
                          {selectedBooking.driverId.name}
                        </p>
                        <p className="text-xs font-bold text-green-600">
                          {selectedBooking.driverId.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-2xl border border-green-100 flex items-center gap-3">
                      <img
                        src={selectedBooking.driverId.activeVehiclePhoto}
                        className="w-12 h-12 rounded-lg object-cover"
                        alt="Vehicle"
                      />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">
                          Active Unit
                        </p>
                        <p className="text-xs font-black uppercase">
                          {selectedBooking.driverId.activeVehicle?.type} (
                          {selectedBooking.driverId.activeVehicle?.model})
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] text-center">
                    <FiTruck
                      className="mx-auto text-slate-300 mb-2"
                      size={24}
                    />
                    <p className="font-black text-slate-400 uppercase text-[10px]">
                      Awaiting Assignment
                    </p>
                  </div>
                )}

                {/* Quotes Section */}
                <section>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
                    Driver Quotes ({selectedBooking.driverQuote?.length || 0})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedBooking.driverQuote?.map((quote) => (
                      <div
                        key={quote._id}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          quote.status === "confirmed"
                            ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
                            : "border-slate-100 bg-white"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={quote.driverId.photo}
                              className="w-10 h-10 rounded-full object-cover"
                              alt=""
                            />
                            <div>
                              <p className="text-xs font-black">
                                {quote.driverId.name}
                              </p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase">
                                Rating: {quote.driverId.rating || "5.0"}
                              </p>
                            </div>
                          </div>
                          <p className="font-black text-blue-600 text-lg">
                            ${quote.currentAmount}
                          </p>
                        </div>

                        {quote.status !== "confirmed" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleAcceptQuote(
                                  selectedBooking._id,
                                  quote._id,
                                )
                              }
                              className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-green-700 transition-colors"
                            >
                              <FiCheck size={14} /> Accept
                            </button>
                            <button
                              onClick={() =>
                                handleRejectQuote(
                                  selectedBooking._id,
                                  quote._id,
                                )
                              }
                              className="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <div className="w-0.5 h-8 bg-slate-300 my-1" />
                    <FiMapPin className="text-red-500" />
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold">
                      <span className="text-slate-400 uppercase text-[10px] mr-2">
                        From:
                      </span>{" "}
                      {selectedBooking.fromLocation}
                    </p>
                    <p className="text-xs font-bold">
                      <span className="text-slate-400 uppercase text-[10px] mr-2">
                        To:
                      </span>{" "}
                      {selectedBooking.toLocation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex gap-6 w-full md:w-auto justify-around md:justify-start">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Payment
                  </p>
                  <p className="text-xs font-black uppercase text-blue-600">
                    {selectedBooking.paymentStatus}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Revenue
                  </p>
                  <p className="text-xs font-black">
                    ${selectedBooking.totalAmount}
                  </p>
                </div>
              </div>

              {/* Updated Action Buttons Group */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center">
                <button
                  onClick={() => handlePublic(selectedBooking._id)}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                >
                  <FiGlobe /> Public
                </button>

                <button
                  onClick={() => handleAssign(selectedBooking._id)}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                >
                  <FiUserPlus /> Assign
                </button>

                <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

                <button
                  onClick={() => handleDownloadManifest(selectedBooking._id)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all"
                >
                  <FiDownload /> Manifest
                </button>

                <button
                  onClick={() => handleCancel(selectedBooking._id)}
                  className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                >
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ____________________________uper all good but assign button not good__________________________________
// ____________________________uper all good but assign button not good__________________________________
