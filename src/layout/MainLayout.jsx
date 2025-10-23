import { Outlet } from "react-router-dom";
import React from "react";
import Navbar from "../components/Navbar";

function MainLayout() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  return (
    <>
      <Navbar user={loggedUser} />  {/* user prop yuboramiz */}
      <main className="pt-20"> {/* navbar ustiga yopishmasligi uchun padding */}
        <Outlet />
      </main>
      <footer className="p-4 text-center text-gray-500">
        <a href="https://www.youtube.com/@akhrorweb" target="_blank">
          Youtube
        </a>{" "}
        |{" "}
        <a href="https://www.github.com/akhrorsoliev" target="_blank">
          Github
        </a>
      </footer>
    </>
  );
}

export default MainLayout;
