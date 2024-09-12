import React from "react";
import { DoctorPage } from "../pages/DoctorPage";
import { ConnectControllerPage } from "../pages/ControllerPage";
import { Route, Routes } from "react-router-dom";
import { AdminPage } from "../pages/AdminPage";
import { AdminCabinets } from "../components/Admin/Outlet";
import { AdminDoctors } from "../components/Admin/Outlet";
import { AdminQueue } from "../components/Admin/Outlet";
import { Auth } from "../components/Auth";
import { ScreenPage } from "../pages/ScreenPage";

export default function App() {
  return (
    <div className="w-100 h-100">
      <Routes>
        <Route index element={<DoctorPage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminDoctors />} />
          <Route path="cabinets" element={<AdminCabinets />} />
          <Route path="queues" element={<AdminQueue />} />
        </Route>
        <Route path="/login" element={<Auth />} />
        <Route path="/screen/:cabinet" element={<ScreenPage />} />
        <Route
          path="/controller/:doctor/:cabinet"
          element={<ConnectControllerPage fetchUrl="/api/checkController" />}
        />
      </Routes>
    </div>
  );
}
