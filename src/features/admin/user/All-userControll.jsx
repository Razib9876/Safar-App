// import React, { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import toast from "react-hot-toast";

// const fetchUsers = async () => {
//   const { data } = await axios.get("/users/public");
//   return data;
// };

// const AllUsersControl = () => {
//   const [page, setPage] = useState(1);

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["allUsersPublic"],
//     queryFn: fetchUsers,
//     keepPreviousData: true,
//     onError: (err) => {
//       toast.error(err.response?.data?.message || "Failed to fetch users");
//     },
//   });

//   if (isLoading)
//     return (
//       <div className="min-h-screen flex items-center justify-center font-mono text-slate-400">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//           <p className="animate-pulse tracking-[0.3em] text-[10px] font-black uppercase">
//             Loading_Users...
//           </p>
//         </div>
//       </div>
//     );

//   if (isError || !data?.success)
//     return (
//       <div className="text-red-600 font-bold p-4">
//         Failed to load users: {data?.message || "Unknown error"}
//       </div>
//     );

//   const users = data.data;
//   const totalPages = Math.ceil(users.length / 10);
//   const paginatedUsers = users.slice((page - 1) * 10, page * 10);

//   return (
//     <div className="w-full max-w-6xl mx-auto p-6">
//       <h1 className="text-2xl font-black mb-4">All Users (Public)</h1>

