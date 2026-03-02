import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import ScrollToTop from "../components/common/ScrollTop";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <ScrollToTop />
      <Navbar></Navbar>
      {/* Page content */}
      <main className="flex-1 ">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer></Footer>
    </div>
  );
}
