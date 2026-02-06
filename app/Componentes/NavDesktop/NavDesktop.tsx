"use client";

import "../../Componentes/NavDesktop/NavDesktop.scss";
import Link from "next/link";
import {
  faBars,
  faHouse,
  faUserGroup,
  faGear,
  faCalculator,
  faCalendar,
  faMoneyBillTransfer,
  faMoneyCheckDollar,
  faChartBar,
  faDownload,
  faLock,
  faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import Clock from "../../Shared/Clock/Clock";
import Avatar from "@mui/material/Avatar";
import Image from "next/image";
import Tooltip from "@mui/material/Tooltip";
import { request } from "http";

const NavDesktop = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [localStorageName, setLocalStorageName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [localStorageDepartment, setLocalStorageDepartment] = useState("");
  const { departmentDetails } = useUsersDetails();
  const [showDeduccionesSubmenu, setShowDeduccionesSubmenu] = useState(false);
  const [showPayrollSubmenu, setShowPayrollSubmenu] = useState(false);

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
      icon: faMoneyCheckDollar,
    },
    { label: "User Settings", href: "/UserSettings", icon: faUserGroup },
    {
      label: "Values Configuration",
      href: "/ValuesConfiguration",
      icon: faGear,
    },
  ];
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          ) : option.label === "Payroll Calculation" ? (
            <li className="menuOptions" key={option.label}>
              <span
                style={{ cursor: "pointer", color: "white", fontSize: "15px" }}
                onClick={() => setShowPayrollSubmenu((prev) => !prev)}
              >
                <FontAwesomeIcon
                  icon={option.icon}
                  style={{ marginRight: "10px", color: "white" }}
                />
                {option.label}
              </span>
              {showPayrollSubmenu && (
                <ul
                  style={{
                    paddingLeft: "20px",
                    marginTop: "15px",
                    marginBottom: "8px",
                    listStyle: "none",
                    borderLeft: "2px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <li
                    style={{
                      marginBottom: "8px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.paddingLeft = "16px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.paddingLeft = "12px";
                    }}
                  >
                    <Link
                      href="/PayrollCalculation"
                      onClick={() => setShowMenu(false)}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        fontSize: "14px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCalculator}
                        style={{ marginRight: "10px", width: "14px" }}
                      />
                      Calculate Payroll
                    </Link>
                  </li>
                  <li
                    style={{
                      marginBottom: "8px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.paddingLeft = "16px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.paddingLeft = "12px";
                    }}
                  >
                    <Link
                      href="/ViewPayrollCalculations"
                      onClick={() => setShowMenu(false)}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        fontSize: "14px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faClipboardCheck}
                        style={{ marginRight: "10px", width: "14px" }}
                      />
                      View Calculations
                    </Link>
                  </li>
                  <li
                    style={{
                      marginBottom: "8px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.paddingLeft = "16px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.paddingLeft = "12px";
                    }}
                  >
                    <Link
                      href="/Reports"
                      onClick={() => setShowMenu(false)}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        fontSize: "14px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faChartBar}
                        style={{ marginRight: "10px", width: "14px" }}
                      />
                      View Reports
                    </Link>
                  </li>

                  <li
                    style={{
                      marginBottom: "8px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.paddingLeft = "16px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.paddingLeft = "12px";
                    }}
                  >
                    <Link
                      href="/Receipts"
                      onClick={() => setShowMenu(false)}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        fontSize: "14px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faDownload}
                        style={{ marginRight: "10px", width: "14px" }}
                      />
                      Download Receipts
                    </Link>
                  </li>
                  <li
                    style={{
                      marginBottom: "8px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.paddingLeft = "16px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.paddingLeft = "12px";
                    }}
                  >
                    <Link
                      href="/ClosePeriod"
                      onClick={() => setShowMenu(false)}
                      style={{
                        textDecoration: "none",
                        color: "white",
                        fontSize: "14px",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faLock}
                        style={{ marginRight: "10px", width: "14px" }}
                      />
                      Close Payroll Period
                    </Link>
                  </li>
                </ul>
              )}
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
          ),
        )}
      </ul>
    </div>
  );
};

export default NavDesktop;
