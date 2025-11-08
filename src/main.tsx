import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App'
import DetailPage from "./pages/DetailPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter> {/* ✅ BrowserRouter → HashRouter */}
      <Routes>
        <Route path="/" element={<App />} /> 
        <Route path="/detail/:id" element={<DetailPage />} /> 
      </Routes>
    </HashRouter>
  </StrictMode>
);