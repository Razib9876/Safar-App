import { useEffect, useState, useMemo } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../services/axiosSecure";
import toast from "react-hot-toast";
import HeroPages from "../components/AboutPages/HeroPages";
import { AlertTriangle } from "lucide-react";
import {
  X,
  ChevronLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Car,
  Info,
  CreditCard,
  ArrowRight,
  Download,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { RefreshCw, Search, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

// ================= CONSTANTS =================
const paymentMethods = [
  {
    id: "bkash",
    name: "bKash",
    logo: "src/assets/bkash.jpg",
  },
  {
    id: "nagad",
    name: "Nagad",
    logo: "https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png",
  },
  {
    id: "rocket",
    name: "Rocket",
    logo: "src/assets/rocket.jpg",
  },
  {
    id: "visa",
    name: "Visa",
    logo: "https://pngimg.com/uploads/visa/visa_PNG30.png",
  },
];

const restrictedStatuses = [
  "confirmed",
  "on_trip",
  "completed",
  "cancelled",
  "rejected",
];

export default function MyBookings() {
  const queryClient = useQueryClient();
  const [userEmail, setUserEmail] = useState(null);

  // MODAL STATES
  const [viewingBooking, setViewingBooking] = useState(null); // The Main Detail Modal
  const [activeStep, setActiveStep] = useState("details"); // details | quotes | vehicle | payment
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [tempVehicleView, setTempVehicleView] = useState(null);

  // FILTER/SORT STATES
  const [quoteSort, setQuoteSort] = useState("newest"); // newest | oldest | low_price | high_price
  const [selectedMethod, setSelectedMethod] = useState(null);

  // ================= AUTH =================
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) setUserEmail(user.email);
      else toast.error("Please login");
    });
    return () => unsubscribe();
  }, []);

  // ================= FETCH BOOKINGS =================
  // const { data: bookings = [], isLoading } = useQuery({
  //   queryKey: ["my-bookings", userEmail],
  //   enabled: !!userEmail,
  //   queryFn: async () => {
  //     const res = await axiosSecure.get(
  //       `/bookings/by-email?email=${encodeURIComponent(userEmail)}`,
  //     );
  //     return res.data.data || [];
  //   },
  // });
  // Update your fetch block
  const {
    data: bookings = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["my-bookings", userEmail],
    enabled: !!userEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/bookings/by-email?email=${encodeURIComponent(userEmail)}`,
      );
      return res.data.data || [];
    },
  });
  // ================= MUTATIONS =================
  const cancelMutation = useMutation({
    mutationFn: (bookingId) =>
      axiosSecure.patch(`/bookings/to-rejected/${bookingId}`),
    onSuccess: () => {
      toast.success("Booking cancelled");
      setViewingBooking(null);
      queryClient.invalidateQueries(["my-bookings", userEmail]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    },
  });

  const confirmAndPayMutation = useMutation({
    mutationFn: async ({
      bookingId,
      quoteId,
      driverId,
      amount,
      paymentMethod,
    }) => {
      if (!driverId) throw new Error("Driver ID is missing");
      if (!amount || !paymentMethod)
        throw new Error("Amount or payment method missing");

      return axiosSecure.post(`/payments/initiate`, {
        bookingId,
        quoteId,
        driverId,
        amount,
        paymentMethod,
      });
    },
    onSuccess: () => {
      toast.success("Payment Successful! Trip Confirmed.");
      closeModals();
      queryClient.invalidateQueries(["my-bookings", userEmail]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Transaction failed",
      );
    },
  });

  // ================= LOGIC =================
  const closeModals = () => {
    setViewingBooking(null);
    setActiveStep("details");
    setSelectedQuote(null);
    setTempVehicleView(null);
    setSelectedMethod(null);
  };

  const handleRowClick = (booking) => {
    setViewingBooking(booking);
    setActiveStep("details");
  };

  const sortedQuotes = useMemo(() => {
    if (!viewingBooking?.driverQuote) return [];
    let list = [...viewingBooking.driverQuote];
    switch (quoteSort) {
      case "low_price":
        return list.sort((a, b) => a.currentAmount - b.currentAmount);
      case "high_price":
        return list.sort((a, b) => b.currentAmount - a.currentAmount);
      case "oldest":
        return list.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      default:
        return list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }
  }, [viewingBooking, quoteSort]);

  const calculateTotal = (amount) => Math.round(amount * 1.05);

  const handleDownloadImage = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename || "vehicle-image.jpg";
    link.click();
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center mt-50">
        <span className="loading loading-spinner text-neutral"></span>
      </div>
    );

  return (
    <>
      <HeroPages name="My Bookings" />

      <div className="max-w-7xl mx-auto p-4 sm:p-10">
        {/* DESKTOP TABLE */}
        <div className="hidden lg:block overflow-hidden bg-white shadow-2xl border border-gray-100 rounded-2xl">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Route / Type
                </th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Schedule
                </th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>
                <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">
                  Payment
                </th>
                <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr
                  key={b._id}
                  onClick={() => handleRowClick(b)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                >
                  <td className="p-4">
                    <div className="font-bold text-gray-800 capitalize">
                      {b.fromLocation.split(",")[0]} →{" "}
                      {b.toLocation.split(",")[0]}
                    </div>
                    <div className="text-xs text-gray-400">
                      {b.tripType.replace("_", " ")} • {b.vehicleType}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {new Date(b.dateFrom).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={14} /> {b.timeFrom}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm font-medium">{b.paymentStatus}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button className="p-2 hover:bg-white rounded-full text-blue-600 shadow-sm border border-transparent hover:border-blue-100">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* if no data */}
          {bookings.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center">
              <div className="relative group">
                {/* Animated Background Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>

                {/* Icon Container */}
                <div className="relative bg-white p-6 rounded-full shadow-xl">
                  <Calendar
                    className="w-12 h-12 text-indigo-500"
                    strokeWidth={1.5}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-md">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center max-w-sm">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  No Bookings Yet
                </h3>
                <p className="mt-3 text-gray-500 leading-relaxed">
                  It looks like your travel history is empty. Ready to start
                  your next journey with us?
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
                <Link to="/">
                  <button className="bg-orange-500 text-white  hover:bg-orange-600 px-8 py-3 font-bold rounded-xl ">
                    Plan a Trip
                  </button>
                </Link>

                <button
                  disabled={isFetching}
                  onClick={() =>
                    queryClient.invalidateQueries(["my-bookings", userEmail])
                  }
                  className="flex items-center justify-center gap-2 px-6 py-3 min-w-[140px] bg-white text-gray-600 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isFetching ? "animate-spin text-indigo-500" : ""}`}
                  />
                  <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* MOBILE LIST */}
        <div className="lg:hidden space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              onClick={() => handleRowClick(b)}
              className="bg-white p-4 rounded-2xl shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                  {b.tripType.replace("_", " ")}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100">
                  {b.status}
                </span>
              </div>
              <p className="font-bold text-gray-800">
                {b.fromLocation.split(",")[0]} → {b.toLocation.split(",")[0]}
              </p>
              <div className="mt-3 flex justify-between items-center border-t pt-3">
                <div className="text-xs text-gray-500">
                  {new Date(b.dateFrom).toLocaleDateString()}
                </div>
                <div className="font-bold text-blue-600 flex items-center gap-1 text-sm">
                  Details <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
          {/* NO DATA MESSAGE */}
          {bookings.length === 0 && (
            <div className="py-8 px-4 flex flex-col items-center justify-center min-h-[60vh]">
              <div className="relative group">
                {/* Animated Background Glow - Sized down for mobile */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                {/* Icon Container - Scaled for mobile (w-16 vs w-20) */}
                <div className="relative bg-white p-5 rounded-3xl shadow-lg border border-gray-50">
                  <Calendar
                    className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500"
                    strokeWidth={1.5}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-gray-100">
                    <Search className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center max-w-[280px] sm:max-w-sm">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  No Bookings Yet
                </h3>
                <p className="mt-2 text-sm sm:text-base text-gray-500 leading-relaxed">
                  Your travel history is empty. Ready to start your next
                  journey?
                </p>
              </div>

              {/* Button Group - Full width on mobile, side-by-side on desktop */}
              <div className="mt-8 flex flex-col w-full sm:w-auto items-center gap-3">
                <Link to="/" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-10 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-md active:scale-[0.98] transition-all">
                    Plan a Trip
                  </button>
                </Link>

                <button
                  disabled={isFetching}
                  onClick={() =>
                    queryClient.invalidateQueries(["my-bookings", userEmail])
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-600 font-semibold rounded-2xl border border-gray-200 active:bg-gray-50 transition-all disabled:opacity-70"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isFetching ? "animate-spin text-indigo-500" : ""}`}
                  />
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {isFetching ? "Refreshing..." : "Refresh"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= BOSS LEVEL MODAL ================= */}
      {viewingBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={closeModals}
          />

          <div className="relative bg-white w-full max-w-2xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                {activeStep !== "details" && (
                  <button
                    onClick={() => {
                      if (activeStep === "vehicle") setActiveStep("quotes");
                      else if (activeStep === "payment")
                        setActiveStep("quotes");
                      else setActiveStep("details");
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <ChevronLeft />
                  </button>
                )}
                <div>
                  <h2 className="font-black text-xl text-gray-800 leading-tight">
                    {activeStep === "details" && "Booking Information"}
                    {activeStep === "quotes" && "Available Quotes"}
                    {activeStep === "vehicle" && "Vehicle Inspection"}
                    {activeStep === "payment" && "Secure Checkout"}
                  </h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    ID: {viewingBooking._id.slice(-8)}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModals}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-gray-50/30">
              {/* STEP 1: NESTED DETAILS */}
              {activeStep === "details" && (
                <div className="space-y-6">
                  {/* Trip Summary Card */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    {viewingBooking?.completionOtp && (
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                        <h1 className="text-lg font-bold text-gray-800">
                          Complete OTP: {viewingBooking.completionOtp}
                        </h1>

                        <div className="flex items-start gap-2 mt-2 text-yellow-700 text-xs font-medium">
                          <AlertTriangle size={16} className="mt-0.5" />
                          <p>
                            Don't share this OTP before the trip is completed.
                            Share it only after reaching your destination.
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">
                          From
                        </label>
                        <p className="text-sm font-semibold flex items-start gap-1">
                          <MapPin size={14} className="text-red-500 mt-0.5" />{" "}
                          {viewingBooking.fromLocation}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">
                          To
                        </label>
                        <p className="text-sm font-semibold flex items-start gap-1">
                          <MapPin size={14} className="text-green-500 mt-0.5" />{" "}
                          {viewingBooking.toLocation}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">
                          Pickup Date
                        </label>
                        <p className="text-sm font-semibold flex items-center gap-1">
                          <Calendar size={14} />{" "}
                          {new Date(
                            viewingBooking.dateFrom,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">
                          Pickup Time
                        </label>
                        <p className="text-sm font-semibold flex items-center gap-1">
                          <Clock size={14} /> {viewingBooking.timeFrom}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Driver Details (Conditional) */}
                  {viewingBooking.status === "confirmed" &&
                  viewingBooking.driverId ? (
                    <div className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-200">
                      <h3 className="text-xs font-black uppercase mb-3 opacity-80 tracking-widest">
                        Assigned Driver
                      </h3>
                      <div className="flex items-center gap-4">
                        <img
                          src={viewingBooking.driverId.photo}
                          className="w-16 h-16 rounded-full border-2 border-white/30 object-cover"
                        />
                        <div className="flex-grow">
                          <p className="font-black text-lg">
                            {viewingBooking.driverId.name}
                          </p>
                          <div className="flex gap-3 mt-2">
                            <a
                              href={`tel:${viewingBooking.driverId.phoneNumber}`}
                              className="flex items-center gap-1 bg-white/20 hover:bg-white/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                              <Phone size={14} /> Call
                            </a>
                            <a
                              href={`mailto:driver@example.com`}
                              className="flex items-center gap-1 bg-white/20 hover:bg-white/40 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                              <Mail size={14} /> Message
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-3">
                      <Info className="text-orange-500" />
                      <p className="text-xs text-orange-700 font-medium leading-relaxed">
                        Driver details are hidden until you confirm a quote and
                        complete payment for security reasons.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    {/* Cancel Booking Button */}
                    <button
                      disabled={restrictedStatuses.includes(
                        viewingBooking.status,
                      )}
                      onClick={() => cancelMutation.mutate(viewingBooking._id)}
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold text-sm hover:bg-red-100 disabled:opacity-50 transition-all"
                    >
                      Cancel Booking
                    </button>

                    {/* View Quotes / Pay Button */}
                    <button
                      onClick={() => setActiveStep("quotes")}
                      disabled={viewingBooking.paymentStatus === "paid"} // Prevent viewing quotes if already paid
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
                        viewingBooking.paymentStatus === "paid"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-900 text-white hover:bg-blue-600 shadow-gray-200"
                      }`}
                    >
                      View {viewingBooking.driverQuote?.length || 0} Quotes{" "}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: QUOTES LIST */}
              {activeStep === "quotes" && (
                <div className="space-y-4">
                  {/* Sort Controls */}
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 pl-2">
                      <Filter size={14} /> Sort By:
                    </div>
                    <div className="flex gap-1">
                      {[
                        {
                          id: "newest",
                          icon: <Clock size={12} />,
                          label: "New",
                        },
                        {
                          id: "low_price",
                          icon: <SortAsc size={12} />,
                          label: "Price",
                        },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setQuoteSort(s.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
                            quoteSort === s.id
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {sortedQuotes.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-400 italic">
                        No driver responses yet.
                      </p>
                    </div>
                  ) : (
                    sortedQuotes.map((q) => {
                      const v =
                        q?.driverId?.activeVehicle ??
                        q?.driverId?.vehicleDetails?.[0] ??
                        {};
                      const finalAmount = calculateTotal(q.currentAmount);

                      return (
                        <div
                          key={q._id}
                          className="bg-white p-4 rounded-2xl border border-gray-200 hover:border-blue-500 transition-all group"
                        >
                          <div className="flex gap-4">
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <img
                                src={v?.mainPhoto || "/no-vehicle.png"}
                                alt="vehicle"
                                className="w-full h-full object-cover rounded-xl"
                              />
                              <button
                                onClick={() => {
                                  setTempVehicleView(v);
                                  setActiveStep("vehicle");
                                }}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-xl"
                              >
                                <Eye size={20} />
                              </button>
                            </div>
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <h4 className="font-black text-gray-800 uppercase tracking-tight">
                                  {v?.type}{" "}
                                  <span className="text-gray-400">
                                    | {v?.model}
                                  </span>
                                </h4>
                                <div className="text-right">
                                  <p className="text-sm font-black text-blue-600">
                                    {finalAmount} TK
                                  </p>
                                  <p className="text-[8px] text-gray-400 font-bold uppercase">
                                    Incl. 5% Fee
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 mt-2">
                                <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-md border border-green-100 flex items-center gap-1">
                                  <CheckCircle2 size={10} /> {v?.capacity} Seats
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedQuote(q);
                                  setActiveStep("payment");
                                }}
                                className="w-full mt-3 bg-gray-900 text-white py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md"
                              >
                                Select Quote
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* STEP 3: VEHICLE GALLERY */}
              {activeStep === "vehicle" && tempVehicleView && (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden border">
                    <img
                      src={tempVehicleView.mainPhoto}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() =>
                        handleDownloadImage(
                          tempVehicleView.mainPhoto,
                          `${tempVehicleView.model}.jpg`,
                        )
                      }
                      className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Model
                      </p>
                      <p className="font-bold text-gray-800">
                        {tempVehicleView.model}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Registration
                      </p>
                      <p className="font-bold text-gray-800">
                        {tempVehicleView.registrationNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: PAYMENT */}
              {activeStep === "payment" && selectedQuote && (
                <div className="space-y-6">
                  <div className="bg-gray-100 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Final Amount
                      </p>
                      <p className="text-2xl font-black text-gray-900">
                        {calculateTotal(selectedQuote.currentAmount)} TK
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400">
                        Base: {selectedQuote.currentAmount} TK
                      </p>
                      <p className="text-[10px] font-bold text-blue-500">
                        Service Fee: 5%
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black uppercase text-gray-500 mb-3 block">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {paymentMethods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m.id)}
                          className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 bg-white ${
                            selectedMethod === m.id
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-100 grayscale opacity-60"
                          }`}
                        >
                          <img
                            src={m.logo}
                            className="h-8 w-auto object-contain"
                          />
                          <span className="text-[10px] font-black uppercase">
                            {m.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <CreditCard
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        placeholder="Enter Gateway Password"
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <button
                      disabled={
                        !selectedMethod || confirmAndPayMutation.isPending
                      }
                      onClick={() =>
                        confirmAndPayMutation.mutate({
                          bookingId: viewingBooking._id,
                          quoteId: selectedQuote._id,
                          driverId:
                            selectedQuote.driverId._id ||
                            selectedQuote.driverId,
                          amount: calculateTotal(selectedQuote.currentAmount),
                          paymentMethod: selectedMethod,
                        })
                      }
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-[2px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2"
                    >
                      {confirmAndPayMutation.isPending
                        ? "Processing..."
                        : "Confirm & Pay Now"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
