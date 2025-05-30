import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PublicHome from "./pages/PublicHome";
import MemberHome from "./pages/MemberHome";
import DashboardPage from "./pages/DashboardPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";

import PublicLayout from "./layouts/PublicLayout";
import MemberLayout from "./layouts/MemberLayout";
import EarlyBirdLaunchpad from "./pages/EarlyBirdLaunchpad";
import SeniorBlueprint from "./pages/SeniorBlueprint";
import ComparePage from "./pages/ComparePage";

import GuidePage from "./pages/GuidePage";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/home"
          element={
            <PublicLayout>
              <PublicHome />
            </PublicLayout>
          }
        />
        <Route
          path="/home/:uid"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <MemberHome />
              </MemberLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MemberLayout>
                <DashboardPage />
              </MemberLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/early-bird"
          element={
            <PublicLayout>
              <EarlyBirdLaunchpad />
            </PublicLayout>
          }
        />
        <Route
          path="/senior-blueprint"
          element={
            <PublicLayout>
              <SeniorBlueprint />
            </PublicLayout>
          }
        />
        <Route
          path="/compare"
          element={
            <PublicLayout>
              <ComparePage />
            </PublicLayout>
          }
        />
        <Route
          path="/guide"
          element={
            <PublicLayout>
              <GuidePage />
            </PublicLayout>
          }
        />
        <Route path="/listing/:id" element={<ListingDetailPage />} />
      </Routes>

      <AuthModal />
    </>
  );
}
