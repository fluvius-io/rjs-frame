import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { RjsRouteHandler } from "./RjsRouteHandler";

export function RjsApp({ children }: { children: React.ReactNode }) {
return <BrowserRouter>
    <RjsRouteHandler />
    <Routes>
    {children}
    </Routes>
    </BrowserRouter>
}

export { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';