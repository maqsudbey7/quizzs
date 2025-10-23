import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React, { useState, useEffect } from "react";

// pages
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import CreateQuestion from "./pages/CreateQuestion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";

// layout
import MainLayout from "./layout/MainLayout";
import Result from "./components/Result";
import EditQuestion from "./pages/EditQuestion";
import Profile from "./pages/Profile";
import TeacherDashboard from "./pages/TeacherDashboard";
import Leaderboard from "./pages/Leaderboard";
import ResultsOverview from "./pages/ResultsOverview";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("loggedUser"));
    if (logged) setUser(logged);
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout user={user} />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        { path: "/quiz/:title", element: <Quiz /> },
        { path: "/create-question", element: <CreateQuestion /> },
        { path: "/login", element: <Login setUser={setUser} /> },
        { path: "/register", element: <Register setUser={setUser} /> },
        { path: "/dashboard", element: <Dashboard /> }, // teacher uchun
        { path: "/result/:title", element: <Result /> }, // teacher uchun
        { path: "/edit/:subject", element: < EditQuestion /> },
        { path: "/profile", element: <Profile /> },
        { path: "/teacher-dashboard", element: <TeacherDashboard /> },
        { path: 'leaderboard', element: <Leaderboard /> },
        { path: 'results-overview', element: <ResultsOverview  /> }

      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
