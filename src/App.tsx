import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const BookDetailPage = lazy(() => import("./pages/BookDetailPage"));
const ReadingPage = lazy(() => import("./pages/ReadingPage"));
const WizardPage = lazy(() => import("./pages/WizardPage"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ProfileEditPage = lazy(() => import("./pages/ProfileEditPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const OAuthCallbackPage = lazy(() => import("./pages/OAuthCallbackPage"));
const UnderConstructionPage = lazy(() => import("./pages/UnderConstructionPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AuthorDashboardPage = lazy(() => import("./pages/AuthorDashboardPage"));
const AuthorRevenuePage = lazy(() => import("./pages/AuthorRevenuePage"));
const ReaderDashboardPage = lazy(() => import("./pages/ReaderDashboardPage"));
const ReaderLikedBooksPage = lazy(() => import("./pages/ReaderLikedBooksPage"));
const RankingsPage = lazy(() => import("./pages/RankingsPage"));
const StartPage = lazy(() => import("./pages/StartPage"));

const RouteFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary flex flex-col">
        <Navbar />
        <main className="flex-grow pb-24 md:pb-0">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/start" element={<StartPage />} />
              <Route path="/explore" element={<GalleryPage />} />
              <Route path="/search" element={<GalleryPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/dashboard/author" element={<AuthorDashboardPage />} />
              <Route path="/dashboard/author/revenue" element={<AuthorRevenuePage />} />
              <Route path="/dashboard/reader" element={<ReaderDashboardPage />} />
              <Route path="/dashboard/reader/liked" element={<ReaderLikedBooksPage />} />
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
          </Suspense>
        </main>
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>
    </Router>
  );
}
