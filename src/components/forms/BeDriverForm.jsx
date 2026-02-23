import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import axiosSecure from "../../services/axiosSecure";
import toast from "react-hot-toast";
import axios from "axios";

const initialVehicle = {
  type: "car",
  model: "",
  registrationNumber: "",
  capacity: 4,
  mainPhoto: "",
  photos: [],
};

export default function BeDriverForm() {
  const { user } = useAuth();
  const axiosSecured = axiosSecure;

  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [vehicles, setVehicles] = useState([initialVehicle]);

  /* ================= IMGBB ================= */
  const API_KEY = "9a83d882ea110a8d3a592375ad8f3ace";

  const uploadImageToImgBB = async (file) => {
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const form = new URLSearchParams();
      form.append("key", API_KEY);
      form.append("image", base64);

      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        form.toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      return response.data.data.url;
    } catch (err) {
      toast.error("Image upload failed");
      return null;
    }
  };

  /* ================= FETCH MONGO USER ================= */
  const { data: mongoUser, isLoading } = useQuery({
    queryKey: ["mongoUser", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecured.get(`/users/by-email/${user.email}`);
      return res.data?.data;
    },
  });

  /* ================= FORM ================= */
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  /* ================= STEP VALIDATION ================= */
  const nextStep = async () => {
    if (step === 1) {
      if (!acceptedTerms) {
        toast.error("You must accept Terms & Conditions");
        return;
      }
    }

    if (step === 2) {
      const valid = await trigger([
        "name",
        "phoneNumber",
        "photo",
        "nidNumber",
        "nidFront",
        "nidBack",
        "licenseNumber",
        "licenseFront",
        "licenseBack",
      ]);

      if (!valid) return toast.error("Please complete required fields");
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  /* ================= VEHICLE HANDLER ================= */
  const handleVehicleChange = (index, field, value) => {
    const updated = [...vehicles];
    updated[index][field] = value;
    setVehicles(updated);
  };

  const addVehicle = () => setVehicles([...vehicles, initialVehicle]);

  const removeVehicle = (index) =>
    setVehicles(vehicles.filter((_, i) => i !== index));

  /* ================= MUTATION ================= */
  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) =>
      await axiosSecured.post("/drivers/create", payload),

    onMutate: () =>
      toast.loading("Submitting application...", { id: "driverToast" }),

    onSuccess: () =>
      toast.success("Driver application submitted!", { id: "driverToast" }),

    onError: (err) =>
      toast.error(err.response?.data?.message || "Submission failed", {
        id: "driverToast",
      }),
  });

  /* ================= SUBMIT ================= */
  const onSubmit = (data) => {
    if (!mongoUser?._id) {
      toast.error("User not authenticated properly");
      return;
    }

    if (vehicles.length === 0) {
      toast.error("At least one vehicle required");
      return;
    }

    // Validate vehicle photos
    for (let i = 0; i < vehicles.length; i++) {
      if (!vehicles[i].mainPhoto) {
        toast.error(`Please upload main photo for vehicle #${i + 1}`);
        return;
      }
    }

    // Validate NID and License photos
    if (!data.nidFront || !data.nidBack) {
      toast.error("Please upload both NID photos");
      return;
    }

    if (!data.licenseFront || !data.licenseBack) {
      toast.error("Please upload both License photos");
      return;
    }

    const payload = {
      userId: mongoUser._id,
      name: data.name,
      phoneNumber: data.phoneNumber,
      photo: data.photo || "",
      vehicleDetails: vehicles.map((v) => ({
        ...v,
        capacity: Number(v.capacity),
        photos: v.photos || [],
        mainPhoto: v.mainPhoto,
      })),
      nid: {
        number: data.nidNumber,
        photos: [data.nidFront, data.nidBack],
      },
      drivingLicense: {
        number: data.licenseNumber,
        photos: [data.licenseFront, data.licenseBack],
      },
    };

    mutate(payload);
  };

  if (isLoading) return <p>Loading user data...</p>;

  /* ================= UI ================= */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-6">
      {/* STEP INDICATOR */}
      <div className="flex justify-between gap-10">
        {["Terms", "Driver Info", "Vehicle Info"].map((label, i) => (
          <div
            key={i}
            className={`flex-1 text-center pb-2 border-b-4 ${
              step === i + 1
                ? "border-blue-600 text-blue-600"
                : "border-gray-200 text-gray-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <div className="h-56 overflow-y-auto border p-4 rounded-lg text-sm text-gray-600 space-y-2">
            <h3 className="font-semibold text-gray-800 mb-2">
              Driver Terms & Conditions
            </h3>
            <p>• You must provide accurate and truthful information.</p>
            <p>• A valid National ID (NID) is required.</p>
            <p>• A valid Driving License is mandatory.</p>
            <p>• Your vehicle must be legally registered.</p>
            <p>• Vehicle documents must be up to date.</p>
            <p>• You must follow all traffic laws and regulations.</p>
            <p>• Dangerous or reckless driving will result in suspension.</p>
            <p>• Fake documents will cause permanent account ban.</p>
            <p>• You agree to background verification if required.</p>
            <p>• The company reserves the right to reject applications.</p>
            <p>• Application review may take 24–72 hours.</p>
            <p>• Commission charges may apply per completed ride.</p>
            <p>• You are responsible for vehicle maintenance and safety.</p>
            <p>• Professional behavior with passengers is mandatory.</p>
            <p>• Violating platform rules may lead to account termination.</p>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
            />
            <label>I have read and agree to all Terms & Conditions</label>
          </div>

          <button
            type="button"
            onClick={nextStep}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  {...register("name", { required: true })}
                  placeholder="Enter your full legal name"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  {...register("phoneNumber", { required: true })}
                  placeholder="Enter active phone number (e.g. +8801XXXXXXXXX)"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  National ID (NID) Number
                </label>
                <input
                  {...register("nidNumber", { required: true })}
                  placeholder="Enter your National ID number"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Driving License Number
                </label>
                <input
                  {...register("licenseNumber", { required: true })}
                  placeholder="Enter your Driving License number"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 ">
                  Driver Profile Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    const url = await uploadImageToImgBB(file);
                    if (url) setValue("photo", url);
                  }}
                  className="input"
                />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  NID Front Side Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    const url = await uploadImageToImgBB(file);
                    if (url) setValue("nidFront", url);
                  }}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  NID Back Side Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    const url = await uploadImageToImgBB(file);
                    if (url) setValue("nidBack", url);
                  }}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  License Front Side Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    const url = await uploadImageToImgBB(file);
                    if (url) setValue("licenseFront", url);
                  }}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  License Back Side Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    const url = await uploadImageToImgBB(file);
                    if (url) setValue("licenseBack", url);
                  }}
                  className="input"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border rounded-lg"
            >
              Back
            </button>

            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          {vehicles.map((vehicle, index) => (
            <div
              key={index}
              className="border p-6 rounded-xl mb-6 shadow-sm bg-white"
            >
              <h3 className="text-lg font-semibold mb-4">
                Vehicle #{index + 1}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicle.type}
                      onChange={(e) =>
                        handleVehicleChange(index, "type", e.target.value)
                      }
                      className="input"
                    >
                      <option value="car">Car</option>
                      <option value="cng">CNG</option>
                      <option value="hiace">Hiace</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Vehicle Model
                    </label>
                    <input
                      placeholder="Enter vehicle model (e.g. Toyota Axio 2020)"
                      className="input"
                      onChange={(e) =>
                        handleVehicleChange(index, "model", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Registration Number
                    </label>
                    <input
                      placeholder="Enter registration number (e.g. DHA-12-3456)"
                      className="input"
                      onChange={(e) =>
                        handleVehicleChange(
                          index,
                          "registrationNumber",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Passenger Capacity
                    </label>
                    <input
                      type="number"
                      placeholder="Enter passenger capacity (e.g. 4)"
                      className="input"
                      onChange={(e) =>
                        handleVehicleChange(index, "capacity", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Vehicle Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        const url = await uploadImageToImgBB(file);
                        if (url) handleVehicleChange(index, "mainPhoto", url);
                      }}
                      className="input"
                    />
                  </div>
                </div>
              </div>

              {vehicles.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVehicle(index)}
                  className="mt-4 text-red-500 text-sm hover:underline"
                >
                  Remove Vehicle
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addVehicle}
            className="text-blue-600 font-medium mb-6 hover:underline"
          >
            + Add Another Vehicle
          </button>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-2 border rounded-lg"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              {isPending ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
