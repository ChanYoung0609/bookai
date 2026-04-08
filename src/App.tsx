import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import LandingPage from "./pages/LandingPage";
import GalleryPage from "./pages/GalleryPage";
import BookDetailPage from "./pages/BookDetailPage";
import ReadingPage from "./pages/ReadingPage";
import WizardPage from "./pages/WizardPage";
import LibraryPage from "./pages/LibraryPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileEditPage from "./pages/ProfileEditPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage";
import UnderConstructionPage from "./pages/UnderConstructionPage";
import AboutPage from "./pages/AboutPage";
import AuthorDashboardPage from "./pages/AuthorDashboardPage";
import ReaderDashboardPage from "./pages/ReaderDashboardPage";
import StartPage from "./pages/StartPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary flex flex-col">
        <Navbar />
        <main className="flex-grow pb-24 md:pb-0">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/start" element={<StartPage />} />
            <Route path="/explore" element={<GalleryPage />} />
            <Route path="/search" element={<GalleryPage />} />
            <Route path="/dashboard/author" element={<AuthorDashboardPage />} />
            <Route path="/dashboard/reader" element={<ReaderDashboardPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/read/:id" element={<ReadingPage />} />
            <Route path="/create" element={<WizardPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/coming-soon" element={<UnderConstructionPage />} />
            <Route path="*" element={<UnderConstructionPage />} />
          </Routes>
        </main>
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </Router>
  );
}
