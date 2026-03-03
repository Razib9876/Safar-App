// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   FiMoreVertical,
//   FiEye,
//   FiXCircle,
//   FiClock,
//   FiLock,
//   FiArrowLeft,
//   FiUser,
//   FiTruck,
//   FiMapPin,
//   FiCalendar,
//   FiDollarSign,
//   FiPhone,
//   FiMail,
// } from "react-icons/fi";

// const fetchBookings = async () => {
//   const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`);
//   return res.data.data;
// };

// export default function AdminBookings() {
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);

//   const { data: bookings = [], isLoading } = useQuery({
//     queryKey: ["admin-bookings"],
//     queryFn: fetchBookings,
//   });

//   if (isLoading)
//     return <div className="p-6 text-center">Loading bookings...</div>;

//   const handleAction = (type, booking) => {
//     toast.success(`${type} updated for ${booking.userId?.name}`);
//     setOpenDropdown(null);
//   };

//   // const handleAction = async (actionType, booking) => {
//   //   console.log(
//   //     `Action Triggered: ${actionType} for Booking ID: ${booking._id}`,
//   //   );

//   //   // ১. ইউজারকে একটি কনফার্মেশন প্রম্পট দেখানো (Optional but professional)
//   //   const confirmAction = window.confirm(
//   //     `Are you sure you want to set this trip to ${actionType}?`,
//   //   );
//   //   if (!confirmAction) return;

//   //   try {
//   //     // ২. এখানে আপনার API কল হবে (উদাহরণস্বরূপ)
//   //     // await axios.patch(`/api/bookings/${booking._id}`, { status: actionType });

//   //     alert(`Success: Trip is now ${actionType}`);

//   //     // ৩. কাজ শেষ হলে মোডাল বন্ধ করা অথবা স্টেট আপডেট করা
//   //     setSelectedBooking(null);

//   //     // ৪. ডাটা রিফ্রেশ করার ফাংশন থাকলে সেটি কল করুন
//   //     // fetchBookings();
//   //   } catch (error) {
//   //     console.error("Error updating booking:", error);
//   //     alert("Failed to update status. Please try again.");
//   //   }
//   // };
//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Bookings</h1>

//       {/* ================= DESKTOP TABLE ================= */}
//       <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-3">User</th>
//               <th className="p-3">Trip</th>
//               <th className="p-3">Vehicle</th>
//               <th className="p-3">From → To</th>
//               <th className="p-3">Date</th>
//               <th className="p-3">Status</th>
//               <th className="p-3 text-right">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {bookings.map((booking) => (
//               <tr
//                 key={booking._id}
//                 className="border-t hover:bg-gray-50 cursor-pointer"
//                 onClick={() => setSelectedBooking(booking)}
//               >
//                 <td className="p-3">
//                   <div className="font-medium">{booking.userId?.name}</div>
//                   <div className="text-gray-500 text-xs">
//                     {booking.userId?.email}
//                   </div>
//                 </td>

//                 <td className="p-3 capitalize">
//                   {booking.tripType.replace("_", " ")}
//                 </td>

//                 <td className="p-3 uppercase">{booking.vehicleType}</td>

//                 <td className="p-3">
//                   {booking.fromLocation} → {booking.toLocation}
//                 </td>

//                 <td className="p-3">
//                   {new Date(booking.dateFrom).toLocaleDateString()}
//                 </td>

//                 <td className="p-3">
//                   <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
//                     {booking.status}
//                   </span>
//                 </td>

//                 {/* ACTION DROPDOWN */}
//                 <td
//                   className="p-3 text-right relative"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     onClick={() =>
//                       setOpenDropdown(
//                         openDropdown === booking._id ? null : booking._id,
//                       )
//                     }
//                   >
//                     <FiMoreVertical />
//                   </button>

//                   {openDropdown === booking._id && (
//                     <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
//                       <button
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
//                         onClick={() => handleAction("Public", booking)}
//                       >
//                         <FiEye /> Public
//                       </button>
//                       <button
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
//                         onClick={() => handleAction("Private", booking)}
//                       >
//                         <FiLock /> Private
//                       </button>

//                       <button
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
//                         onClick={() => handleAction("Hang On", booking)}
//                       >
//                         <FiClock /> Hang On
//                       </button>

//                       <button
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 w-full"
//                         onClick={() => handleAction("Cancel", booking)}
//                       >
//                         <FiXCircle /> Cancel
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ================= MOBILE CARD VIEW ================= */}
//       <div className="lg:hidden space-y-4">
//         {bookings.map((booking) => (
//           <div
//             key={booking._id}
//             className="bg-white p-4 rounded-xl shadow cursor-pointer"
//             onClick={() => setSelectedBooking(booking)}
//           >
//             <div className="flex justify-between">
//               <div>
//                 <div className="font-semibold">{booking.userId?.name}</div>
//                 <div className="text-sm text-gray-500">
//                   {booking.vehicleType.toUpperCase()}
//                 </div>
//               </div>

//               <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
//                 {booking.status}
//               </span>
//             </div>

//             <div className="mt-2 text-sm text-gray-600">
//               {booking.fromLocation} → {booking.toLocation}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ================= MODAL ================= */}
//       {/* {selectedBooking && (
//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//           onClick={() => setSelectedBooking(null)} // close modal on outside click
//         >
//           <div
//             className="bg-white w-full max-w-lg rounded-xl p-6 relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setSelectedBooking(null)}
//               className="absolute top-3 right-3 text-gray-500"
//             >
//               ✕
//             </button>

//             <h2 className="text-xl font-bold mb-4">Booking Details</h2>

//             <div className="space-y-2 text-sm">
//               <p>
//                 <strong>User:</strong> {selectedBooking.userId?.name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {selectedBooking.userId?.email}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {selectedBooking.phoneNumber}
//               </p>
//               <p>
//                 <strong>Trip:</strong> {selectedBooking.tripType}
//               </p>
//               <p>
//                 <strong>Vehicle:</strong> {selectedBooking.vehicleType}
//               </p>
//               <p>
//                 <strong>From:</strong> {selectedBooking.fromLocation}
//               </p>
//               <p>
//                 <strong>To:</strong> {selectedBooking.toLocation}
//               </p>
//               <p>
//                 <strong>Status:</strong> {selectedBooking.status}
//               </p>
//               <p>
//                 <strong>Payment:</strong> {selectedBooking.paymentStatus}
//               </p>
//             </div>

//             <div className="mt-6 flex gap-3">
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg"
//                 onClick={() => handleAction("Public", selectedBooking)}
//               >
//                 Public
//               </button>
//               <button
//                 className="bg-gray-700 text-white px-4 py-2 rounded-lg"
//                 onClick={() => handleAction("Private", selectedBooking)}
//               >
//                 Private
//               </button>

//               <button
//                 className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
//                 onClick={() => handleAction("Hang On", selectedBooking)}
//               >
//                 Hang On
//               </button>

//               <button
//                 className="bg-red-500 text-white px-4 py-2 rounded-lg"
//                 onClick={() => handleAction("Cancel", selectedBooking)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}

//       {/* ================= MODAL ================= */}
//       {/* ================= INDUSTRIAL MODAL ================= */}
//       {selectedBooking && (
//         <>
//           {/* --- Full Screen Image Preview Overlay --- */}
//           {selectedBooking.viewingImage && (
//             <div className="fixed inset-0 bg-black/95 z-[120] flex flex-col items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
//               <button
//                 onClick={() =>
//                   setSelectedBooking({ ...selectedBooking, viewingImage: null })
//                 }
//                 className="absolute top-10 left-10 flex items-center gap-2 text-white bg-white/10 border border-white/20 px-6 py-3 rounded-full hover:bg-white/20 transition-all font-black tracking-widest text-xs"
//               >
//                 <FiArrowLeft className="text-lg" /> CLOSE PREVIEW
//               </button>
//               <img
//                 src={selectedBooking.viewingImage}
//                 className="max-w-full max-h-[80vh] rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] object-contain"
//                 alt="High Res View"
//               />
//             </div>
//           )}

//           <div
//             className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-2 sm:p-4 font-sans"
//             onClick={() => setSelectedBooking(null)}
//           >
//             <div
//               className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* --- Header: Status & ID --- */}
//               <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
//                 <div className="flex items-center gap-4">
//                   <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100">
//                     <FiTruck className="text-xl" />
//                   </div>
//                   <div>
//                     <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
//                       BOOKING{" "}
//                       <span className="text-blue-600">
//                         #{selectedBooking._id.slice(-6).toUpperCase()}
//                       </span>
//                     </h2>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px] mt-1">
//                       Industrial Logistics Management
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setSelectedBooking(null)}
//                   className="group w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-200 hover:bg-rose-500 hover:border-rose-500 transition-all duration-300"
//                 >
//                   <span className="text-gray-400 group-hover:text-white font-bold text-xl">
//                     ✕
//                   </span>
//                 </button>
//               </div>

//               {/* --- Scrollable Body --- */}
//               <div className="p-8 overflow-y-auto space-y-10 flex-grow scrollbar-hide">
//                 {/* Grid Container */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                   {/* Left Column: Client & Schedule */}
//                   <div className="lg:col-span-1 space-y-8">
//                     {/* Client Info Card */}
//                     <section>
//                       <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
//                         <FiUser /> Customer Information
//                       </h3>
//                       <div className="bg-slate-50 p-5 rounded-[25px] border border-slate-100 space-y-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
//                             {selectedBooking.userId?.name?.charAt(0)}
//                           </div>
//                           <div>
//                             <p className="text-sm font-black text-slate-800">
//                               {selectedBooking.userId?.name}
//                             </p>
//                             <p className="text-[10px] font-medium text-slate-500">
//                               {selectedBooking.userId?.email}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="pt-3 border-t border-slate-200 space-y-2">
//                           <div className="flex items-center justify-between text-xs">
//                             <span className="text-slate-400">Phone:</span>
//                             <span className="font-bold text-slate-700">
//                               {selectedBooking.phoneNumber}
//                             </span>
//                           </div>
//                           <div className="flex items-center justify-between text-xs">
//                             <span className="text-slate-400">Payment:</span>
//                             <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 font-black text-[9px] uppercase">
//                               {selectedBooking.paymentStatus}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </section>

//                     {/* Schedule Info Card */}
//                     <section>
//                       <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
//                         <FiCalendar /> Trip Schedule
//                       </h3>
//                       <div className="bg-amber-50/50 p-5 rounded-[25px] border border-amber-100 space-y-3 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-amber-700/60 font-bold uppercase text-[10px]">
//                             Date:
//                           </span>
//                           <span className="font-black text-slate-800">
//                             {new Date(selectedBooking.dateFrom).toDateString()}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-amber-700/60 font-bold uppercase text-[10px]">
//                             Time:
//                           </span>
//                           <span className="font-black text-slate-800">
//                             {selectedBooking.timeFrom}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-amber-700/60 font-bold uppercase text-[10px]">
//                             Service:
//                           </span>
//                           <span className="font-black text-slate-800 uppercase tracking-tighter italic">
//                             {selectedBooking.tripType?.replace("_", " ")}
//                           </span>
//                         </div>
//                       </div>
//                     </section>
//                   </div>

//                   {/* Middle & Right Column: Logistics Data */}
//                   <div className="lg:col-span-2 space-y-8">
//                     {/* Route Section */}
//                     <section className="bg-slate-900 text-white p-8 rounded-[35px] relative overflow-hidden group shadow-2xl">
//                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
//                       <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
//                         <div className="flex-1 text-center md:text-left">
//                           <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2">
//                             PICKUP
//                           </p>
//                           <h4 className="text-xl font-bold leading-tight">
//                             {selectedBooking.fromLocation}
//                           </h4>
//                         </div>
//                         <div className="flex flex-col items-center px-4">
//                           <div className="w-12 h-1 border-t-2 border-dashed border-slate-600"></div>
//                           <FiMapPin className="text-blue-500 my-2 text-xl" />
//                           <div className="w-12 h-1 border-t-2 border-dashed border-slate-600"></div>
//                         </div>
//                         <div className="flex-1 text-center md:text-right">
//                           <p className="text-rose-400 font-black text-[10px] uppercase tracking-widest mb-2">
//                             DESTINATION
//                           </p>
//                           <h4 className="text-xl font-bold leading-tight">
//                             {selectedBooking.toLocation}
//                           </h4>
//                         </div>
//                       </div>
//                     </section>

//                     {/* Assigned Driver (Professional Layout) */}
//                     {selectedBooking.driverId ? (
//                       <section className="bg-white border-2 border-slate-100 p-6 rounded-[35px] flex flex-col md:flex-row items-center gap-8 shadow-sm">
//                         <div className="relative">
//                           <img
//                             src={selectedBooking.driverId.photo}
//                             onClick={() =>
//                               setSelectedBooking({
//                                 ...selectedBooking,
//                                 viewingImage: selectedBooking.driverId.photo,
//                               })
//                             }
//                             className="w-28 h-28 rounded-[30px] object-cover border-4 border-slate-50 cursor-pointer hover:rotate-3 transition-transform duration-500 shadow-xl"
//                             alt="Driver"
//                           />
//                           <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
//                         </div>

