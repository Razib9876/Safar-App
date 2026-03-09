// import { useState, useRef, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// const fetchCompletedBookings = async () => {
//   const res = await axios.get(
//     `${import.meta.env.VITE_API_URL}/bookings?status=completed`,
//   );

//   return res.data.data || [];
// };

// export default function CompletedBookings() {
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const modalRef = useRef();

//   const { data: bookings = [], isLoading } = useQuery({
//     queryKey: ["completed-bookings"],
//     queryFn: fetchCompletedBookings,
//   });

//   // Close modal if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setSelectedBooking(null);
//       }
//     };

//     if (selectedBooking) {
//       document.addEventListener("mousedown", handleClickOutside);
//     } else {
//       document.removeEventListener("mousedown", handleClickOutside);
//     }

//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [selectedBooking]);

//   if (isLoading)
//     return <div className="p-6 text-center">Loading completed bookings...</div>;

//   return (
//     <div className="mx-auto ">
//       <h1 className="text-2xl font-bold mb-6">Completed Bookings</h1>

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
//             </tr>
//           </thead>

//           <tbody>
//             {bookings.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={6}
//                   className="p-4 text-center text-gray-500 font-medium w-svh"
//                 >
//                   No completed bookings found
//                 </td>
//               </tr>
//             )}

//             {bookings.map((booking) => (
//               <tr
//                 key={booking._id}
//                 className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
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
//                   <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
//                     {booking.status}
//                   </span>
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
//             className="bg-white p-4 rounded-xl shadow cursor-pointer transition-transform hover:scale-[1.01]"
//             onClick={() => setSelectedBooking(booking)}
//           >
//             <div className="flex justify-between">
//               <div>
//                 <div className="font-semibold">{booking.userId?.name}</div>
//                 <div className="text-sm text-gray-500">
//                   {booking.vehicleType.toUpperCase()}
//                 </div>
//               </div>

//               <span className="text-xs bg-green-100 px-2 py-1 rounded">
//                 {booking.status}
//               </span>
//             </div>

//             <div className="mt-2 text-sm text-gray-600">
//               {booking.fromLocation} → {booking.toLocation}
//             </div>
//           </div>
//         ))}

//         {bookings.length === 0 && (
//           <div className="text-center text-gray-500 font-medium p-4">
//             No completed bookings found
//           </div>
//         )}
//       </div>

//       {/* ================= PROFESSIONAL MODAL ================= */}
//       {selectedBooking && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
//           <div
//             ref={modalRef}
//             className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative transform transition-transform scale-95 animate-scaleUp"
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setSelectedBooking(null)}
//               className="absolute top-3 right-3 text-gray-500 text-lg hover:text-gray-700 transition"
//             >
//               ✕
//             </button>

//             <h2 className="text-2xl font-bold mb-5 border-b pb-2">
//               Booking Details
//             </h2>

//             <div className="space-y-3 text-sm text-gray-700">
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
//                 <strong>Trip:</strong>{" "}
//                 {selectedBooking.tripType.replace("_", " ")}
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
//                 <strong>Status:</strong>{" "}
//                 <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
//                   {selectedBooking.status}
//                 </span>
//               </p>
//               <p>
//                 <strong>Payment:</strong> {selectedBooking.paymentStatus}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODAL ANIMATION ================= */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//           }
//           to {
//             opacity: 1;
//           }
//         }
//         @keyframes scaleUp {
//           from {
//             transform: scale(0.95);
//           }
//           to {
//             transform: scale(1);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out forwards;
//         }
//         .animate-scaleUp {
//           animation: scaleUp 0.2s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// }
// ___________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________
// ___________________________________________________________________________________________________________________
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FiUser,
  FiTruck,
  FiMapPin,
  FiCalendar,
  FiExternalLink,
  FiSearch,
  FiClock,
  FiDollarSign,
  FiShield,
  FiClipboard,
  FiCreditCard,
  FiArchive,
} from "react-icons/fi";

