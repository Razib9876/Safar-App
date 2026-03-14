// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import axiosSecure from "../../services/axiosSecure";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { FiActivity, FiNavigation } from "react-icons/fi";

// // 24-hour to 12-hour AM/PM format
// const formatTime12Hour = (time24) => {
//   if (!time24) return "";
//   const [hourStr, minute] = time24.split(":");
//   let hour = parseInt(hourStr, 10);
//   const ampm = hour >= 12 ? "PM" : "AM";
//   hour = hour % 12 || 12;
//   return `${hour}:${minute} ${ampm}`;
// };

// export default function CurrentTrip() {
//   const queryClient = useQueryClient();
//   const [driverId, setDriverId] = useState(null);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [otp, setOtp] = useState("");
//   const [rideStarted, setRideStarted] = useState(false);
//   const [currentTrip, setCurrentTrip] = useState(null);

//   // ================= FETCH DRIVER ID =================
//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user?.email) {
//         try {
//           const res = await axiosSecure.get(
//             `/drivers/by-email?email=${encodeURIComponent(user.email)}`,
//           );
//           setDriverId(res.data.data?._id || null);
//         } catch (err) {
//           toast.error("Failed to fetch driver info");
//         } finally {
//           setAuthLoading(false);
//         }
//       } else {
//         setAuthLoading(false);
//         toast.error("Please login to see your trip");
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // ================= FETCH CURRENT TRIP =================
//   const { data: trips, isLoading } = useQuery({
//     queryKey: ["current-trip", driverId],
//     enabled: !!driverId,
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/bookings/driver/${driverId}/confirmed-bookings`,
//       );
//       return res.data.data;
//     },
//   });

//   // ================= SET CURRENT TRIP =================
//   useEffect(() => {
//     if (trips && trips.length) {
//       setCurrentTrip(trips[0]);
//       setRideStarted(trips[0].pickStatus === "picked");
//     }
//   }, [trips]);

//   // ================= START RIDE =================
//   const mutationStartRide = useMutation({
//     mutationFn: () =>
//       axiosSecure.patch(`/drivers/${driverId}/ride-start/${currentTrip._id}`),
//     onSuccess: () => {
//       toast.success("Ride started successfully");
//       setRideStarted(true);
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: () => {
//       toast.error("Failed to start ride");
//     },
//   });

//   // ================= DROP OFF =================
//   const mutationDropOff = useMutation({
//     mutationFn: () =>
//       axiosSecure.patch(`/bookings/${currentTrip._id}/drop-off`),
//     onSuccess: () => {
//       toast.success("You reached the destination");
//       setCurrentTrip((prev) => ({
//         ...prev,
//         pickStatus: "dropped", // update locally to show OTP input
//       }));
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: () => {
//       toast.error("Failed to mark drop-off");
//     },
//   });

//   // ================= VERIFY COMPLETION OTP =================
//   const mutationVerifyOtp = useMutation({
//     mutationFn: () =>
//       axiosSecure.patch(
//         `/bookings/${currentTrip._id}/verify-completion-otp`,
//         { otp }, // send only OTP
//       ),
//     onSuccess: () => {
//       toast.success("OTP verified, booking completed");
//       setOtp("");
//       setRideStarted(false);
//       setCurrentTrip(null);
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: (err) => {
//       toast.error(err?.response?.data?.message || "OTP mismatch or invalid");
//     },
//   });

//   if (authLoading || isLoading)
//     return <div className="p-6 text-center">Loading current trip...</div>;

//   if (!currentTrip)
//     return <div className="p-6 text-center">No active trip assigned</div>;

//   const driverQuote = currentTrip.driverQuote?.find(
//     (dq) => dq.driverId === driverId,
//   );

//   const customer = currentTrip.userId;

//   const showDropOff =
//     rideStarted &&
//     currentTrip.status === "on_trip" &&
//     currentTrip.pickStatus === "picked";
//   const showOtpInput = currentTrip.pickStatus === "dropped";

//   return (
//     <div>
//       {/* ================= ACTIVE OPERATIONS HEADER ================= */}
//       <div className="px-0 sm:px-6 mb-8 pt-4">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//           {/* Brand & Mission Status */}
//           <div className="flex items-center gap-4">
//             <div
//               className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors duration-500 bg-orange-600 shadow-orange-200"

//             >
//               {rideStarted ? (
//                 <FiNavigation size={28} className="animate-pulse" />
//               ) : (
//                 <FiActivity size={28} />
//               )}
//             </div>
//             <div>
//               <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
//                 Active{" "}
//                 <span
//                   className={
//                     rideStarted ? "text-emerald-600" : "text-orange-600"
//                   }
//                 >
//                   Mission
//                 </span>
//               </h1>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
//                 <span className="relative flex h-2 w-2">
//                   <span
//                     className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${rideStarted ? "bg-emerald-400" : "bg-orange-400"}`}
//                   ></span>
//                   <span
//                     className={`relative inline-flex rounded-full h-2 w-2 ${rideStarted ? "bg-emerald-500" : "bg-orange-500"}`}
//                   ></span>
//                 </span>
//                 {rideStarted
//                   ? "In_Transit: Destination Tracking Active"
//                   : "Status: Awaiting Pilot Ignition"}
//               </p>
//             </div>
//           </div>

