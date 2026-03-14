import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../services/axiosSecure";
import {
  FiUser,
  FiCalendar,
  FiSearch,
  FiShield,
  FiArchive,
} from "react-icons/fi";

// Fetch all users (we will filter for admins in the UI)
const fetchAllUsers = async () => {
  const res = await axiosSecure.get(`/users`);
  return res.data.data || [];
};

// Demote admin to user
const demoteUser = async (userId) => {
  await axiosSecure.patch(`/users/${userId}/demote-user`);
};

export default function AllAdmin() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: fetchAllUsers,
  });

  const demoteMutation = useMutation({
    mutationFn: demoteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["all-users"]);
      setSelectedUser(null);
    },
  });

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedUser(null);
      }
    };
    if (selectedUser) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedUser]);

  // Filter ONLY Admins and then apply search
  const adminUsers = (users || []).filter((user) => user.role === "admin");

  const filteredAdmins = adminUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading)
    return (
      <div className="p-12 text-center animate-pulse font-mono text-slate-400 tracking-tighter">
        FETCHING_ADMIN_RECORDS...
      </div>
    );

  return (
    <div>
      {/* Header Section */}
      <div className="p-10 sm:px-6 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border-2 border-blue-200">
              <FiShield size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                Admin <span className="text-blue-600">Personnel</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
                Privileged_Access • {adminUsers.length} Admins
              </p>
            </div>
          </div>

          <div className="relative group w-full lg:w-96">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <FiSearch
                className="text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={20}
              />
            </div>
            <input
              type="text"
              placeholder="SEARCH_ADMIN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-slate-100 rounded-[24px] text-[12px] font-bold uppercase tracking-widest focus:border-blue-600 focus:ring-8 ring-blue-600/5 outline-none transition-all shadow-sm placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
              <th className="p-4 text-left">Name / ID</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAdmins.map((user) => (
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
                <td className="p-4 font-bold text-blue-600 uppercase">
                  {user.role}
                </td>
                <td className="p-4 font-bold text-slate-600">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredAdmins.map((user) => (
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
              <span className="bg-blue-50 text-blue-700 text-[9px] font-black px-2 py-1 rounded uppercase border border-blue-100">
                {user.role}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
              <span>Status: {user.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-0 sm:p-4 overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-white w-full max-w-4xl min-h-screen sm:min-h-0 sm:rounded-[40px] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300"
          >
            <div className="bg-slate-900 p-6 sm:p-10 text-white flex justify-between items-start relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                  Admin Credentials
                </p>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                  {selectedUser.name}
                </h2>
                <div className="flex gap-4 mt-4">
                  <span className="flex items-center gap-2 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    <FiCalendar className="text-blue-400" /> ID:{" "}
                    {selectedUser._id.slice(-8)}
                  </span>
                  <span className="flex items-center gap-2 text-xs font-bold bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/20 uppercase">
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

            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiUser className="text-blue-600" /> Administrative Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                        Full Name
                      </p>
                      <p className="font-bold text-slate-800">
                        {selectedUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {selectedUser._id}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                        System Status
                      </p>
                      <p className="font-bold text-slate-800">
                        {selectedUser.status}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <button
                  disabled={demoteMutation.isLoading}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-100 disabled:bg-slate-300"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to remove admin privileges?",
                      )
                    ) {
                      demoteMutation.mutate(selectedUser._id);
                    }
                  }}
                >
                  Revoke Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
