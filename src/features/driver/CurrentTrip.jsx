// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import axiosSecure from "../../services/axiosSecure";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

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
//   const { isLoading } = useQuery({
//     queryKey: ["current-trip", driverId],
//     enabled: !!driverId,
//     queryFn: async () => {
//       const res = await axiosSecure.get(
//         `/bookings/driver/${driverId}/confirmed-bookings`,
//       );
//       return res.data.data;
//     },
//     onSuccess: (data) => {
//       if (data.length) {
//         setCurrentTrip(data[0]); // আমরা সরাসরি setCurrentTrip ব্যবহার করছি
//         setRideStarted(data[0].pickStatus === "started");
//       }
//     },
//   });
//   // ================= START RIDE MUTATION =================
//   const mutationStartRide = useMutation({
//     mutationFn: () =>
//       axiosSecure.post(`/drivers/${driverId}/ride-start/${currentTrip._id}`),
//     onSuccess: () => {
//       toast.success("Ride started successfully");
//       setRideStarted(true);
//       queryClient.invalidateQueries(["current-trip", driverId]);
//     },
//     onError: () => {
//       toast.error("Failed to start ride");
//     },
//   });

//   // ================= DROP-OFF MUTATION =================
//   const mutationDropOff = useMutation({
//     mutationFn: () => axiosSecure.post(`/bookings/${currentTrip._id}/drop-off`),
//     onSuccess: () => {
//       toast.success("You reached the destination");
//       setRideStarted(false);
//       queryClient.invalidateQueries(["current-trip", driverId]);
//     },
//     onError: () => {
//       toast.error("Failed to mark drop-off");
//     },
//   });

//   // ================= VERIFY COMPLETION OTP =================
//   const mutationVerifyOtp = useMutation({
//     mutationFn: () =>
//       axiosSecure.patch(`/bookings/${currentTrip._id}/verify-completion-otp`, {
//         otp,
//         driverId,
//       }),
//     onSuccess: () => {
//       toast.success("OTP verified, booking completed");
//       setOtp("");
//       queryClient.invalidateQueries(["current-trip", driverId]);
//       setCurrentTrip(null); // Trip completed
//     },
//     onError: (err) => {
//       toast.error(err?.response?.data?.message || "Failed to verify OTP");
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

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Current Trip</h1>

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
//         ) : (
//           <>
//             <button
//               onClick={() => mutationDropOff.mutate()}
//               className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//             >
//               Drop Off
//             </button>

//             {/* OTP Verification */}
//             <div className="mt-4">
//               <label className="block mb-2 font-medium">
//                 Enter Completion OTP
//               </label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="OTP"
//                 className="border p-2 rounded w-full"
//               />
//               <button
//                 onClick={() => mutationVerifyOtp.mutate()}
//                 className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//               >
//                 Verify OTP & Complete Trip
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// ______________________________________________________________________________________________________
// ______________________________________________________________________________________________________
// ______________________________________________________________________________________________________
// ______________________________________________________________________________________________________
// ______________________________________________________________________________________________________
// ______________________________________________________________________________________________________
// ______________________________________________________________________________________________________
// ______________________________________________________________________________________________________
// ______________________________________________________________________________________________________
// ______________________________________________________________________________________________________
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import axiosSecure from "../../services/axiosSecure";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

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
//   const [rideStarted, setRideStarted] = useState();
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

//   // React Query v5 fix → useEffect দিয়ে state update
//   useEffect(() => {
//     if (trips && trips.length) {
//       setCurrentTrip(trips[0]);
//       setRideStarted(trips[0].pickStatus === "started");
//     }
//   }, [trips]);

//   // ================= START RIDE MUTATION =================
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

