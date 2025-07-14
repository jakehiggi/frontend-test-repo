"use client";

import { Routes, Route } from "react-router-dom";
import LandingPage from "@/routes/LandingPage";
import About from "@/routes/About";
import Login from "@/routes/Login";
import Dashboard from "@/routes/dashboard";
import DashboardHome from "@/routes/dashboard/Home";
import Settings from "@/routes/dashboard/Settings";
import Preferences from "@/routes/dashboard/Preferences";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/*" element={<Dashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="settings" element={<Settings />} />
        <Route path="preferences" element={<Preferences />} />
      </Route>
    </Routes>
  );
}
