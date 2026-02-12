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
  Legend,
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
import { Box } from "@mui/material";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    GrossSalary: 0,
    Total_Net_Payroll: 0,
    Taxes: 0,
    Total_Employees: 0,
    Next_PaymentDate: "",
  });

  const session = useSession();
  const router = useRouter();
  const { valorUSDToMXN, payFrequencyDetails } = useUsersDetails();
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
  const [valorMoedaLocalStorage, setValorMoedaLocalStorage] = useState("MXN");
  const [payFrequency, setPayFrequency] = useState("");
  const [actualPeriod, setActualPeriod] = useState("");

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
        if (response.status === 200) {
          setDashboardData({
            ...dashboardData,
            Next_PaymentDate: response.data[0].Next_Payment_Date,
            GrossSalary: response.data[0].Last_Month_Cost,
            Total_Net_Payroll: response.data[0].Total_Net_Payment,
            Taxes: response.data[0].Total_Taxes,
            Total_Employees: response.data[0].Total_Employees,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            `Error fetching dashboard data: ${
              error.response?.data.message || error.message
            }`,
          );
        }
      }
    };
    dashboardInfo();
    const valorMoedaLocalStorage = localStorage.getItem(
      "valorMonedaLocalStorage",
    );
    const payFrequency = localStorage.getItem("payFrequency");
    const actualPeriod = localStorage.getItem("actualPeriod");

    if (valorMoedaLocalStorage) {
      setValorMoedaLocalStorage(valorMoedaLocalStorage);
    }

    if (payFrequency) {
      setPayFrequency(payFrequency);
    }
    if (actualPeriod) {
      setActualPeriod(actualPeriod);
    }
  }, []);

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
            Gross Payroll
            <p>
              {valorMoedaLocalStorage === "USD"
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(dashboardData.GrossSalary)
                : valorMoedaLocalStorage === "MXN" ||
                    valorMoedaLocalStorage === "" ||
                    valorMoedaLocalStorage === null
                  ? new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(dashboardData.GrossSalary * valorUSDToMXN)
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
                  }).format(dashboardData.Total_Net_Payroll)
                : valorMoedaLocalStorage === "MXN" ||
                    valorMoedaLocalStorage === "" ||
                    valorMoedaLocalStorage === null
                  ? new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(dashboardData.Total_Net_Payroll * valorUSDToMXN)
                  : null}
            </p>
          </div>
          <div className="div3">
            Federal Taxes
            <p>
              {valorMoedaLocalStorage === "USD"
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(dashboardData.Taxes)
                : valorMoedaLocalStorage === "MXN" ||
                    valorMoedaLocalStorage === "" ||
                    valorMoedaLocalStorage === null
                  ? new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(dashboardData.Taxes * valorUSDToMXN)
                  : null}
            </p>
          </div>
          <div className="div4">
            Total Employees
            <p>{dashboardData.Total_Employees}</p>
          </div>
        </section>

        <section className="actions">
          <div className="actions1">
            <div className="actions1div1">
              <div className="actions1div1-button">
                <div className="next-payment">
                  <p>Ready for Payroll</p>
                  <p className="next">
                    Next pay{" "}
                    <span>
                      {dashboardData.Next_PaymentDate
                        ? new Date(
                            dashboardData.Next_PaymentDate,
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "(Not period available)"}
                    </span>
                  </p>
                </div>
                <button onClick={() => router.push("/PayrollCalculation")}>
                  Start Payroll
                </button>
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
