"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavDesktop from "../NavDesktop/NavDesktop";
import "./Settings.scss";

const Settings = () => {
  const router = useRouter();
  const handleLogOut = async () => {
    await signOut({ redirect: false });
    router.push("/Login");
    localStorage.removeItem("userName");
    localStorage.removeItem("userDepartment");
  };

  return (
    <div>
      <NavDesktop />
      <div className="settings-container">
        {" "}
        <button onClick={handleLogOut} className="logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
