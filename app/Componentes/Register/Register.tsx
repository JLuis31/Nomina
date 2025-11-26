"use client";

import axios from "axios";
import { useState } from "react";
import "../../Componentes/Register/Register.scss";
import banco from "../../../public/Assets/edificio-del-banco.png";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const RegisterForm = () => {
  const router = useRouter();
  const [data, setData] = useState({
    name: "",
    email: "",
    department: "Humane Resources",
    password: "",
    confirmPassword: "",
  });

  const { departmentDetails } = useUsersDetails();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match", { duration: 2000 });
      return;
    }

    try {
      await axios.post("api/Users/RegisterUsers", {
        Name: data.name,
        Email: data.email,
        Department: data.department,
        Password: data.password,
      });
      toast.success("Registration successful!", { duration: 2000 });
      router.push("/Login");
    } catch (error) {
      const err = error as any;

      if (err.status === 409) {
        toast.error("User already exists.", {
          duration: 2000,
        });
      }
    }
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
        <label htmlFor="name">Name</label>
        <input
          onChange={(e) => setData({ ...data, name: e.target.value })}
          type="text"
          id="name"
          name="name"
          required
          placeholder="Enter your name"
        />
        <label htmlFor="email">Email Address</label>
        <input
          onChange={(e) => setData({ ...data, email: e.target.value })}
          type="email"
          id="email"
          name="email"
          required
          placeholder="example@.com"
        />
        <label htmlFor="department">Department</label>
        <select
          onChange={(e) => setData({ ...data, department: e.target.value })}
          name=""
          id=""
        >
          {departmentDetails.map((dept) => (
            <option key={dept.Id_Department} value={dept.Id_Department}>
              {dept.Description}
            </option>
          ))}
        </select>

        <label htmlFor="password">Password</label>
        <input
          onChange={(e) => setData({ ...data, password: e.target.value })}
          type="password"
          id="password"
          name="password"
          required
          placeholder="Enter your password"
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
          placeholder="Confirm your password"
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
