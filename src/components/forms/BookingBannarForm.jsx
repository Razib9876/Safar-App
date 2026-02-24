import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "react-datepicker/dist/react-datepicker.css";
import useAuth from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

import divisionsData from "../../assets/data/division.json";
import districtsData from "../../assets/data/district.json";
import upazilasData from "../../assets/data/upazila.json";
import axiosSecure from "../../services/axiosSecure";
import toast from "react-hot-toast";

const BookingForm = ({ driver, onClose }) => {
  const { user } = useAuth();
  const axiosSecured = axiosSecure;
  const [phoneError, setPhoneError] = useState("");

  const [openLocation, setOpenLocation] = useState({ from: false, to: false });
  const [fromDivision, setFromDivision] = useState(null);
  const [fromDistrict, setFromDistrict] = useState(null);
  const [fromUpazila, setFromUpazila] = useState(null);
  const [toDivision, setToDivision] = useState(null);
  const [toDistrict, setToDistrict] = useState(null);
  const [toUpazila, setToUpazila] = useState(null);

  const now = new Date();

  const [dateFrom, setDateFrom] = useState(now);
  const [timeFrom, setTimeFrom] = useState(now);

  const [dateTo, setDateTo] = useState(now);
  const [timeTo, setTimeTo] = useState(
    new Date(now.getTime() + 60 * 60 * 1000),
  );

  const isTodayFrom = dateFrom
    ? dateFrom.toDateString() === new Date().toDateString()
    : false;
  const minFromTime = isTodayFrom ? new Date() : new Date().setHours(0, 0, 0);

  const isSameDay =
    dateFrom && dateTo
      ? dateTo.toDateString() === dateFrom.toDateString()
      : false;
  const minToTime =
    isSameDay && timeFrom ? timeFrom : new Date().setHours(0, 0, 0);

  const [dateTimeError, setDateTimeError] = useState("");

  const formRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);

  const filteredDistricts = (division) =>
    districtsData.districts.filter((d) => d.division_id === division?.id);

  const filteredUpazilas = (district) =>
    upazilasData.upazilas.filter((u) => u.district_id === district?.id);

  const finalLocation = (upazila, district, division) =>
    upazila ? `${upazila.name}, ${district.name}, ${division.name}` : "";

  const { data: mongoUser, isLoading: mongoLoading } = useQuery({
    queryKey: ["mongoUser", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const res = await axiosSecured.get(`/users/by-email/${user.email}`);
        return res.data?.data || null;
      } catch (err) {
        console.error("MongoUser fetch error:", err);
        return null;
      }
    },
  });
  const carTypes = [
    {
      name: "car",
      img: "https://i.ibb.co/qMYJZF1W/2-147321beb1d9fcf16be281f9facfa204d5d02712acef82f3eee589397878c054.png",
    },
    {
      name: "cng",
      img: "https://i.ibb.co/j9NKF9RQ/mini-cng-car-silhouette-flat-260nw-2494093055.png",
    },
    {
      name: "hiace",
      img: "https://i.ibb.co/WpG1BnNt/minivan-bus-transportation-vehicle-silhouette-illustration-free-vector.png",
    },
  ];

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      tripType: "one_way",
      phone: "",
      selectedCar: "car",
    },
  });

  const { mutate: addBooking, isPending } = useMutation({
    mutationFn: async (bookingPayload) => {
      return await axiosSecured.post("/bookings/create", bookingPayload);
    },

    onMutate: () => {
      toast.loading("Adding booking...", { id: "bookingToast" });
    },

    onSuccess: () => {
      toast.success("Booking Added Successfully!", { id: "bookingToast" });
    },

    onError: (err) => {
      toast.error(err.response?.data?.message || "Something went wrong!", {
        id: "bookingToast",
      });
    },
  });

  const validatePhone = (value) => {
    if (!value) {
      setPhoneError("Phone number is required");
      return false;
    } else if (!isValidPhoneNumber(value)) {
      setPhoneError("Invalid phone number for selected country");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const onSubmit = async (data) => {
    if (!user || !mongoUser?._id) {
      setDateTimeError("User not logged in or user data not found.");
      return;
    }

    if (!validatePhone(data.phone)) return;

    const fromDateTime = new Date(
      dateFrom.getFullYear(),
      dateFrom.getMonth(),
      dateFrom.getDate(),
      timeFrom.getHours(),
      timeFrom.getMinutes(),
    );

    const toDateTime = new Date(
      dateTo.getFullYear(),
      dateTo.getMonth(),
      dateTo.getDate(),
      timeTo.getHours(),
      timeTo.getMinutes(),
    );

    if (fromDateTime >= toDateTime) {
      setDateTimeError("'To' date & time must be after 'From' date & time.");
      return;
    }

    setDateTimeError("");

    const tripType = watch("tripType") || "one_way";

    const bookingPayload = {
      userId: mongoUser._id,
      driverId: driver?._id || null,
      tripType,
      vehicleType: watch("selectedCar"),
      phoneNumber: data.phone,
      fromLocation: finalLocation(fromUpazila, fromDistrict, fromDivision),
      toLocation: finalLocation(toUpazila, toDistrict, toDivision),
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      timeFrom: format(timeFrom, "HH:mm"),
      timeTo: format(timeTo, "HH:mm"),
      isPublic: true,
    };

    addBooking(bookingPayload);
    if (onClose) onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setOpenLocation((prev) => ({ ...prev, from: false }));
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setOpenLocation((prev) => ({ ...prev, to: false }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    const combined = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
    );
    return format(combined, "dd-MM-yyyy hh:mma");
  };

  return (
    <div className="relative">
      {mongoLoading && <p>Loading user data...</p>}

      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-t-3xl rounded-b-none md:rounded-b-3xl p-6 lg:p-10 shadow-black text-black mt-20 mb-0 m-auto"
      >
        {/* Vehicle Type */}
        <div className="flex gap-5 -mt-20 justify-center m-auto ">
          {carTypes.map((car) => (
            <button
              type="button"
              key={car.name}
              className={`border-4 p-1 rounded-xl bg-white ${
                watch("selectedCar") === car.name
                  ? "border-orange-500"
                  : "border-gray-300"
              }`}
              onClick={() => setValue("selectedCar", car.name)}
            >
              <img
                src={car.img}
                alt={car.name}
                className="h-20 w-20 object-contain bg-white"
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-7 mt-5">
          {/* Phone Number */}
          <div className="w-full md:w-1/2">
            <label className="font-semibold">Phone Number</label>
            <PhoneInput
              {...register("phone")}
              defaultCountry="BD"
              international
              value={watch("phone")}
              onChange={(value) => setValue("phone", value)}
              onBlur={() => validatePhone(watch("phone"))}
              placeholder="Enter phone number"
              className="w-full mt-2 rounded-xl border p-3 outline-none"
            />
            {phoneError && <p className="text-red-500 mt-1">{phoneError}</p>}
          </div>

          {/* Trip Type */}
          <div className="w-full md:w-1/2 flex items-center gap-4 mt-5">
            <span>One Way</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={watch("tripType") === "round_trip"}
                onChange={(e) =>
                  setValue(
                    "tripType",
                    e.target.checked ? "round_trip" : "one_way",
                  )
                }
              />
              <div className="h-6 w-12 rounded-full bg-gray-300 peer-checked:bg-orange-500 transition-all"></div>
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-6"></div>
            </label>
            <span>Return</span>
          </div>
        </div>

        {/* FROM & TO */}
        <div className="flex gap-9 mt-5 relative">
          {/* FROM */}
          <div className="mb-4 w-1/2 relative" ref={fromRef}>
            <label className="font-semibold">From</label>
            <input
              type="text"
              required
              value={finalLocation(fromUpazila, fromDistrict, fromDivision)}
              onChange={() => {
                setFromDivision(null);
                setFromDistrict(null);
                setFromUpazila(null);
              }}
              placeholder="Select Division → District → Upazila"
              className="w-full mt-2 rounded-xl border p-3 outline-none bg-gray-50"
              onClick={() => setOpenLocation({ ...openLocation, from: true })}
            />
            <AnimatePresence>
              {openLocation.from && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 w-full border bg-white rounded-xl shadow-lg mt-1 z-50 max-h-72 overflow-y-auto"
                >
                  {!fromDivision && (
                    <>
                      <h3 className="font-semibold mb-2 p-2">
                        Select Division
                      </h3>
                      {divisionsData.divisions.map((d) => (
                        <div
                          key={d.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setFromDivision(d)}
                        >
                          {d.name}
                        </div>
                      ))}
                    </>
                  )}
                  {fromDivision && !fromDistrict && (
                    <>
                      <button
                        className="text-blue-500 text-sm underline mb-2 p-2"
                        onClick={() => setFromDivision(null)}
                      >
                        ← Back
                      </button>
                      {filteredDistricts(fromDivision).map((dist) => (
                        <div
                          key={dist.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setFromDistrict(dist)}
                        >
                          {dist.name}
                        </div>
                      ))}
                    </>
                  )}
                  {fromDivision && fromDistrict && !fromUpazila && (
                    <>
                      <button
                        className="text-blue-500 text-sm underline mb-2 p-2"
                        onClick={() => setFromDistrict(null)}
                      >
                        ← Back
                      </button>
                      {filteredUpazilas(fromDistrict).map((u) => (
                        <div
                          key={u.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setFromUpazila(u)}
                        >
                          {u.name}
                        </div>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* TO */}
          <div className="mb-4 w-1/2 relative" ref={toRef}>
            <label className="font-semibold">To</label>
            <input
              type="text"
              required
              value={finalLocation(toUpazila, toDistrict, toDivision)}
              onChange={(e) => {
                setToDivision(null);
                setToDistrict(null);
                setToUpazila(null);
              }}
              placeholder="Select Division → District → Upazila"
              className="w-full mt-2 rounded-xl border p-3 outline-none bg-gray-50 overflow-x-auto whitespace-nowrap"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onClick={() => setOpenLocation({ ...openLocation, to: true })}
            />
            <AnimatePresence>
              {openLocation.to && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 w-full border bg-white rounded-xl shadow-lg mt-1 z-50 max-h-72 overflow-y-auto"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <style>
                    {`
              div::-webkit-scrollbar { display: none; }
            `}
                  </style>

                  {!toDivision && (
                    <>
                      <h3 className="font-semibold mb-2 p-2">
                        Select Division
                      </h3>
                      {divisionsData.divisions.map((d) => (
                        <div
                          key={d.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setToDivision(d)}
                        >
                          {d.name}
                        </div>
                      ))}
                    </>
                  )}

                  {toDivision && !toDistrict && (
                    <>
                      <button
                        className="text-blue-500 text-sm underline mb-2 p-2"
                        onClick={() => setToDivision(null)}
                      >
                        ← Back
                      </button>
                      {filteredDistricts(toDivision).map((dist) => (
                        <div
                          key={dist.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setToDistrict(dist)}
                        >
                          {dist.name}
                        </div>
                      ))}
                    </>
                  )}

                  {toDivision && toDistrict && !toUpazila && (
                    <>
                      <button
                        className="text-blue-500 text-sm underline mb-2 p-2"
                        onClick={() => setToDistrict(null)}
                      >
                        ← Back
                      </button>
                      {filteredUpazilas(toDistrict).map((u) => (
                        <div
                          key={u.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setToUpazila(u)}
                        >
                          {u.name}
                        </div>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* FLEX Date & Time Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          {/* From */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="font-semibold">From Date</label>

              <DatePicker
                selected={dateFrom || null}
                onChange={(date) => setDateFrom(date || null)}
                className="w-full rounded-xl border p-3 mt-2 outline-none text-black"
                dateFormat="dd-MM-yyyy"
                required
                minDate={new Date()}
                placeholderText={new Date().toLocaleDateString()}
              />
            </div>
            <div className="w-1/2">
              <label className="font-semibold">From Time</label>

              <DatePicker
                selected={timeFrom || null}
                onChange={(time) => setTimeFrom(time || null)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="hh:mm aa"
                className="w-full rounded-xl border p-3 mt-2 outline-none"
                minTime={minFromTime}
                maxTime={new Date().setHours(23, 45)}
              />
            </div>
          </div>

          {/* To */}
          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="font-semibold">To Date</label>

              <DatePicker
                selected={dateTo || null}
                onChange={(date) => setDateTo(date || null)}
                className="w-full rounded-xl border p-3 mt-2 outline-none"
                dateFormat="dd-MM-yyyy"
                minDate={dateFrom}
              />
            </div>
            <div className="w-1/2">
              <label className="font-semibold">To Time</label>

              <DatePicker
                selected={timeTo || null}
                onChange={(time) => setTimeTo(time || null)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="hh:mm aa"
                className="w-full rounded-xl border p-3 mt-2 outline-none"
                minTime={minToTime}
                maxTime={new Date().setHours(23, 45)}
              />
            </div>
          </div>
        </div>

        {/* Display Formatted Date & Time */}
        <div className="hidden mt-4 text-gray-700 font-semibold">
          From: {formatDateTime(dateFrom, timeFrom)} &nbsp; | &nbsp; To:{" "}
          {formatDateTime(dateTo, timeTo)}
        </div>

        {dateTimeError && (
          <p className="text-red-500 mt-1 font-semibold">{dateTimeError}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-orange-500 text-white py-4 mt-4 rounded-xl text-lg font-semibold hover:bg-orange-600"
        >
          {isPending ? "Submitting..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
