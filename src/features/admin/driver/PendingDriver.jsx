import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiXCircle,
  FiMoreVertical,
  FiEye,
  FiTruck,
  FiFileText,
  FiUser,
  FiZap,
  FiSearch,
  FiX,
} from "react-icons/fi";
import axiosSecure from "../../../services/axiosSecure";

const fetchPendingDrivers = async () => {
  const res = await axiosSecure.get("/drivers?status=pending");
  return res.data?.data || [];
};

export default function PendingDriver() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  /* ================= FETCH DATA ================= */
  const {
    data: drivers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pending-drivers"],
    queryFn: fetchPendingDrivers,
  });

  /* ================= SEARCH LOGIC ================= */
  const filteredDrivers = drivers.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.phoneNumber?.includes(search) ||
      d.activeVehicle?.registrationNumber
        ?.toLowerCase()
        .includes(search.toLowerCase()),
  );

  /* ================= MUTATIONS ================= */
  const approveMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/drivers/${id}/approve`),
    onSuccess: () => {
      toast.success("OPERATOR_VERIFIED");
      queryClient.invalidateQueries(["pending-drivers"]);
      setSelectedDriver(null);
    },
    onError: () => toast.error("VERIFICATION_FAILED"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => axiosSecure.patch(`/drivers/${id}/reject`),
    onSuccess: () => {
      toast.error("OPERATOR_REJECTED");
      queryClient.invalidateQueries(["pending-drivers"]);
      setSelectedDriver(null);
    },
    onError: () => toast.error("REJECTION_FAILED"),
  });

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse font-mono text-slate-400 text-xs tracking-widest uppercase">
        Syncing_Pending_Registry...
      </div>
    );

  if (isError)
    return (
      <div className="p-20 text-center text-red-500 font-black uppercase tracking-tighter italic">
        Database_Connection_Error
      </div>
    );

  return (
    <div>
      {/* ================= INDUSTRIAL HEADER ================= */}
      <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-900/20">
            <FiZap size={28} />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
              Pending <span className="text-orange-600">Verification</span>
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">
              Authentication_Queue • {filteredDrivers.length} Applications
              Waiting
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group w-full xl:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
          <input
            type="text"
            placeholder="FILTER_APPLICATIONS..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:border-orange-600 outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden lg:block overflow-hidden bg-white border-2 border-slate-100 rounded-[32px] shadow-sm">
        {filteredDrivers.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-100">
                <th className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Operator
                </th>
                <th className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Vehicle_Unit
                </th>
                <th className="p-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Credentials
                </th>
                <th className="p-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Manifest
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDrivers.map((driver) => (
                <tr
                  key={driver._id}
                  className="hover:bg-orange-50/20 transition-colors group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={driver.photo || "https://via.placeholder.com/40"}
                        className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border-slate-200"
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
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-2 py-1 rounded uppercase border border-orange-100">
                        {driver.activeVehicle?.type}
                      </span>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                        {driver.activeVehicle?.model}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2">
                      <Badge label="NID" verified={driver.nid?.verified} />
                      <Badge
                        label="LICENSE"
                        verified={driver.drivingLicense?.verified}
                      />
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      onClick={() => setSelectedDriver(driver)}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                    >
                      View_Full_Data
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* ================= DRIVER EMPTY STATE ================= */
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              {/* Radar concentric circles */}
              <div className="absolute inset-0 scale-150 bg-slate-50 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 scale-110 border border-slate-100 rounded-full animate-[ping_3s_linear_infinite]"></div>

              <div className="relative w-20 h-20 bg-white rounded-2xl border-2 border-slate-100 shadow-xl flex items-center justify-center">
                <FiSearch
                  size={32}
                  className="text-slate-200 animate-[bounce_2s_infinite]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">
                Zero <span className="text-orange-600">Operators</span> Detected
              </h3>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                Signal_Search: No matches found in registry
              </p>
            </div>

            <button
              onClick={() => {
                /* reset filter logic here */
              }}
              className="mt-8 px-6 py-2 border-2 border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-orange-200 hover:text-orange-600 transition-all"
            >
              Reset_Filters
            </button>
          </div>
        )}
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="lg:hidden grid grid-cols-1 gap-4">
        {filteredDrivers.map((driver) => (
          <div
            key={driver._id}
            className="bg-white border-2 border-slate-100 p-5 rounded-[2rem] shadow-sm active:bg-orange-50 transition-colors"
            onClick={() => setSelectedDriver(driver)}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <img
                  src={driver.photo}
                  className="w-12 h-12 rounded-2xl object-cover"
                  alt=""
                />
                <div>
                  <h3 className="font-black text-slate-900 uppercase italic tracking-tighter">
                    {driver.name}
                  </h3>
                  <p className="text-[10px] font-bold text-orange-600 uppercase">
                    {driver.phoneNumber}
                  </p>
                </div>
              </div>
              <FiEye className="text-orange-600" />
            </div>
          </div>
        ))}
      </div>

      {/* ================= VERIFICATION MODAL ================= */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl my-auto animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-8 bg-slate-50 border-b flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img
                  src={selectedDriver.photo}
                  className="w-16 h-16 rounded-2xl border-4 border-white shadow-md object-cover"
                  alt="Profile"
                />
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                    Review_Operator_Files
                  </h2>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                    ID: {selectedDriver._id?.slice(-12)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDriver(null)}
                className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <FiX />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Left Column */}
              <div className="space-y-6">
                <Section title="General Information" icon={<FiUser />}>
                  <DataRow label="Full Name" value={selectedDriver.name} />
                  <DataRow
                    label="Email Address"
                    value={selectedDriver.userId?.email}
                  />
                  <DataRow
                    label="Contact Phone"
                    value={selectedDriver.phoneNumber}
                  />
                </Section>

                <Section title="Vehicle Specification" icon={<FiTruck />}>
                  <DataRow
                    label="Unit Type"
                    value={selectedDriver.activeVehicle?.type}
                  />
                  <DataRow
                    label="Model Reference"
                    value={selectedDriver.activeVehicle?.model}
                  />
                  <DataRow
                    label="Registration"
                    value={selectedDriver.activeVehicle?.registrationNumber}
                  />
                </Section>
              </div>

              {/* Right Column: Imagery */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FiEye /> Photographic_Evidence
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <PhotoBox
                    label="Vehicle Unit"
                    url={selectedDriver.activeVehicle?.mainPhoto}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <PhotoBox
                      label="NID_Front"
                      url={selectedDriver.nid?.photos?.[0]}
                    />
                    <PhotoBox
                      label="NID_Back"
                      url={selectedDriver.nid?.photos?.[1]}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-8 bg-slate-50 border-t grid grid-cols-2 gap-4">
              <button
                disabled={rejectMutation.isPending}
                onClick={() => rejectMutation.mutate(selectedDriver._id)}
                className="py-5 bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                <FiXCircle />{" "}
                {rejectMutation.isPending
                  ? "PROCESSING..."
                  : "Terminate_Application"}
              </button>
              <button
                disabled={approveMutation.isPending}
                onClick={() => approveMutation.mutate(selectedDriver._id)}
                className="py-5 bg-slate-900 hover:bg-orange-600 text-white rounded-[24px] text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-900/10"
              >
                <FiCheckCircle />{" "}
                {approveMutation.isPending
                  ? "AUTHORIZING..."
                  : "Authorize_Operator"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= HELPER COMPONENTS =================

const Badge = ({ label, verified }) => (
  <div
    className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${verified ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}
  >
    {label}_{verified ? "OK" : "PENDING"}
  </div>
);

const Section = ({ title, icon, children }) => (
  <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
    <div className="flex items-center gap-2 mb-4 text-orange-600">
      {icon}
      <h4 className="text-[10px] font-black uppercase tracking-widest">
        {title}
      </h4>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const DataRow = ({ label, value }) => (
  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
    <span className="text-[10px] font-bold text-slate-400 uppercase">
      {label}
    </span>
    <span className="text-xs font-black text-slate-800 uppercase italic">
      {value || "NOT_PROVIDED"}
    </span>
  </div>
);

const PhotoBox = ({ label, url }) => (
  <div className="space-y-2">
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
      {label}
    </p>
    <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-100 hover:border-orange-600 transition-all group relative">
      {url ? (
        <img
          src={url}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={label}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-300 italic">
          IMAGE_MISSING
        </div>
      )}
    </div>
  </div>
);
