"use client";

import { useState } from "react";
import "../../Componentes/Register/Register.scss";
import banco from "../../../public/Assets/edificio-del-banco.png";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(data);
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", { duration: 2000 });
      return;
    }
    router.push("/Login");
    toast.success("Registered successfully!", { duration: 2000 });
  };
  return (
    <div className="login-form">
      <div className="images-stack">
        <Image
          className="image-top"
          height={1000}
          width={1000}
          src={banco}
          alt="Banco"
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            width: "5%",
            height: "auto",
            objectFit: "cover",
            zIndex: 2,
            opacity: 0.9,
          }}
        />
        <Image
          className="image-bottom"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSQr4-VlGCprmsvx1W0iSh0Bgd8HC5vEhKE6Z4_BeJWbNykAcoxz3vLoNxqU7Omqxv6ccs-gFhAmA8HCIWyM2XAAhSMLaP7CWdK-EdQ5WLRWjDMoNXfFHII3iTBC1rL0p1iWqRnwh_KLKlhgTcEhDdrsNPz8E7IoDdxLG13LUoJUO8w0-S8EAJzmXwulsBNAUAhOo3tnmbJ1CisXExV5VPIoYVWC1wxdXvyBMAKjUrc6cduutpW06qS1fiNcbVZxawgH-k0goZRbM"
          alt="avatar"
          width={1000}
          height={1000}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            objectFit: "cover",
            zIndex: 1,
          }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <h1>Register for Free</h1>
        <h4>Welcome! Please enter your details</h4>
        <label htmlFor="email">Email Address</label>
        <input
          onChange={(e) => setData({ ...data, email: e.target.value })}
          type="email"
          id="email"
          name="email"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          onChange={(e) => setData({ ...data, password: e.target.value })}
          type="password"
          id="password"
          name="password"
          required
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          onChange={(e) =>
            setData({ ...data, confirmPassword: e.target.value })
          }
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
        />

        <button type="submit">Register</button>
        <label className="register" htmlFor="register">
          <a href="/Login">Have an account? Login</a>
        </label>

        <h5 className="copy">@2024 Nomina. All rights reserved.</h5>
        <h5>Help & Support</h5>
      </form>
    </div>
  );
};

export default RegisterForm;
