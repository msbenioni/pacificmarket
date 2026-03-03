/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './screens/About';
import AdminDashboard from './screens/AdminDashboard';
import ApplyListing from './screens/ApplyListing';
import BusinessProfile from './screens/BusinessProfile';
import Contact from './screens/Contact';
import CustomerPortal from './screens/CustomerPortal';
import Home from './screens/Home';
import Insights from './screens/Insights';
import InvoiceGenerator from './screens/InvoiceGenerator';
import Pricing from './screens/Pricing';
import QRCodeGenerator from './screens/QRCodeGenerator';
import Registry from './screens/Registry';
import __Layout from './components/layout/Layout.jsx';


export const PAGES = {
    "About": About,
    "AdminDashboard": AdminDashboard,
    "ApplyListing": ApplyListing,
    "BusinessProfile": BusinessProfile,
    "Contact": Contact,
    "CustomerPortal": CustomerPortal,
    "Home": Home,
    "Insights": Insights,
    "InvoiceGenerator": InvoiceGenerator,
    "Pricing": Pricing,
    "QRCodeGenerator": QRCodeGenerator,
    "Registry": Registry,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};