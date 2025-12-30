"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import "../../Componentes/Dashboard/Dashboard.scss";
import NavDesktop from "../NavDesktop/NavDesktop";
import { Bar } from "react-chartjs-2";

import bolsaDinero from "../../../public/Assets/bolsa-de-dinero.png";
import empleado from "../../../public/Assets/empleado-de-oficina.png";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalPaid: 0,
    totalEmployees: 0,
  });
  const [totalNeto, setTotalNeto] = useState(0);
  const [residuoNeto, setResiduoNeto] = useState(0);
  const session = useSession();
  const router = useRouter();
  const { valorUSDToMXN } = useUsersDetails();

  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Payroll",
        data: [40, 30, 50, 40, 60],
        backgroundColor: "#8884d8",
      },
    ],
  };

  const options = {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Payroll Cost Over Time" },
    },
  };

  const handleEmployees = () => {
    router.push("/Employees");
  };

  useEffect(() => {
    if (session.status === "unauthenticated") {
      toast.dismiss();
      toast.error("No active session found. Please log in.", {
        duration: 1000,
      });

      router.push("/Login");
    }
  }, [session.status, router]);

  useEffect(() => {
    const dashboardInfo = async () => {
      try {
        const response = await axios.get("/api/DashBoardInformation");
        const totalCost = response.data.totalCost;
        const totalEmployees = response.data.totalEmployees;

        const suma = totalCost
          .map((item) => Number(String(item.Salary).replace(/,/g, "")))
          .filter((n) => !isNaN(n))
          .reduce((acc, n) => acc + n, 0);
        let resultanteNeto: number;
        let residuoNeto: number;

        resultanteNeto = suma - suma * 0.16;
        residuoNeto = suma * 0.16;

        setDashboardData({ totalPaid: suma, totalEmployees: totalEmployees });
        setTotalNeto(resultanteNeto);
        setResiduoNeto(residuoNeto);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            `Error fetching dashboard data: ${
              error.response?.data.message || error.message
            }`
          );
        }
      }
    };
    dashboardInfo();
  }, []);

  const valorMoedaLocalStorage = localStorage.getItem("valorMoneda");

  return (
    <div className="global-dash-container">
      <NavDesktop />

      <div className="dashboard-container">
        <div className="reloj-y-titulo">
          {" "}
          <h2>Dashboard</h2>
          <label htmlFor="reloj">Manage payroll effectively</label>
        </div>
        <hr />

        <section className="stats">
          <div className="div1">
            Total Payroll Cost
            <p>
              {valorMoedaLocalStorage === "USD"
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(dashboardData.totalPaid)
                : valorMoedaLocalStorage === "MXN"
                ? new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(dashboardData.totalPaid * valorUSDToMXN)
                : null}
            </p>
          </div>
          <div className="div2">
            Net Payroll Cost
            <p>
              {valorMoedaLocalStorage === "USD"
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalNeto)
                : valorMoedaLocalStorage === "MXN"
                ? new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(totalNeto * valorUSDToMXN)
                : null}
            </p>
          </div>
          <div className="div3">
            Taxes
            <p>
              {valorMoedaLocalStorage === "USD"
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(residuoNeto)
                : valorMoedaLocalStorage === "MXN"
                ? new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(residuoNeto * valorUSDToMXN)
                : null}
            </p>
          </div>
          <div className="div4">
            Total Employees
            <p>{dashboardData.totalEmployees}</p>
          </div>
        </section>

        <section className="actions">
          <div className="actions1">
            <div className="actions1div1">
              <div className="actions1div1-button">
                <div className="next-payment">
                  <p>Ready for Payroll</p>
                  <p className="next">
                    Next pay <span>March 15, 2023</span>
                  </p>
                </div>
                <button>Start Payroll</button>
              </div>
            </div>
            <div className="actions1div2">
              <p>Action Items</p>
            </div>
            <div className="actions2div1">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "250px",
                  width: "100%",
                }}
              >
                <Bar data={data} options={options} />
              </div>
            </div>
            <div className="actions2div2">
              <p>Quick Links</p>
              <div onClick={handleEmployees} className="quick-links">
                <Image
                  className="quick-links-image"
                  src={empleado}
                  alt="Empleados"
                />
                <span>Employees</span>
              </div>
              <div className="quick-links">
                <Image
                  className="quick-links-image"
                  src={bolsaDinero}
                  alt="Empleados"
                />
                <span>Taxes</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
