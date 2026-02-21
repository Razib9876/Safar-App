import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axiosSecure from "../services/axiosSecure";
import { notify } from "../services/notification";

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [dbUser, setDbUser] = useState(null);

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");

  const [loading, setLoading] = useState(true);

  /* Load user from DB */
  useEffect(() => {
    if (!user?.email) return;

    axiosSecure.get(`/users/${user.email}`).then((res) => {
      setDbUser(res.data);

      setName(res.data.name);
      setPhoto(res.data.photo);

      setLoading(false);
    });
  }, [user]);

  /* Update Profile */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update Firebase
      await updateProfile(name, photo);

      // Update DB
      await axiosSecure.patch(`/users/${dbUser._id}`, { name, photo });

      notify.success("Profile updated");
    } catch {
      notify.error("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="label">Email</label>

          <input
            value={user.email}
            disabled
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Role */}
        <div>
          <label className="label">Role</label>

          <input
            value={dbUser.role}
            disabled
            className="input input-bordered w-full bg-gray-100"
          />
        </div>

        {/* Name */}
        <div>
          <label className="label">Full Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* Photo */}
        <div>
          <label className="label">Photo URL</label>

          <input
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* Preview */}
        {photo && (
          <img
            src={photo}
            alt="preview"
            className="w-24 h-24 rounded-full object-cover mt-2"
          />
        )}

        {/* Save */}
        <button type="submit" className="btn btn-primary w-full">
          Save Changes
        </button>
      </form>
    </div>
  );
}
