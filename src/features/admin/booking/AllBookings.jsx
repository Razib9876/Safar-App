// import { useState, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import {
//   FiEye,
//   FiTruck,
//   FiCalendar,
//   FiPhone,
//   FiX,
//   FiMail,
//   FiLoader,
//   FiUser,
//   FiMapPin,
//   FiActivity,
//   FiDownload,
//   FiTrash2,
//   FiCheck,
//   FiGlobe,
//   FiUserPlus,
// } from "react-icons/fi";
// import { toast } from "react-hot-toast"; // Assuming you use a toast library, otherwise use alert
// import Loading from "../../../components/Loading";

// const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// export default function AdminLogisticsMaster() {
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("all");

//   // ================= FETCH DATA =================
//   const {
//     data: bookings = [],
//     isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ["all-bookings"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/bookings");
//       return Array.isArray(res.data) ? res.data : res.data.data;
//     },
//   });

//   // ================= LOGIC =================
//   const filteredBookings = useMemo(() => {
//     if (statusFilter === "all") return bookings;
//     return bookings.filter((b) => b.status === statusFilter);
//   }, [bookings, statusFilter]);

//   const closeAllModals = () => {
//     setSelectedBooking(null);
//   };

//   const handleDownloadManifest = (id) => {
//     console.log(`Generating Manifest for: ${id}`);
//     // Future PDF logic here
//   };

//   // --- Footer Action Handlers ---
//   const handlePublic = async (id) => {
//     try {
//       await axiosSecure.patch(`/bookings/to-public/${id}`);
//       toast?.success("Booking moved to public pool");
//       refetch();
//       closeAllModals();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update status to public");
//     }
//   };

//   const handleAssign = async (id) => {
//     const driverId = prompt("Enter Driver ID:");
//     const amount = prompt("Enter Assignment Amount:");

//     if (!driverId || !amount) return;

//     try {
//       await axiosSecure.patch(`/bookings/to-assined-by-admin/${id}`, {
//         driverId,
//         amount: Number(amount),
//       });
//       toast?.success("Driver assigned successfully");
//       refetch();
//       closeAllModals();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to assign driver");
//     }
//   };

//   const handleCancel = async (id) => {
//     if (window.confirm("Are you sure you want to cancel this booking?")) {
//       try {
//         await axiosSecure.patch(`/bookings/${id}/cancel`, {
//           cancellationReason: "Cancelled by Admin",
//         });
//         toast?.success("Booking cancelled");
//         refetch();
//         closeAllModals();
//       } catch (err) {
//         console.error(err);
//         alert("Failed to cancel booking");
//       }
//     }
//   };

//   // --- Quote Action Handlers ---
//   const handleAcceptQuote = async (bookingId, quoteId) => {
//     // Note: Your controller 'confirmBookingWithDriver' uses /:id/confirm-booking/:quoteId
//     try {
//       await axiosSecure.patch(
//         `/bookings/${bookingId}/confirm-booking/${quoteId}`,
//       );
//       toast?.success("Quote accepted and booking confirmed");
//       refetch();
//       closeAllModals();
//     } catch (err) {
//       console.error(err);
//       alert("Failed to accept quote");
//     }
//   };

//   const handleRejectQuote = async (bookingId, quoteId) => {
//     try {
//       await axiosSecure.patch(
//         `/bookings/${bookingId}/quotes/${quoteId}/reject`,
//       );
//       toast?.success("Quote rejected");
//       refetch();
//       // Update selected booking view locally if needed
//       if (selectedBooking) {
//         const updatedQuotes = selectedBooking.driverQuote.filter(
//           (q) => q._id !== quoteId,
//         );
//         setSelectedBooking({ ...selectedBooking, driverQuote: updatedQuotes });
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to reject quote");
//     }
//   };

//   if (isLoading) return <Loading></Loading>;

