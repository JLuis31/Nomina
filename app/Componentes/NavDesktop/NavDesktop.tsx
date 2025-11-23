"use client";

import "../../Componentes/NavDesktop/NavDesktop.scss";
import Link from "next/link";
import {
  faBars,
  faHouse,
  faUserGroup,
  faFileLines,
  faGear,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import nominaImage from "../../../public/Assets/nomina-de-sueldos.png";

const NavDesktop = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [localStorageName, setLocalStorageName] = useState("");
  const [localStorageDepartment, setLocalStorageDepartment] = useState("");

  const session = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && session.data?.user) {
      localStorage.setItem("userName", session.data.user.name);
      localStorage.setItem("userDepartment", session.data.user.department);
      setLocalStorageName(session.data.user.name);
      setLocalStorageDepartment(session.data.user.department);
    }
  }, [session.data]);

  const menuOptions = [
    { label: "Home", href: "/Dashboard", icon: faHouse },
    { label: "Employees", href: "/Employees", icon: faUserGroup },
    { label: "Reports", href: "/Reports", icon: faFileLines },
    { label: "Settings", href: "/Settings", icon: faGear },
    {
      label: "Values Configuration",
      href: "/ValuesConfiguration",
      icon: faSliders,
    },
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

      <ul className={`menu-horizontal${showMenu ? "" : " menu-hidden"}`}>
        <div className="menu-separacion">
          {" "}
          <FontAwesomeIcon
            icon={faBars}
            className="menu-icon"
            onClick={() => setShowMenu(!showMenu)}
          />
          <b>Nomina - DOCHUB</b>
        </div>
        {menuOptions.map((option) => (
          <li key={option.label}>
            <Link href={option.href} onClick={() => setShowMenu(false)}>
              <FontAwesomeIcon
                icon={option.icon}
                style={{ marginRight: "10px", width: "15px" }}
              />
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavDesktop;
