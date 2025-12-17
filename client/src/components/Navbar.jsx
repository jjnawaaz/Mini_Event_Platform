import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import Logo from "../svg/Logo";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // prevent scrollbar from scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="nav-gradient text-white px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          <div className="flex items-center gap-x-3 tracking-widest">
            <Logo />
            MiniEvents
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/create" className="hover:text-gray-300">
                Create Event
              </Link>
              <Link to="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-gray-300 border-2 border-white px-3 py-1 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-black px-3 py-1 rounded hover:bg-gray-100"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(true)}>
          <Menu />
        </button>
      </nav>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-gradient-to-b from-[#0f0c29] to-[#24243e] text-white z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-6">
          {/* Close */}
          <button className="self-end text-2xl" onClick={() => setOpen(false)}>
            <X />
          </button>

          {/* Links */}
          {user ? (
            <>
              <Link
                to="/create"
                onClick={() => setOpen(false)}
                className="text-lg hover:text-purple-400"
              >
                Create Event
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="text-lg hover:text-purple-400"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-y-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="hover:text-gray-300 border-2 flex justify-center border-white px-4 py-2 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="bg-white text-black px-4 py-2 flex justify-center rounded hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
