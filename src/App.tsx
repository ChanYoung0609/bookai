import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import LandingPage from "./pages/LandingPage";
import GalleryPage from "./pages/GalleryPage";
import BookDetailPage from "./pages/BookDetailPage";
import ReadingPage from "./pages/ReadingPage";
import WizardPage from "./pages/WizardPage";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UnderConstructionPage from "./pages/UnderConstructionPage";

// --- Main App ---

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<GalleryPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/read/:id" element={<ReadingPage />} />
            <Route path="/create" element={<WizardPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/coming-soon" element={<UnderConstructionPage />} />
            <Route path="*" element={<UnderConstructionPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
