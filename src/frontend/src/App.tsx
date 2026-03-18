import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Layout from "./components/Layout";
import AdminPanel from "./pages/AdminPanel";
import Dashboard from "./pages/Dashboard";
import Performance from "./pages/Performance";
import ResourceLibrary from "./pages/ResourceLibrary";
import StudentProfile from "./pages/StudentProfile";

type Page = "dashboard" | "resources" | "profile" | "performance" | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={navigate} />;
      case "resources":
        return <ResourceLibrary />;
      case "profile":
        return <StudentProfile />;
      case "performance":
        return <Performance />;
      case "admin":
        return <AdminPanel />;
      default:
        return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={navigate}>
        {renderPage()}
      </Layout>
      <Toaster richColors position="top-right" />
    </>
  );
}