//   return (
//     <div>
//       {/* Header & Filters */}
//       <div className="px-0 sm:px-6 mb-10">
//         <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-orange-500 shadow-xl border border-slate-800">
//               <FiGlobe size={28} />
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
//                 Global <span className="text-orange-600">Fleet Manager</span>
//               </h1>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
//                 Fleet_Overview • Syncing_{new Date().toLocaleDateString()}
//               </p>
//             </div>
//           </div>

//           <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
//             {["all", "pending", "confirmed", "paid"].map((status) => (
//               <button
//                 key={status}
//                 onClick={() => setStatusFilter(status)}
//                 className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
//                   statusFilter === status
//                     ? "bg-orange-600 text-white shadow-lg scale-105"
//                     : "text-slate-500 hover:text-orange-600"
//                 }`}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//       {/* ================= TABLE ================= */}
//       <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl">
//         <table className="min-w-full text-sm">
//           <thead className="bg-slate-50 border-b border-slate-200">
//             <tr>
//               <th className="p-3">Route</th>
//               <th className="p-3">Client</th>
//               <th className="p-3">Asset</th>
//               <th className="p-3">Driver</th>
//               <th className="p-3">Financials</th>
//               <th className="p-3">Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {filteredBookings.map((booking) => (
//               <tr
//                 key={booking._id}
//                 className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
//                 onClick={() => setSelectedBooking(booking)}
//               >
//                 <td className="p-5">
//                   <div className="flex flex-col">
//                     <span className="font-bold text-slate-800">
//                       {booking.fromLocation?.split(",")[0]} →{" "}
//                       {booking.toLocation?.split(",")[0]}
//                     </span>
//                     <span className="text-[10px] text-slate-400 font-medium">
//                       {booking.dateFrom
//                         ? new Date(booking.dateFrom).toLocaleDateString()
//                         : "N/A"}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="p-5">
//                   <div className="font-bold text-slate-700">
//                     {booking.userId?.name || "Unknown"}
//                   </div>
//                   <div className="text-[10px] text-slate-400">
//                     {booking.phoneNumber}
//                   </div>
//                 </td>
//                 <td className="p-5">
//                   <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-black uppercase">
//                     {booking.vehicleType}
//                   </span>
//                 </td>
//                 <td className="p-5">
//                   {booking.driverId ? (
//                     <div className="flex items-center gap-2">
//                       <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
//                       <span className="font-bold text-slate-700">
//                         {booking.driverId.name}
//                       </span>
//                     </div>
//                   ) : (
//                     <span className="text-slate-400 text-xs italic">
//                       Unassigned ({booking.driverQuote?.length || 0} Quotes)
//                     </span>
//                   )}
//                 </td>
//                 <td className="p-5">
//                   <div className="font-black text-slate-800">
//                     ${booking.totalAmount || "0"}
//                   </div>
//                   <div
//                     className={`text-[9px] uppercase font-bold ${
//                       booking.paymentStatus === "paid"
//                         ? "text-green-600"
//                         : "text-amber-600"
//                     }`}
//                   >
//                     {booking.paymentStatus}
//                   </div>
//                 </td>
//                 <td className="p-5 text-right">
//                   <span
//                     className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
//                       booking.status === "confirmed"
//                         ? "bg-green-100 text-green-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {booking.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* ================= MOBILE CARDS (Hidden on Desktop) ================= */}
//       <div className="grid grid-cols-1 gap-4 md:hidden">
//         {filteredBookings.map((booking) => (
//           <div
//             key={booking._id}
//             onClick={() => setSelectedBooking(booking)}
//             className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <span
//                   className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${booking.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
//                 >
//                   {booking.status}
//                 </span>
//                 <h3 className="font-black text-slate-800 mt-2">
//                   {booking.fromLocation?.split(",")[0]} →{" "}
//                   {booking.toLocation?.split(",")[0]}
//                 </h3>
//               </div>
//               <div className="text-right">
//                 <p className="font-black text-lg text-slate-900">
//                   ${booking.totalAmount || "0"}
//                 </p>
//                 <p
//                   className={`text-[10px] font-bold uppercase ${booking.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}
//                 >
//                   {booking.paymentStatus}
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
//               <div>
//                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
//                   Client
//                 </p>
//                 <p className="text-xs font-bold text-slate-700">
//                   {booking.userId?.name || "Unknown"}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
//                   Vehicle
//                 </p>
//                 <p className="text-xs font-bold text-slate-700 uppercase">
//                   {booking.vehicleType}
//                 </p>
//               </div>
//               <div className="col-span-2">
//                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
//                   Driver Status
//                 </p>
//                 {booking.driverId ? (
//                   <p className="text-xs font-bold text-green-600 flex items-center gap-1">
//                     <FiCheck size={12} /> {booking.driverId.name}
//                   </p>
//                 ) : (
//                   <p className="text-xs font-medium text-slate-400 italic">
//                     Unassigned ({booking.driverQuote?.length || 0} Quotes)
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* ================= MODAL ================= */}
//       {selectedBooking && (
//         <div
//           className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
//           onClick={closeAllModals}
//         >
//           <div
//             className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
//                   <FiActivity size={24} />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-black uppercase tracking-tight">
//                     Booking Manifest
//                   </h2>
//                   <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
//                     TXN: {selectedBooking._id}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={closeAllModals}
//                 className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
//               >
//                 <FiX />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-8 overflow-y-auto flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#fcfcfd]">
//               {/* Left Column */}
//               <div className="lg:col-span-4 space-y-6">
//                 <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//                   <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
//                     Customer Info
//                   </h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3">
//                       <FiUser className="text-slate-400" />
//                       <span className="font-bold">
//                         {selectedBooking.userId?.name}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <FiMail className="text-slate-400" />
//                       <span className="text-sm">
//                         {selectedBooking.userId?.email}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <FiPhone className="text-slate-400" />
//                       <span className="text-sm font-medium">
//                         {selectedBooking.phoneNumber}
//                       </span>
//                     </div>
//                   </div>
//                 </section>

