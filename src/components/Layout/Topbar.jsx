import useAuth from "../../hooks/useAuth";

export default function Topbar() {
  const { user, logout } = useAuth();

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="font-semibold text-lg">Dashboardd</h2>

      <div className="flex items-center gap-3">
        <img
          src={user?.photoURL || "/avatar.png"}
          className="w-8 h-8 rounded-full"
          alt="user"
        />

        <span className="text-sm">{user?.displayName}</span>

        <button onClick={logout} className="btn btn-sm btn-outline">
          Logout
        </button>
      </div>
    </div>
  );
}
