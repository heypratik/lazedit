// Sidebar.js
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
const Sidebar = ({ activeLink }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarLinks = [
    { href: "/dashboard", src: "/Home.svg", alt: "Home" },
    { href: "/calendar", src: "/Calendar Plus.svg", alt: "Calendar Plus" },
    {
      href: "/assets",
      src: "/Align Text Bottom.svg",
      alt: "Align Text Bottom",
    },
    { href: "/settings", src: "/Settings.svg", alt: "Settings" },
    { href: "/logout", src: "/Logout.svg", alt: "Logout" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className="d-md-none p-4 bg-dark text-white">
        <button
          onClick={toggleSidebar}
          className="focus:outline-none px-2 py-1"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      <div
        className={`d-md-block sidebar ${
          isOpen ? "d-block py-3 w-100" : "d-none"
        } col-sm-1 max-w-[60px] bg-dark text-white pt-5 p-sm-0`}
      >
        <div className="flex flex-md-column flex-sm-row items-center justify-content-center">
          {sidebarLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="my-md-5 my-sm-0 menu-icons"
            >
              <Image
                src={link.src}
                alt={link.alt}
                className={`icon ${activeLink === link.href ? "active" : ""}`}
                width={activeLink === link.href ? 40 : 40}
                height={activeLink === link.href ? 40 : 40}
                priority
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
