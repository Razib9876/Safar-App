import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../services/axiosSecure";
import useDrivers from "../../../hooks/useDrivers";
import toast from "react-hot-toast";

const AvailableDriver = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [confirmDriver, setConfirmDriver] = useState(null);

  const queryClient = useQueryClient();

  const { drivers, total, isLoading } = useDrivers("available", page, search);

  const suspendMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/drivers/${id}/suspend`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries(["drivers"]);
      const previous = queryClient.getQueryData(["drivers"]);

      queryClient.setQueryData(["drivers"], (old) => {
        return {
          ...old,
          data: old?.data?.filter((d) => d._id !== id),
        };
      });

      return { previous };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["drivers"], context.previous);
      toast.error("Suspend failed");
    },
    onSuccess: () => {
      toast.success("Driver Suspended");
      queryClient.invalidateQueries(["drivers"]);
    },
  });

  const totalPages = Math.ceil(total / 10);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, phone"
          className="input input-bordered w-full max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE (keep your existing table structure) */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.name}</td>
                <td>{driver.phoneNumber}</td>
                <td>{driver.activeVehicle?.model}</td>
                <td>{driver.status}</td>
                <td>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => setConfirmDriver(driver)}
                  >
                    Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`btn btn-sm ${page === i + 1 ? "btn-primary" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* CONFIRM MODAL */}
      {confirmDriver && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Suspend {confirmDriver.name}?</h3>
            <div className="modal-action">
              <button className="btn" onClick={() => setConfirmDriver(null)}>
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => {
                  suspendMutation.mutate(confirmDriver._id);
                  setConfirmDriver(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableDriver;
