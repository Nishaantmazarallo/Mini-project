import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfessionalHome from "./pages/ProfessionalHome";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Contact from "./pages/Contact";
import OnlineClasses from "./pages/OnlineClasses";
import AdminEnrollments from "./pages/AdminEnrollments";
import CreativeNavbar from "./component/CreativeNavbar/CreativeNavbar";

import "./App.css";

export default function App() {
  return (
    <Router>
      <CreativeNavbar />

      {/* Page Content */}
      <main className="content">
        <Routes>
          <Route path="/" element={<ProfessionalHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/online-classes" element={<OnlineClasses />} />
          <Route path="/admin/enrollments" element={<AdminEnrollments />} />
        </Routes>
      </main>
    </Router>
  );
}