//           {/* Telemetry Badge */}
//           <div className="flex items-center">
//             <div className="px-6 py-3 bg-slate-900 rounded-2xl border-r-4 border-indigo-500 shadow-xl flex items-center gap-4">
//               <div className="flex flex-col">
//                 <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">
//                   Trip_ID
//                 </span>
//                 <span className="text-white text-[11px] font-mono tracking-tighter">
//                   #{currentTrip._id.slice(-8).toUpperCase()}
//                 </span>
//               </div>
//               <div className="h-8 w-[1px] bg-slate-700"></div>
//               <div className="flex flex-col">
//                 <span className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">
//                   Earning
//                 </span>
//                 <span className="text-white text-[13px] font-black">
//                   {driverQuote?.currentAmount} TK
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Trip Info */}
//       <div className="bg-white shadow rounded-xl p-6 border">
//         <div className="flex items-center gap-4">
//           <img
//             src={currentTrip.driverId?.activeVehiclePhoto}
//             alt="Vehicle"
//             className="w-20 h-20 rounded-lg object-cover border"
//           />
//           <div className="space-y-1">
//             <h2 className="font-semibold text-lg">
//               {currentTrip.tripType.replace("_", " ")}
//             </h2>
//             <p className="text-gray-600">
//               Vehicle: {currentTrip.vehicleType.toUpperCase()}
//             </p>
//             <p className="text-gray-600">
//               From: {currentTrip.fromLocation} → To: {currentTrip.toLocation}
//             </p>
//             <p className="text-gray-600">
//               Date & Time: {new Date(currentTrip.dateFrom).toLocaleDateString()}{" "}
//               | {formatTime12Hour(currentTrip.timeFrom)} →{" "}
//               {new Date(currentTrip.dateTo).toLocaleDateString()} |{" "}
//               {formatTime12Hour(currentTrip.timeTo)}
//             </p>
//             <p className="text-gray-600">
//               Status: <span className="font-medium">{currentTrip.status}</span>
//             </p>
//             <p className="text-gray-600">
//               Quote Amount:{" "}
//               <span className="font-bold text-blue-600">
//                 {driverQuote?.currentAmount} TK
//               </span>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Customer Info */}
//       <div className="bg-white shadow rounded-xl p-6 border">
//         <h3 className="font-semibold text-lg mb-2">Customer Info</h3>
//         <p>Name: {customer?.name}</p>
//         <p>
//           Email:{" "}
//           <a href={`mailto:${customer?.email}`} className="text-blue-600">
//             {customer?.email}
//           </a>
//         </p>
//         <p>
//           Phone:{" "}
//           <a href={`tel:${currentTrip.phoneNumber}`} className="text-blue-600">
//             {currentTrip.phoneNumber}
//           </a>
//         </p>
//       </div>