const fetchCompletedBookings = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/bookings?status=completed`,
  );
  return res.data.data || [];
};

export default function CompletedBookings() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["completed-bookings"],
    queryFn: fetchCompletedBookings,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target))
        setSelectedBooking(null);
    };
    if (selectedBooking)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedBooking]);

  const filteredBookings = bookings.filter(
    (b) =>
      b.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.fromLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.toLocation.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading)
    return (
      <div className="p-12 text-center animate-pulse font-mono text-slate-400 tracking-tighter">
        INITIALIZING_SECURE_DATA_FETCH...
      </div>
    );

  return (
    <div className="w-full pb-10">
      {/* Header Section */}
      <div className="px-0 sm:px-6 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 border-2 border-orange-200">
              <FiArchive size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                Dispatch <span className="text-orange-600">Archive</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
                Data_Verification • {bookings.length} Encrypted Records
              </p>
            </div>
          </div>

          {/* Industrial Search Bar */}
          <div className="relative group w-full lg:w-96">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <FiSearch
                className="text-slate-400 group-focus-within:text-orange-600 transition-colors"
                size={20}
              />
            </div>
            <input
              type="text"
              placeholder="SCAN_MANIFEST_OR_ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] text-[12px] font-bold uppercase tracking-widest focus:border-orange-600 focus:ring-8 ring-orange-600/5 outline-none transition-all shadow-sm placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
              <th className="p-4 text-left">Customer / ID</th>
              <th className="p-4 text-left">Logistics Spec</th>
              <th className="p-4 text-left">Route Information</th>
              <th className="p-4 text-left">Driver Assigned</th>
              <th className="p-4 text-right">Final Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBookings.map((booking) => (
              <tr
                key={booking._id}
                onClick={() => setSelectedBooking(booking)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="p-4">
                  <div className="font-bold text-slate-900">
                    {booking.userId?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    #{booking._id.slice(-8)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-600 uppercase italic">
                      {booking.vehicleType}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 capitalize">
                      {booking.tripType.replace("_", " ")}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <span className="truncate max-w-[150px]">
                      {booking.fromLocation}
                    </span>
                    <span className="text-slate-300">→</span>
                    <span className="truncate max-w-[150px]">
                      {booking.toLocation}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  {booking.driverId ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={booking.driverId.photo}
                        className="w-6 h-6 rounded-full object-cover grayscale group-hover:grayscale-0"
                        alt=""
                      />
                      <span className="font-medium text-slate-600">
                        {booking.driverId.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-xs">
                      Unassigned
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <div className="font-mono font-bold text-slate-900">
                    ৳{booking.driverQuote?.[0]?.currentAmount || 0}
                  </div>
                  <div className="text-[9px] font-black text-emerald-600 uppercase">
                    Paid
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="lg:hidden space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            onClick={() => setSelectedBooking(booking)}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm active:bg-slate-50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">
                  {booking.userId?.name}
                </h3>
                <p className="text-[10px] font-mono text-slate-400">
                  ID: {booking._id.slice(-8)}
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-1 rounded uppercase border border-emerald-100">
                {booking.status}
              </span>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-bold">
                <div className="truncate flex-1">
                  {booking.fromLocation.split(",")[0]}
                </div>
                <div className="px-2 text-slate-300">→</div>
                <div className="truncate flex-1 text-right">
                  {booking.toLocation.split(",")[0]}
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
                <span className="flex items-center gap-1">
                  <FiTruck className="text-blue-500" /> {booking.vehicleType}
                </span>
                <span className="flex items-center gap-1">
                  <FiDollarSign className="text-emerald-500" /> ৳
                  {booking.driverQuote?.[0]?.currentAmount || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= COMPREHENSIVE INDUSTRIAL MODAL ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-0 sm:p-4 overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-[40px] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Modal Header Area */}
            <div className="bg-slate-900 p-6 sm:p-10 text-white flex justify-between items-start relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                  Internal Manifest Log
                </p>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                  TRANS_{selectedBooking._id.slice(-10)}
                </h2>
                <div className="flex gap-4 mt-4">
                  <span className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    <FiCalendar className="text-blue-400" />{" "}
                    {new Date(selectedBooking.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2 text-xs font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase">
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-slate-900 transition-all font-black text-xl"
              >
                ✕
              </button>
              <FiTruck
                size={200}
                className="absolute -right-10 -bottom-10 text-white/5 rotate-12"
              />
            </div>

            {/* Modal Body: High Density Data */}
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Column 1: Core Logistics */}
              <div className="lg:col-span-2 space-y-8">
                {/* User & Contact */}
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiUser className="text-blue-600" /> Client Intelligence
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                        Legal Name
                      </p>
                      <p className="font-bold text-slate-800">
                        {selectedBooking.userId?.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {selectedBooking.userId?.email}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                        Emergency Contact
                      </p>
                      <p className="font-bold text-slate-800">
                        {selectedBooking.phoneNumber}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        Verified System Profile
                      </p>
                    </div>
                  </div>
                </section>

                {/* Route Configuration */}
                <section className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl">
                  <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">
                    Navigation Manifest
                  </h3>
                  <div className="flex flex-col gap-8 relative">
                    <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/10 border-l border-dashed border-white/20"></div>
                    <div className="flex gap-4 relative">
                      <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-slate-900 z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase">
                          Departure Point
                        </p>
                        <p className="text-sm font-bold leading-tight">
                          {selectedBooking.fromLocation}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-blue-400 font-mono">
                          <FiClock /> {selectedBooking.timeFrom}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 relative">
                      <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-slate-900 z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase">
                          Final Destination
                        </p>
                        <p className="text-sm font-bold leading-tight">
                          {selectedBooking.toLocation}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-emerald-400 font-mono">
                          <FiClock /> {selectedBooking.timeTo}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Driver & Vehicle Details (Nested Data Integration) */}
                {selectedBooking.driverId && (
                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FiShield className="text-emerald-600" /> Operational
                      Personnel
                    </h3>
                    <div className="border border-slate-200 rounded-[24px] p-6 flex flex-col md:flex-row gap-6">
                      <img
                        src={selectedBooking.driverId.photo}
                        className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-100"
                      />
                      <div className="flex-1 grid grid-cols-2 gap-y-4">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">
                            Operator
                          </p>
                          <p className="font-bold">
                            {selectedBooking.driverId.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">
                            Unit Type
                          </p>
                          <p className="font-bold text-blue-600 uppercase italic">
                            {selectedBooking.driverId.activeVehicle?.type}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">
                            Registration
                          </p>
                          <p className="font-mono text-xs font-bold">
                            {
                              selectedBooking.driverId.activeVehicle
                                ?.registrationNumber
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase">
                            License
                          </p>
                          <p className="font-mono text-xs font-bold">
                            {selectedBooking.driverId.drivingLicense?.number}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* Column 2: Financial & System Meta */}
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-6">
                  <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4">
                    Financial Audit
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-500">
                        Service Quote
                      </span>
                      <span className="text-2xl font-black text-slate-900 font-mono">
                        ৳{selectedBooking.driverQuote?.[0]?.currentAmount || 0}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-emerald-200 space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="text-slate-500">Payment Status</span>
                        <span className="text-emerald-700">
                          {selectedBooking.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="text-slate-500">Billing ID</span>
                        <span className="text-slate-900 font-mono">
                          {selectedBooking.payment?.slice(-8) || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-[32px] p-6 space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    System Metadata
                  </h3>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <FiClipboard className="text-slate-400" />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none">
                        Trip Class
                      </p>
                      <p className="text-xs font-bold capitalize">
                        {selectedBooking.tripType.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <FiCreditCard className="text-slate-400" />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase leading-none">
                        Public Visibility
                      </p>
                      <p className="text-xs font-bold italic">
                        {selectedBooking.isPublic
                          ? "LIVE_NETWORK"
                          : "PRIVATE_FLEET"}
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200">
                  <FiExternalLink /> Export PDF Manifest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
