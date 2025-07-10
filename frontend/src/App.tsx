"use client";

import { Routes, Route } from "react-router-dom";
import LandingPage from "@/routes/LandingPage";
import About from "@/routes/About";
import Login from "@/routes/Login";
import Dashboard from "@/routes/dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