//                         <div className="flex-grow text-center md:text-left">
//                           <h4 className="text-xl font-black text-slate-800">
//                             {selectedBooking.driverId.name}
//                           </h4>
//                           <p className="text-xs font-bold text-blue-600 uppercase mb-4 tracking-tighter">
//                             Verified Industrial Partner
//                           </p>
//                           <div className="grid grid-cols-2 gap-4">
//                             <div className="bg-slate-50 p-3 rounded-2xl">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase">
//                                 Vehicle
//                               </p>
//                               <p className="text-xs font-black text-slate-700 uppercase">
//                                 {selectedBooking.driverId.activeVehicle?.type}
//                               </p>
//                             </div>
//                             <div className="bg-slate-50 p-3 rounded-2xl">
//                               <p className="text-[9px] font-bold text-slate-400 uppercase">
//                                 Reg Number
//                               </p>
//                               <p className="text-xs font-black text-slate-700 uppercase">
//                                 {
//                                   selectedBooking.driverId.activeVehicle
//                                     ?.registrationNumber
//                                 }
//                               </p>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex flex-col gap-2 w-full md:w-auto">
//                           <button className="p-4 bg-slate-100 rounded-2xl hover:bg-blue-100 hover:text-blue-600 transition-colors">
//                             <FiPhone />
//                           </button>
//                           <button
//                             onClick={() =>
//                               setSelectedBooking({
//                                 ...selectedBooking,
//                                 viewingImage:
//                                   selectedBooking.driverId.activeVehiclePhoto,
//                               })
//                             }
//                             className="p-4 bg-slate-100 rounded-2xl hover:bg-green-100 hover:text-green-600 transition-colors"
//                           >
//                             <FiTruck />
//                           </button>
//                         </div>
//                       </section>
//                     ) : (
//                       <div className="p-8 border-2 border-dashed border-slate-200 rounded-[35px] text-center italic text-slate-400 text-sm">
//                         Waiting for driver assignment...
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Bottom Table: Bidding History */}
//                 <section className="bg-white border border-slate-100 rounded-[35px] overflow-hidden shadow-inner">
//                   <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
//                     <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
//                       Driver Bidding Logs
//                     </h3>
//                     <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
//                       {selectedBooking.driverQuote?.length || 0} QUOTES
//                     </span>
//                   </div>
//                   <div className="overflow-x-auto p-4">
//                     <table className="w-full text-left border-separate border-spacing-y-2">
//                       <thead>
//                         <tr className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
//                           <th className="px-6 py-2">Profile</th>
//                           <th className="px-6 py-2">Amount</th>
//                           <th className="px-6 py-2 text-center">Status</th>
//                           <th className="px-6 py-2 text-right">Timestamp</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {selectedBooking.driverQuote?.map((quote, idx) => (
//                           <tr
//                             key={idx}
//                             className="bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group"
//                           >
//                             <td className="px-6 py-4 rounded-l-2xl">
//                               <div className="flex items-center gap-3">
//                                 <img
//                                   src={quote.driverId?.photo}
//                                   onClick={() =>
//                                     setSelectedBooking({
//                                       ...selectedBooking,
//                                       viewingImage: quote.driverId?.photo,
//                                     })
//                                   }
//                                   className="w-10 h-10 rounded-xl object-cover cursor-pointer group-hover:scale-110 transition-transform"
//                                   alt="Bidder"
//                                 />
//                                 <p className="text-xs font-black text-slate-800">
//                                   {quote.driverId?.name}
//                                 </p>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 font-black text-green-600 text-sm">
//                               {quote.currentAmount} TK
//                             </td>
//                             <td className="px-6 py-4 text-center">
//                               <span
//                                 className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${quote.status === "confirmed" ? "bg-green-600 text-white shadow-lg shadow-green-100" : "bg-slate-200 text-slate-500"}`}
//                               >
//                                 {quote.status}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 rounded-r-2xl">
//                               {new Date(quote.createdAt).toLocaleString()}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </section>
//               </div>

//               {/* --- Action Footer (Boss Level Buttons) --- */}
//               {/* --- Action Footer (Industrial Design) --- */}
//               {/* --- Action Footer (Industrial Design) --- */}
//               <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/80 flex flex-wrap gap-4 justify-center sm:justify-end">
//                 {/* Public Button */}
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation(); // মোডাল যাতে বন্ধ না হয়
//                     handleAction("Public", selectedBooking);
//                     setSelectedBooking(null); // অ্যাকশন শেষে মোডাল বন্ধ
//                   }}
//                   className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[22px] text-[11px] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all duration-200"
//                 >
//                   <FiEye className="text-sm group-hover:scale-125 transition-transform" />
//                   PUBLISH TO PUBLIC
//                 </button>

//                 {/* Private Button */}
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleAction("Private", selectedBooking);
//                     setSelectedBooking(null);
//                   }}
//                   className="group flex items-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-[22px] text-[11px] font-black shadow-xl shadow-slate-300 hover:bg-black hover:-translate-y-1 active:scale-95 transition-all duration-200"
//                 >
//                   <FiLock className="text-sm group-hover:rotate-12 transition-transform" />
//                   SET AS PRIVATE
//                 </button>

//                 {/* Hang On Button */}
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleAction("Hang On", selectedBooking);
//                     setSelectedBooking(null);
//                   }}
//                   className="group flex items-center gap-3 px-8 py-4 bg-amber-500 text-white rounded-[22px] text-[11px] font-black shadow-xl shadow-amber-200 hover:bg-amber-600 hover:-translate-y-1 active:scale-95 transition-all duration-200"
//                 >
//                   <FiClock className="text-sm group-hover:animate-spin-slow" />
//                   PUT ON HOLD
//                 </button>

//                 {/* Cancel Button */}
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleAction("Cancel", selectedBooking);
//                     setSelectedBooking(null);
//                   }}
//                   className="group flex items-center gap-3 px-8 py-4 bg-rose-500 text-white rounded-[22px] text-[11px] font-black shadow-xl shadow-rose-200 hover:bg-rose-600 hover:-translate-y-1 active:scale-95 transition-all duration-200"
//                 >
//                   <FiXCircle className="text-sm group-hover:shake" />
//                   TERMINATE TRIP
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
// _____________________________________________________________________________________________________________________________
// _____________________________________________________________________________________________________________________________
// _____________________________________________________________________________________________________________________________
// _____________________________________________________________________________________________________________________________
// _____________________________________________________________________________________________________________________________
// _____________________________________________________________________________________________________________________________
// _____________________________________________________________________________________________________________________________
// import { useState, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   FiMoreVertical,
//   FiEye,
//   FiXCircle,
//   FiClock,
//   FiLock,
//   FiArrowLeft,
//   FiUser,
//   FiTruck,
//   FiMapPin,
//   FiCalendar,
//   FiPhone,
//   FiSearch,
//   FiCheck,
//   FiX,
//   FiMail,
//   FiInbox,
//   FiLoader,
// } from "react-icons/fi";

// const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// // Endpoint Mapping for cleaner logic
// const STATUS_ENDPOINTS = {
//   Public: (id) => `/bookings/to-public/${id}`,
//   Private: (id) => `/bookings/to-assined-by-admin/${id}`,
//   Cancel: (id) => `/bookings/to-rejected/${id}`,
// };

// export default function AdminBookings() {
//   const queryClient = useQueryClient();
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [assigningDriver, setAssigningDriver] = useState(false);
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [searchDriver, setSearchDriver] = useState("");

//   // ================= FETCH DATA =================
//   const {
//     data: bookings = [],
//     isLoading,
//     isRefetching,
//   } = useQuery({
//     queryKey: ["pending-bookings"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/bookings?status=pending");
//       return res.data.data;
//     },
//     refetchInterval: 30000, // Auto-refresh every 30s for "Control Tower" feel
//   });

//   const { data: drivers = [], isLoading: loadingDrivers } = useQuery({
//     queryKey: ["available-drivers"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/drivers?status=available");
//       return res.data.data;
//     },
//     enabled: assigningDriver,
//   });

//   // ================= MUTATIONS =================
//   const mutationUpdate = useMutation({
//     mutationFn: ({ id, status, driverId }) => {
//       const url = STATUS_ENDPOINTS[status](id);
//       return axiosSecure.patch(url, { driverId });
//     },
//     onSuccess: (_, variables) => {
//       toast.success(`System Updated: Trip set to ${variables.status}`);
//       queryClient.invalidateQueries(["pending-bookings"]);
//       closeAllModals();
//     },
//     onError: (err) => {
//       const msg =
//         err.response?.data?.message || "Protocol Error: Update Failed";
//       toast.error(msg);
//     },
//   });

//   // ================= HANDLERS =================
//   const closeAllModals = () => {
//     setSelectedBooking(null);
//     setAssigningDriver(false);
//     setSelectedDriver(null);
//     setSearchDriver("");
//     setOpenDropdown(null);
//   };

//   const handleAction = (e, status, booking) => {
//     e.stopPropagation(); // Critical: Prevents row click from firing
//     if (status === "Private") {
//       setSelectedBooking(booking);
//       setAssigningDriver(true);
//     } else {
//       if (window.confirm(`Are you sure you want to set this to ${status}?`)) {
//         mutationUpdate.mutate({ id: booking._id, status });
//       }
//     }
//   };

//   const confirmAssignment = () => {
//     if (!selectedDriver)
//       return toast.error("Deployment Error: Select a Driver");
//     mutationUpdate.mutate({
//       id: selectedBooking._id,
//       status: "Private",
//       driverId: selectedDriver._id,
//     });
//   };

//   // Memoized search for performance
//   const filteredDrivers = useMemo(() => {
//     return drivers.filter(
//       (d) =>
//         d.userId?.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
//         d.phoneNumber.includes(searchDriver),
//     );
//   }, [drivers, searchDriver]);

//   // ================= RENDER HELPERS =================
//   if (isLoading)
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//         <FiLoader className="text-4xl text-blue-600 animate-spin" />
//         <p className="font-bold text-slate-500 animate-pulse">
//           Initializing Control Tower...
//         </p>
//       </div>
//     );

//   return (
//     <div className="p-4 sm:p-6 bg-[#f8fafc] min-h-screen font-sans">
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-3xl font-black text-slate-900 tracking-tight">
//             Logistics Control Tower
//           </h1>
//           <p className="text-slate-500 text-sm font-medium">
//             Monitoring {bookings.length} pending deployments
//           </p>
//         </div>
//         {isRefetching && (
//           <span className="text-[10px] bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold animate-pulse">
//             LIVE SYNCING
//           </span>
//         )}
//       </div>

