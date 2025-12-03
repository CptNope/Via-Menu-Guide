import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { FiShield, FiHome, FiShare2, FiDollarSign } from "react-icons/fi";
import "./App.css";

import appetizersData from "./data/appetizers.json";
import dinnerData from "./data/dinner.json";
import lunchData from "./data/lunch.json";
import dessertData from "./data/dessert.json";
import gelatoData from "./data/gelato.json";
import pastaData from "./data/pasta.json";
import kidsData from "./data/kids.json";
import drinksData from "./data/drinks.json";

import MenuPage from "./components/MenuPage";
import SharePage from "./components/SharePage";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import UpdateNotification from "./components/UpdateNotification";
import TipTracker from "./components/TipTracker";
import GlobalSearch from "./components/GlobalSearch";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [workbox, setWorkbox] = useState(null);

  // Listen for workbox to be set by index.js
  React.useEffect(() => {
    if (window.workbox) {
      setWorkbox(window.workbox);
    }

    // Listen for workbox ready and update events
    const handleWorkboxReady = () => {
      if (window.workbox) {
        setWorkbox(window.workbox);
      }
    };

    const handleWorkboxUpdate = () => {
      if (window.workbox) {
        setWorkbox(window.workbox);
      }
    };

    window.addEventListener('workboxReady', handleWorkboxReady);
    window.addEventListener('workboxUpdate', handleWorkboxUpdate);

    return () => {
      window.removeEventListener('workboxReady', handleWorkboxReady);
      window.removeEventListener('workboxUpdate', handleWorkboxUpdate);
    };
  }, []);

  // Combine appetizers with dinner and lunch menus
  const fullDinnerData = [...appetizersData, ...dinnerData, ...pastaData];
  const fullLunchData = [...appetizersData, ...lunchData, ...pastaData];
  
  // Combine desserts with individual gelato/sorbetto items
  const fullDessertData = [...dessertData, ...gelatoData];

  // Menu data for search
  const allMenuData = {
    dinner: fullDinnerData,
    lunch: fullLunchData,
    dessert: fullDessertData,
    kids: kidsData,
    drinks: drinksData
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-main">VIA</span>
          <span className="brand-sub">Italian Table</span>
        </div>
        <GlobalSearch menuData={allMenuData} />
        <nav className="nav">
          <NavLink to="/dinner" className="nav-link">
            Dinner
          </NavLink>
          <NavLink to="/lunch" className="nav-link">
            Lunch
          </NavLink>
          <NavLink to="/dessert" className="nav-link">
            Dessert
          </NavLink>
          <NavLink to="/kids" className="nav-link">
            Kids
          </NavLink>
          <NavLink to="/drinks" className="nav-link">
            Drinks
          </NavLink>
          <NavLink to="/tips" className="nav-link icon-link">
            <FiDollarSign /> Tips
          </NavLink>
          <NavLink to="/share" className="nav-link icon-link">
            <FiShare2 /> Share
          </NavLink>
          <NavLink to="/admin" className="nav-link icon-link">
            <FiShield /> Admin
          </NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <MenuPage
                title="Dinner"
                data={fullDinnerData}
                showKidsFilter={false}
              />
            }
          />
          <Route
            path="/dinner"
            element={
              <MenuPage
                title="Dinner"
                data={fullDinnerData}
                showKidsFilter={false}
              />
            }
          />
          <Route
            path="/lunch"
            element={
              <MenuPage
                title="Lunch"
                data={fullLunchData}
                showKidsFilter={false}
              />
            }
          />
          <Route
            path="/dessert"
            element={
              <MenuPage
                title="Dessert"
                data={fullDessertData}
                showKidsFilter={false}
              />
            }
          />
          <Route
            path="/kids"
            element={
              <MenuPage title="Kids" data={kidsData} showKidsFilter={false} />
            }
          />
          <Route
            path="/drinks"
            element={
              <MenuPage
                title="Drinks"
                data={drinksData}
                showKidsFilter={false}
              />
            }
          />
          <Route
            path="/tips"
            element={<TipTracker />}
          />
          <Route
            path="/share"
            element={<SharePage />}
          />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminPanel
                  onLogout={() => setIsAdmin(false)}
                  menus={{ dinnerData: fullDinnerData, lunchData: fullLunchData, dessertData: fullDessertData, kidsData, drinksData }}
                />
              ) : (
                <AdminLogin onLogin={() => setIsAdmin(true)} />
              )
            }
          />
          <Route
            path="*"
            element={
              <div className="page">
                <h1>
                  <FiHome /> VIA Italian Table Menu
                </h1>
                <p>Select a menu from the navigation above.</p>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <small>VIA Italian Table · Interactive Menu PWA · Demo starter</small>
      </footer>

      {/* Update notification - shows when new version available */}
      <UpdateNotification workbox={workbox} />
    </div>
  );
}

export default App;
