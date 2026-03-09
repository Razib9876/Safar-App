// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { FiMoreVertical, FiEye } from "react-icons/fi";
// import axiosSecure from "../../../services/axiosSecure"; // your secure axios instance

// // ================= FETCH ON-RIDE DRIVERS =================
// const fetchOnRideDrivers = async () => {
//   const res = await axiosSecure.get("/drivers?status=on-ride");
//   return res.data.data;
// };

// export default function OnRideDriver() {
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);

//   /* ================= FETCH ================= */
//   const {
//     data: drivers = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["on-ride-drivers"],
//     queryFn: fetchOnRideDrivers,
//   });

//   if (isLoading)
//     return <div className="p-6 text-center">Loading drivers...</div>;

//   if (isError)
//     return (
//       <div className="p-6 text-center text-red-500">Failed to load drivers</div>
//     );

//   const handleDetails = (driver) => {
//     toast(`Viewing details for ${driver.name}`);
//     setSelectedDriver(driver);
//     setOpenDropdown(null);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">On-Ride Drivers</h1>

//       {/* ================= DESKTOP TABLE ================= */}
//       <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="p-3">Name</th>
//               <th className="p-3">Phone</th>
//               <th className="p-3">Vehicle</th>
//               <th className="p-3">NID</th>
//               <th className="p-3">License</th>
//               <th className="p-3">Status</th>
//               <th className="p-3 text-right">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {drivers.map((driver) => (
//               <tr
//                 key={driver._id}
//                 className="border-t hover:bg-gray-50 cursor-pointer"
//                 onClick={() => setSelectedDriver(driver)}
//               >
//                 <td className="p-3">
//                   <div className="font-medium">{driver.name}</div>
//                   <div className="text-xs text-gray-500">
//                     {driver.userId?.email}
//                   </div>
//                 </td>

//                 <td className="p-3">{driver.phoneNumber}</td>

//                 <td className="p-3 capitalize">
//                   {driver.activeVehicle?.type} - {driver.activeVehicle?.model}
//                 </td>

//                 <td className="p-3">
//                   {driver.nid?.verified ? (
//                     <span className="text-green-600 text-xs">Verified</span>
//                   ) : (
//                     <span className="text-yellow-600 text-xs">
//                       Not Verified
//                     </span>
//                   )}
//                 </td>

//                 <td className="p-3">
//                   {driver.drivingLicense?.verified ? (
//                     <span className="text-green-600 text-xs">Verified</span>
//                   ) : (
//                     <span className="text-yellow-600 text-xs">
//                       Not Verified
//                     </span>
//                   )}
//                 </td>

//                 <td className="p-3">
//                   <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
//                     {driver.status}
//                   </span>
//                 </td>

//                 {/* ================= ACTION DROPDOWN ================= */}
//                 <td
//                   className="p-3 text-right relative"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     onClick={() =>
//                       setOpenDropdown(
//                         openDropdown === driver._id ? null : driver._id,
//                       )
//                     }
//                   >
//                     <FiMoreVertical />
//                   </button>

//                   {openDropdown === driver._id && (
//                     <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
//                       <button
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
//                         onClick={() => handleDetails(driver)}
//                       >
//                         <FiEye /> Details
//                       </button>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ================= MOBILE VIEW ================= */}
//       <div className="lg:hidden space-y-4">
//         {drivers.map((driver) => (
//           <div
//             key={driver._id}
//             className="bg-white p-4 rounded-xl shadow cursor-pointer"
//             onClick={() => setSelectedDriver(driver)}
//           >
//             <div className="flex justify-between">
//               <div>
//                 <div className="font-semibold">{driver.name}</div>
//                 <div className="text-sm text-gray-500">
//                   {driver.activeVehicle?.type.toUpperCase()}
//                 </div>
//               </div>

//               <span className="text-xs bg-blue-100 px-2 py-1 rounded">
//                 {driver.status}
//               </span>
//             </div>

//             <div className="mt-2 text-sm text-gray-600">
//               {driver.phoneNumber}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ================= MODAL ================= */}
//       {selectedDriver && (
//         <div
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//           onClick={() => setSelectedDriver(null)}
//         >
//           <div
//             className="bg-white w-full max-w-lg rounded-xl p-6 relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setSelectedDriver(null)}
//               className="absolute top-3 right-3 text-gray-500"
//             >
//               ✕
//             </button>

//             <h2 className="text-xl font-bold mb-4">Driver Details</h2>

//             <div className="space-y-2 text-sm">
//               <p>
//                 <strong>Name:</strong> {selectedDriver.name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {selectedDriver.userId?.email}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {selectedDriver.phoneNumber}
//               </p>
//               <p>
//                 <strong>Vehicle:</strong> {selectedDriver.activeVehicle?.type} -{" "}
//                 {selectedDriver.activeVehicle?.model}
//               </p>
//               <p>
//                 <strong>NID:</strong> {selectedDriver.nid?.number}
//               </p>
//               <p>
//                 <strong>License:</strong>{" "}
//                 {selectedDriver.drivingLicense?.number}
//               </p>
//               <p>
//                 <strong>Status:</strong> {selectedDriver.status}
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// _____________________________________________________________________________________________________
// _____________________________________________________________________________________________________
// _____________________________________________________________________________________________________
// _____________________________________________________________________________________________________
// _____________________________________________________________________________________________________
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiMoreVertical,
  FiEye,
  FiTruck,
  FiMapPin,
  FiUser,
  FiPhone,
  FiInfo,
  FiSearch,
  FiX,
  FiActivity,
} from "react-icons/fi";
import axiosSecure from "../../../services/axiosSecure";

