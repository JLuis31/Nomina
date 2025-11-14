"use client";

import "../../Componentes/NavDesktop/NavDesktop.scss";
import Link from "next/link";
import {
  faBars,
  faHouse,
  faUserGroup,
  faFileLines,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { parse } from "path";

const NavDesktop = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const localStorageName = localStorage.getItem("userName");

  const localStorageDepartment = localStorage.getItem("userDepartment");

  const menuOptions = [
    { label: "Home", href: "/Dashboard", icon: faHouse },
    { label: "Employees", href: "/Employees", icon: faUserGroup },
    { label: "Reports", href: "/Reports", icon: faFileLines },
    { label: "Settings", href: "/Settings", icon: faGear },
  ];

  const handleLogOut = async () => {
    await signOut({ redirect: false });
    router.push("/Login");
    localStorage.removeItem("userName");
    localStorage.removeItem("userDepartment");
  };

  return (
    <div className="contenedor">
      <nav className="nav-bar">
        <div>
          {" "}
          <FontAwesomeIcon
            icon={faBars}
            className="menu-icon"
            onClick={() => setShowMenu(!showMenu)}
          />
          <span className="titulo">
            <Link className="titulo-interior" href="/Dashboard">
              Nomina
            </Link>
          </span>
        </div>
        <div>
          {" "}
          <label htmlFor="nombreUsuario">
            {localStorageName} -{" "}
            {String(localStorageDepartment) === "1"
              ? "Human Resources"
              : String(localStorageDepartment) === "2"
              ? "Finance"
              : String(localStorageDepartment) === "3"
              ? "IT"
              : "Otro"}
          </label>{" "}
          <button onClick={handleLogOut} className="logout">
            Logout
          </button>
        </div>
      </nav>

      {showMenu && (
        <ul className="menu-horizontal">
          {menuOptions.map((option) => (
            <li key={option.label}>
              <Link href={option.href} onClick={() => setShowMenu(false)}>
                <FontAwesomeIcon
                  icon={option.icon}
                  style={{ marginRight: "10px", width: "15px" }}
                ></FontAwesomeIcon>
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavDesktop;
