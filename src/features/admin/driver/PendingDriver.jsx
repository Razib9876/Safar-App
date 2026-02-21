import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FiMoreVertical, FiCheckCircle, FiXCircle } from "react-icons/fi";
import axiosSecure from "../../../services/axiosSecure"; // import your configured axios

// ================= FETCH FUNCTION =================
const fetchPendingDrivers = async () => {
  try {
    const res = await axiosSecure.get("/drivers?status=pending");
    return res.data?.data || []; // always return an array
  } catch (err) {
    console.error("Failed to fetch pending drivers", err);
    return [];
  }
};

export default function PendingDriver() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const queryClient = useQueryClient();

  // ================= FETCH DRIVERS =================
  const {
    data: drivers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pending-drivers"],
    queryFn: fetchPendingDrivers,
  });

  // ================= APPROVE MUTATION =================
  const approveMutation = useMutation({
    mutationFn: async (driverId) => {
      return await axiosSecure.patch(`/drivers/${driverId}/approve`);
    },
    onSuccess: () => {
      toast.success("Driver Approved Successfully");
      queryClient.invalidateQueries(["pending-drivers"]);
      setSelectedDriver(null);
    },
    onError: () => {
      toast.error("Failed to approve driver");
    },
  });

  // ================= REJECT MUTATION =================
  const rejectMutation = useMutation({
    mutationFn: async (driverId) => {
      return await axiosSecure.patch(`/drivers/${driverId}/reject`);
    },
    onSuccess: () => {
      toast.success("Driver Rejected");
      queryClient.invalidateQueries(["pending-drivers"]);
      setSelectedDriver(null);
    },
    onError: () => {
      toast.error("Failed to reject driver");
    },
  });

  const handleApprove = (driver) => {
    approveMutation.mutate(driver._id);
    setOpenDropdown(null);
  };

  const handleReject = (driver) => {
    rejectMutation.mutate(driver._id);
    setOpenDropdown(null);
  };

  // ================= LOADING & ERROR =================
  if (isLoading)
    return <div className="p-6 text-center">Loading drivers...</div>;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">Failed to load drivers</div>
    );

  // ================= MAIN RENDER =================
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Drivers</h1>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">NID</th>
              <th className="p-3">License</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr
                key={driver._id}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedDriver(driver)}
              >
                <td className="p-3">
                  <div className="font-medium">{driver.name}</div>
                  <div className="text-xs text-gray-500">
                    {driver.userId?.email}
                  </div>
                </td>
                <td className="p-3">{driver.phoneNumber}</td>
                <td className="p-3 capitalize">
                  {driver.activeVehicle?.type} - {driver.activeVehicle?.model}
                </td>
                <td className="p-3">
                  {driver.nid?.verified ? (
                    <span className="text-green-600 text-xs">Verified</span>
                  ) : (
                    <span className="text-yellow-600 text-xs">
                      Not Verified
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {driver.drivingLicense?.verified ? (
                    <span className="text-green-600 text-xs">Verified</span>
                  ) : (
                    <span className="text-yellow-600 text-xs">
                      Not Verified
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    {driver.status}
                  </span>
                </td>
                <td
                  className="p-3 text-right relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === driver._id ? null : driver._id,
                      )
                    }
                  >
                    <FiMoreVertical />
                  </button>
                  {openDropdown === driver._id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full"
                        onClick={() => handleApprove(driver)}
                      >
                        <FiCheckCircle /> Approve
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-red-600 w-full"
                        onClick={() => handleReject(driver)}
                      >
                        <FiXCircle /> Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="lg:hidden space-y-4">
        {drivers.map((driver) => (
          <div
            key={driver._id}
            className="bg-white p-4 rounded-xl shadow cursor-pointer"
            onClick={() => setSelectedDriver(driver)}
          >
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{driver.name}</div>
                <div className="text-sm text-gray-500">
                  {driver.activeVehicle?.type?.toUpperCase()}
                </div>
              </div>
              <span className="text-xs bg-yellow-100 px-2 py-1 rounded">
                {driver.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {driver.phoneNumber}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedDriver && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedDriver(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDriver(null)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Driver Details</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {selectedDriver.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedDriver.userId?.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedDriver.phoneNumber}
              </p>
              <p>
                <strong>Vehicle:</strong> {selectedDriver.activeVehicle?.type} -{" "}
                {selectedDriver.activeVehicle?.model}
              </p>
              <p>
                <strong>NID:</strong> {selectedDriver.nid?.number}
              </p>
              <p>
                <strong>License:</strong>{" "}
                {selectedDriver.drivingLicense?.number}
              </p>
              <p>
                <strong>Status:</strong> {selectedDriver.status}
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleApprove(selectedDriver)}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => handleReject(selectedDriver)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
