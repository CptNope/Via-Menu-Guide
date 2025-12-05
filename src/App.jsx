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

// Import all drink category files
import drinksDraught from "./data/drinks-draught.json";
import drinksBottlesCans from "./data/drinks-bottles-cans.json";
import drinksNonAlcoholicBeer from "./data/drinks-non-alcoholic-beer.json";
import drinksHalfBottles from "./data/drinks-half-bottles.json";
import drinksItalianReds from "./data/drinks-italian-reds.json";
import drinksSuperTuscan from "./data/drinks-super-tuscan.json";
import drinksMerlotMalbec from "./data/drinks-merlot-malbec.json";
import drinksPinotNoir from "./data/drinks-pinot-noir.json";
import drinksCabernetBlends from "./data/drinks-cabernet-blends.json";
import drinksSauvignonBlanc from "./data/drinks-sauvignon-blanc.json";
import drinksChardonnay from "./data/drinks-chardonnay.json";
import drinksInterestingWhites from "./data/drinks-interesting-whites.json";
import drinksSparkling from "./data/drinks-sparkling.json";
import drinksWineFlights from "./data/drinks-wine-flights.json";
import drinksItalianRedsBottles from "./data/drinks-italian-reds-bottles.json";
import drinksSuperTuscanBottles from "./data/drinks-super-tuscan-bottles.json";
import drinksMerlotMalbecBottles from "./data/drinks-merlot-malbec-bottles.json";
import drinksPinotNoirInterestingRedsBottles from "./data/drinks-pinot-noir-interesting-reds-bottles.json";
import drinksCabernetBlendsBottles from "./data/drinks-cabernet-blends-bottles.json";
import drinksSauvignonBlancBottles from "./data/drinks-sauvignon-blanc-bottles.json";
import drinksChardonnayBottles from "./data/drinks-chardonnay-bottles.json";
import drinksInterestingWhitesBottles from "./data/drinks-interesting-whites-bottles.json";
import drinksSparklingBottles from "./data/drinks-sparkling-bottles.json";
import drinksHalfBottlesWine from "./data/drinks-half-bottles-wine.json";
import drinksBourbon from "./data/drinks-bourbon.json";
import drinksRye from "./data/drinks-rye.json";
import drinksScotch from "./data/drinks-scotch.json";
import drinksGrappa from "./data/drinks-grappa.json";
import drinksCognac from "./data/drinks-cognac.json";
import drinksPort from "./data/drinks-port.json";
import drinksAmaroDigestivo from "./data/drinks-amaro-digestivo.json";
import drinksSignatureCocktails from "./data/drinks-signature-cocktails.json";
import drinksMocktails from "./data/drinks-mocktails.json";
import drinksCoffeeCocktails from "./data/drinks-coffee-cocktails.json";

// Combine all drink categories into one array
const drinksData = [
  ...drinksDraught,
  ...drinksBottlesCans,
  ...drinksNonAlcoholicBeer,
  ...drinksSignatureCocktails,
  ...drinksMocktails,
  ...drinksCoffeeCocktails,
  ...drinksItalianReds,
  ...drinksSuperTuscan,
  ...drinksMerlotMalbec,
  ...drinksPinotNoir,
  ...drinksCabernetBlends,
  ...drinksSauvignonBlanc,
  ...drinksChardonnay,
  ...drinksInterestingWhites,
  ...drinksSparkling,
  ...drinksWineFlights,
  ...drinksItalianRedsBottles,
  ...drinksSuperTuscanBottles,
  ...drinksMerlotMalbecBottles,
  ...drinksPinotNoirInterestingRedsBottles,
  ...drinksCabernetBlendsBottles,
  ...drinksSauvignonBlancBottles,
  ...drinksChardonnayBottles,
  ...drinksInterestingWhitesBottles,
  ...drinksSparklingBottles,
  ...drinksHalfBottles,
  ...drinksHalfBottlesWine,
  ...drinksBourbon,
  ...drinksRye,
  ...drinksScotch,
  ...drinksGrappa,
  ...drinksCognac,
  ...drinksPort,
  ...drinksAmaroDigestivo
];

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