//       {/* Actions */}
//       <div className="space-y-4">
//         {!rideStarted ? (
//           <button
//             onClick={() => mutationStartRide.mutate()}
//             className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//           >
//             Start Ride
//           </button>
//         ) : showDropOff ? (
//           <button
//             onClick={() => mutationDropOff.mutate()}
//             className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//           >
//             Drop Off
//           </button>
//         ) : showOtpInput ? (
//           <div className="mt-4">
//             <label className="block mb-2 font-medium">
//               Enter Completion OTP
//             </label>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               placeholder="OTP"
//               className="border p-2 rounded w-full"
//             />
//             <button
//               onClick={() => mutationVerifyOtp.mutate()}
//               className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//             >
//               Verify OTP & Complete Trip
//             </button>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }
// _____________________________________________________________________________________
// _____________________________________________________________________________________
// _____________________________________________________________________________________
// _____________________________________________________________________________________
// _____________________________________________________________________________________
// _____________________________________________________________________________________
// _____________________________________________________________________________________
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../services/axiosSecure";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiMail,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiTruck,
  FiUser,
  FiShieldLock,
} from "react-icons/fi";
// import {
//   FiActivity,
//   FiNavigation,
//   FiMapPin,
//   FiClock,
//   FiUser,
//   FiPhone,
//   FiMail,
//   FiTruck,
//   FiCheckCircle,
//   FiShieldLock,
// } from "react-icons/fi";

const formatTime12Hour = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

