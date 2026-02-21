import { useState } from "react";
import axiosSecure from "../services/axiosSecure";
import { notify } from "../services/notification";
import HeroPages from "../components/AboutPages/HeroPages";

export default function BeDriver() {
  const [form, setForm] = useState({
    phone: "",
    license: "",
    vehicle: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axiosSecure.post("/drivers/apply", form);

      notify.success("Application submitted");
    } catch {
      notify.error("Submission failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow rounded">
      <HeroPages name="About" />
      <h2 className="text-2xl font-bold mb-4">Apply as Driver</h2>

      <form onSubmit={submit} className="space-y-4">
        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        <input
          name="license"
          placeholder="Driving License No"
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        <input
          name="vehicle"
          placeholder="Vehicle Info"
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />

        <button className="btn btn-primary w-full">Apply</button>
      </form>
    </div>
  );
}
