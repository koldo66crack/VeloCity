// src/layouts/MemberLayout.jsx
import React from "react";
import Navbar from "../components/Navbar";

export default function MemberLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
