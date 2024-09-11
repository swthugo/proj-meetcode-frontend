import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./routes/App";
import SignIn from "./routes/SignIn";
import SignUp from "./routes/SignUp";
import Dashboard from "./routes/user/Dashboard";
import ProblemPage from "./routes/user/problem/[id]";
import QuestionEditPage from "./routes/admin/edit/[id]";
import AdminDashboard from "./routes/admin/AdminDashboard";
import AdminSignUp from "./routes/admin/AdminSignUp";
import NewProblem from "./routes/admin/edit/NewProblem";

const router = createBrowserRouter([
  { path: "/sitemap", element: <App /> },
  { path: "/", element: <SignIn /> },
  { path: "/login", element: <SignIn /> },
  { path: "/register", element: <SignUp /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/problem/:id", element: <ProblemPage /> },
  { path: "/admin/register", element: <AdminSignUp /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/edit/:id", element: <QuestionEditPage /> },
  { path: "/admin/edit/new", element: <NewProblem /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={router} />);