//       {bookings.length === 0 ? (
//         <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 flex flex-col items-center text-center">
//           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
//             <FiInbox className="text-3xl text-slate-300" />
//           </div>
//           <h3 className="text-xl font-bold text-slate-800">
//             No Pending Requests
//           </h3>
//           <p className="text-slate-500 max-w-xs">
//             All logistics requests have been processed. New requests will appear
//             here in real-time.
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-hidden bg-white shadow-sm rounded-2xl border border-slate-200">
//           <table className="min-w-full text-sm">
//             <thead className="bg-slate-50 border-b border-slate-200">
//               <tr>
//                 <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                   User Profile
//                 </th>
//                 <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                   Trip Type
//                 </th>
//                 <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                   Asset Spec
//                 </th>
//                 <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                   Logistics Route
//                 </th>
//                 <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                   Current Status
//                 </th>
//                 <th className="p-5 text-right font-bold text-slate-500 uppercase tracking-wider text-[11px]">
//                   Control
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {bookings.map((booking) => (
//                 <tr
//                   key={booking._id}
//                   className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
//                   onClick={() => setSelectedBooking(booking)}
//                 >
//                   <td className="p-5">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
//                         {booking.userId?.name?.charAt(0)}
//                       </div>
//                       <div>
//                         <div className="font-bold text-slate-800">
//                           {booking.userId?.name}
//                         </div>
//                         <div className="text-slate-400 text-xs">
//                           {booking.userId?.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-5 capitalize font-medium text-slate-600">
//                     {booking.tripType?.replace("_", " ")}
//                   </td>
//                   <td className="p-5">
//                     <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[11px] font-black uppercase">
//                       {booking.vehicleType}
//                     </span>
//                   </td>
//                   <td className="p-5">
//                     <div className="flex items-center gap-2 text-slate-700">
//                       <span className="font-semibold">
//                         {booking.fromLocation}
//                       </span>
//                       <span className="text-slate-300">→</span>
//                       <span className="font-semibold">
//                         {booking.toLocation}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="p-5">
//                     <div className="flex items-center gap-2">
//                       <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
//                       <span className="text-[11px] font-black uppercase text-yellow-700">
//                         {booking.status}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="p-5 text-right relative">
//                     <button
//                       className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setOpenDropdown(
//                           openDropdown === booking._id ? null : booking._id,
//                         );
//                       }}
//                     >
//                       <FiMoreVertical className="text-slate-400 group-hover:text-slate-600" />
//                     </button>
//                     {openDropdown === booking._id && (
//                       <div className="absolute right-4 mt-2 w-48 bg-white shadow-xl rounded-xl z-50 border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
//                         <button
//                           className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 w-full text-xs font-bold text-slate-700"
//                           onClick={(e) => handleAction(e, "Public", booking)}
//                         >
//                           <FiEye className="text-blue-500" /> PUBLISH TO PUBLIC
//                         </button>
//                         <button
//                           className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 w-full text-xs font-bold text-slate-700"
//                           onClick={(e) => handleAction(e, "Private", booking)}
//                         >
//                           <FiLock className="text-indigo-500" /> ASSIGN PRIVATE
//                         </button>
//                         <div className="my-1 border-t border-slate-50" />
//                         <button
//                           className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 w-full text-xs font-black"
//                           onClick={(e) => handleAction(e, "Cancel", booking)}
//                         >
//                           <FiXCircle /> REJECT REQUEST
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ================= INDUSTRIAL MODAL ================= */}
//       {selectedBooking && (
//         <div
//           className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
//           onClick={closeAllModals}
//         >
//           <div
//             className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="px-8 py-6 border-b flex justify-between items-center bg-white">
//               <div>
//                 <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
//                   {assigningDriver ? "Unit Deployment" : "Request Intelligence"}
//                 </h2>
//                 <p className="text-xs text-slate-400 font-bold">
//                   UID: {selectedBooking._id}
//                 </p>
//               </div>
//               <button
//                 onClick={closeAllModals}
//                 className="w-10 h-10 rounded-full bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all flex items-center justify-center font-bold"
//               >
//                 <FiX />
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto flex-grow bg-[#fcfcfd]">
//               {assigningDriver ? (
//                 <div className="space-y-6">
//                   <div className="relative">
//                     <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
//                     <input
//                       autoFocus
//                       className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-lg font-medium"
//                       placeholder="Search units by name or fleet ID..."
//                       value={searchDriver}
//                       onChange={(e) => setSearchDriver(e.target.value)}
//                     />
//                   </div>

//                   {loadingDrivers ? (
//                     <div className="grid grid-cols-2 gap-4">
//                       {[1, 2, 3, 4].map((i) => (
//                         <div
//                           key={i}
//                           className="h-24 bg-slate-100 animate-pulse rounded-2xl"
//                         />
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       {filteredDrivers.map((driver) => (
//                         <div
//                           key={driver._id}
//                           onClick={() => setSelectedDriver(driver)}
//                           className={`p-5 border-2 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${
//                             selectedDriver?._id === driver._id
//                               ? "border-blue-600 bg-blue-50/50 ring-4 ring-blue-50"
//                               : "border-white bg-white hover:border-slate-200 shadow-sm"
//                           }`}
//                         >
//                           <img
//                             src={driver.photo}
//                             className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-sm"
//                             alt=""
//                           />
//                           <div className="flex-grow">
//                             <p className="font-black text-slate-800 text-lg leading-tight">
//                               {driver.userId?.name}
//                             </p>
//                             <p className="text-sm font-bold text-blue-600">
//                               {driver.phoneNumber}
//                             </p>
//                           </div>
//                           {selectedDriver?._id === driver._id && (
//                             <div className="bg-blue-600 p-1 rounded-full">
//                               <FiCheck className="text-white" />
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                   {/* Left Col */}
//                   <div className="space-y-6">
//                     <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//                       <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
//                         Client Profile
//                       </h3>
//                       <div className="flex items-center gap-4">
//                         <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
//                           {selectedBooking.userId?.name?.charAt(0)}
//                         </div>
//                         <div>
//                           <p className="font-black text-slate-900">
//                             {selectedBooking.userId?.name}
//                           </p>
//                           <p className="text-xs text-slate-500 font-medium">
//                             {selectedBooking.userId?.email}
//                           </p>
//                         </div>
//                       </div>
//                       <a
//                         href={`tel:${selectedBooking.phoneNumber}`}
//                         className="mt-6 flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-xl text-[11px] font-black uppercase hover:bg-blue-600 transition-colors"
//                       >
//                         <FiPhone /> Contact Client
//                       </a>
//                     </section>

//                     <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
//                       <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-4">
//                         Deployment Window
//                       </h3>
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
//                           <FiCalendar />
//                         </div>
//                         <div>
//                           <p className="font-black text-slate-800 text-sm">
//                             {new Date(selectedBooking.dateFrom).toDateString()}
//                           </p>
//                           <p className="text-xs font-bold text-amber-600">
//                             {selectedBooking.timeFrom}
//                           </p>
//                         </div>
//                       </div>
//                     </section>
//                   </div>

//                   {/* Right Col */}
//                   <div className="lg:col-span-2 space-y-6">
//                     <div className="bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
//                       <div className="absolute -right-10 -bottom-10 opacity-10">
//                         <FiTruck size={240} />
//                       </div>
//                       <div className="relative z-10">
//                         <p className="text-blue-400 font-black text-[10px] tracking-[0.3em] mb-8">
//                           ACTIVE LOGISTICS CHANNEL
//                         </p>
//                         <div className="flex items-center gap-8">
//                           <div className="flex-1">
//                             <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">
//                               Origin Point
//                             </p>
//                             <h4 className="text-2xl font-black">
//                               {selectedBooking.fromLocation}
//                             </h4>
//                           </div>
//                           <div className="flex flex-col items-center">
//                             <div className="h-1 w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full mb-2" />
//                             <FiTruck className="text-blue-500 text-3xl animate-bounce" />
//                             <div className="h-1 w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full mt-2" />
//                           </div>
//                           <div className="flex-1 text-right">
//                             <p className="text-slate-400 text-[10px] font-bold uppercase mb-1">
//                               Destination Point
//                             </p>
//                             <h4 className="text-2xl font-black">
//                               {selectedBooking.toLocation}
//                             </h4>
//                           </div>
//                         </div>
//                         <div className="mt-10 pt-10 border-t border-white/10 grid grid-cols-2 gap-4">
//                           <div>
//                             <p className="text-slate-500 text-[10px] font-bold uppercase">
//                               Asset Type
//                             </p>
//                             <p className="text-lg font-black">
//                               {selectedBooking.vehicleType}
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-slate-500 text-[10px] font-bold uppercase">
//                               Mission Type
//                             </p>
//                             <p className="text-lg font-black capitalize">
//                               {selectedBooking.tripType?.replace("_", " ")}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Actions */}
//             <div className="px-8 py-6 border-t bg-white flex flex-wrap gap-4 justify-end">
//               {assigningDriver ? (
//                 <>
//                   <button
//                     onClick={() => setAssigningDriver(false)}
//                     className="px-8 py-4 font-black text-slate-400 text-[11px] hover:text-slate-900 transition-colors uppercase tracking-widest"
//                   >
//                     Back to Specs
//                   </button>
//                   <button
//                     disabled={!selectedDriver || mutationUpdate.isPending}
//                     onClick={confirmAssignment}
//                     className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-blue-200 disabled:bg-slate-200 disabled:shadow-none hover:bg-blue-700 transition-all flex items-center gap-2"
//                   >
//                     {mutationUpdate.isPending ? (
//                       <FiLoader className="animate-spin" />
//                     ) : (
//                       <FiCheck />
//                     )}
//                     {mutationUpdate.isPending
//                       ? "PROCESSING..."
//                       : "CONFIRM DEPLOYMENT"}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button
//                     disabled={mutationUpdate.isPending}
//                     onClick={(e) => handleAction(e, "Public", selectedBooking)}
//                     className="px-6 py-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-2xl text-[11px] font-black transition-all flex items-center gap-2"
//                   >
//                     <FiEye /> RELEASE TO PUBLIC
//                   </button>
//                   <button
//                     disabled={mutationUpdate.isPending}
//                     onClick={() => setAssigningDriver(true)}
//                     className="px-6 py-4 bg-slate-900 text-white hover:bg-black rounded-2xl text-[11px] font-black transition-all flex items-center gap-2 shadow-lg"
//                   >
//                     <FiLock /> ASSIGN PRIVATE UNIT
//                   </button>
//                   <button
//                     disabled={mutationUpdate.isPending}
//                     onClick={(e) => handleAction(e, "Cancel", selectedBooking)}
//                     className="px-6 py-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl text-[11px] font-black transition-all"
//                   >
//                     TERMINATE REQUEST
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// // _____________________________________________________________________________________________________________________________
// // _____________________________________________________________________________________________________________________________
// // _____________________________________________________________________________________________________________________________
// // _____________________________________________________________________________________________________________________________
// // _____________________________________________________________________________________________________________________________
// // _____________________________________________________________________________________________________________________________
// // _____________________________________________________________________________________________________________________________
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
// } from "react-icons/fi";

// const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// export default function AdminLogisticsMaster() {
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [statusFilter, setStatusFilter] = useState("all");

//   // ================= FETCH DATA =================
//   const { data: bookings = [], isLoading } = useQuery({
//     queryKey: ["all-bookings"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/bookings");
//       // Assuming your API returns { data: [...] } or just [...]
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
//     // Future implementation: window.open(`/api/reports/${id}`)
//   };

//   if (isLoading)
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//         <FiLoader className="text-4xl text-blue-600 animate-spin" />
//         <p className="font-bold text-slate-500 animate-pulse">
//           Syncing Fleet Data...
//         </p>
//       </div>
//     );

//   return (
//     <div className="p-4 sm:p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
//       {/* Header & Filters */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-black tracking-tight">
//             Global Logistics Manager
//           </h1>
//           <p className="text-slate-500 text-sm font-medium">
//             Monitoring {bookings.length} Total Operations
//           </p>
//         </div>

//         <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
//           {["all", "pending", "confirmed", "paid"].map((status) => (
//             <button
//               key={status}
//               onClick={() => setStatusFilter(status)}
//               className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${
//                 statusFilter === status
//                   ? "bg-slate-900 text-white shadow-md"
//                   : "text-slate-400 hover:text-slate-600"
//               }`}
//             >
//               {status}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="overflow-x-auto bg-white shadow-sm rounded-2xl border border-slate-200">
//         <table className="min-w-full text-sm">
//           <thead className="bg-slate-50 border-b border-slate-200">
//             <tr>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Route
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Client
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Asset
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Driver
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Financials
//               </th>
//               <th className="p-5 text-right font-bold text-slate-500 uppercase tracking-wider text-[11px]">
//                 Status
//               </th>
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
//                     className={`text-[9px] uppercase font-bold ${booking.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"}`}
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
//                 {/* Active Driver/Vehicle */}
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
//                         className={`p-4 rounded-2xl border-2 ${quote.status === "confirmed" ? "border-green-500 bg-green-50" : "border-slate-100 bg-white"}`}
//                       >
//                         <div className="flex justify-between items-center">
//                           <div className="flex items-center gap-3">
//                             <img
//                               src={quote.driverId.photo}
//                               className="w-10 h-10 rounded-full"
//                               alt=""
//                             />
//                             <p className="text-xs font-black">
//                               {quote.driverId.name}
//                             </p>
//                           </div>
//                           <p className="font-black text-blue-600">
//                             ${quote.currentAmount}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </section>

//                 {/* Route */}
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
//             <div className="px-8 py-6 border-t bg-slate-50 flex justify-between items-center">
//               <div className="flex gap-6">
//                 <div>
//                   <p className="text-[9px] font-black text-slate-400 uppercase">
//                     Status
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
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => handleDownloadManifest(selectedBooking._id)}
//                   className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase"
//                 >
//                   <FiDownload /> Manifest
//                 </button>
//                 <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase">
//                   <FiTrash2 /> Terminate
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// ___________________________________________________________________________up code iis working good only button fixed now
// ___________________________________________________________________________up code iis working good only button fixed now
// ___________________________________________________________________________up code iis working good only button fixed now
// ___________________________________________________________________________up code iis working good only button fixed now
// ___________________________________________________________________________up code iis working good only button fixed now
// ___________________________________________________________________________up code iis working good only button fixed now
// ___________________________________________________________________________up code iis working good only button fixed now
// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   FiMoreVertical,
//   FiEye,
//   FiXCircle,
//   FiClock,
//   FiLock,
//   FiArrowLeft,
//   FiUser,
//   FiTruck,
//   FiMapPin,
//   FiCalendar,
//   FiPhone,
//   FiSearch,
//   FiCheck,
//   FiX,
//   FiMail,
//   FiLoader,
//   FiActivity,
// } from "react-icons/fi";

// const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// export default function PendingTrip() {
//   const queryClient = useQueryClient();
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [assigningDriver, setAssigningDriver] = useState(false);
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [searchDriver, setSearchDriver] = useState("");

//   // ================= FETCH DATA =================
//   const { data: bookings = [], isLoading } = useQuery({
//     queryKey: ["pending-trips"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/bookings");
//       return Array.isArray(res.data) ? res.data : res.data.data;
//     },
//   });

//   const { data: drivers = [] } = useQuery({
//     queryKey: ["available-drivers"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/drivers?status=available");
//       return Array.isArray(res.data) ? res.data : res.data.data;
//     },
//     enabled: assigningDriver,
//   });

//   // ================= MUTATIONS (Fixed per pendingBooking logic) =================
//   const mutationUpdate = useMutation({
//     mutationFn: ({ id, status, driverId }) => {
//       let endpoint = `/bookings/to-public/${id}`;
//       if (status === "Private")
//         endpoint = `/bookings/to-assined-by-admin/${id}`;
//       if (status === "Cancel") endpoint = `/bookings/to-rejected/${id}`;

//       return axiosSecure.patch(endpoint, { driverId });
//     },
//     onSuccess: (_, variables) => {
//       toast.success(`Trip updated to ${variables.status}`);
//       queryClient.invalidateQueries(["pending-trips"]);
//       closeAllModals();
//     },
//     onError: () => toast.error("Deployment Protocol Failed"),
//   });

//   // ================= HANDLERS =================
//   const closeAllModals = () => {
//     setSelectedBooking(null);
//     setAssigningDriver(false);
//     setSelectedDriver(null);
//     setSearchDriver("");
//     setOpenDropdown(null);
//   };

//   const handleAction = (status, booking) => {
//     if (status === "Private") {
//       setAssigningDriver(true);
//     } else {
//       if (window.confirm(`Confirm action: ${status}?`)) {
//         mutationUpdate.mutate({ id: booking._id, status });
//       }
//     }
//   };

//   const confirmAssignment = () => {
//     if (!selectedDriver) return toast.error("Please select a driver");
//     mutationUpdate.mutate({
//       id: selectedBooking._id,
//       status: "Private",
//       driverId: selectedDriver._id,
//     });
//   };

//   const filteredDrivers = drivers.filter(
//     (d) =>
//       d.userId?.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
//       d.phoneNumber.includes(searchDriver),
//   );

//   if (isLoading)
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//         <FiLoader className="text-4xl text-blue-600 animate-spin" />
//         <p className="font-bold text-slate-500">Syncing Pending Fleet...</p>
//       </div>
//     );

//   return (
//     <div className="p-4 sm:p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
//       <div className="mb-8">
//         <h1 className="text-3xl font-black tracking-tight">
//           Pending Operations
//         </h1>
//         <p className="text-slate-500 text-sm font-medium">
//           Awaiting Administrative Authorization
//         </p>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="overflow-x-auto bg-white shadow-sm rounded-2xl border border-slate-200">
//         <table className="min-w-full text-sm">
//           <thead className="bg-slate-50 border-b border-slate-200">
//             <tr>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase text-[11px]">
//                 User
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase text-[11px]">
//                 Type
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase text-[11px]">
//                 Vehicle
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase text-[11px]">
//                 Route
//               </th>
//               <th className="p-5 text-right font-bold text-slate-500 uppercase text-[11px]">
//                 Action
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {bookings.map((booking) => (
//               <tr
//                 key={booking._id}
//                 className="hover:bg-blue-50/50 transition-colors cursor-pointer"
//                 onClick={() => setSelectedBooking(booking)}
//               >
//                 <td className="p-5">
//                   <div className="font-bold text-slate-800">
//                     {booking.userId?.name}
//                   </div>
//                   <div className="text-[10px] text-slate-400 font-medium">
//                     {booking.userId?.email}
//                   </div>
//                 </td>
//                 <td className="p-5 capitalize font-medium">
//                   {booking.tripType?.replace("_", " ")}
//                 </td>
//                 <td className="p-5">
//                   <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">
//                     {booking.vehicleType}
//                   </span>
//                 </td>
//                 <td className="p-5 text-slate-600 font-medium">
//                   {booking.fromLocation?.split(",")[0]} →{" "}
//                   {booking.toLocation?.split(",")[0]}
//                 </td>
//                 <td
//                   className="p-5 text-right relative"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     onClick={() =>
//                       setOpenDropdown(
//                         openDropdown === booking._id ? null : booking._id,
//                       )
//                     }
//                     className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
//                   >
//                     <FiMoreVertical />
//                   </button>
//                   {openDropdown === booking._id && (
//                     <div className="absolute right-4 mt-2 w-48 bg-white shadow-2xl rounded-2xl z-50 border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2">
//                       <button
//                         onClick={() => handleAction("Public", booking)}
//                         className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 w-full text-xs font-black uppercase text-blue-600"
//                       >
//                         <FiEye /> Release Public
//                       </button>
//                       <button
//                         onClick={() => handleAction("Private", booking)}
//                         className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 w-full text-xs font-black uppercase text-slate-700"
//                       >
//                         <FiLock /> Assign Private
//                       </button>
//                       <div className="h-px bg-slate-100 my-1 mx-2"></div>
//                       <button
//                         onClick={() => handleAction("Cancel", booking)}
//                         className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 w-full text-xs font-black uppercase"
//                       >
//                         <FiXCircle /> Terminate
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ================= INDUSTRIAL MODAL ================= */}
//       {selectedBooking && (
//         <div
//           className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
//           onClick={closeAllModals}
//         >
//           <div
//             className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50/50">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-600 rounded-2xl text-white">
//                   <FiActivity size={24} />
//                 </div>
//                 <h2 className="text-xl font-black uppercase tracking-tight">
//                   {assigningDriver
//                     ? "Private Fleet Selection"
//                     : "Trip Manifest"}
//                 </h2>
//               </div>
//               <button
//                 onClick={closeAllModals}
//                 className="w-10 h-10 rounded-full border border-slate-200 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
//               >
//                 <FiX />
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto flex-grow">
//               {assigningDriver ? (
//                 <div className="space-y-6">
//                   <div className="relative">
//                     <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                     <input
//                       className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 outline-none transition-all font-bold"
//                       placeholder="Filter drivers by name or credential..."
//                       value={searchDriver}
//                       onChange={(e) => setSearchDriver(e.target.value)}
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {filteredDrivers.map((driver) => (
//                       <div
//                         key={driver._id}
//                         onClick={() => setSelectedDriver(driver)}
//                         className={`p-4 border-2 rounded-[24px] flex items-center gap-4 cursor-pointer transition-all ${selectedDriver?._id === driver._id ? "border-blue-600 bg-blue-50" : "border-slate-100 hover:border-blue-200 bg-white"}`}
//                       >
//                         <img
//                           src={driver.photo}
//                           className="w-14 h-14 rounded-xl object-cover"
//                           alt=""
//                         />
//                         <div className="flex-grow">
//                           <p className="font-black text-slate-800">
//                             {driver.userId?.name}
//                           </p>
//                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                             {driver.phoneNumber}
//                           </p>
//                         </div>
//                         {selectedDriver?._id === driver._id && (
//                           <FiCheck className="text-blue-600 text-xl" />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//                   <div className="lg:col-span-4 space-y-6">
//                     <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
//                       <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
//                         Client Detail
//                       </h3>
//                       <p className="font-black text-slate-800">
//                         {selectedBooking.userId?.name}
//                       </p>
//                       <p className="text-xs text-slate-500 mb-4">
//                         {selectedBooking.userId?.email}
//                       </p>
//                       <a
//                         href={`tel:${selectedBooking.phoneNumber}`}
//                         className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 py-3 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase"
//                       >
//                         <FiPhone /> Contact Client
//                       </a>
//                     </section>
//                     <section className="bg-slate-900 text-white p-6 rounded-3xl">
//                       <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">
//                         Trip Specs
//                       </h3>
//                       <div className="grid grid-cols-2 gap-2 mb-4">
//                         <div className="bg-white/10 p-3 rounded-xl">
//                           <p className="text-[8px] font-bold text-slate-400 uppercase">
//                             Unit
//                           </p>
//                           <p className="text-xs font-black uppercase">
//                             {selectedBooking.vehicleType}
//                           </p>
//                         </div>
//                         <div className="bg-white/10 p-3 rounded-xl">
//                           <p className="text-[8px] font-bold text-slate-400 uppercase">
//                             Type
//                           </p>
//                           <p className="text-xs font-black capitalize">
//                             {selectedBooking.tripType?.replace("_", " ")}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
//                         <FiCalendar className="text-blue-400" />
//                         <div>
//                           <p className="text-sm font-black">
//                             {new Date(selectedBooking.dateFrom).toDateString()}
//                           </p>
//                           <p className="text-[10px] text-slate-400 font-bold">
//                             {selectedBooking.timeFrom}
//                           </p>
//                         </div>
//                       </div>
//                     </section>
//                   </div>
//                   <div className="lg:col-span-8 space-y-6">
//                     <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-200 flex items-center justify-between gap-6 relative overflow-hidden">
//                       <div className="absolute right-0 top-0 opacity-5">
//                         <FiTruck size={120} />
//                       </div>
//                       <div className="flex-1">
//                         <span className="text-[10px] font-black text-slate-400 block uppercase mb-1">
//                           Origin
//                         </span>
//                         <h4 className="text-xl font-black">
//                           {selectedBooking.fromLocation}
//                         </h4>
//                       </div>
//                       <div className="flex flex-col items-center">
//                         <FiTruck className="text-blue-600 text-2xl" />
//                         <div className="w-16 h-px bg-slate-300 mt-2"></div>
//                       </div>
//                       <div className="flex-1 text-right">
//                         <span className="text-[10px] font-black text-slate-400 block uppercase mb-1">
//                           Destination
//                         </span>
//                         <h4 className="text-xl font-black">
//                           {selectedBooking.toLocation}
//                         </h4>
//                       </div>
//                     </div>
//                     <div className="p-8 border-2 border-dashed border-slate-200 rounded-[32px] text-center">
//                       <FiClock
//                         className="mx-auto text-slate-300 mb-2"
//                         size={24}
//                       />
//                       <p className="font-black text-slate-400 uppercase text-[10px]">
//                         Awaiting Administrative Action
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="px-8 py-6 border-t bg-slate-50 flex flex-wrap gap-4 justify-end">
//               {assigningDriver ? (
//                 <>
//                   <button
//                     onClick={() => setAssigningDriver(false)}
//                     className="px-8 py-4 font-black text-[10px] text-slate-500 uppercase tracking-widest"
//                   >
//                     Back
//                   </button>
//                   <button
//                     disabled={!selectedDriver || mutationUpdate.isPending}
//                     onClick={confirmAssignment}
//                     className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl disabled:bg-slate-300 transition-all"
//                   >
//                     {mutationUpdate.isPending
//                       ? "Assigning..."
//                       : "Confirm Private Assign"}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => handleAction("Public", selectedBooking)}
//                     className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200"
//                   >
//                     Release Public
//                   </button>
//                   <button
//                     onClick={() => setAssigningDriver(true)}
//                     className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200"
//                   >
//                     Assign Private
//                   </button>
//                   <button
//                     onClick={() => handleAction("Cancel", selectedBooking)}
//                     className="px-8 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200"
//                   >
//                     Reject Trip
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// __________________________________uper code button work perfectly___________________________________________________
// __________________________________uper code button work perfectly___________________________________________________
// __________________________________uper code button work perfectly___________________________________________________
// __________________________________uper code button work perfectly___________________________________________________
// __________________________________uper code button work perfectly___________________________________________________
// __________________________________uper code button work perfectly___________________________________________________
// __________________________________uper code button work perfectly___________________________________________________
// __________________________________uper code button work perfectly___________________________________________________
// import { useState, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   FiMoreVertical,
//   FiEye,
//   FiXCircle,
//   FiClock,
//   FiLock,
//   FiUser,
//   FiTruck,
//   FiMapPin,
//   FiCalendar,
//   FiPhone,
//   FiSearch,
//   FiCheck,
//   FiX,
//   FiMail,
//   FiLoader,
//   FiActivity,
//   FiDollarSign,
//   FiChevronDown,
//   FiChevronUp,
//   FiFilter,
// } from "react-icons/fi";

// const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// export default function FleetManagementSystem() {
//   const queryClient = useQueryClient();
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [assigningDriver, setAssigningDriver] = useState(false);
//   const [selectedDriver, setSelectedDriver] = useState(null);

//   // Search & Sort States
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "createdAt",
//     direction: "desc",
//   });
//   const [driverSearch, setDriverSearch] = useState("");

//   // ================= FETCH DATA =================
//   const { data: bookings = [], isLoading } = useQuery({
//     queryKey: ["all-bookings"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/bookings");
//       return Array.isArray(res.data) ? res.data : res.data.data;
//     },
//   });

//   const { data: drivers = [] } = useQuery({
//     queryKey: ["available-drivers"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/drivers?status=available");
//       return Array.isArray(res.data) ? res.data : res.data.data;
//     },
//     enabled: assigningDriver,
//   });

//   // ================= MUTATIONS =================
//   const mutationUpdate = useMutation({
//     mutationFn: ({ id, status, driverId }) => {
//       let endpoint = `/bookings/to-public/${id}`;
//       if (status === "Private")
//         endpoint = `/bookings/to-assined-by-admin/${id}`;
//       if (status === "Cancel") endpoint = `/bookings/to-rejected/${id}`;

//       return axiosSecure.patch(endpoint, { driverId });
//     },
//     onSuccess: (_, variables) => {
//       toast.success(`Action Executed: ${variables.status}`);
//       queryClient.invalidateQueries(["all-bookings"]);
//       closeAllModals();
//     },
//     onError: () => toast.error("Deployment Protocol Failed"),
//   });

//   // ================= LOGIC: SEARCH & SORT =================
//   const processedBookings = useMemo(() => {
//     let filtered = bookings.filter(
//       (item) =>
//         item.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.toLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()),
//     );

//     if (sortConfig.key) {
//       filtered.sort((a, b) => {
//         const aValue = a[sortConfig.key];
//         const bValue = b[sortConfig.key];
//         if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
//         if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
//         return 0;
//       });
//     }
//     return filtered;
//   }, [bookings, searchTerm, sortConfig]);

//   const requestSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // ================= HANDLERS =================
//   const closeAllModals = () => {
//     setSelectedBooking(null);
//     setAssigningDriver(false);
//     setSelectedDriver(null);
//     setOpenDropdown(null);
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
//       pending: "bg-amber-50 text-amber-600 border-amber-100",
//       cancelled: "bg-rose-50 text-rose-600 border-rose-100",
//       paid: "bg-blue-50 text-blue-600 border-blue-100",
//     };
//     return (
//       styles[status?.toLowerCase()] ||
//       "bg-slate-50 text-slate-600 border-slate-100"
//     );
//   };

//   if (isLoading)
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-[#f8fafc]">
//         <FiLoader className="text-4xl text-blue-600 animate-spin" />
//         <p className="font-bold text-slate-500 text-xs tracking-widest uppercase">
//           Syncing Fleet Data...
//         </p>
//       </div>
//     );

//   return (
//     <div className="p-4 sm:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
//       {/* Header & Search Bar */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div>
//             <h1 className="text-2xl font-black tracking-tight text-slate-800">
//               Fleet Control Center
//             </h1>
//             <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
//               Administrative Authorization Level: Super
//             </p>
//           </div>

//           <div className="relative w-full md:w-96">
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search by client, location, or unit..."
//               className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Main Data Table */}
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white shadow-sm rounded-2xl border border-slate-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-[12px]">
//               <thead className="bg-slate-50/80 border-b border-slate-200">
//                 <tr>
//                   <th
//                     onClick={() => requestSort("userId")}
//                     className="p-5 font-black text-slate-500 text-left uppercase tracking-tighter cursor-pointer hover:text-blue-600 transition-colors"
//                   >
//                     Client{" "}
//                     {sortConfig.key === "userId" &&
//                       (sortConfig.direction === "asc" ? (
//                         <FiChevronUp className="inline" />
//                       ) : (
//                         <FiChevronDown className="inline" />
//                       ))}
//                   </th>
//                   <th className="p-5 font-black text-slate-500 text-left uppercase tracking-tighter">
//                     Route Details
//                   </th>
//                   <th className="p-5 font-black text-slate-500 text-left uppercase tracking-tighter">
//                     Vehicle
//                   </th>
//                   <th
//                     onClick={() => requestSort("status")}
//                     className="p-5 font-black text-slate-500 text-left uppercase tracking-tighter cursor-pointer"
//                   >
//                     Status
//                   </th>
//                   <th className="p-5 font-black text-slate-500 text-right uppercase tracking-tighter">
//                     Quick Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {processedBookings.map((booking) => (
//                   <tr
//                     key={booking._id}
//                     className="hover:bg-slate-50 transition-colors cursor-pointer group"
//                     onClick={() => setSelectedBooking(booking)}
//                   >
//                     <td className="p-5">
//                       <div className="font-bold text-slate-800">
//                         {booking.userId?.name}
//                       </div>
//                       <div className="text-[10px] text-slate-400 font-medium lowercase">
//                         {booking.userId?.email}
//                       </div>
//                     </td>
//                     <td className="p-5">
//                       <div className="font-medium text-slate-600">
//                         {booking.fromLocation?.split(",")[0]}
//                         <span className="mx-2 text-slate-300">→</span>
//                         {booking.toLocation?.split(",")[0]}
//                       </div>
//                       <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">
//                         {new Date(booking.dateFrom).toDateString()}
//                       </div>
//                     </td>
//                     <td className="p-5">
//                       <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border border-blue-100">
//                         {booking.vehicleType}
//                       </span>
//                     </td>
//                     <td className="p-5">
//                       <span
//                         className={`px-2 py-1 rounded-md border text-[10px] font-black uppercase ${getStatusBadge(booking.status)}`}
//                       >
//                         {booking.status}
//                       </span>
//                     </td>
//                     <td
//                       className="p-5 text-right relative"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <button
//                         onClick={() =>
//                           setOpenDropdown(
//                             openDropdown === booking._id ? null : booking._id,
//                           )
//                         }
//                         className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
//                       >
//                         <FiMoreVertical />
//                       </button>

//                       {/* Dropdown Menu */}
//                       {openDropdown === booking._id && (
//                         <div className="absolute right-6 mt-2 w-44 bg-white shadow-xl rounded-xl z-50 border border-slate-100 py-1 animate-in fade-in slide-in-from-top-2">
//                           <button
//                             onClick={() => setSelectedBooking(booking)}
//                             className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 w-full text-[11px] font-bold text-slate-700"
//                           >
//                             <FiEye className="text-blue-500" /> View Full Specs
//                           </button>
//                           <button
//                             onClick={() =>
//                               mutationUpdate.mutate({
//                                 id: booking._id,
//                                 status: "Public",
//                               })
//                             }
//                             className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 w-full text-[11px] font-bold text-slate-700"
//                           >
//                             <FiActivity className="text-emerald-500" /> Release
//                             Public
//                           </button>
//                           <div className="h-px bg-slate-100 my-1 mx-2"></div>
//                           <button
//                             onClick={() => {
//                               setAssigningDriver(true);
//                               setSelectedBooking(booking);
//                             }}
//                             className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 w-full text-[11px] font-bold text-slate-700"
//                           >
//                             <FiLock className="text-amber-500" /> Private Assign
//                           </button>
//                           <button
//                             onClick={() => {
//                               if (window.confirm("Confirm termination?"))
//                                 mutationUpdate.mutate({
//                                   id: booking._id,
//                                   status: "Cancel",
//                                 });
//                             }}
//                             className="flex items-center gap-3 px-4 py-2 hover:bg-rose-50 w-full text-[11px] font-bold text-rose-600"
//                           >
//                             <FiXCircle /> Terminate
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ================= REFINED INDUSTRIAL MODAL ================= */}
//       {selectedBooking && (
//         <div
//           className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
//           onClick={closeAllModals}
//         >
//           <div
//             className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="px-8 py-5 border-b flex justify-between items-center bg-slate-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-lg">
//                   <FiActivity size={18} />
//                 </div>
//                 <div>
//                   <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">
//                     {assigningDriver
//                       ? "Private Fleet Selection"
//                       : "Operational Manifest"}
//                   </h2>
//                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-none">
//                     ID: {selectedBooking._id}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={closeAllModals}
//                 className="w-8 h-8 rounded-full border border-slate-200 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center"
//               >
//                 <FiX size={16} />
//               </button>
//             </div>

//             <div className="p-8 overflow-y-auto flex-grow bg-white">
//               {assigningDriver ? (
//                 /* Driver List for Private Assign */
//                 <div className="space-y-6">
//                   <div className="relative">
//                     <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                     <input
//                       className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all text-xs font-bold"
//                       placeholder="Search operative name or credential..."
//                       onChange={(e) => setDriverSearch(e.target.value)}
//                     />
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {drivers
//                       .filter((d) =>
//                         d.name
//                           ?.toLowerCase()
//                           .includes(driverSearch.toLowerCase()),
//                       )
//                       .map((driver) => (
//                         <div
//                           key={driver._id}
//                           onClick={() => setSelectedDriver(driver)}
//                           className={`p-4 border-2 rounded-2xl flex items-center gap-4 cursor-pointer transition-all ${selectedDriver?._id === driver._id ? "border-blue-600 bg-blue-50" : "border-slate-100 hover:border-blue-100"}`}
//                         >
//                           <img
//                             src={driver.photo}
//                             className="w-10 h-10 rounded-lg object-cover"
//                             alt=""
//                           />
//                           <div className="flex-grow">
//                             <p className="text-xs font-black text-slate-800 uppercase leading-none">
//                               {driver.name}
//                             </p>
//                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
//                               {driver.phoneNumber}
//                             </p>
//                           </div>
//                           {selectedDriver?._id === driver._id && (
//                             <FiCheck className="text-blue-600" />
//                           )}
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               ) : (
//                 /* Professional Info Display */
//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//                   {/* Left Specs */}
//                   <div className="lg:col-span-4 space-y-6">
//                     <section className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 shadow-inner">
//                       <h3 className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
//                         Client Intelligence
//                       </h3>
//                       <div className="flex flex-col gap-1">
//                         <span className="text-sm font-black text-slate-800">
//                           {selectedBooking.userId?.name}
//                         </span>
//                         <span className="text-[11px] text-slate-500 lowercase font-medium">
//                           {selectedBooking.userId?.email}
//                         </span>
//                         <span className="text-[11px] text-slate-600 font-bold mt-2">
//                           {selectedBooking.phoneNumber}
//                         </span>
//                       </div>
//                       <div className="mt-5 grid grid-cols-2 gap-2">
//                         <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
//                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
//                             Status
//                           </p>
//                           <p className="text-[10px] font-black uppercase text-blue-600">
//                             {selectedBooking.status}
//                           </p>
//                         </div>
//                         <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
//                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
//                             Payment
//                           </p>
//                           <p
//                             className={`text-[10px] font-black uppercase ${selectedBooking.paymentStatus === "paid" ? "text-emerald-600" : "text-rose-600"}`}
//                           >
//                             {selectedBooking.paymentStatus}
//                           </p>
//                         </div>
//                       </div>
//                     </section>

//                     <section className="bg-slate-900 p-6 rounded-[24px] text-white">
//                       <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
//                         Tactical Data
//                       </h3>
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center py-2 border-b border-white/5">
//                           <span className="text-[10px] font-bold text-slate-400">
//                             Unit Type
//                           </span>
//                           <span className="text-[11px] font-black uppercase text-blue-400">
//                             {selectedBooking.vehicleType}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2 border-b border-white/5">
//                           <span className="text-[10px] font-bold text-slate-400">
//                             Launch Date
//                           </span>
//                           <span className="text-[11px] font-black">
//                             {new Date(selectedBooking.dateFrom).toDateString()}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center py-2">
//                           <span className="text-[10px] font-bold text-slate-400">
//                             Time From
//                           </span>
//                           <span className="text-[11px] font-black text-emerald-400">
//                             {selectedBooking.timeFrom}
//                           </span>
//                         </div>
//                       </div>
//                     </section>
//                   </div>

//                   {/* Right Logistics */}
//                   <div className="lg:col-span-8 space-y-6">
//                     <div className="p-8 bg-[#fdfdfd] border border-slate-200 rounded-[32px] relative overflow-hidden">
//                       <div className="flex items-center justify-between gap-6 relative z-10">
//                         <div className="flex-1">
//                           <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">
//                             Origin Node
//                           </span>
//                           <h4 className="text-lg font-black text-slate-800 leading-tight">
//                             {selectedBooking.fromLocation}
//                           </h4>
//                         </div>
//                         <div className="flex flex-col items-center">
//                           <FiTruck className="text-blue-600 mb-1" size={20} />
//                           <div className="w-12 h-[2px] bg-slate-200"></div>
//                         </div>
//                         <div className="flex-1 text-right">
//                           <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">
//                             Target Node
//                           </span>
//                           <h4 className="text-lg font-black text-slate-800 leading-tight">
//                             {selectedBooking.toLocation}
//                           </h4>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Driver Quote Management */}
//                     <div>
//                       <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
//                         <FiDollarSign size={14} className="text-emerald-500" />{" "}
//                         Active Driver Bids (
//                         {selectedBooking.driverQuote?.length || 0})
//                       </h3>
//                       <div className="grid grid-cols-1 gap-3">
//                         {selectedBooking.driverQuote?.map((quote, idx) => (
//                           <div
//                             key={idx}
//                             className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between hover:border-blue-200 transition-all shadow-sm"
//                           >
//                             <div className="flex items-center gap-3">
//                               <img
//                                 src={quote.driverId?.photo}
//                                 className="w-9 h-9 rounded-lg object-cover"
//                                 alt=""
//                               />
//                               <div>
//                                 <p className="text-[11px] font-black text-slate-800 uppercase">
//                                   {quote.driverId?.name}
//                                 </p>
//                                 <p className="text-[9px] font-bold text-slate-400">
//                                   {quote.driverId?.phoneNumber}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-6">
//                               <div className="text-right">
//                                 <p className="text-[8px] font-black text-slate-400 uppercase">
//                                   Amount
//                                 </p>
//                                 <p className="text-sm font-black text-slate-900 uppercase">
//                                   ৳{quote.currentAmount}
//                                 </p>
//                               </div>
//                               <span className="text-[9px] font-black px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
//                                 {quote.status}
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Footer Control Panel */}
//             <div className="px-8 py-6 border-t bg-slate-50/80 flex flex-wrap gap-3 justify-end">
//               {assigningDriver ? (
//                 <>
//                   <button
//                     onClick={() => setAssigningDriver(false)}
//                     className="px-6 py-3 font-black text-[10px] text-slate-500 uppercase tracking-widest"
//                   >
//                     Back to Specs
//                   </button>
//                   <button
//                     disabled={!selectedDriver || mutationUpdate.isPending}
//                     onClick={() =>
//                       mutationUpdate.mutate({
//                         id: selectedBooking._id,
//                         status: "Private",
//                         driverId: selectedDriver._id,
//                       })
//                     }
//                     className="px-8 py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 disabled:bg-slate-300 transition-all active:scale-95"
//                   >
//                     {mutationUpdate.isPending
//                       ? "Configuring..."
//                       : "Confirm Private Deployment"}
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   <button
//                     onClick={() =>
//                       mutationUpdate.mutate({
//                         id: selectedBooking._id,
//                         status: "Public",
//                       })
//                     }
//                     className="px-6 py-3.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 transition-all"
//                   >
//                     Release Public
//                   </button>
//                   <button
//                     onClick={() => setAssigningDriver(true)}
//                     className="px-6 py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
//                   >
//                     Manual Assign
//                   </button>
//                   <button
//                     onClick={() => {
//                       if (window.confirm("Abort this mission?"))
//                         mutationUpdate.mutate({
//                           id: selectedBooking._id,
//                           status: "Cancel",
//                         });
//                     }}
//                     className="px-6 py-3.5 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
//                   >
//                     Reject Trip
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// _________________________________________________________________modal uper code missing_________________________
// import { useState, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   FiMoreVertical,
//   FiEye,
//   FiXCircle,
//   FiLock,
//   FiUser,
//   FiTruck,
//   FiMapPin,
//   FiCalendar,
//   FiPhone,
//   FiSearch,
//   FiCheck,
//   FiX,
//   FiMail,
//   FiActivity,
//   FiDollarSign,
//   FiChevronDown,
//   FiChevronUp,
//   FiArrowLeft,
//   FiPieChart,
//   FiShare2,
//   FiSave,
//   FiClock,
//   FiShield,
//   FiFilter,
// } from "react-icons/fi";

// const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// export default function SuperAdminFleetCommand() {
//   const queryClient = useQueryClient();

//   // States
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [assigningDriver, setAssigningDriver] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [quoteSearch, setQuoteSearch] = useState("");
//   const [quoteSort, setQuoteSort] = useState("newest"); // newest, lowest, highest
//   const [fullScreenPhoto, setFullScreenPhoto] = useState(null);
//   const [showSortOptions, setShowSortOptions] = useState(false);

//   // Constants
//   const REVENUE_PERCENTAGE = 0.05; // 5%

//   // ================= FETCH DATA =================
//   const { data: bookings = [], isLoading } = useQuery({
//     queryKey: ["all-bookings"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/bookings");
//       return Array.isArray(res.data) ? res.data : res.data.data;
//     },
//   });

//   // ================= MUTATIONS =================
//   const mutationUpdate = useMutation({
//     mutationFn: ({ id, status, driverId }) => {
//       let endpoint = `/bookings/to-public/${id}`;
//       if (status === "Private")
//         endpoint = `/bookings/to-assined-by-admin/${id}`;
//       if (status === "Cancel") endpoint = `/bookings/to-rejected/${id}`;
//       return axiosSecure.patch(endpoint, { driverId });
//     },
//     onSuccess: () => {
//       toast.success("Deployment Protocol Updated");
//       queryClient.invalidateQueries(["all-bookings"]);
//       closeAllModals();
//     },
//   });

//   // ================= LOGIC =================
//   const processedBookings = useMemo(() => {
//     return bookings.filter(
//       (item) =>
//         item.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   }, [bookings, searchTerm]);

//   // Filter and Sort Quotes inside the modal
//   const filteredQuotes = useMemo(() => {
//     if (!selectedBooking?.driverQuote) return [];
//     let quotes = [...selectedBooking.driverQuote].filter((q) =>
//       q.driverId?.name.toLowerCase().includes(quoteSearch.toLowerCase()),
//     );

//     if (quoteSort === "lowest")
//       quotes.sort((a, b) => a.currentAmount - b.currentAmount);
//     if (quoteSort === "highest")
//       quotes.sort((a, b) => b.currentAmount - a.currentAmount);
//     if (quoteSort === "newest")
//       quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     return quotes;
//   }, [selectedBooking, quoteSearch, quoteSort]);

//   const closeAllModals = () => {
//     setSelectedBooking(null);
//     setAssigningDriver(false);
//     setOpenDropdown(null);
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
//       pending: "bg-amber-100 text-amber-700 border-amber-200",
//       paid: "bg-blue-100 text-blue-700 border-blue-200",
//     };
//     return (
//       styles[status?.toLowerCase()] ||
//       "bg-slate-100 text-slate-700 border-slate-200"
//     );
//   };

//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
//       {/* Photo Viewer */}
//       {fullScreenPhoto && (
//         <div className="fixed inset-0 bg-black/95 z-[300] flex flex-col items-center justify-center p-4">
//           <div className="absolute top-8 left-8 flex gap-4">
//             <button
//               onClick={() => setFullScreenPhoto(null)}
//               className="flex items-center gap-2 text-white bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 border border-white/20 text-xs font-black uppercase"
//             >
//               <FiArrowLeft /> Back
//             </button>
//             <button className="flex items-center gap-2 text-white bg-blue-600 px-6 py-3 rounded-full text-xs font-black uppercase">
//               <FiSave /> Save Photo
//             </button>
//             <button className="flex items-center gap-2 text-white bg-emerald-600 px-6 py-3 rounded-full text-xs font-black uppercase">
//               <FiShare2 /> Share
//             </button>
//           </div>
//           <img
//             src={fullScreenPhoto}
//             className="max-w-full max-h-[80vh] rounded-2xl object-contain"
//             alt="Deep View"
//           />
//         </div>
//       )}

//       {/* Header & Table (Structure Kept Same as Requested) */}
//       <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
//         <h1 className="text-3xl font-black tracking-tighter">
//           FLEET <span className="text-blue-600">COMMAND</span>
//         </h1>
//         <div className="relative group">
//           <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search Master Manifest..."
//             className="pl-11 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-blue-600 w-64 shadow-sm"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
//         <table className="w-full text-left">
//           <thead className="bg-slate-50 border-b">
//             <tr>
//               <th className="p-6 text-[11px] font-black uppercase text-slate-400">
//                 Customer
//               </th>
//               <th className="p-6 text-[11px] font-black uppercase text-slate-400">
//                 Route
//               </th>
//               <th className="p-6 text-[11px] font-black uppercase text-slate-400">
//                 Vehicle
//               </th>
//               <th className="p-6 text-[11px] font-black uppercase text-slate-400">
//                 Finance
//               </th>
//               <th className="p-6 text-[11px] font-black uppercase text-slate-400 text-right">
//                 Control
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {processedBookings.map((booking) => (
//               <tr
//                 key={booking._id}
//                 className="hover:bg-blue-50/30 transition-all cursor-pointer"
//                 onClick={() => setSelectedBooking(booking)}
//               >
//                 <td className="p-6">
//                   <div className="font-black text-slate-800">
//                     {booking.userId?.name}
//                   </div>
//                   <div className="text-[10px] text-slate-400 font-bold">
//                     {booking.userId?.email}
//                   </div>
//                 </td>
//                 <td className="p-6 font-bold text-sm text-slate-600">
//                   {booking.fromLocation.split(",")[0]} →{" "}
//                   {booking.toLocation.split(",")[0]}
//                 </td>
//                 <td className="p-6">
//                   <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter">
//                     {booking.vehicleType}
//                   </span>
//                 </td>
//                 <td className="p-6">
//                   <span
//                     className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(booking.status)}`}
//                   >
//                     {booking.status}
//                   </span>
//                 </td>
//                 <td
//                   className="p-6 text-right relative"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     onClick={() =>
//                       setOpenDropdown(
//                         openDropdown === booking._id ? null : booking._id,
//                       )
//                     }
//                     className="p-2 hover:bg-slate-100 rounded-lg"
//                   >
//                     <FiMoreVertical />
//                   </button>
//                   {openDropdown === booking._id && (
//                     <div className="absolute right-6 mt-2 w-44 bg-white shadow-2xl rounded-xl border p-2 z-50">
//                       <button
//                         onClick={() => setSelectedBooking(booking)}
//                         className="flex items-center gap-3 w-full p-2 text-[11px] font-black hover:bg-slate-50 rounded-lg"
//                       >
//                         <FiEye className="text-blue-500" /> View Specs
//                       </button>
//                       <button
//                         onClick={() =>
//                           mutationUpdate.mutate({
//                             id: booking._id,
//                             status: "Cancel",
//                           })
//                         }
//                         className="flex items-center gap-3 w-full p-2 text-[11px] font-black hover:bg-rose-50 text-rose-600 rounded-lg"
//                       >
//                         <FiXCircle /> Terminate
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ================= INDUSTRIAL MODAL ================= */}
//       {selectedBooking && (
//         <div
//           className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4"
//           onClick={closeAllModals}
//         >
//           <div
//             className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
//                   <FiActivity size={24} />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">
//                     Operational Manifest
//                   </h2>
//                   <p className="text-slate-400 text-[9px] font-black tracking-widest uppercase">
//                     ID: {selectedBooking._id}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={closeAllModals}
//                 className="w-10 h-10 rounded-xl border hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-colors"
//               >
//                 <FiX size={20} />
//               </button>
//             </div>

//             <div className="flex-grow overflow-y-auto p-8 space-y-8 scrollbar-hide">
//               {/* Row 1: Customer & Booking Info */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* 1. Customer Section */}
//                 <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100 relative overflow-hidden">
//                   <FiUser
//                     className="absolute -right-4 -top-4 text-slate-200/50"
//                     size={120}
//                   />
//                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 flex items-center gap-2">
//                     <FiShield /> Client Authentication
//                   </h3>
//                   <div className="flex items-center gap-5 relative z-10">
//                     <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 border border-slate-200">
//                       <FiUser size={32} />
//                     </div>
//                     <div>
//                       <div className="text-xl font-black text-slate-900 leading-none">
//                         {selectedBooking.userId?.name}
//                       </div>
//                       <div className="text-sm font-bold text-slate-500 mt-1">
//                         {selectedBooking.phoneNumber}
//                       </div>
//                       <div className="flex gap-2 mt-3">
//                         <a
//                           href={`mailto:${selectedBooking.userId?.email}`}
//                           className="p-2 bg-blue-600 text-white rounded-lg hover:scale-105 transition-transform"
//                         >
//                           <FiMail size={16} />
//                         </a>
//                         <a
//                           href={`tel:${selectedBooking.phoneNumber}`}
//                           className="p-2 bg-emerald-600 text-white rounded-lg hover:scale-105 transition-transform"
//                         >
//                           <FiPhone size={16} />
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* 2. Booking Info Section */}
//                 <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden">
//                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
//                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">
//                     Logistics Parameters
//                   </h3>
//                   <div className="grid grid-cols-2 gap-6">
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
//                         Pickup Location
//                       </p>
//                       <p className="text-sm font-bold flex items-start gap-2">
//                         <FiMapPin className="mt-1 text-blue-400 flex-shrink-0" />{" "}
//                         {selectedBooking.fromLocation}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
//                         Destination
//                       </p>
//                       <p className="text-sm font-bold flex items-start gap-2">
//                         <FiMapPin className="mt-1 text-rose-400 flex-shrink-0" />{" "}
//                         {selectedBooking.toLocation}
//                       </p>
//                     </div>
//                     <div className="pt-4 border-t border-white/10">
//                       <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
//                         Schedule
//                       </p>
//                       <p className="text-sm font-bold flex items-center gap-2">
//                         <FiCalendar className="text-blue-400" />{" "}
//                         {new Date(
//                           selectedBooking.dateFrom,
//                         ).toLocaleDateString()}
//                       </p>
//                       <p className="text-xs text-slate-400 font-bold ml-6 mt-1">
//                         {selectedBooking.timeFrom} - {selectedBooking.timeTo}
//                       </p>
//                     </div>
//                     <div className="pt-4 border-t border-white/10">
//                       <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
//                         Vehicle Class
//                       </p>
//                       <p className="text-sm font-bold flex items-center gap-2 capitalize">
//                         <FiTruck className="text-blue-400" />{" "}
//                         {selectedBooking.vehicleType} (
//                         {selectedBooking.tripType})
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* 3. Driver Quotes Section */}
//               <div className="space-y-4">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                   <h3 className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-3">
//                     <FiPieChart className="text-blue-600" /> Driver Bidding Pool
//                     <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">
//                       {selectedBooking.driverQuote?.length || 0}
//                     </span>
//                   </h3>

//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <FiSearch
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                         size={14}
//                       />
//                       <input
//                         type="text"
//                         placeholder="Filter drivers..."
//                         className="pl-9 pr-4 py-2 border rounded-xl text-xs font-bold outline-none focus:border-blue-600 w-44"
//                         onChange={(e) => setQuoteSearch(e.target.value)}
//                       />
//                     </div>
//                     <select
//                       className="text-xs font-black uppercase border rounded-xl px-3 py-2 outline-none bg-white"
//                       value={quoteSort}
//                       onChange={(e) => setQuoteSort(e.target.value)}
//                     >
//                       <option value="newest">Latest Bid</option>
//                       <option value="lowest">Lowest Price</option>
//                       <option value="highest">Highest Price</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {filteredQuotes.map((quote) => (
//                     <div
//                       key={quote._id}
//                       className={`p-5 rounded-3xl border-2 transition-all hover:shadow-lg ${quote.status === "confirmed" ? "border-emerald-500 bg-emerald-50/30" : "border-slate-100 bg-white"}`}
//                     >
//                       <div className="flex items-center gap-4 mb-4">
//                         <img
//                           src={quote.driverId?.photo}
//                           className="w-14 h-14 rounded-2xl object-cover cursor-pointer hover:scale-105 transition-transform border-2 border-white shadow-sm"
//                           onClick={() =>
//                             setFullScreenPhoto(quote.driverId?.photo)
//                           }
//                         />
//                         <div className="flex-grow">
//                           <div className="text-sm font-black text-slate-900">
//                             {quote.driverId?.name}
//                           </div>
//                           <div className="flex items-center gap-2 mt-1">
//                             <a
//                               href={`tel:${quote.driverId?.phoneNumber}`}
//                               className="text-[10px] font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1"
//                             >
//                               <FiPhone size={10} /> Contact
//                             </a>
//                             <span
//                               className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${quote.status === "confirmed" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}
//                             >
//                               {quote.status}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex justify-between items-end border-t pt-4">
//                         <div>
//                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none">
//                             Quote Amount
//                           </p>
//                           <p className="text-xl font-black text-slate-900 mt-1">
//                             ৳{quote.currentAmount}
//                           </p>
//                         </div>
//                         <button
//                           className={`p-2 rounded-xl transition-colors ${quote.status === "confirmed" ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-blue-600"}`}
//                         >
//                           {quote.status === "confirmed" ? (
//                             <FiCheck size={18} />
//                           ) : (
//                             <FiClock size={18} />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                   {filteredQuotes.length === 0 && (
//                     <div className="col-span-full py-12 text-center text-slate-400 font-bold border-2 border-dashed rounded-3xl">
//                       No bids found for this deployment.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* 4. Footer: Revenue Calculation */}
//             <div className="px-10 py-8 bg-slate-900 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
//               <div className="flex items-center gap-8">
//                 <div className="flex flex-col">
//                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
//                     Confirmed Amount
//                   </span>
//                   <span className="text-2xl font-black text-white">
//                     ৳
//                     {selectedBooking.driverQuote?.find(
//                       (q) => q.status === "confirmed",
//                     )?.currentAmount || 0}
//                   </span>
//                 </div>
//                 <div className="w-px h-10 bg-white/10"></div>
//                 <div className="flex flex-col">
//                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
//                     Platform Revenue (5%)
//                   </span>
//                   <div className="flex items-center gap-2">
//                     <span className="text-2xl font-black text-emerald-400">
//                       ৳
//                       {(
//                         (selectedBooking.driverQuote?.find(
//                           (q) => q.status === "confirmed",
//                         )?.currentAmount || 0) * REVENUE_PERCENTAGE
//                       ).toFixed(2)}
//                     </span>
//                     <FiDollarSign className="text-emerald-400" size={20} />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <button
//                   onClick={closeAllModals}
//                   className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 transition-all"
//                 >
//                   Close Manifest
//                 </button>
//                 <button
//                   onClick={() => toast.success("Invoice Generated")}
//                   className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all"
//                 >
//                   Generate Invoice
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// import { useState, useMemo } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   FiMoreVertical,
//   FiEye,
//   FiXCircle,
//   FiLock,
//   FiUser,
//   FiTruck,
//   FiMapPin,
//   FiCalendar,
//   FiPhone,
//   FiSearch,
//   FiCheck,
//   FiX,
//   FiMail,
//   FiActivity,
//   FiDollarSign,
//   FiChevronDown,
//   FiChevronUp,
//   FiArrowLeft,
//   FiPieChart,
//   FiShare2,
//   FiSave,
//   FiClock,
//   FiShield,
//   FiSend,
//   FiSlash,
// } from "react-icons/fi";

// const axiosSecure = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// export default function SuperAdminFleetCommand() {
//   const queryClient = useQueryClient();

//   // States
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [quoteSearch, setQuoteSearch] = useState("");
//   const [quoteSort, setQuoteSort] = useState("newest");
//   const [fullScreenPhoto, setFullScreenPhoto] = useState(null);

//   // Constants
//   const REVENUE_PERCENTAGE = 0.05; // 5%

//   // ================= FETCH DATA =================
//   const { data: bookings = [], isLoading } = useQuery({
//     queryKey: ["all-bookings"],
//     queryFn: async () => {
//       const res = await axiosSecure.get("/bookings");
//       return Array.isArray(res.data) ? res.data : res.data.data;
//     },
//   });

//   // ================= MUTATIONS =================
//   const mutationUpdate = useMutation({
//     mutationFn: ({ id, status, driverId }) => {
//       let endpoint = `/bookings/to-public/${id}`;
//       if (status === "Private")
//         endpoint = `/bookings/to-assined-by-admin/${id}`;
//       if (status === "Cancel") endpoint = `/bookings/to-rejected/${id}`;
//       return axiosSecure.patch(endpoint, { driverId });
//     },
//     onSuccess: () => {
//       toast.success("Manifest Status Updated Successfully");
//       queryClient.invalidateQueries(["all-bookings"]);
//       closeAllModals();
//     },
//     onError: () => {
//       toast.error("Operation Protocol Failed");
//     },
//   });

//   // ================= LOGIC =================
//   const processedBookings = useMemo(() => {
//     return bookings.filter(
//       (item) =>
//         item.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   }, [bookings, searchTerm]);

//   const filteredQuotes = useMemo(() => {
//     if (!selectedBooking?.driverQuote) return [];
//     let quotes = [...selectedBooking.driverQuote].filter((q) =>
//       q.driverId?.name.toLowerCase().includes(quoteSearch.toLowerCase()),
//     );

//     if (quoteSort === "lowest")
//       quotes.sort((a, b) => a.currentAmount - b.currentAmount);
//     if (quoteSort === "highest")
//       quotes.sort((a, b) => b.currentAmount - a.currentAmount);
//     if (quoteSort === "newest")
//       quotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     return quotes;
//   }, [selectedBooking, quoteSearch, quoteSort]);

//   const closeAllModals = () => {
//     setSelectedBooking(null);
//     setOpenDropdown(null);
//   };

//   const getStatusBadge = (status) => {
//     const styles = {
//       confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
//       pending: "bg-amber-100 text-amber-700 border-amber-200",
//       paid: "bg-blue-100 text-blue-700 border-blue-200",
//     };
//     return (
//       styles[status?.toLowerCase()] ||
//       "bg-slate-100 text-slate-700 border-slate-200"
//     );
//   };

//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-slate-50">
//         <FiActivity className="animate-spin text-blue-600" size={40} />
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-10 bg-[#f8fafc] min-h-screen font-sans">
//       {/* Photo Viewer Component */}
//       {fullScreenPhoto && (
//         <div className="fixed inset-0 bg-black/95 z-[300] flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
//           <div className="absolute top-8 left-8 flex gap-4">
//             <button
//               onClick={() => setFullScreenPhoto(null)}
//               className="flex items-center gap-2 text-white bg-white/10 px-6 py-3 rounded-full hover:bg-white/20 border border-white/20 text-xs font-black uppercase"
//             >
//               <FiArrowLeft /> Back
//             </button>
//             <button className="flex items-center gap-2 text-white bg-blue-600 px-6 py-3 rounded-full text-xs font-black uppercase">
//               <FiSave /> Save
//             </button>
//             <button className="flex items-center gap-2 text-white bg-emerald-600 px-6 py-3 rounded-full text-xs font-black uppercase">
//               <FiShare2 /> Share
//             </button>
//           </div>
//           <img
//             src={fullScreenPhoto}
//             className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl"
//             alt="Deep View"
//           />
//         </div>
//       )}

//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
//         <h1 className="text-4xl font-black tracking-tighter">
//           FLEET <span className="text-blue-600">COMMAND</span>
//         </h1>
//         <div className="relative group">
//           <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search Master Manifest..."
//             className="pl-11 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-blue-600 w-64 md:w-80 shadow-sm transition-all"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Main Table Structure */}
//       <div className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-xl border border-slate-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="bg-slate-50/50 border-b">
//               <tr>
//                 <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-wider">
//                   Customer
//                 </th>
//                 <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-wider">
//                   Route
//                 </th>
//                 <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-wider">
//                   Vehicle
//                 </th>
//                 <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-wider">
//                   Status
//                 </th>
//                 <th className="p-6 text-[11px] font-black uppercase text-slate-400 tracking-wider text-right">
//                   Control
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {processedBookings.map((booking) => (
//                 <tr
//                   key={booking._id}
//                   className="group hover:bg-blue-50/30 transition-all cursor-pointer"
//                   onClick={() => setSelectedBooking(booking)}
//                 >
//                   <td className="p-6">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-white">
//                         <FiUser size={18} />
//                       </div>
//                       <div>
//                         <div className="font-black text-slate-800">
//                           {booking.userId?.name}
//                         </div>
//                         <div className="text-[10px] text-slate-400 font-bold">
//                           {booking.userId?.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-6 font-bold text-sm text-slate-600">
//                     {booking.fromLocation.split(",")[0]} →{" "}
//                     {booking.toLocation.split(",")[0]}
//                   </td>
//                   <td className="p-6">
//                     <span className="bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter">
//                       {booking.vehicleType}
//                     </span>
//                   </td>
//                   <td className="p-6">
//                     <span
//                       className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(booking.status)}`}
//                     >
//                       {booking.status}
//                     </span>
//                   </td>
//                   <td
//                     className="p-6 text-right relative"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <button
//                       onClick={() =>
//                         setOpenDropdown(
//                           openDropdown === booking._id ? null : booking._id,
//                         )
//                       }
//                       className="p-3 hover:bg-white border-2 border-transparent hover:border-slate-100 rounded-2xl transition-all shadow-sm"
//                     >
//                       <FiMoreVertical />
//                     </button>
//                     {openDropdown === booking._id && (
//                       <div className="absolute right-6 mt-2 w-48 bg-white shadow-2xl rounded-2xl border p-2 z-50 animate-in slide-in-from-top-2">
//                         <button
//                           onClick={() => setSelectedBooking(booking)}
//                           className="flex items-center gap-3 w-full p-3 text-[11px] font-black hover:bg-slate-50 rounded-xl transition-colors"
//                         >
//                           <FiEye className="text-blue-500" /> View Specs
//                         </button>
//                         <div className="h-px bg-slate-50 my-1"></div>
//                         <button
//                           onClick={() =>
//                             mutationUpdate.mutate({
//                               id: booking._id,
//                               status: "Cancel",
//                             })
//                           }
//                           className="flex items-center gap-3 w-full p-3 text-[11px] font-black hover:bg-rose-50 text-rose-600 rounded-xl transition-colors"
//                         >
//                           <FiXCircle /> Terminate
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ================= INDUSTRIAL MODAL ================= */}
//       {selectedBooking && (
//         <div
//           className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4"
//           onClick={closeAllModals}
//         >
//           <div
//             className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[48px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="px-10 py-8 border-b flex justify-between items-center bg-slate-50/80">
//               <div className="flex items-center gap-5">
//                 <div className="p-4 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200">
//                   <FiActivity size={28} />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800">
//                     Operational Manifest
//                   </h2>
//                   <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase">
//                     Deployment ID: {selectedBooking._id}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={closeAllModals}
//                 className="w-12 h-12 rounded-2xl border-2 border-slate-100 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center"
//               >
//                 <FiX size={24} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="flex-grow overflow-y-auto p-10 space-y-10 scrollbar-hide">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 {/* Section 1: Customer All Info */}
//                 <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-100 relative">
//                   <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
//                     <FiShield /> Client Profile
//                   </h3>
//                   <div className="flex items-center gap-6">
//                     <div className="w-20 h-20 bg-white rounded-[28px] shadow-sm flex items-center justify-center text-slate-300 border border-slate-100">
//                       <FiUser size={40} />
//                     </div>
//                     <div className="flex-grow">
//                       <div className="text-2xl font-black text-slate-900 leading-tight">
//                         {selectedBooking.userId?.name}
//                       </div>
//                       <div className="text-sm font-bold text-slate-500 mt-1">
//                         {selectedBooking.userId?.email}
//                       </div>
//                       <div className="text-sm font-bold text-slate-900 mt-1">
//                         {selectedBooking.phoneNumber}
//                       </div>
//                       <div className="flex gap-3 mt-4">
//                         <a
//                           href={`mailto:${selectedBooking.userId?.email}`}
//                           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase hover:bg-blue-700 transition-colors"
//                         >
//                           <FiMail /> Email Client
//                         </a>
//                         <a
//                           href={`tel:${selectedBooking.phoneNumber}`}
//                           className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase hover:bg-emerald-700 transition-colors"
//                         >
//                           <FiPhone /> Voice Call
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Section 2: Booking All Info */}
//                 <div className="bg-slate-900 rounded-[40px] p-8 text-white relative shadow-2xl">
//                   <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
//                     <FiPieChart /> Logistics Spec
//                   </h3>
//                   <div className="grid grid-cols-2 gap-y-6 gap-x-8">
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
//                         Pickup
//                       </p>
//                       <p className="text-sm font-bold leading-snug">
//                         <FiMapPin className="inline text-blue-400 mr-1" />{" "}
//                         {selectedBooking.fromLocation}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
//                         Dropoff
//                       </p>
//                       <p className="text-sm font-bold leading-snug">
//                         <FiMapPin className="inline text-rose-400 mr-1" />{" "}
//                         {selectedBooking.toLocation}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
//                         Manifest Date
//                       </p>
//                       <p className="text-sm font-bold leading-snug">
//                         <FiCalendar className="inline text-blue-400 mr-1" />{" "}
//                         {new Date(
//                           selectedBooking.dateFrom,
//                         ).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-500 mb-1">
//                         Unit Class
//                       </p>
//                       <p className="text-sm font-bold leading-snug capitalize">
//                         <FiTruck className="inline text-blue-400 mr-1" />{" "}
//                         {selectedBooking.vehicleType} (
//                         {selectedBooking.tripType?.replace("_", " ")})
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Section 3: Driver Quotes with Search & Sort */}
//               <div className="space-y-6">
//                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
//                   <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 flex items-center gap-3">
//                     Driver Bidding Pool
//                     <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full">
//                       {selectedBooking.driverQuote?.length || 0} Bids
//                     </span>
//                   </h3>

//                   <div className="flex items-center gap-3">
//                     <div className="relative">
//                       <FiSearch
//                         className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                         size={16}
//                       />
//                       <input
//                         type="text"
//                         placeholder="Filter by driver..."
//                         className="pl-10 pr-4 py-3 border-2 border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-blue-600 w-56"
//                         onChange={(e) => setQuoteSearch(e.target.value)}
//                       />
//                     </div>
//                     <select
//                       className="text-xs font-black uppercase border-2 border-slate-100 rounded-xl px-4 py-3 outline-none bg-white cursor-pointer"
//                       value={quoteSort}
//                       onChange={(e) => setQuoteSort(e.target.value)}
//                     >
//                       <option value="newest">Newest First</option>
//                       <option value="lowest">Lowest Price</option>
//                       <option value="highest">Highest Price</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredQuotes.map((quote) => (
//                     <div
//                       key={quote._id}
//                       className={`p-6 rounded-[32px] border-2 transition-all hover:shadow-xl group bg-white ${quote.status === "confirmed" ? "border-emerald-500 shadow-lg shadow-emerald-50" : "border-slate-100"}`}
//                     >
//                       <div className="flex items-center gap-4 mb-6">
//                         <div className="relative">
//                           <img
//                             src={quote.driverId?.photo}
//                             className="w-16 h-16 rounded-2xl object-cover cursor-pointer hover:opacity-80 transition-opacity ring-4 ring-white shadow-md"
//                             onClick={() =>
//                               setFullScreenPhoto(quote.driverId?.photo)
//                             }
//                           />
//                           {quote.status === "confirmed" && (
//                             <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full">
//                               <FiCheck size={12} />
//                             </div>
//                           )}
//                         </div>
//                         <div className="flex-grow">
//                           <div className="text-base font-black text-slate-900">
//                             {quote.driverId?.name}
//                           </div>
//                           <div className="flex items-center gap-2 mt-1">
//                             <a
//                               href={`tel:${quote.driverId?.phoneNumber}`}
//                               className="p-1.5 bg-slate-100 rounded-lg text-slate-600 hover:bg-blue-600 hover:text-white transition-all"
//                             >
//                               <FiPhone size={12} />
//                             </a>
//                             <span
//                               className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${quote.status === "confirmed" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-500"}`}
//                             >
//                               {quote.status}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex justify-between items-end bg-slate-50 p-4 rounded-2xl">
//                         <div>
//                           <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">
//                             Current Bid
//                           </p>
//                           <p className="text-xl font-black text-slate-900">
//                             ৳{quote.currentAmount}
//                           </p>
//                         </div>
//                         <div className="flex flex-col items-end gap-1">
//                           <p className="text-[8px] font-black text-slate-400 uppercase">
//                             Status
//                           </p>
//                           <p className="text-[10px] font-bold text-slate-600">
//                             {new Date(quote.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Section 4: Modal Footer - Calculated Revenue */}
//             <div className="px-10 py-8 bg-slate-900 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-8">
//               <div className="flex items-center gap-10">
//                 <div className="flex flex-col">
//                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
//                     Confirmed Total
//                   </span>
//                   <span className="text-3xl font-black text-white">
//                     ৳
//                     {selectedBooking.driverQuote?.find(
//                       (q) => q.status === "confirmed",
//                     )?.currentAmount || 0}
//                   </span>
//                 </div>
//                 <div className="w-px h-12 bg-white/10 hidden lg:block"></div>
//                 <div className="flex flex-col">
//                   <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">
//                     Platform Revenue (5%)
//                   </span>
//                   <div className="flex items-center gap-3">
//                     <span className="text-3xl font-black text-emerald-400">
//                       ৳
//                       {(
//                         (selectedBooking.driverQuote?.find(
//                           (q) => q.status === "confirmed",
//                         )?.currentAmount || 0) * REVENUE_PERCENTAGE
//                       ).toFixed(2)}
//                     </span>
//                     <div className="p-1.5 bg-emerald-500/10 rounded-lg">
//                       <FiDollarSign className="text-emerald-400" size={20} />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ACTION BUTTONS: Public, Private, Cancel */}
//               <div className="flex flex-wrap gap-4">
//                 <button
//                   onClick={() =>
//                     mutationUpdate.mutate({
//                       id: selectedBooking._id,
//                       status: "Public",
//                     })
//                   }
//                   className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
//                 >
//                   <FiSend /> Release Public
//                 </button>
//                 <button
//                   onClick={() =>
//                     mutationUpdate.mutate({
//                       id: selectedBooking._id,
//                       status: "Private",
//                     })
//                   }
//                   className="flex items-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
//                 >
//                   <FiLock /> Assign Private
//                 </button>
//                 <button
//                   onClick={() => {
//                     if (window.confirm("Abort this deployment?"))
//                       mutationUpdate.mutate({
//                         id: selectedBooking._id,
//                         status: "Cancel",
//                       });
//                   }}
//                   className="flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
//                 >
//                   <FiSlash /> Terminate
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// _____________________________________uper code modal ok but button not working____________________________
// _____________________________________uper code modal ok but button not working____________________________
// _____________________________________uper code modal ok but button not working____________________________
// _____________________________________uper code modal ok but button not working____________________________
// _____________________________________uper code modal ok but button not working____________________________
// _____________________________________uper code modal ok but button not working____________________________
// _____________________________________uper code modal ok but button not working____________________________
// _____________________________________uper code modal ok but button not working____________________________
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
// } from "react-icons/fi";

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
//   };

//   // --- Quote Action Handlers ---
//   const handleAcceptQuote = async (bookingId, quoteId) => {
//     console.log(`Accepting Quote: ${quoteId} for Booking: ${bookingId}`);
//     // Logic: axiosSecure.patch(`/bookings/${bookingId}/accept/${quoteId}`)
//   };

//   const handleRejectQuote = async (bookingId, quoteId) => {
//     console.log(`Rejecting Quote: ${quoteId} for Booking: ${bookingId}`);
//     // Logic: axiosSecure.delete(`/bookings/${bookingId}/quote/${quoteId}`)
//   };

//   if (isLoading)
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//         <FiLoader className="text-4xl text-blue-600 animate-spin" />
//         <p className="font-bold text-slate-500 animate-pulse">
//           Syncing Fleet Data...
//         </p>
//       </div>
//     );

//   return (
//     <div className="p-4 sm:p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
//       {/* Header & Filters */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h1 className="text-3xl font-black tracking-tight">
//             Global Logistics Manager
//           </h1>
//           <p className="text-slate-500 text-sm font-medium">
//             Monitoring {bookings.length} Total Operations
//           </p>
//         </div>

//         <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
//           {["all", "pending", "confirmed", "paid"].map((status) => (
//             <button
//               key={status}
//               onClick={() => setStatusFilter(status)}
//               className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${
//                 statusFilter === status
//                   ? "bg-slate-900 text-white shadow-md"
//                   : "text-slate-400 hover:text-slate-600"
//               }`}
//             >
//               {status}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="overflow-x-auto bg-white shadow-sm rounded-2xl border border-slate-200">
//         <table className="min-w-full text-sm">
//           <thead className="bg-slate-50 border-b border-slate-200">
//             <tr>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Route
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Client
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Asset
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Driver
//               </th>
//               <th className="p-5 font-bold text-slate-500 text-left uppercase tracking-wider text-[11px]">
//                 Financials
//               </th>
//               <th className="p-5 text-right font-bold text-slate-500 uppercase tracking-wider text-[11px]">
//                 Status
//               </th>
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
//                 {/* Active Driver/Vehicle */}
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

//                         {/* Quote Action Buttons */}
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

//                 {/* Route */}
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
//             <div className="px-8 py-6 border-t bg-slate-50 flex justify-between items-center">
//               <div className="flex gap-6">
//                 <div>
//                   <p className="text-[9px] font-black text-slate-400 uppercase">
//                     Status
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
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => handleDownloadManifest(selectedBooking._id)}
//                   className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase"
//                 >
//                   <FiDownload /> Manifest
//                 </button>
//                 <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase hover:bg-red-100">
//                   <FiTrash2 /> Terminate
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// _____________________________uper code good but only button not working___________________________________________
// _____________________________uper code good but only button not working___________________________________________
// _____________________________uper code good but only button not working___________________________________________
// _____________________________uper code good but only button not working___________________________________________
// _____________________________uper code good but only button not working___________________________________________
// _____________________________uper code good but only button not working___________________________________________
// _____________________________uper code good but only button not working___________________________________________
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
    <div className="p-4 sm:p-6 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Global Logistics Manager
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Monitoring {bookings.length} Total Operations
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          {["all", "pending", "confirmed", "paid"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${
                statusFilter === status
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white shadow-sm rounded-2xl border border-slate-200">
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
// ____________________________uper all good but assign button not good__________________________________
// ____________________________uper all good but assign button not good__________________________________
// ____________________________uper all good but assign button not good__________________________________
// ____________________________uper all good but assign button not good__________________________________
// ____________________________uper all good but assign button not good__________________________________
// ____________________________uper all good but assign button not good__________________________________
// ____________________________uper all good but assign button not good__________________________________
