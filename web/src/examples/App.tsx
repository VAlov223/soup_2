import React from "react";
import { DoctorPage } from "../pages/DoctorPage";
import { ConnectControllerPage } from "../pages/ControllerPage";
import { Route, Routes } from "react-router-dom";
import { AdminPage } from "../pages/AdminPage";
import { Auth } from "../components/Auth";
import { ScreenPage } from "../pages/ScreenPage";
import { AdminCabinets } from "../components/Admin/Outlets/AdminCabinets";
import { AdminDoctors } from "../components/Admin/Outlets/AdminDoctor";
import { AdminQueue } from "../components/Admin/Outlets/AdminQueue";
import { AdminAdditionals } from "../components/Admin/Outlets/AdminAdditional";

export default function App() {
  return (
    <div className="w-100 h-100">
      <Routes>
        <Route index element={<DoctorPage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route path="cabinets" element={<AdminCabinets />} />
          <Route path="queues" element={<AdminQueue />} />
          <Route path="additionals" element={<AdminAdditionals />} />
          <Route index element={<AdminDoctors />} />
        </Route>
        <Route path="/login" element={<Auth />} />
        <Route path="/screen/:cabinet" element={<ScreenPage />} />
        <Route
          path="/controller/:doctor/:cabinet/:additional"
          element={<ConnectControllerPage fetchUrl="/api/checkController" />}
        />
      </Routes>
    </div>
  );
}
