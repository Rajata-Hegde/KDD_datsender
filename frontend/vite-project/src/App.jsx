import { useState, useEffect } from "react"; // Added useEffect for debugging
import Dashboard from "./pages/Dashboard";
import ModelPerformance from "./pages/ModelPerformance";
import AboutSystem from "./pages/AboutSystem";
import AttackReport from "./pages/AttackReport"; // 1. IMPORT
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  // 2. DEBUGGING: This will show you exactly what text is coming from the Sidebar
  useEffect(() => {
    console.log("Current Active Page:", activePage);
  }, [activePage]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col font-mono">
      <Sidebar 
        open={menuOpen} 
        setOpen={setMenuOpen} 
        setActivePage={setActivePage} 
      />
      
      <Header toggleMenu={() => setMenuOpen(!menuOpen)}/>

      <main className="flex-grow">
        {/* 3. UPDATED SWITCH LOGIC */}
        {activePage === "Dashboard" ? (
          <Dashboard />
        ) : activePage === "Model Performance" ? (
          <ModelPerformance />
        ) : activePage === "About System" ? (
          <AboutSystem />
        ) : activePage === "Attack Reports" ? ( // ENSURE THIS MATCHES SIDEBAR STRING
          <AttackReport />
        ) : (
          <div className="p-20 text-center text-gray-500 uppercase tracking-widest">
            {activePage} :: INITIALIZING...
          </div>
        )}
      </main>

      <Footer/>
    </div>
  );
}