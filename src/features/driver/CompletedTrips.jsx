import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axiosSecure from "../../services/axiosSecure";
import Loading from "../../components/Loading";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Wallet,
  ArrowRight,
  Search,
  History,
} from "lucide-react";
import { FiArchive, FiCheckCircle } from "react-icons/fi";

export default function CompletedTrips() {
  const [driverId, setDriverId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Fetch Driver ID
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
          console.error("Driver fetch error", err);
        } finally {
          setAuthLoading(false);
        }
      } else {
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Completed Bookings
  const { data: completedTrips = [], isLoading } = useQuery({
    queryKey: ["completed-trips", driverId],
    enabled: !!driverId,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/driver/${driverId}/completed-bookings`,
      );
      return res.data.data;
    },
  });

  if (authLoading || isLoading) return <Loading />;

  if (completedTrips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <History className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">No History Yet</h2>
        <p className="text-gray-500 mt-2">
          Complete your first trip to see it here!
        </p>
      </div>
    );
  }

  // Calculate Total Earnings
  const totalEarnings = completedTrips.reduce((acc, trip) => {
    const quote = trip.driverQuote?.find((q) => q.driverId === driverId);
    return acc + (quote?.currentAmount || 0);
  }, 0);

  return (
    <div className=" p-4 sm:p-6 pb-10">
      {/* ================= ARCHIVE & LOGS HEADER ================= */}
      <div className="px-0 sm:px-6 mb-10 pt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand & Log Status */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-lg shadow-slate-200 border border-slate-700">
              <FiArchive size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                Mission <span className="text-emerald-600">Logs</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                <FiCheckCircle className="text-emerald-500" size={12} />
                Database_Synchronized • {completedTrips.length} Records Found
              </p>
            </div>
          </div>

          {/* Revenue Analytics Badge */}
          <div className="flex items-center">
            <div className="px-6 py-3 bg-white rounded-2xl border-l-4 border-emerald-500 shadow-sm flex items-center gap-4 border border-gray-100">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                  Gross_Revenue
                </span>
                <span className="text-slate-900 text-xl font-black tracking-tight">
                  {totalEarnings.toLocaleString()}{" "}
                  <span className="text-xs text-emerald-600">TK</span>
                </span>
              </div>
              <div className="h-8 w-[1px] bg-gray-100"></div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                  Efficiency
                </span>
                <span className="text-emerald-600 text-[11px] font-bold">
                  100% SUCC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trips List */}
      <div className="grid gap-4">
        {completedTrips.map((trip) => {
          const myQuote = trip.driverQuote?.find(
            (q) => q.driverId === driverId,
          );

          return (
            <div
              key={trip._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {trip.userId?.name || "Guest User"}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                      <Calendar size={12} />
                      {new Date(trip.dateFrom).toLocaleDateString()} •{" "}
                      {trip.tripType.replace("_", " ")}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-gray-900">
                    {myQuote?.currentAmount} TK
                  </p>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">
                    Paid
                  </span>
                </div>
              </div>

              {/* Route Summary */}
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin size={14} className="text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {trip.fromLocation.split(",")[0]}
                  </span>
                </div>
                <ArrowRight size={14} className="text-gray-300 shrink-0" />
                <div className="flex items-center gap-2 min-w-0 justify-end">
                  <span className="text-sm text-gray-600 truncate text-right">
                    {trip.toLocation.split(",")[0]}
                  </span>
                  <MapPin size={14} className="text-indigo-400 shrink-0" />
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Vehicle: {trip.vehicleType}</span>
                <span className="group-hover:text-indigo-500 transition-colors cursor-pointer flex items-center gap-1">
                  View Details <Search size={10} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