//                 <section className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
//                   <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">
//                     Trip Specifications
//                   </h3>
//                   <div className="grid grid-cols-2 gap-3 mb-4">
//                     <div className="bg-white/10 p-3 rounded-xl">
//                       <p className="text-[8px] font-bold text-slate-400 uppercase">
//                         Trip Type
//                       </p>
//                       <p className="text-xs font-black capitalize">
//                         {selectedBooking.tripType?.replace("_", " ")}
//                       </p>
//                     </div>
//                     <div className="bg-white/10 p-3 rounded-xl">
//                       <p className="text-[8px] font-bold text-slate-400 uppercase">
//                         Vehicle
//                       </p>
//                       <p className="text-xs font-black uppercase">
//                         {selectedBooking.vehicleType}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
//                     <FiCalendar className="text-blue-400" />
//                     <div>
//                       <p className="text-sm font-black">
//                         {new Date(selectedBooking.dateFrom).toDateString()}
//                       </p>
//                       <p className="text-[10px] text-slate-400 uppercase font-bold">
//                         {selectedBooking.timeFrom} - {selectedBooking.timeTo}
//                       </p>
//                     </div>
//                   </div>
//                 </section>
//               </div>

//               {/* Right Column */}
//               <div className="lg:col-span-8 space-y-6">
//                 {selectedBooking.driverId ? (
//                   <div className="bg-green-50/50 p-6 rounded-[32px] border border-green-100 flex flex-col md:flex-row gap-6">
//                     <div className="flex-1 flex items-center gap-4">
//                       <img
//                         src={selectedBooking.driverId.photo}
//                         className="w-16 h-16 rounded-2xl object-cover border-2 border-white"
//                         alt="Driver"
//                       />
//                       <div>
//                         <p className="text-[10px] font-black text-green-700 uppercase mb-1">
//                           Assigned Driver
//                         </p>
//                         <p className="text-lg font-black">
//                           {selectedBooking.driverId.name}
//                         </p>
//                         <p className="text-xs font-bold text-green-600">
//                           {selectedBooking.driverId.phoneNumber}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex-1 bg-white p-4 rounded-2xl border border-green-100 flex items-center gap-3">
//                       <img
//                         src={selectedBooking.driverId.activeVehiclePhoto}
//                         className="w-12 h-12 rounded-lg object-cover"
//                         alt="Vehicle"
//                       />
//                       <div>
//                         <p className="text-[10px] font-black text-slate-400 uppercase">
//                           Active Unit
//                         </p>
//                         <p className="text-xs font-black uppercase">
//                           {selectedBooking.driverId.activeVehicle?.type} (
//                           {selectedBooking.driverId.activeVehicle?.model})
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] text-center">
//                     <FiTruck
//                       className="mx-auto text-slate-300 mb-2"
//                       size={24}
//                     />
//                     <p className="font-black text-slate-400 uppercase text-[10px]">
//                       Awaiting Assignment
//                     </p>
//                   </div>
//                 )}

