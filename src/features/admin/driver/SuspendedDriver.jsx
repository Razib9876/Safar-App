// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { FiMoreVertical, FiCheckCircle } from "react-icons/fi";
// import axiosSecure from "../../../services/axiosSecure";

// const fetchSuspendedDrivers = async () => {
//   const res = await axiosSecure.get("/drivers?status=suspended");
//   return res.data.data;
// };

// export default function SuspendedDriver() {
//   const [selectedDriver, setSelectedDriver] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const queryClient = useQueryClient();

//   /* ================= FETCH ================= */
//   const {
//     data: drivers = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["suspended-drivers"],
//     queryFn: fetchSuspendedDrivers,
//   });

//   /* ================= APPROVE ================= */
//   const approveMutation = useMutation({
//     mutationFn: async (driverId) => {
//       return await axiosSecure.patch(`/drivers/${driverId}/approve`);
//     },
//     onSuccess: () => {
//       toast.success("Driver Approved Successfully");
//       queryClient.invalidateQueries(["suspended-drivers"]);
//       setSelectedDriver(null);
//     },
//     onError: () => {
//       toast.error("Failed to approve driver");
//     },
//   });

//   const handleApprove = (driver) => {
//     approveMutation.mutate(driver._id);
//     setOpenDropdown(null);
//   };

//   if (isLoading)
//     return <div className="p-6 text-center">Loading drivers...</div>;

//   if (isError)
//     return (
//       <div className="p-6 text-center text-red-500">Failed to load drivers</div>
//     );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Suspended Drivers</h1>

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
//                   <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
//                     {driver.status}
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
//                         openDropdown === driver._id ? null : driver._id,
//                       )
//                     }
//                   >
//                     <FiMoreVertical />
//                   </button>

//                   {openDropdown === driver._id && (
//                     <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
//                       <button
//                         className="flex items-center gap-2 px-4 py-2 hover:bg-green-100 text-green-700 w-full"
//                         onClick={() => handleApprove(driver)}
//                       >
//                         <FiCheckCircle /> Approve
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

//               <span className="text-xs bg-red-100 px-2 py-1 rounded">
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

//             <div className="mt-6 flex gap-3">
//               <button
//                 className="bg-green-500 text-white px-4 py-2 rounded-lg"
//                 onClick={() => handleApprove(selectedDriver)}
//               >
//                 Approve
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// _____________________________________________________________________________________________
// _____________________________________________________________________________________________
// _____________________________________________________________________________________________
// _____________________________________________________________________________________________
// _____________________________________________________________________________________________
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiMoreVertical,
  FiCheckCircle,
  FiUser,
  FiPhone,
  FiTruck,
  FiFileText,
  FiAlertCircle,
  FiX,
  FiSearch,
} from "react-icons/fi";
import axiosSecure from "../../../services/axiosSecure";

const fetchSuspendedDrivers = async () => {
  const res = await axiosSecure.get("/drivers?status=suspended");
  return res.data.data;
};

