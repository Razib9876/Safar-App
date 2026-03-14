import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosSecure from "../../services/axiosSecure";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FiActivity, FiNavigation } from "react-icons/fi";

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
    <div>
      {/* ================= ACTIVE OPERATIONS HEADER ================= */}
      <div className="px-0 sm:px-6 mb-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand & Mission Status */}
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors duration-500 ${
                rideStarted
                  ? "bg-emerald-600 shadow-emerald-200"
                  : "bg-orange-600 shadow-orange-200"
              }`}
            >
              {rideStarted ? (
                <FiNavigation size={28} className="animate-pulse" />
              ) : (
                <FiActivity size={28} />
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                Active{" "}
                <span
                  className={
                    rideStarted ? "text-emerald-600" : "text-orange-600"
                  }
                >
                  Mission
                </span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${rideStarted ? "bg-emerald-400" : "bg-orange-400"}`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${rideStarted ? "bg-emerald-500" : "bg-orange-500"}`}
                  ></span>
                </span>
                {rideStarted
                  ? "In_Transit: Destination Tracking Active"
                  : "Status: Awaiting Pilot Ignition"}
              </p>
            </div>
          </div>

          {/* Telemetry Badge */}
          <div className="flex items-center">
            <div className="px-6 py-3 bg-slate-900 rounded-2xl border-r-4 border-indigo-500 shadow-xl flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                  Trip_ID
                </span>
                <span className="text-white text-[11px] font-mono tracking-tighter">
                  #{currentTrip._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-slate-700"></div>
              <div className="flex flex-col">
                <span className="text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                  Earning
                </span>
                <span className="text-white text-[13px] font-black">
                  {driverQuote?.currentAmount} TK
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
