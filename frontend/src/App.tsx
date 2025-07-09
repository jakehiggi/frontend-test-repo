"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Login from "@/pages/Login";

export default function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}
