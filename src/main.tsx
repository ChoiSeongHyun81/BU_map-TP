import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from "react-router-dom";

import './index.css'
import App from './App'
import DetailPage from "./pages/DetailPage";
import Login from './loginPage/Login'; 
import Register from './loginPage/Register';


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/" element={<Login />} />

        {/* 회원가입 페이지 */}
        <Route path="/register" element={<Register />} />

         {/* 앱 화면 */}
        <Route path="/app" element={<App />} />
        <Route path="/detail/:id" element={<DetailPage />} /> 

      </Routes>
    </HashRouter>
  </StrictMode>
);