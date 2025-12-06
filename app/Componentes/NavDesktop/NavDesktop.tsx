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
  faMoneyBill,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const NavDesktop = () => {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [localStorageName, setLocalStorageName] = useState("");
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
    }
  }, [session.data]);

  const menuOptions = [
    { label: "Home", href: "/Dashboard", icon: faHouse },
    { label: "Employees", href: "/Employees", icon: faUserGroup },
    {
      label: "Deducciones",
      icon: faFileLines,
      subOptions: [
        {
          label: "Movements Entry",
          href: "/MovementsEntry",
          icon: faMoneyBill,
        },
        { label: "View Deductions", href: "/ViewDeductions", icon: faEye },
      ],
    },
    { label: "Settings", href: "/Settings", icon: faGear },
    {
      label: "Values Configuration",
      href: "/ValuesConfiguration",
      icon: faSliders,
    },
  ];

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
            {departmentDetails.map((dep) => {
              if (String(dep.Id_Department) === localStorageDepartment) {
                return dep.Description;
              }
            })}
          </label>{" "}
          <FontAwesomeIcon icon={faUser} style={{ marginLeft: "10px" }} />
        </div>
      </nav>

      <ul className={`menu-horizontal${showMenu ? "" : " menu-hidden"}`}>
        <div className="menu-separacion">
          <FontAwesomeIcon
            icon={faBars}
            className="menu-icon"
            onClick={() => setShowMenu(!showMenu)}
          />
          Nomina - DOCHUB
        </div>
        {menuOptions.map((option) =>
          option.label === "Deducciones" ? (
            <li className="menuOptions" key={option.label}>
              <span
                style={{ cursor: "pointer", color: "white" }}
                onClick={() => setShowDeduccionesSubmenu((prev) => !prev)}
              >
                <FontAwesomeIcon
                  icon={option.icon}
                  style={{ marginRight: "10px", width: "15px", color: "white" }}
                />
                {option.label}
              </span>
              {showDeduccionesSubmenu && (
                <ul className="submenu">
                  {option.subOptions.map((sub) => (
                    <li className="subOptions" key={sub.label}>
                      <Link href={sub.href} onClick={() => setShowMenu(false)}>
                        <FontAwesomeIcon
                          icon={sub.icon}
                          style={{ marginRight: "10px", width: "15px" }}
                        />{" "}
                        {sub.label}
                      </Link>
                    </li>
                  ))}
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
          )
        )}
      </ul>
    </div>
  );
};

export default NavDesktop;