//   // ================= DROP-OFF MUTATION =================
//   const mutationDropOff = useMutation({
//     mutationFn: () => axiosSecure.post(`/bookings/${currentTrip._id}/drop-off`),
//     onSuccess: () => {
//       toast.success("You reached the destination");
//       setRideStarted(false);
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: () => {
//       toast.error("Failed to mark drop-off");
//     },
//   });

//   // ================= VERIFY COMPLETION OTP =================
//   const mutationVerifyOtp = useMutation({
//     mutationFn: () =>
//       axiosSecure.patch(`/bookings/${currentTrip._id}/verify-completion-otp`, {
//         otp,
//         driverId,
//       }),
//     onSuccess: () => {
//       toast.success("OTP verified, booking completed");
//       setOtp("");
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//       setCurrentTrip(null);
//     },
//     onError: (err) => {
//       toast.error(err?.response?.data?.message || "Failed to verify OTP");
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

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Current Trip</h1>

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
//         ) : (
//           <>
//             <button
//               onClick={() => mutationDropOff.mutate()}
//               className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//             >
//               Drop Off
//             </button>

//             {/* OTP Verification */}
//             <div className="mt-4">
//               <label className="block mb-2 font-medium">
//                 Enter Completion OTP
//               </label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="OTP"
//                 className="border p-2 rounded w-full"
//               />
//               <button
//                 onClick={() => mutationVerifyOtp.mutate()}
//                 className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//               >
//                 Verify OTP & Complete Trip
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
// __________________________________________uper code didnt show dropp off button_____________________________________
// __________________________________________uper code didnt show dropp off button_____________________________________
// __________________________________________uper code didnt show dropp off button_____________________________________
// __________________________________________uper code didnt show dropp off button_____________________________________
// __________________________________________uper code didnt show dropp off button_____________________________________
// __________________________________________uper code didnt show dropp off button_____________________________________
// __________________________________________uper code didnt show dropp off button_____________________________________
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import axiosSecure from "../../services/axiosSecure";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

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
//   const [showOtpInput, setShowOtpInput] = useState(false);
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

//   useEffect(() => {
//     if (trips && trips.length) {
//       setCurrentTrip(trips[0]);
//       setRideStarted(trips[0].pickStatus === "started");
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
//       setShowOtpInput(true);
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: () => {
//       toast.error("Failed to mark drop-off");
//     },
//   });

//   // ================= VERIFY COMPLETION OTP =================
//   const mutationVerifyOtp = useMutation({
//     mutationFn: () =>
//       axiosSecure.patch(`/bookings/${currentTrip._id}/verify-completion-otp`, {
//         otp,
//         driverId,
//       }),
//     onSuccess: () => {
//       toast.success("OTP verified, booking completed");
//       setOtp("");
//       setShowOtpInput(false);
//       setRideStarted(false);
//       setCurrentTrip(null);
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: (err) => {
//       toast.error(err?.response?.data?.message || "Failed to verify OTP");
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

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Current Trip</h1>

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
//       {/* Actions */}
//       <div className="space-y-4">
//         {!rideStarted ? (
//           <button
//             onClick={() => mutationStartRide.mutate()}
//             className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//           >
//             Start Ride
//           </button>
//         ) : !showOtpInput ? (
//           <button
//             onClick={() => mutationDropOff.mutate()}
//             className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//           >
//             Drop Off
//           </button>
//         ) : (
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
//         )}
//       </div>
//     </div>
//   );
// }
// ___________________________________________
// ___________________________________________
// ___________________________________________
// ___________________________________________
// ___________________________________________
// ___________________________________________
// ___________________________________________
// ___________________________________________
// ___________________________________________
// ___________________________________________
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import axiosSecure from "../../services/axiosSecure";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

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
//   const [showOtpInput, setShowOtpInput] = useState(false);
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
//       setShowOtpInput(trips[0].status === "dropped"); // if already dropped, show OTP input
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
//       setShowOtpInput(true); // show OTP input after drop-off
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: () => {
//       toast.error("Failed to mark drop-off");
//     },
//   });

//   // ================= VERIFY COMPLETION OTP =================
//   const mutationVerifyOtp = useMutation({
//     mutationFn: () =>
//       axiosSecure.patch(`/bookings/${currentTrip._id}/verify-completion-otp`, {
//         otp,
//         driverId,
//       }),
//     onSuccess: () => {
//       toast.success("OTP verified, booking completed");
//       setOtp("");
//       setShowOtpInput(false);
//       setRideStarted(false);
//       setCurrentTrip(null);
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: (err) => {
//       toast.error(err?.response?.data?.message || "Failed to verify OTP");
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

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Current Trip</h1>

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
//         ) : currentTrip.status === "on_trip" && !showOtpInput ? (
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
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// __________________________________________________________________________________________________________________
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import axiosSecure from "../../services/axiosSecure";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

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
//       const trip = trips[0];
//       setCurrentTrip(trip);
//       setRideStarted(
//         trip.pickStatus === "picked" || trip.pickStatus === "started",
//       );
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
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: () => {
//       toast.error("Failed to mark drop-off");
//     },
//   });

//   // ================= VERIFY COMPLETION OTP =================
//   const mutationVerifyOtp = useMutation({
//     mutationFn: () =>
//       axiosSecure.patch(`/bookings/${currentTrip._id}/verify-completion-otp`, {
//         otp,
//         driverId,
//       }),
//     onSuccess: () => {
//       toast.success("OTP verified, booking completed");
//       setOtp("");
//       setRideStarted(false);
//       setCurrentTrip(null);
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: (err) => {
//       toast.error(err?.response?.data?.message || "Failed to verify OTP");
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

//   // ================= DETERMINE UI =================
//   const showOtpInput = currentTrip.pickStatus === "dropped";
//   const showDropOffButton =
//     rideStarted && currentTrip.status === "on_trip" && !showOtpInput;
//   const showStartRideButton =
//     !rideStarted && currentTrip.pickStatus !== "picked";

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Current Trip</h1>

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
//         {showStartRideButton && (
//           <button
//             onClick={() => mutationStartRide.mutate()}
//             className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//           >
//             Start Ride
//           </button>
//         )}

//         {showDropOffButton && (
//           <button
//             onClick={() => mutationDropOff.mutate()}
//             className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//           >
//             Drop Off
//           </button>
//         )}

//         {showOtpInput && (
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
//         )}
//       </div>
//     </div>
//   );
// }
// _______________________________uper code didnt see input field____________________________________
// _______________________________uper code didnt see input field____________________________________
// _______________________________uper code didnt see input field____________________________________
// _______________________________uper code didnt see input field____________________________________
// _______________________________uper code didnt see input field____________________________________
// _______________________________uper code didnt see input field____________________________________
// import { useState, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import axiosSecure from "../../services/axiosSecure";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

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
//       const trip = trips[0];
//       setCurrentTrip(trip);
//       setRideStarted(
//         trip.pickStatus === "picked" || trip.pickStatus === "started",
//       );
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
//       // Optimistically update currentTrip locally
//       setCurrentTrip((prev) =>
//         prev ? { ...prev, pickStatus: "dropped" } : prev,
//       );
//       queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
//     },
//     onError: () => {
//       toast.error("Failed to mark drop-off");
//     },
//   });

//   // ================= VERIFY COMPLETION OTP =================
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
//       toast.error(err?.response?.data?.message || "Failed to verify OTP");
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

//   // ================= DETERMINE UI =================
//   const showOtpInput = currentTrip.pickStatus === "dropped";
//   const showDropOffButton =
//     rideStarted && currentTrip.status === "on_trip" && !showOtpInput;
//   const showStartRideButton =
//     !rideStarted && currentTrip.pickStatus !== "picked";

//   return (
//     <div className="max-w-3xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold mb-4">Current Trip</h1>

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
//         {showStartRideButton && (
//           <button
//             onClick={() => mutationStartRide.mutate()}
//             className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//           >
//             Start Ride
//           </button>
//         )}

//         {showDropOffButton && (
//           <button
//             onClick={() => mutationDropOff.mutate()}
//             className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
//           >
//             Drop Off
//           </button>
//         )}

//         {showOtpInput && (
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
//         )}
//       </div>
//     </div>
//   );
// }
// ____________________________________________uper code is working good but otp mismatch_________________________
// ____________________________________________uper code is working good but otp mismatch_________________________
// ____________________________________________uper code is working good but otp mismatch_________________________
// ____________________________________________uper code is working good but otp mismatch_________________________
// ____________________________________________uper code is working good but otp mismatch_________________________
// ____________________________________________uper code is working good but otp mismatch_________________________
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../services/axiosSecure";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// 24-hour to 12-hour AM/PM format
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

  // ================= FETCH DRIVER ID =================
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

  // ================= FETCH CURRENT TRIP =================
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

  // ================= SET CURRENT TRIP =================
  useEffect(() => {
    if (trips && trips.length) {
      setCurrentTrip(trips[0]);
      setRideStarted(trips[0].pickStatus === "picked");
    }
  }, [trips]);

  // ================= START RIDE =================
  const mutationStartRide = useMutation({
    mutationFn: () =>
      axiosSecure.patch(`/drivers/${driverId}/ride-start/${currentTrip._id}`),
    onSuccess: () => {
      toast.success("Ride started successfully");
      setRideStarted(true);
      queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
    },
    onError: () => {
      toast.error("Failed to start ride");
    },
  });

  // ================= DROP OFF =================
  const mutationDropOff = useMutation({
    mutationFn: () =>
      axiosSecure.patch(`/bookings/${currentTrip._id}/drop-off`),
    onSuccess: () => {
      toast.success("You reached the destination");
      setCurrentTrip((prev) => ({
        ...prev,
        pickStatus: "dropped", // update locally to show OTP input
      }));
      queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
    },
    onError: () => {
      toast.error("Failed to mark drop-off");
    },
  });

  // ================= VERIFY COMPLETION OTP =================
  const mutationVerifyOtp = useMutation({
    mutationFn: () =>
      axiosSecure.patch(
        `/bookings/${currentTrip._id}/verify-completion-otp`,
        { otp }, // send only OTP
      ),
    onSuccess: () => {
      toast.success("OTP verified, booking completed");
      setOtp("");
      setRideStarted(false);
      setCurrentTrip(null);
      queryClient.invalidateQueries({ queryKey: ["current-trip", driverId] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "OTP mismatch or invalid");
    },
  });

  if (authLoading || isLoading)
    return <div className="p-6 text-center">Loading current trip...</div>;

  if (!currentTrip)
    return <div className="p-6 text-center">No active trip assigned</div>;

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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Current Trip</h1>

      {/* Trip Info */}
      <div className="bg-white shadow rounded-xl p-6 border">
        <div className="flex items-center gap-4">
          <img
            src={currentTrip.driverId?.activeVehiclePhoto}
            alt="Vehicle"
            className="w-20 h-20 rounded-lg object-cover border"
          />
          <div className="space-y-1">
            <h2 className="font-semibold text-lg">
              {currentTrip.tripType.replace("_", " ")}
            </h2>
            <p className="text-gray-600">
              Vehicle: {currentTrip.vehicleType.toUpperCase()}
            </p>
            <p className="text-gray-600">
              From: {currentTrip.fromLocation} → To: {currentTrip.toLocation}
            </p>
            <p className="text-gray-600">
              Date & Time: {new Date(currentTrip.dateFrom).toLocaleDateString()}{" "}
              | {formatTime12Hour(currentTrip.timeFrom)} →{" "}
              {new Date(currentTrip.dateTo).toLocaleDateString()} |{" "}
              {formatTime12Hour(currentTrip.timeTo)}
            </p>
            <p className="text-gray-600">
              Status: <span className="font-medium">{currentTrip.status}</span>
            </p>
            <p className="text-gray-600">
              Quote Amount:{" "}
              <span className="font-bold text-blue-600">
                {driverQuote?.currentAmount} TK
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white shadow rounded-xl p-6 border">
        <h3 className="font-semibold text-lg mb-2">Customer Info</h3>
        <p>Name: {customer?.name}</p>
        <p>
          Email:{" "}
          <a href={`mailto:${customer?.email}`} className="text-blue-600">
            {customer?.email}
          </a>
        </p>
        <p>
          Phone:{" "}
          <a href={`tel:${currentTrip.phoneNumber}`} className="text-blue-600">
            {currentTrip.phoneNumber}
          </a>
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        {!rideStarted ? (
          <button
            onClick={() => mutationStartRide.mutate()}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
          >
            Start Ride
          </button>
        ) : showDropOff ? (
          <button
            onClick={() => mutationDropOff.mutate()}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
          >
            Drop Off
          </button>
        ) : showOtpInput ? (
          <div className="mt-4">
            <label className="block mb-2 font-medium">
              Enter Completion OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="border p-2 rounded w-full"
            />
            <button
              onClick={() => mutationVerifyOtp.mutate()}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Verify OTP & Complete Trip
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
