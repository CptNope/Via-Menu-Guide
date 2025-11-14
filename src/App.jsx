import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { FiShield, FiHome, FiShare2 } from "react-icons/fi";
import { GiWineBottle } from "react-icons/gi";
import "./App.css";

import appetizersData from "./data/appetizers.json";
import dinnerData from "./data/dinner.json";
import lunchData from "./data/lunch.json";
import dessertData from "./data/dessert.json";
import kidsData from "./data/kids.json";
import drinksData from "./data/drinks.json";
import winesData from "./data/wines.json";

import MenuPage from "./components/MenuPage";
import PairingsPage from "./components/PairingsPage";
import SharePage from "./components/SharePage";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Combine appetizers with dinner and lunch menus
  const fullDinnerData = [...appetizersData, ...dinnerData];
  const fullLunchData = [...appetizersData, ...lunchData];

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-main">VIA</span>
          <span className="brand-sub">Italian Table</span>
        </div>
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
          <NavLink to="/pairings" className="nav-link icon-link">
            <GiWineBottle /> Pairings
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
                data={dessertData}
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
            path="/pairings"
            element={<PairingsPage wines={winesData} menus={{ dinnerData: fullDinnerData, lunchData: fullLunchData, dessertData, kidsData }} />}
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
                  menus={{ dinnerData: fullDinnerData, lunchData: fullLunchData, dessertData, kidsData, drinksData }}
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
    </div>
  );
}

export default App;
