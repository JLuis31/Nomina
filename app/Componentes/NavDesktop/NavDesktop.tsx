"use client";

import "../../Componentes/NavDesktop/NavDesktop.scss";
import Link from "next/link";
import {
  faBars,
  faHouse,
  faUserGroup,
  faGear,
  faMoneyBill,
  faEye,
  faCalculator,
  faCalendar,
  faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import Clock from "../../Shared/Clock/Clock";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";

const NavDesktop = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [localStorageName, setLocalStorageName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [localStorageDepartment, setLocalStorageDepartment] = useState("");
  const { departmentDetails } = useUsersDetails();
  const [showDeduccionesSubmenu, setShowDeduccionesSubmenu] = useState(false);

  const session = useSession();

  useEffect(() => {
    if (typeof window !== "undefined" && session.data?.user) {
      localStorage.setItem("userName", session.data.user.name);
      localStorage.setItem("userDepartment", session.data.user.department);
      setLocalStorageName(session.data.user.name);
      setLocalStorageDepartment(session.data.user.department);
      setUserImage(session.data.user.image || "");
    }
  }, [session.data]);

  const menuOptions = [
    { label: "Home", href: "/Dashboard", icon: faHouse },
    { label: "Employees", href: "/Employees", icon: faUserGroup },
    {
      label: "Deductions - Incomes",
      href: "/ViewMovements",
      icon: faMoneyBillTransfer,
    },
    { label: "Calendar Settings", href: "/Settings", icon: faCalendar },
    {
      label: "Payroll Calculation",
      href: "/PayrollCalculation",
      icon: faCalculator,
    },
    { label: "User Settings", href: "/UserSettings", icon: faUserGroup },
    {
      label: "Values Configuration",
      href: "/ValuesConfiguration",
      icon: faGear,
    },
  ];
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowMenu(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
              Nomina -
            </Link>
            <Clock></Clock>
          </span>
        </div>

        <div className="avatar-name">
          {" "}
          <Link href="/UserSettings" style={{ textDecoration: "none" }}>
            <Tooltip title={`${localStorageName}`}>
              {session.data?.user?.image || userImage ? (
                <Avatar
                  style={{ cursor: "pointer" }}
                  className="avatar"
                  sx={{
                    listStyle: "none",
                    width: 40,
                    height: 40,
                    bgcolor: "#1976d2",
                    fontSize: 14,
                    mb: 2,
                  }}
                >
                  <Image
                    src={session.data?.user?.image || userImage}
                    alt="User avatar"
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                </Avatar>
              ) : (
                <Avatar
                  style={{ cursor: "pointer" }}
                  className="avatar"
                  sx={{
                    listStyle: "none",
                    width: 40,
                    height: 40,
                    bgcolor: "#1976d2",
                    fontSize: 14,
                    mb: 2,
                  }}
                >
                  {localStorageName?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              )}
            </Tooltip>
          </Link>
        </div>
      </nav>

      <ul className={`menu-horizontal${showMenu ? "" : " menu-hidden"}`}>
        <div className="menu-separacion">
          <FontAwesomeIcon
            icon={faBars}
            className="menu-icon"
            onClick={() => setShowMenu(!showMenu)}
          />
          <p>Nomina - DOCHUB</p>
        </div>
        {menuOptions.map((option) =>
          option.label === "Deductions - Incomes" ? (
            <li className="menuOptions" key={option.label}>
              <span
                style={{ cursor: "pointer", color: "white" }}
                onClick={() => setShowDeduccionesSubmenu((prev) => !prev)}
              >
                <Link href={option.href}>
                  <FontAwesomeIcon
                    icon={option.icon}
                    style={{ marginRight: "10px", color: "white" }}
                  />
                  {option.label}
                </Link>
              </span>
            </li>
          ) : (
            <li key={option.label}>
              <Link href={option.href} onClick={() => setShowMenu(false)}>
                <FontAwesomeIcon
                  icon={option.icon}
                  style={{ marginRight: "10px", width: "15px" }}
                />
                {option.label}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default NavDesktop;
