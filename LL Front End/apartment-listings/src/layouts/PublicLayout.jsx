// src/layouts/PublicLayout.jsx
import React from "react";
import Navbar from "../components/Navbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
