"use client";

import { useState } from "react";
import "../../Componentes/Login/Login.scss";
import Image from "next/image";
import banco from "../../../public/Assets/edificio-del-banco.png";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

const LoginForm = () => {
  const session = useSession();
  console.log("Current session:", session);

  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Intento de login para:", data.email);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.ok) {
        router.push("/Dashboard");
        toast.success("Login successful!", { duration: 2000 });
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials." + error);
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
        <h1>Log In </h1>
        <h4>Welcome back! Please enter your details</h4>
        <label htmlFor="email">Email Address</label>
        <input
          onChange={(e) => setData({ ...data, email: e.target.value })}
          type="email"
          id="email"
          name="email"
          required
          placeholder="example@.com"
        />

        <label htmlFor="password">Password</label>
        <input
          onChange={(e) => setData({ ...data, password: e.target.value })}
          type="password"
          id="password"
          name="password"
          required
          placeholder="Enter your password"
        />
        <label className="forgot-password" htmlFor="forgotPassword">
          <a href="#">Forgot Password?</a>
        </label>

        <button type="submit">Log In</button>
        <label className="register" htmlFor="register">
          <a href="/Register">Dont have an account? Register</a>
        </label>

        <h5 className="copy">@2024 Nomina. All rights reserved.</h5>
        <h5>Help & Support</h5>
      </form>
    </div>
  );
};

export default LoginForm;
