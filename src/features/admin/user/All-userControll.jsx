import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const fetchUsers = async () => {
  const { data } = await axios.get("/users/public");
  return data;
};

const AllUsersControl = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allUsersPublic"],
    queryFn: fetchUsers,
    keepPreviousData: true,
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to fetch users");
    },
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse tracking-[0.3em] text-[10px] font-black uppercase">
            Loading_Users...
          </p>
        </div>
      </div>
    );

  if (isError || !data?.success)
    return (
      <div className="text-red-600 font-bold p-4">
        Failed to load users: {data?.message || "Unknown error"}
      </div>
    );

  const users = data.data;
  const totalPages = Math.ceil(users.length / 10);
  const paginatedUsers = users.slice((page - 1) * 10, page * 10);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-4">All Users (Public)</h1>

      <table className="min-w-full bg-white border-2 border-slate-100 rounded-xl shadow-sm">
        <thead>
          <tr className="bg-slate-50 border-b-2 border-slate-100">
            <th className="p-3 text-left text-xs font-black text-slate-400 uppercase">
              Name
            </th>
            <th className="p-3 text-left text-xs font-black text-slate-400 uppercase">
              Email
            </th>
            <th className="p-3 text-left text-xs font-black text-slate-400 uppercase">
              Role
            </th>
            <th className="p-3 text-left text-xs font-black text-slate-400 uppercase">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user._id} className="hover:bg-slate-50 transition-colors">
              <td className="p-3 font-bold">{user.name}</td>
              <td className="p-3 font-mono text-xs">{user.email}</td>
              <td className="p-3 text-sm uppercase">{user.role}</td>
              <td className="p-3 text-sm uppercase">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsersControl;