//       <table className="min-w-full bg-white border-2 border-slate-100 rounded-xl shadow-sm">
//         <thead>
//           <tr className="bg-slate-50 border-b-2 border-slate-100">
//             <th className="p-3 text-left text-xs font-black text-slate-400 uppercase">
//               Name
//             </th>
//             <th className="p-3 text-left text-xs font-black text-slate-400 uppercase">
//               Email
//             </th>
//             <th className="p-3 text-left text-xs font-black text-slate-400 uppercase">
//               Role
//             </th>
//             <th className="p-3 text-left text-xs font-black text-slate-400 uppercase">
//               Status
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedUsers.map((user) => (
//             <tr key={user._id} className="hover:bg-slate-50 transition-colors">
//               <td className="p-3 font-bold">{user.name}</td>
//               <td className="p-3 font-mono text-xs">{user.email}</td>
//               <td className="p-3 text-sm uppercase">{user.role}</td>
//               <td className="p-3 text-sm uppercase">{user.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="mt-6 flex justify-center gap-2">
//         <button
//           disabled={page === 1}
//           onClick={() => setPage((p) => p - 1)}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         {[...Array(totalPages)].map((_, i) => (
//           <button
//             key={i}
//             onClick={() => setPage(i + 1)}
//             className={`px-3 py-1 border rounded ${
//               page === i + 1 ? "bg-blue-600 text-white" : ""
//             }`}
//           >
//             {i + 1}
//           </button>
//         ))}
//         <button
//           disabled={page === totalPages}
//           onClick={() => setPage((p) => p + 1)}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AllUsersControl;
// ____________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________
// ____________________________________________________________________________________________________________________
// import { useState, useRef, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import {
//   FiUser,
//   FiTruck,
//   FiCalendar,
//   FiExternalLink,
//   FiSearch,
//   FiShield,
//   FiClipboard,
//   FiCreditCard,
//   FiArchive,
// } from "react-icons/fi";

// // Fetch all users
// const fetchAllUsers = async () => {
//   const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
//   return res.data.data || [];
// };

// // Fetch driver by user ID
// const fetchDriverByUserId = async (userId) => {
//   const res = await axios.get(
//     `${import.meta.env.VITE_API_URL}/drivers/user/${userId}`,
//   );
//   return res.data || null;
// };

// // Promote user to admin
// const promoteUser = async (userId) => {
//   await axios.patch(
//     `${import.meta.env.VITE_API_URL}/users/${userId}/promote-admin`,
//   );
// };

// // Demote admin to user
// const demoteUser = async (userId) => {
//   await axios.patch(
//     `${import.meta.env.VITE_API_URL}/users/${userId}/demote-user`,
//   );
// };

// export default function AllUsers() {
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [driverData, setDriverData] = useState(null);
//   const modalRef = useRef();
//   const queryClient = useQueryClient();

//   const { data: users = [], isLoading } = useQuery({
//     queryKey: ["all-users"],
//     queryFn: fetchAllUsers,
//   });

//   const promoteMutation = useMutation(promoteUser, {
//     onSuccess: () => queryClient.invalidateQueries(["all-users"]),
//   });

//   const demoteMutation = useMutation(demoteUser, {
//     onSuccess: () => queryClient.invalidateQueries(["all-users"]),
//   });

//   // Fetch driver data only when a driver row is selected
//   useEffect(() => {
//     const fetchDriverData = async () => {
//       if (!selectedUser || selectedUser.role !== "driver") {
//         // Defer state update to avoid synchronous setState in effect
//         setTimeout(() => setDriverData(null), 0);
//         return;
//       }

//       try {
//         const data = await fetchDriverByUserId(selectedUser._id);
//         setDriverData(data);
//       } catch (error) {
//         console.error("Failed to fetch driver data:", error);
//         setDriverData(null);
//       }
//     };

//     fetchDriverData();
//   }, [selectedUser]);

//   // Close modal on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setSelectedUser(null);
//       }
//     };
//     if (selectedUser) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [selectedUser]);

//   // Filter users safely
//   const filteredUsers = (users || []).filter(
//     (user) =>
//       user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.status?.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   if (isLoading)
//     return (
//       <div className="p-12 text-center animate-pulse font-mono text-slate-400 tracking-tighter">
//         INITIALIZING_SECURE_DATA_FETCH...
//       </div>
//     );

//   return (
//     <div className="w-full pb-10">
//       {/* Header Section */}
//       <div className="px-0 sm:px-6 mb-10">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
//           {/* Title Section */}
//           <div className="flex items-center gap-4">
//             <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 border-2 border-orange-200">
//               <FiArchive size={28} />
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
//                 User <span className="text-orange-600">Management</span>
//               </h1>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
//                 Data_Verification • {users.length} Records
//               </p>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="relative group w-full lg:w-96">
//             <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
//               <FiSearch
//                 className="text-slate-400 group-focus-within:text-orange-600 transition-colors"
//                 size={20}
//               />
//             </div>
//             <input
//               type="text"
//               placeholder="SEARCH_USER..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] text-[12px] font-bold uppercase tracking-widest focus:border-orange-600 focus:ring-8 ring-orange-600/5 outline-none transition-all shadow-sm placeholder:text-slate-300"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Desktop Table */}
//       <div className="hidden lg:block overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
//         <table className="min-w-full text-sm">
//           <thead>
//             <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
//               <th className="p-4 text-left">Name / ID</th>
//               <th className="p-4 text-left">Role</th>
//               <th className="p-4 text-left">Status</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {filteredUsers.map((user) => (
//               <tr
//                 key={user._id}
//                 onClick={() => setSelectedUser(user)}
//                 className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
//               >
//                 <td className="p-4">
//                   <div className="font-bold text-slate-900">{user.name}</div>
//                   <div className="text-[10px] text-slate-400 font-mono">
//                     #{user._id.slice(-8)}
//                   </div>
//                 </td>
//                 <td className="p-4 font-bold text-blue-600 uppercase">
//                   {user.role}
//                 </td>
//                 <td className="p-4 font-bold text-slate-600">{user.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Mobile Card View */}
//       <div className="lg:hidden space-y-4">
//         {filteredUsers.map((user) => (
//           <div
//             key={user._id}
//             onClick={() => setSelectedUser(user)}
//             className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm active:bg-slate-50 transition-all"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">
//                   {user.name}
//                 </h3>
//                 <p className="text-[10px] font-mono text-slate-400">
//                   ID: {user._id.slice(-8)}
//                 </p>
//               </div>
//               <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-1 rounded uppercase border border-blue-100">
//                 {user.role}
//               </span>
//             </div>
//             <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
//               <span>Status: {user.status}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Modal */}
//       {selectedUser && (
//         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-0 sm:p-4 overflow-y-auto">
//           <div
//             ref={modalRef}
//             className="bg-white w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-[40px] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300"
//           >
//             {/* Modal Header */}
//             <div className="bg-slate-900 p-6 sm:p-10 text-white flex justify-between items-start relative overflow-hidden">
//               <div className="relative z-10">
//                 <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
//                   User Details
//                 </p>
//                 <h2 className="text-3xl font-black italic uppercase tracking-tighter">
//                   {selectedUser.name}
//                 </h2>
//                 <div className="flex gap-4 mt-4">
//                   <span className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
//                     <FiCalendar className="text-blue-400" /> ID:{" "}
//                     {selectedUser._id.slice(-8)}
//                   </span>
//                   <span className="flex items-center gap-2 text-xs font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase">
//                     {selectedUser.role}
//                   </span>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setSelectedUser(null)}
//                 className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-slate-900 transition-all font-black text-xl"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Column 1: User Info */}
//               <div className="lg:col-span-2 space-y-8">
//                 <section>
//                   <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
//                     <FiUser className="text-blue-600" /> Personal Info
//                   </h3>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Name
//                       </p>
//                       <p className="font-bold text-slate-800">
//                         {selectedUser.name}
//                       </p>
//                       <p className="text-xs text-slate-500 truncate">
//                         {selectedUser._id}
//                       </p>
//                     </div>
//                     <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
//                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
//                         Status
//                       </p>
//                       <p className="font-bold text-slate-800">
//                         {selectedUser.status}
//                       </p>
//                     </div>
//                   </div>
//                 </section>

//                 {/* Driver Info if role is driver */}
//                 {selectedUser.role === "driver" && driverData && (
//                   <section>
//                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
//                       <FiShield className="text-emerald-600" /> Driver Info
//                     </h3>
//                     <div className="border border-slate-200 rounded-[24px] p-6 flex flex-col md:flex-row gap-6">
//                       <img
//                         src={driverData.photo}
//                         className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-100"
//                       />
//                       <div className="flex-1 grid grid-cols-2 gap-y-4">
//                         <div>
//                           <p className="text-[9px] font-black text-slate-400 uppercase">
//                             Operator
//                           </p>
//                           <p className="font-bold">{driverData.name}</p>
//                         </div>
//                         <div>
//                           <p className="text-[9px] font-black text-slate-400 uppercase">
//                             Unit Type
//                           </p>
//                           <p className="font-bold text-blue-600 uppercase italic">
//                             {driverData.activeVehicle?.type}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-[9px] font-black text-slate-400 uppercase">
//                             Registration
//                           </p>
//                           <p className="font-mono text-xs font-bold">
//                             {driverData.activeVehicle?.registrationNumber}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-[9px] font-black text-slate-400 uppercase">
//                             License
//                           </p>
//                           <p className="font-mono text-xs font-bold">
//                             {driverData.drivingLicense?.number}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </section>
//                 )}
//               </div>

//               {/* Column 2: Actions */}
//               <div className="space-y-6">
//                 {(selectedUser.role === "rider" ||
//                   selectedUser.role === "admin") && (
//                   <button
//                     className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
//                     onClick={() => {
//                       if (selectedUser.role === "rider") {
//                         promoteMutation.mutate(selectedUser._id);
//                       } else if (selectedUser.role === "admin") {
//                         demoteMutation.mutate(selectedUser._id);
//                       }
//                     }}
//                   >
//                     {selectedUser.role === "rider" ? "Make Admin" : "Make User"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

// ---------------- API FUNCTIONS ----------------
const fetchAllUsers = async () => {
  const res = await axios.get(
    "https://thriving-endurance-production.up.railway.app/api/users",
  );
  return res.data.data || [];
};

const fetchDriverByUserId = async (userId) => {
  const res = await axios.get(
    `https://thriving-endurance-production.up.railway.app/api/drivers/user/${userId}`,
  );
  return res.data || null;
};

const promoteUserAPI = async (id) => {
  const res = await axios.post(
    `https://thriving-endurance-production.up.railway.app/api/users/${id}/promote-admin`,
  );
  return res.data;
};

const demoteUserAPI = async (id) => {
  const res = await axios.post(
    `https://thriving-endurance-production.up.railway.app/api/users/${id}/demote-user`,
  );
  return res.data;
};

// ---------------- COMPONENT ----------------
export default function AllUsers() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef();
  const queryClient = useQueryClient();

  // ---------------- QUERIES ----------------
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: fetchAllUsers,
  });

  // ---------------- MUTATIONS ----------------
  const promoteMutation = useMutation({
    mutationFn: promoteUserAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-users"] }),
  });

  const demoteMutation = useMutation({
    mutationFn: demoteUserAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["all-users"] }),
  });

  // ---------------- EFFECT TO FETCH DRIVER ----------------
  useEffect(() => {
    if (selectedUser?.role === "driver") {
      let isMounted = true;
      fetchDriverByUserId(selectedUser._id)
        .then((data) => {
          if (isMounted) setDriverData(data);
        })
        .catch(() => setDriverData(null));
      return () => (isMounted = false);
    } else {
      setDriverData(null);
    }
  }, [selectedUser]);

  // ---------------- HANDLE OUTSIDE CLICK ----------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target))
        setSelectedUser(null);
    };
    if (selectedUser) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedUser]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()),
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
                User <span className="text-orange-600">Management</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
                Secure Audit • {users.length} Records
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative group w-full lg:w-96">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <FiSearch
                className="text-slate-400 group-focus-within:text-orange-600 transition-colors"
                size={20}
              />
            </div>
            <input
              type="text"
              placeholder="SEARCH_USER_NAME_OR_ROLE..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] text-[12px] font-bold uppercase tracking-widest focus:border-orange-600 focus:ring-8 ring-orange-600/5 outline-none transition-all shadow-sm placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>

      {/* ---------------- DESKTOP TABLE ---------------- */}
      <div className="hidden lg:block overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
              <th className="p-4 text-left">User / ID</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="p-4">
                  <div className="font-bold text-slate-900">{user.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    #{user._id.slice(-8)}
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-700">{user.role}</td>
                <td className="p-4 font-mono text-[10px] text-slate-500">
                  {user.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- MOBILE CARD VIEW ---------------- */}
      <div className="lg:hidden space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm active:bg-slate-50 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">
                  {user.name}
                </h3>
                <p className="text-[10px] font-mono text-slate-400">
                  ID: {user._id.slice(-8)}
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-1 rounded uppercase border border-emerald-100">
                {user.role.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Status: {user.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-0 sm:p-4 overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-[40px] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 sm:p-10 text-white flex justify-between items-start relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                  Internal User Log
                </p>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                  USER_{selectedUser._id.slice(-10)}
                </h2>
                <div className="flex gap-4 mt-4">
                  <span className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    <FiCalendar className="text-blue-400" /> Active
                  </span>
                  <span className="flex items-center gap-2 text-xs font-bold bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 uppercase">
                    {selectedUser.role}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="relative z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-slate-900 transition-all font-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Column 1: User Info */}
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiUser className="text-blue-600" /> User Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                        Name
                      </p>
                      <p className="font-bold text-slate-800">
                        {selectedUser.name}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                        Status
                      </p>
                      <p className="font-bold text-slate-800">
                        {selectedUser.status}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Driver Info if role is driver */}
                {selectedUser.role === "driver" && driverData && (
                  <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FiTruck className="text-blue-500" /> Driver Details
                    </h3>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p>Name: {driverData.name}</p>
                      <p>
                        License: {driverData.drivingLicense?.number || "N/A"}
                      </p>
                      <p>Vehicle: {driverData.activeVehicle?.type || "N/A"}</p>
                    </div>
                  </section>
                )}
              </div>

              {/* Column 2: Actions */}
              {selectedUser.role !== "driver" && (
                <div className="space-y-6 flex flex-col justify-start">
                  {selectedUser.role === "rider" && (
                    <button
                      onClick={() => promoteMutation.mutate(selectedUser._id)}
                      className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                    >
                      Make Admin
                    </button>
                  )}
                  {selectedUser.role === "admin" && (
                    <button
                      onClick={() => demoteMutation.mutate(selectedUser._id)}
                      className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                    >
                      Make Rider
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