export default function SuspendedDriver() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  /* ================= FETCH DATA ================= */
  const {
    data: drivers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["suspended-drivers"],
    queryFn: fetchSuspendedDrivers,
  });

  /* ================= FILTER LOGIC ================= */
  const filteredDrivers = drivers.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.phoneNumber?.includes(search) ||
      d.userId?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  /* ================= APPROVE MUTATION ================= */
  const approveMutation = useMutation({
    mutationFn: async (driverId) => {
      return await axiosSecure.patch(`/drivers/${driverId}/approve`);
    },
    onSuccess: () => {
      toast.success("PROTOCOL_SUCCESS: OPERATOR_RESTORED");
      queryClient.invalidateQueries(["suspended-drivers"]);
      setSelectedDriver(null);
    },
    onError: () => {
      toast.error("SYSTEM_FAILURE: APPROVAL_REJECTED");
    },
  });

  const handleApprove = (driver) => {
    approveMutation.mutate(driver._id);
    setOpenDropdown(null);
  };

  if (isLoading)
    return (
      <div className="p-20 text-center font-mono text-slate-400 animate-pulse tracking-widest text-xs">
        INITIALIZING_SUSPENDED_REGISTRY...
      </div>
    );

  if (isError)
    return (
      <div className="p-20 text-center text-red-500 font-black uppercase tracking-tighter italic">
        <FiAlertCircle className="mx-auto mb-2 text-3xl" />
        Data_Link_Failure
      </div>
    );

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:px-2 lg:px-3">
      {/* --- HEADER & SEARCH --- */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-900/20">
            <FiAlertCircle size={28} />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
              Suspended <span className="text-orange-600">Registry</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
              Manual_Intervention_Required • {filteredDrivers.length} Units
            </p>
          </div>
        </div>

        <div className="relative group w-full xl:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
          <input
            type="text"
            placeholder="FILTER_SUSPENDED_UNITS..."
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
              <th className="p-5 text-left">Operator_Asset</th>
              <th className="p-5 text-left">Phone_Contact</th>
              <th className="p-5 text-left">Vehicle_Model</th>
              <th className="p-5 text-left">Verification_Status</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredDrivers.map((driver) => (
              <tr
                key={driver._id}
                className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                onClick={() => setSelectedDriver(driver)}
              >
                <td className="p-5">
                  <div className="font-black text-slate-800 uppercase italic text-sm">
                    {driver.name}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 lowercase">
                    {driver.userId?.email}
                  </div>
                </td>
                <td className="p-5 font-mono text-xs text-slate-600">
                  {driver.phoneNumber}
                </td>
                <td className="p-5 font-black text-slate-700 text-xs uppercase italic">
                  {driver.activeVehicle?.type}{" "}
                  <span className="text-slate-300 mx-1">/</span>{" "}
                  {driver.activeVehicle?.model}
                </td>
                <td className="p-5">
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${driver.nid?.verified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      NID_{driver.nid?.verified ? "OK" : "PENDING"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${driver.drivingLicense?.verified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      DL_{driver.drivingLicense?.verified ? "OK" : "PENDING"}
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
                    <div className="absolute right-5 mt-2 w-48 bg-white border-2 border-slate-100 shadow-xl rounded-2xl z-50 overflow-hidden">
                      <button
                        onClick={() => handleApprove(driver)}
                        className="w-full flex items-center gap-3 px-4 py-4 hover:bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                      >
                        <FiCheckCircle size={16} /> Re_Approve_Unit
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MOBILE CARDS --- */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver._id}
            className="bg-white border-2 border-slate-100 p-5 rounded-3xl shadow-sm"
            onClick={() => setSelectedDriver(driver)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-slate-900 uppercase italic tracking-tighter">
                  {driver.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {driver.activeVehicle?.model}
                </p>
              </div>
              <span className="text-[9px] font-black bg-red-50 text-red-600 px-2 py-1 rounded-md uppercase tracking-widest">
                {driver.status}
              </span>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
              <div className="text-[10px] font-mono text-slate-500">
                {driver.phoneNumber}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(driver);
                }}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest"
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                  <FiAlertCircle size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                    {selectedDriver.name}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Operator_Status: {selectedDriver.status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center border-2 border-slate-50 hover:bg-slate-100 transition-colors"
              >
                <FiX />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-3xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3">
                    Unit_Contact
                  </p>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-1 uppercase tracking-tighter italic">
                    <FiPhone className="text-red-500" />{" "}
                    {selectedDriver.phoneNumber}
                  </p>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tighter italic">
                    <FiUser className="text-red-500" />{" "}
                    {selectedDriver.userId?.email}
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-3">
                    Vehicle_Spec
                  </p>
                  <p className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-1 uppercase tracking-tighter italic">
                    <FiTruck className="text-red-500" />{" "}
                    {selectedDriver.activeVehicle?.model}
                  </p>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-tighter italic">
                    TYPE: {selectedDriver.activeVehicle?.type}
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl text-white">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                  Registry_Documents
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      NID_Identification
                    </span>
                    <span className="text-[11px] font-mono text-red-400">
                      {selectedDriver.nid?.number}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black uppercase tracking-widest">
                      Driving_License
                    </span>
                    <span className="text-[11px] font-mono text-red-400">
                      {selectedDriver.drivingLicense?.number}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 border-t flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setSelectedDriver(null)}
                className="flex-1 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest"
              >
                Close_Registry
              </button>
              <button
                onClick={() => handleApprove(selectedDriver)}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
              >
                Restore_Operator_Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
