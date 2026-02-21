import useAuth from "../hooks/useAuth";
import { notify } from "../services/notification";

export default function Settings() {
  const { logout } = useAuth();

  const handleLogoutAll = async () => {
    await logout();

    notify.success("Logged out from all devices");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded space-y-4">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Security */}
      <div className="border p-4 rounded">
        <h3 className="font-bold mb-2">Security</h3>

        <button className="btn btn-error btn-sm" onClick={handleLogoutAll}>
          Logout All
        </button>
      </div>

      {/* Preferences */}
      <div className="border p-4 rounded">
        <h3 className="font-bold mb-2">Preferences</h3>

        <p className="text-gray-500">Dark mode coming soon...</p>
      </div>
    </div>
  );
}