//                 {/* Quotes Section */}
//                 <section>
//                   <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">
//                     Driver Quotes ({selectedBooking.driverQuote?.length || 0})
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {selectedBooking.driverQuote?.map((quote) => (
//                       <div
//                         key={quote._id}
//                         className={`p-4 rounded-2xl border-2 transition-all ${
//                           quote.status === "confirmed"
//                             ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
//                             : "border-slate-100 bg-white"
//                         }`}
//                       >
//                         <div className="flex justify-between items-center mb-4">
//                           <div className="flex items-center gap-3">
//                             <img
//                               src={quote.driverId.photo}
//                               className="w-10 h-10 rounded-full object-cover"
//                               alt=""
//                             />
//                             <div>
//                               <p className="text-xs font-black">
//                                 {quote.driverId.name}
//                               </p>
//                               <p className="text-[9px] text-slate-400 font-bold uppercase">
//                                 Rating: {quote.driverId.rating || "5.0"}
//                               </p>
//                             </div>
//                           </div>
//                           <p className="font-black text-blue-600 text-lg">
//                             ${quote.currentAmount}
//                           </p>
//                         </div>

//                         {quote.status !== "confirmed" && (
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() =>
//                                 handleAcceptQuote(
//                                   selectedBooking._id,
//                                   quote._id,
//                                 )
//                               }
//                               className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-green-700 transition-colors"
//                             >
//                               <FiCheck size={14} /> Accept
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleRejectQuote(
//                                   selectedBooking._id,
//                                   quote._id,
//                                 )
//                               }
//                               className="px-3 py-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
//                             >
//                               <FiTrash2 size={14} />
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </section>

//                 <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
//                   <div className="flex flex-col items-center">
//                     <div className="w-2 h-2 rounded-full bg-blue-600" />
//                     <div className="w-0.5 h-8 bg-slate-300 my-1" />
//                     <FiMapPin className="text-red-500" />
//                   </div>
//                   <div className="space-y-4">
//                     <p className="text-xs font-bold">
//                       <span className="text-slate-400 uppercase text-[10px] mr-2">
//                         From:
//                       </span>{" "}
//                       {selectedBooking.fromLocation}
//                     </p>
//                     <p className="text-xs font-bold">
//                       <span className="text-slate-400 uppercase text-[10px] mr-2">
//                         To:
//                       </span>{" "}
//                       {selectedBooking.toLocation}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="px-8 py-6 border-t bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
//               <div className="flex gap-6 w-full md:w-auto justify-around md:justify-start">
//                 <div>
//                   <p className="text-[9px] font-black text-slate-400 uppercase">
//                     Payment
//                   </p>
//                   <p className="text-xs font-black uppercase text-blue-600">
//                     {selectedBooking.paymentStatus}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-[9px] font-black text-slate-400 uppercase">
//                     Revenue
//                   </p>
//                   <p className="text-xs font-black">
//                     ${selectedBooking.totalAmount}
//                   </p>
//                 </div>
//               </div>

//               {/* Updated Action Buttons Group */}
//               <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center">
//                 <button
//                   onClick={() => handlePublic(selectedBooking._id)}
//                   className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
//                 >
//                   <FiGlobe /> Public
//                 </button>

//                 <button
//                   onClick={() => handleAssign(selectedBooking._id)}
//                   className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
//                 >
//                   <FiUserPlus /> Assign
//                 </button>

//                 <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

//                 <button
//                   onClick={() => handleDownloadManifest(selectedBooking._id)}
//                   className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all"
//                 >
//                   <FiDownload /> Manifest
//                 </button>

//                 <button
//                   onClick={() => handleCancel(selectedBooking._id)}
//                   className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
//                 >
//                   <FiX /> Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// // ____________________________uper all good but assign button not good__________________________________
// // ____________________________uper all good but assign button not good__________________________________
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../../services/axiosSecure";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Loading from "../../../components/Loading";
import { ArrowRight, Calendar, Clock } from "lucide-react";

// 24-hour to 12-hour AM/PM
const formatTime12Hour = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

export default function AdminLogisticsMaster() {
  const queryClient = useQueryClient();
  const [driverId, setDriverId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  // ================= FETCH DRIVER ID =================
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          const res = await axiosSecure.get(
            `/drivers/by-email?email=${encodeURIComponent(user.email)}`,
          );
          setDriverId(res.data.data?._id || null);
        } catch (err) {
          toast.error("Failed to fetch driver info");
        } finally {
          setAuthLoading(false);
        }
      } else {
        setAuthLoading(false);
        toast.error("Please login to see bookings");
      }
    });
    return () => unsubscribe();
  }, []);

  // ================= FETCH BOOKINGS =================
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["available-bookings", driverId],
    enabled: !!driverId, // only fetch if driverId exists
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/available-for-driver?driverId=${driverId}`,
      );
      return res.data.data;
    },
  });

  // ================= SEND / UPDATE OFFER =================
  const mutationSendOffer = useMutation({
    mutationFn: ({ bookingId, amount }) =>
      axiosSecure.post(`/bookings/${bookingId}/driver-quote`, {
        driverId,
        amount: Number(amount),
      }),
    onSuccess: () => {
      toast.success("Offer sent successfully");
      queryClient.invalidateQueries(["available-bookings", driverId]);
      setOfferModalOpen(false);
      setAmount("");
    },
    onError: () => {
      toast.error("Failed to send offer");
    },
  });

  const handleSendOffer = () => {
    if (!amount) return toast.error("Enter your amount");

    toast((t) => (
      <div>
        <p className="mb-2">Are you sure to send this offer?</p>
        <div className="flex gap-2 justify-end">
          <button
            className="bg-gray-300 px-3 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={() => {
              mutationSendOffer.mutate({
                bookingId: selectedBooking._id,
                amount,
              });
              toast.dismiss(t.id);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    ));
  };

  if (authLoading || isLoading) return <Loading></Loading>;

  // ================= HELPER: GET DRIVER QUOTE =================
  const getDriverQuote = (booking) => {
    if (!booking.driverQuote || booking.driverQuote.length === 0) return null;
    const quotes = booking.driverQuote.filter((dq) => dq.driverId === driverId);
    return quotes.length ? quotes[quotes.length - 1] : null;
  };

  // ================= UI =================
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Bookings</h1>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Rider</th>
              <th className="p-3">Trip</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">From → To</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Amount</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const driverQuote = getDriverQuote(booking);
              return (
                <tr key={booking._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{booking.userId?.name}</td>
                  <td className="p-3 capitalize">
                    {booking.tripType.replace("_", " ")}
                  </td>
                  <td className="p-3 uppercase">{booking.vehicleType}</td>
                  <td className="p-3">
                    {booking.fromLocation} → {booking.toLocation}
                  </td>
                  <td className="p-3">
                    {new Date(booking.dateFrom).toLocaleDateString()} |{" "}
                    {formatTime12Hour(booking.timeFrom)} →{" "}
                    {new Date(booking.dateTo).toLocaleDateString()} |{" "}
                    {formatTime12Hour(booking.timeTo)}
                  </td>
                  <td className="p-3">{driverQuote?.status || "-"}</td>
                  <td className="p-3">
                    {driverQuote ? (
                      <div className="flex items-center">
                        {/* Logic: If previousAmount is 0, this evaluates to false and hides the span.
          Only shows if previousAmount is 1 or higher.
      */}
                        {driverQuote.previousAmount > 0 && (
                          <span className="line-through text-gray-400 mr-2 text-xs">
                            {driverQuote.previousAmount}
                          </span>
                        )}

                        <span className="font-bold text-blue-600">
                          {driverQuote.currentAmount}
                        </span>
                        <span className="text-[10px] ml-1 text-gray-400 font-medium">
                          TK
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setOfferModalOpen(true);
                        setAmount(driverQuote?.currentAmount || "");
                      }}
                    >
                      {driverQuote ? "Update Offer" : "Send Offer"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE / TABLET CARDS ================= */}
      {/* <div className="lg:hidden space-y-4">
        {bookings.map((booking) => {
          const driverQuote = getDriverQuote(booking);
          return (
            <div
              key={booking._id}
              className="bg-white shadow rounded-xl p-4 border hover:shadow-lg"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium text-lg">
                  {booking.userId?.name}
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {driverQuote?.status || "-"}
                </span>
              </div>

              <div className="mt-2 text-sm">
                <p>
                  <strong>Trip:</strong> {booking.tripType.replace("_", " ")}
                </p>
                <p>
                  <strong>Vehicle:</strong> {booking.vehicleType.toUpperCase()}
                </p>
                <p>
                  <strong>Route:</strong> {booking.fromLocation} →{" "}
                  {booking.toLocation}
                </p>
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {new Date(booking.dateFrom).toLocaleDateString()} |{" "}
                  {formatTime12Hour(booking.timeFrom)} →{" "}
                  {new Date(booking.dateTo).toLocaleDateString()} |{" "}
                  {formatTime12Hour(booking.timeTo)}
                </p>

                <p>
                  <strong>Amount:</strong>{" "}
                  {driverQuote ? (
                    <>
                      {driverQuote.previousAmount && (
                        <span className="line-through mr-1">
                          {driverQuote.previousAmount}
                        </span>
                      )}
                      <span>{driverQuote.currentAmount}</span>
                    </>
                  ) : (
                    "-"
                  )}
                </p>
              </div>

              <div className="mt-4 text-right">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setOfferModalOpen(true);
                    setAmount(driverQuote?.currentAmount || "");
                  }}
                >
                  {driverQuote ? "Update Offer" : "Send Offer"}
                </button>
              </div>
            </div>
          );
        })}
      </div> */}
      {/* ================= MOBILE / TABLET CARDS ================= */}
      <div className="lg:hidden space-y-4 px-2">
        {bookings.map((booking) => {
          const driverQuote = getDriverQuote(booking);

          return (
            <div
              key={booking._id}
              className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5"
            >
              {/* Top Header: Name and Status */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                    {booking.userId?.name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-none">
                      {booking.userId?.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                      {booking.vehicleType} •{" "}
                      {booking.tripType.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                    driverQuote
                      ? "bg-green-50 text-green-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {driverQuote?.status || "New Request"}
                </span>
              </div>

              {/* Route visualization */}
              <div className="relative pl-7 space-y-4 mb-5 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-100">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-indigo-500 bg-white"></div>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {booking.fromLocation}
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-red-400 bg-white"></div>
                  <p className="text-xs text-gray-500 font-medium truncate">
                    {booking.toLocation}
                  </p>
                </div>
              </div>

              {/* Date and Time Row */}
              <div className="flex items-center gap-4 py-3 border-t border-b border-gray-50 mb-5">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600 font-semibold">
                    {new Date(booking.dateFrom).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600 font-semibold">
                    {formatTime12Hour(booking.timeFrom)}
                  </span>
                </div>
              </div>

              {/* Footer: Price and Action */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    My Bid
                  </p>
                  <div className="flex items-baseline gap-1">
                    {driverQuote ? (
                      <>
                        <span className="text-lg font-black text-indigo-600">
                          {driverQuote.currentAmount}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">
                          TK
                        </span>
                        {driverQuote.previousAmount > 0 && (
                          <span className="text-xs text-gray-300 line-through ml-1">
                            {driverQuote.previousAmount}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-300 italic">
                        No offer yet
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setOfferModalOpen(true);
                    setAmount(driverQuote?.currentAmount || "");
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    driverQuote
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  }`}
                >
                  {driverQuote ? "Edit Bid" : "Send Bid"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* ================= FIXED MODAL ================= */}
      {offerModalOpen && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOfferModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {getDriverQuote(selectedBooking) ? "Update Offer" : "Send Offer"}
            </h2>

            {/* Trip Details Summary */}
            <div className="space-y-2 text-sm mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p>
                <strong className="text-gray-700">Rider:</strong>{" "}
                {selectedBooking.userId?.name}
              </p>
              <p>
                <strong className="text-gray-700">Route:</strong>{" "}
                {selectedBooking.fromLocation} → {selectedBooking.toLocation}
              </p>
              <p>
                <strong className="text-gray-700">Date & Time:</strong>{" "}
                {new Date(selectedBooking.dateFrom).toLocaleDateString()}{" "}
                {formatTime12Hour(selectedBooking.timeFrom)} →{" "}
                {new Date(selectedBooking.dateTo).toLocaleDateString()}{" "}
                {formatTime12Hour(selectedBooking.timeTo)}
              </p>
            </div>

            {/* Amount Input with Up/Down Buttons & Zero Fix */}
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Your Demand (TK)
            </label>
            <div className="flex items-center gap-2 mb-4">
              {/* Minus Button */}
              <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-bold text-2xl transition-all border border-gray-300 active:scale-95"
                onClick={() => {
                  const current = Number(amount) || 0;
                  const newVal = Math.max(0, current - 100); // Stop at 0
                  setAmount(newVal.toString());
                }}
              >
                −
              </button>

              <input
                type="number"
                min="0"
                placeholder="0"
                onKeyDown={(e) =>
                  ["-", "e", "E"].includes(e.key) && e.preventDefault()
                }
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setAmount("");
                  } else {
                    // FIX: Convert to Number then String to strip "0500" leading zeros
                    const numericVal = Number(val);
                    if (numericVal >= 0) {
                      setAmount(numericVal.toString());
                    }
                  }
                }}
                className="border-2 border-gray-300 p-2 flex-grow text-center rounded-lg text-lg font-semibold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              />

              {/* Plus Button */}
              <button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg font-bold text-2xl transition-all border border-gray-300 active:scale-95"
                onClick={() => {
                  const current = Number(amount) || 0;
                  const newVal = current + 100;
                  setAmount(newVal.toString());
                }}
              >
                +
              </button>
            </div>

            {/* Admin Commission Calculation */}
            {amount && Number(amount) > 0 && (
              <div className="bg-blue-50 p-3 rounded-lg mb-6 border border-blue-100">
                <p className="text-sm text-blue-800 flex justify-between">
                  <span>Admin Commission (5%):</span>
                  <span className="font-bold">
                    {(Number(amount) * 0.05).toFixed(2)} TK
                  </span>
                </p>
                <p className="text-sm text-gray-800 mt-1 flex justify-between border-t border-blue-200 pt-1 font-semibold">
                  <span>Total with Commission:</span>
                  <span className="text-red-600">
                    {(Number(amount) * 1.05).toFixed(2)} TK
                  </span>
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                onClick={() => setOfferModalOpen(false)}
              >
                Close
              </button>

              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md active:scale-95"
                onClick={handleSendOffer}
              >
                {getDriverQuote(selectedBooking)
                  ? "Update Offer"
                  : "Send Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// _________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________
// _________________________________________________________________________________________________________________