// ================= FETCH ON-RIDE DRIVERS =================
const fetchOnRideDrivers = async () => {
  const res = await axiosSecure.get("/drivers?status=on-ride");
  return res.data.data;
};

export default function OnRideDriver() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [search, setSearch] = useState("");

  /* ================= FETCH DATA ================= */
  const {
    data: drivers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["on-ride-drivers"],
    queryFn: fetchOnRideDrivers,
    refetchInterval: 30000, // Auto-refresh every 30s for live tracking
  });

  /* ================= FILTER LOGIC ================= */
  const filteredDrivers = drivers.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.phoneNumber?.includes(search),
  );

  const handleDetails = (driver) => {
    setSelectedDriver(driver);
    setOpenDropdown(null);
  };

  if (isLoading)
    return (
      <div className="p-20 text-center font-mono text-slate-400 animate-pulse tracking-widest text-xs">
        CONNECTING_TO_LIVE_FLEET...
      </div>
    );

  if (isError)
    return (
      <div className="p-20 text-center text-red-500 font-black uppercase tracking-tighter italic">
        <FiActivity className="mx-auto mb-2 text-3xl" />
        Telemetry_Link_Offline
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:px-2 lg:px-3 sm:p-6 lg:p-8">
      {/* --- HEADER & LIVE SEARCH --- */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-900/20">
            <FiActivity size={28} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
              Live <span className="text-orange-600">Deployments</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-ping"></span>
              Active_In_Transit • {filteredDrivers.length} Units
            </p>
          </div>
        </div>

        <div className="relative group w-full xl:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
          <input
            type="text"
            placeholder="SEARCH_ACTIVE_UNIT..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:border-orange-600 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* --- DESKTOP TABLE --- */}
      <div className="hidden lg:block overflow-hidden bg-white border-2 border-slate-100 rounded-[32px] shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-5 text-left">Operator</th>
              <th className="p-5 text-left">Asset_Details</th>
              <th className="p-5 text-left">Contact_Feed</th>
              <th className="p-5 text-left">Security_Check</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredDrivers.map((driver) => (
              <tr
                key={driver._id}
                className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                onClick={() => setSelectedDriver(driver)}
              >
                <td className="p-5">
                  <div className="font-black text-slate-800 uppercase italic text-sm">
                    {driver.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">
                    UUID: {driver._id.slice(-8)}
                  </div>
                </td>
                <td className="p-5">
                  <div className="font-black text-slate-700 text-xs uppercase italic">
                    {driver.activeVehicle?.model}
                  </div>
                  <div className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                    {driver.activeVehicle?.type}
                  </div>
                </td>
                <td className="p-5 font-mono text-xs text-slate-600">
                  {driver.phoneNumber}
                </td>
                <td className="p-5">
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${driver.nid?.verified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      NID_{driver.nid?.verified ? "OK" : "??"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${driver.drivingLicense?.verified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      DL_{driver.drivingLicense?.verified ? "OK" : "??"}
                    </span>
                  </div>
                </td>
                <td
                  className="p-5 text-right relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === driver._id ? null : driver._id,
                      )
                    }
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <FiMoreVertical />
                  </button>
                  {openDropdown === driver._id && (
                    <div className="absolute right-5 mt-2 w-40 bg-white border-2 border-slate-100 shadow-xl rounded-2xl z-50 overflow-hidden">
                      <button
                        onClick={() => handleDetails(driver)}
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest"
                      >
                        <FiEye size={16} /> View_Details
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver._id}
            className="bg-white border-2 border-slate-100 p-5 rounded-3xl shadow-sm active:bg-blue-50 transition-colors"
            onClick={() => setSelectedDriver(driver)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-slate-900 uppercase italic tracking-tighter">
                  {driver.name}
                </h3>
                <p className="text-[10px] font-bold text-blue-600 uppercase">
                  {driver.activeVehicle?.model}
                </p>
              </div>
              <span className="text-[8px] font-black bg-blue-50 text-blue-700 px-2 py-1 rounded-md uppercase animate-pulse">
                {driver.status}
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] font-mono text-slate-500 italic">
              <span>{driver.phoneNumber}</span>
              <FiEye className="text-blue-600" size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* --- LIVE MONITORING MODAL --- */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <FiTruck size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                    {selectedDriver.name}
                  </h2>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-70 mt-1">
                    Live_Unit_Telemetry
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
              >
                <FiX />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <FiUser className="text-blue-600" /> Operator_Info
                  </p>
                  <p className="text-xs font-bold text-slate-800 uppercase italic truncate">
                    {selectedDriver.userId?.email}
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-1">
                    {selectedDriver.phoneNumber}
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <FiMapPin className="text-blue-600" /> Asset_Spec
                  </p>
                  <p className="text-xs font-bold text-slate-800 uppercase italic truncate">
                    {selectedDriver.activeVehicle?.model}
                  </p>
                  <p className="text-[10px] font-black text-slate-500 mt-1 uppercase">
                    {selectedDriver.activeVehicle?.type}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl text-white">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <FiInfo /> Registry_Sync
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      NID_Ref
                    </span>
                    <span className="text-xs font-mono">
                      {selectedDriver.nid?.number}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      License_Ref
                    </span>
                    <span className="text-xs font-mono">
                      {selectedDriver.drivingLicense?.number}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t">
              <button
                onClick={() => setSelectedDriver(null)}
                className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-100 transition-all"
              >
                Exit_Monitor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