export default function CurrentTrip() {
  const queryClient = useQueryClient();
  const [driverId, setDriverId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [rideStarted, setRideStarted] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

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
        toast.error("Please login to see your trip");
      }
    });
    return () => unsubscribe();
  }, []);

  const { data: trips, isLoading } = useQuery({
    queryKey: ["current-trip", driverId],
    enabled: !!driverId,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/driver/${driverId}/confirmed-bookings`,
      );
      return res.data.data;
    },
  });

  useEffect(() => {
    if (trips && trips.length) {
      setCurrentTrip(trips[0]);
      setRideStarted(trips[0].pickStatus === "picked");
    }
  }, [trips]);

  const mutationStartRide = useMutation({
    mutationFn: () =>
      axiosSecure.patch(`/drivers/${driverId}/ride-start/${currentTrip._id}`),
    onSuccess: () => {
      toast.success("Ride started successfully");
      setRideStarted(true);
      queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
    },
    onError: () => toast.error("Failed to start ride"),
  });

  const mutationDropOff = useMutation({
    mutationFn: () =>
      axiosSecure.patch(`/bookings/${currentTrip._id}/drop-off`),
    onSuccess: () => {
      toast.success("You reached the destination");
      setCurrentTrip((prev) => ({ ...prev, pickStatus: "dropped" }));
      queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
    },
    onError: () => toast.error("Failed to mark drop-off"),
  });

  const mutationVerifyOtp = useMutation({
    mutationFn: () =>
      axiosSecure.patch(`/bookings/${currentTrip._id}/verify-completion-otp`, {
        otp,
      }),
    onSuccess: () => {
      toast.success("OTP verified, booking completed");
      setOtp("");
      setRideStarted(false);
      setCurrentTrip(null);
      queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "OTP mismatch"),
  });

  if (authLoading || isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">
          Syncing mission data...
        </p>
      </div>
    );

  if (!currentTrip)
    return (
      <div className="p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FiActivity className="text-slate-300" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No Active Missions</h3>
        <p className="text-slate-500">Stand by for new trip assignments.</p>
      </div>
    );

  const driverQuote = currentTrip.driverQuote?.find(
    (dq) => dq.driverId === driverId,
  );
  const customer = currentTrip.userId;
  const showDropOff =
    rideStarted &&
    currentTrip.status === "on_trip" &&
    currentTrip.pickStatus === "picked";
  const showOtpInput = currentTrip.pickStatus === "dropped";

  return (
    <div className="  space-y-6">
      {/* ================= HEADER SECTION ================= */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-500 ${
                rideStarted
                  ? "bg-emerald-500 shadow-emerald-200"
                  : "bg-orange-500 shadow-orange-200"
              }`}
            >
              {rideStarted ? (
                <FiNavigation size={32} className="animate-pulse" />
              ) : (
                <FiActivity size={32} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  CURRENT{" "}
                  <span
                    className={
                      rideStarted ? "text-emerald-600" : "text-orange-600"
                    }
                  >
                    TRIP
                  </span>
                </h1>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${rideStarted ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}
                >
                  {currentTrip.status}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${rideStarted ? "bg-emerald-400" : "bg-orange-400"}`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${rideStarted ? "bg-emerald-500" : "bg-orange-500"}`}
                  ></span>
                </span>
                {rideStarted
                  ? "In Transit: GPS Active"
                  : "Status: Awaiting Pickup"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center gap-4">
              <div className="border-r border-slate-700 pr-4 text-center">
                <p className="text-[9px] text-slate-400 uppercase font-bold">
                  Trip ID
                </p>
                <p className="font-mono text-xs">
                  #{currentTrip._id.slice(-6).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-emerald-400 uppercase font-bold">
                  Earnings
                </p>
                <p className="text-lg font-black">
                  {driverQuote?.currentAmount}{" "}
                  <span className="text-[10px]">TK</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= TRIP DETAILS CARD ================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-sm tracking-wider">
                <FiTruck className="text-indigo-500" /> Route Logistics
              </h3>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg">
                {currentTrip.tripType.replace("_", " ")}
              </span>
            </div>

            <div className="p-6 space-y-8">
              {/* Route Timeline */}
              <div className="relative pl-8 space-y-10">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-dashed border-l-2 border-slate-200 border-dashed"></div>

                {/* Pickup */}
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-white border-4 border-emerald-500 z-10"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Pickup Location
                  </p>
                  <p className="font-bold text-slate-800 text-lg leading-tight">
                    {currentTrip.fromLocation}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiClock />{" "}
                      {new Date(currentTrip.dateFrom).toLocaleDateString()}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                      {formatTime12Hour(currentTrip.timeFrom)}
                    </span>
                  </div>
                </div>

                {/* Dropoff */}
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-white border-4 border-indigo-500 z-10"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Destination
                  </p>
                  <p className="font-bold text-slate-800 text-lg leading-tight">
                    {currentTrip.toLocation}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <FiClock />{" "}
                      {new Date(currentTrip.dateTo).toLocaleDateString()}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-700">
                      {formatTime12Hour(currentTrip.timeTo)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle Specs */}
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                <img
                  src={currentTrip.driverId?.activeVehiclePhoto}
                  className="w-16 h-16 rounded-xl object-cover shadow-sm ring-2 ring-white"
                  alt="Vehicle"
                />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Registered Vehicle
                  </p>
                  <p className="font-bold text-slate-800 uppercase text-sm tracking-wide">
                    {currentTrip.vehicleType}
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    Plate: Verified Operational
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SIDEBAR: CUSTOMER & ACTIONS ================= */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-sm tracking-wider mb-6">
              <FiUser className="text-indigo-500" /> Customer
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {customer?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800 leading-none">
                    {customer?.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-tighter">
                    Client Account
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-50">
                <a
                  href={`tel:${currentTrip.phoneNumber}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50 text-indigo-700 transition-transform active:scale-95"
                >
                  <FiPhone />{" "}
                  <span className="text-sm font-bold">
                    {currentTrip.phoneNumber}
                  </span>
                </a>
                <a
                  href={`mailto:${customer?.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 text-slate-600 truncate transition-transform active:scale-95"
                >
                  <FiMail />{" "}
                  <span className="text-xs font-medium">{customer?.email}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Action Center */}
          <div className="bg-slate-900 rounded-3xl shadow-xl p-6 text-white">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Mission Controls
            </h3>

            {!rideStarted ? (
              <button
                onClick={() => mutationStartRide.mutate()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-14 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
              >
                <FiCheckCircle size={20} /> Start Ride
              </button>
            ) : showDropOff ? (
              <button
                onClick={() => mutationDropOff.mutate()}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white h-14 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2"
              >
                <FiMapPin size={20} /> Confirm Drop Off
              </button>
            ) : showOtpInput ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2">
                    Completion OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit code"
                    className="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-2xl text-center text-xl font-black tracking-[0.5em] focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 placeholder:text-xs placeholder:tracking-normal"
                  />
                </div>
                <button
                  onClick={() => mutationVerifyOtp.mutate()}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 text-white h-14 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2"
                >
                  <FiShieldLock size={20} /> Verify & Close
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
