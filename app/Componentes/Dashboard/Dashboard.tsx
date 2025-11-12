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

const Dashboard = () => {
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
      legend: { position: "top" },
      title: { display: true, text: "Payroll Cost Over Time" },
    },
  };

  return (
    <div className="global-dash-container">
      <NavDesktop />

      <div className="dashboard-container">
        <h1>Dashboard</h1>

        <section className="stats">
          <div className="div1">
            Total Payroll Cost
            <p>$120,000</p>
          </div>
          <div className="div2">
            Net Payroll Cost
            <p>$100,000</p>
          </div>
          <div className="div3">
            Taxes
            <p>$20,000</p>
          </div>
          <div className="div4">
            Employees Paid
            <p>50</p>
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
                  marginLeft: "5%",
                  width: "auto",
                  height: "250px",
                }}
              >
                <Bar data={data} options={options} />
              </div>
            </div>
            <div className="actions2div2">
              <p>Quick Links</p>
              <div className="quick-links">
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
