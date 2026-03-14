import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../services/axiosSecure";
import useDrivers from "../../../hooks/useDrivers";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiSlash,
  FiAlertTriangle,
  FiTruck,
  FiUser,
  FiNavigation,
  FiChevronLeft,
  FiChevronRight,
  FiPhone,
  FiInfo,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";

const AvailableDriver = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [confirmDriver, setConfirmDriver] = useState(null); // For Suspend
  const [selectedDriver, setSelectedDriver] = useState(null); // For Details Modal

  const queryClient = useQueryClient();

  // Logic: Reset to page 1 when search changes to fix the "no results" bug
  useEffect(() => {
    setPage(1);
  }, [search]);

  const { drivers, total, isLoading } = useDrivers("available", page, search);

  const suspendMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/drivers/${id}/suspend`);
    },
    onSuccess: () => {
      toast.success("OPERATOR_SUSPENDED");
      queryClient.invalidateQueries(["drivers"]);
      setConfirmDriver(null);
      setSelectedDriver(null);
    },
    onError: () => {
      toast.error("PROTOCOL_FAILURE: SUSPEND_FAILED");
    },
  });

  const totalPages = Math.ceil(total / 10);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse tracking-[0.3em] text-[10px] font-black uppercase">
            Syncing_Fleet_Data...
          </p>
        </div>
      </div>
    );

  return (
    <div>
      {/* 1. INDUSTRIAL HEADER */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-900/20">
            <FiNavigation size={28} />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
              Available <span className="text-orange-600">Operators</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
              Fleet_Status: Online • {total} Units Ready
            </p>
          </div>
        </div>

        <div className="relative group w-full xl:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
          <input
            type="text"
            placeholder="FILTER_BY_NAME_PHONE_OR_ID..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:border-orange-600 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 2. DATA DISPLAY - DESKTOP TABLE */}
      <div className="hidden lg:block overflow-hidden bg-white border-2 border-slate-100 rounded-[32px] shadow-sm">
        {drivers.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-100">
                <th className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Operator
                </th>
                <th className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Vehicle_Asset
                </th>
                <th className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Performance
                </th>
                <th className="p-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Intervention
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {drivers.map((driver) => (
                <tr
                  key={driver._id}
                  onClick={() => setSelectedDriver(driver)}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={driver.photo}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100 shadow-sm"
                        alt=""
                      />
                      <div>
                        <div className="font-black text-slate-800 uppercase text-sm italic">
                          {driver.name}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          {driver.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-xs font-black text-slate-700 uppercase">
                    {driver.activeVehicle?.model || "NO_UNIT"}
                  </td>
                  <td className="p-5">
                    <span className="text-xs font-black text-emerald-600 italic">
                      ৳{driver.totalEarnings?.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDriver(driver);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <FiSlash /> Suspend
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* ================= ASSET EMPTY STATE ================= */
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              {/* Orbital animation */}
              <div className="absolute inset-0 scale-150 border border-slate-50 rounded-full animate-[spin_8s_linear_infinite]"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-200 rounded-full"></div>

              <div className="relative w-24 h-24 bg-slate-50 rounded-[32px] border-2 border-slate-100 flex items-center justify-center text-slate-200">
                <FiTruck size={40} className="opacity-50" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-slate-100 rounded-lg flex items-center justify-center">
                  <FiX size={16} className="text-red-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                Registry <span className="text-orange-600">Depleted</span>
              </h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.4em]">
                Status: No_Active_Assets_Found
              </p>
            </div>

            <div className="mt-8 px-4 py-2 bg-slate-50 rounded-xl inline-flex items-center gap-3 border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Waiting for operator uplink...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE GRID VIEW */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {drivers.map((driver) => (
          <div
            key={driver._id}
            onClick={() => setSelectedDriver(driver)}
            className="bg-white border-2 border-slate-100 rounded-3xl p-5 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={driver.photo}
                  className="w-14 h-14 rounded-2xl object-cover"
                  alt=""
                />
                <div>
                  <h3 className="font-black text-slate-900 uppercase italic">
                    {driver.name}
                  </h3>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {driver.phoneNumber}
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase tracking-widest">
                {driver.status}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDriver(driver);
              }}
              className="w-full py-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <FiSlash size={14} /> Suspend_Operator
            </button>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Manifest_Page {page} / {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-slate-100 hover:border-orange-600 transition-all disabled:opacity-20"
          >
            <FiChevronLeft />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-11 h-11 text-[11px] font-black rounded-xl transition-all ${page === i + 1 ? "bg-slate-900 text-white shadow-lg" : "bg-white border-2 border-slate-100 sm:flex items-center justify-center hidden"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-slate-100 hover:border-orange-600 transition-all disabled:opacity-20"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* MODAL 1: FULL DATA DETAILS */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDriver.photo}
                  className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md"
                  alt=""
                />
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                    {selectedDriver.name}
                  </h2>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">
                    OPERATOR_ID: {selectedDriver._id.slice(-8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <FiUser /> Profile_Info
                  </p>
                  <p className="text-xs font-black text-slate-800 mb-1 uppercase tracking-tighter">
                    {selectedDriver.userId?.email}
                  </p>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">
                    {selectedDriver.phoneNumber}
                  </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
                    <FiTruck /> Vehicle_Unit
                  </p>
                  <p className="text-xs font-black text-slate-800 mb-1 uppercase italic">
                    {selectedDriver.activeVehicle?.model}
                  </p>
                  <p className="text-[9px] font-mono text-slate-500">
                    REG: {selectedDriver.activeVehicle?.registrationNumber}
                  </p>
                </div>
              </div>

              {/* Photos Gallery */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FiInfo /> Registry_Documents
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-slate-400 uppercase">
                      Operator_Photo
                    </p>
                    <img
                      src={selectedDriver.photo}
                      className="w-full h-32 object-cover rounded-2xl border-2 border-slate-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black text-slate-400 uppercase">
                      Active_Vehicle
                    </p>
                    <img
                      src={selectedDriver.activeVehiclePhoto}
                      className="w-full h-32 object-cover rounded-2xl border-2 border-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-8 bg-slate-50 border-t flex gap-4">
              <button
                onClick={() => {
                  setConfirmDriver(selectedDriver);
                }}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-900/20 active:scale-95 transition-all"
              >
                Suspend_Operator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SUSPEND CONFIRMATION */}
      {confirmDriver && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiAlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-2">
              Confirm_Suspend
            </h3>
            <p className="text-sm text-slate-500 mb-8 uppercase tracking-tighter">
              Are you sure you want to suspend <br />
              <span className="font-black text-slate-900">
                {confirmDriver.name}
              </span>
              ?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setConfirmDriver(null)}
                className="py-4 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => suspendMutation.mutate(confirmDriver._id)}
                className="py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-red-900/20"
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableDriver;
