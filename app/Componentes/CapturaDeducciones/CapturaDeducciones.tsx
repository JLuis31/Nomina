"use client";
import NavDesktop from "../NavDesktop/NavDesktop";
import "../../Componentes/CapturaDeducciones/CapturaDeducciones.scss";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

const CapturaDeducciones = () => {
  const session = useSession();
  const Router = useRouter();
  console.log("session data:", session);

  const {
    deduccionesDetails,
    empleadosDetails,
    valorUSDToMXN,
    departmentDetails,
    jobPositionsDetails,
  } = useUsersDetails();

  const [dataDeducion, setDataDeduccion] = useState({
    Movement_Type: "D",
    Id_Concept: "1",
    Id_Employee: "",
    Name: "",
    Id_Department: "",
    Id_JobPosition: "",
    Total_Amount: 0,
    Balance: 0,
    Acumulated_Deducted: "I",
    Initial_Period: "",
  });
  const [nombreInput, setNombreInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [idInput, setIdInput] = useState("");
  const [idSuggestions, setIdSuggestions] = useState<any[]>([]);

  const [pagoPorPeriodo, setPagoPorPeriodo] = useState(false);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombreInput(value);
    setIdInput("");
    setDataDeduccion({
      ...dataDeducion,
      Id_Employee: "",
      Id_JobPosition: "",
      Id_Department: "",
    });
    setDataDeduccion({ ...dataDeducion, Nombre: value });
    if (value.length > 0) {
      const filtered = empleadosDetails.filter((empleado: any) => {
        const fullName =
          `${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`.toLowerCase();
        return fullName.includes(value.toLowerCase());
      });
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const idhandleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdInput(value);
    setNombreInput("");
    setDataDeduccion({
      ...dataDeducion,
      Id_JobPosition: "",
      Id_Department: "",
    });
    setDataDeduccion({ ...dataDeducion, Id_Employee: value });
    if (value.length > 0) {
      const filtered = empleadosDetails.filter((empleado: any) =>
        String(empleado.Id_Employee).includes(value)
      );
      setIdSuggestions(filtered);
    } else {
      setIdSuggestions([]);
    }
  };

  const handleSuggestionClick = (empleado: any) => {
    const fullName = `${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`;
    setNombreInput(fullName);
    setIdInput(String(empleado.Id_Employee));

    setDataDeduccion({
      ...dataDeducion,
      Id_Employee: empleado.Id_Employee,
      Name: fullName,
      Id_Department: empleado.Id_Department,
      Id_JobPosition: empleado.Id_Job,
    });
    setSuggestions([]);
  };

  const handleIdSuggestionClick = (empleado: any) => {
    const fullName = `${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`;
    setIdInput(String(empleado.Id_Employee));
    setNombreInput(fullName);
    setDataDeduccion({
      ...dataDeducion,
      Id_Employee: empleado.Id_Employee,
      Name: fullName,
      Id_Department: empleado.Id_Department,
      Id_JobPosition: empleado.Id_Job,
    });
    setIdSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      dataDeducion.Balance > dataDeducion.Total_Amount ||
      dataDeducion.Balance === undefined ||
      dataDeducion.Total_Amount === undefined ||
      dataDeducion.Total_Amount === 0
    ) {
      toast.error("Amount is required, and Balance cannot exceed Amount.");
      return;
    }

    if (
      dataDeducion.Initial_Period === "" ||
      dataDeducion.Initial_Period === undefined
    ) {
      toast.error("Initial Period is required.");
      return;
    }
    if (
      dataDeducion.Id_Employee === "" ||
      dataDeducion.Id_Employee === undefined ||
      dataDeducion.Name === "" ||
      dataDeducion.Name === undefined
    ) {
      toast.error("Employee ID and Name are required.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/EmployeesMovements",
        dataDeducion
      );
      console.log("Response from server:", response);

      if (response.status === 201) {
        if (dataDeducion.Movement_Type === "D") {
          toast.success(
            `Deduction added successfully to employee: ${dataDeducion.Nombre}`
          );
        } else {
          toast.success(
            `Income added successfully to employee: ${dataDeducion.Nombre}`
          );
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.message);
      }
    }
  };

  useEffect(() => {
    if (deduccionesDetails.length > 0 && !dataDeducion.Id_Concept) {
      setDataDeduccion((prev) => ({
        ...prev,
        Id_Concept: deduccionesDetails[0].Id_Concept,
      }));
    }
  }, [deduccionesDetails]);

  useEffect(() => {
    if (!pagoPorPeriodo) {
      setDataDeduccion((prev) => ({
        ...prev,
        Numero_Periodos: "",
        Pago_Por_Periodo: 0,
      }));
    }
  }, [pagoPorPeriodo]);

  if (session.status === "loading") {
    return (
      <div className="loading-container">
        <ClipLoader size={100} color={"#123abc"} loading={true} />
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    Router.push("/api/auth/signin");
    return null;
  }

  return (
    <div>
      <NavDesktop />
      <div className="deducciones-container">
        <h2>Add New Deduction or Income</h2>
        <p className="descr">Create and configure a new deduction or income</p>
        <hr />
        <div className="checkboxs">
          {" "}
          <div className="checkboxs2">
            <label htmlFor=""> Movement Type:</label>
            <select
              onChange={(e) =>
                setDataDeduccion({
                  ...dataDeducion,
                  Movement_Type: e.target.value,
                })
              }
              name=""
              id=""
            >
              <option value="D">Deduction</option>
              <option value="I">Income</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="deducciones-form">
          <div className="concept-Details">
            <div style={{ position: "relative" }}>
              <label htmlFor="idInput">Id Employee</label>
              <input
                id="idInput"
                type="number"
                value={idInput}
                onChange={idhandleIdChange}
                autoComplete="off"
                required
              />
              {idSuggestions.length > 0 && (
                <ul
                  className="suggestions-list"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #ccc",
                    zIndex: 10,
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {idSuggestions.map((empleado: any) => (
                    <li
                      key={empleado.Id_Employee}
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => handleIdSuggestionClick(empleado)}
                    >
                      {empleado.Id_Employee} - {empleado.Name}{" "}
                      {empleado.First_SurName} {empleado.Second_Surname}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <label htmlFor="nombreInput">Name:</label>
              <input
                id="nombreInput"
                type="text"
                value={nombreInput}
                onChange={handleNombreChange}
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul
                  className="suggestions-list"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "white",
                    border: "1px solid #ccc",
                    zIndex: 10,
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {suggestions.map((empleado: any) => (
                    <li
                      key={empleado.Id_Employee}
                      style={{ padding: "8px", cursor: "pointer" }}
                      onClick={() => handleSuggestionClick(empleado)}
                    >
                      {empleado.Name} {empleado.First_SurName}{" "}
                      {empleado.Second_Surname}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="concept-Details">
            <div>
              <label htmlFor="">Job Position:</label>
              <input
                disabled
                type="text"
                value={
                  jobPositionsDetails.find(
                    (jobPosition: any) =>
                      String(jobPosition.Id_Job) ===
                      String(dataDeducion.Id_JobPosition)
                  )?.Description || ""
                }
                readOnly
              />
            </div>
            <div>
              <label htmlFor="">Department:</label>
              <input
                disabled
                type="text"
                value={
                  departmentDetails.find(
                    (department: any) =>
                      String(department.Id_Department) ===
                      String(dataDeducion.Id_Department)
                  )?.Description || ""
                }
                readOnly
              />
            </div>
          </div>
          <div className="concept-Details">
            {" "}
            <div className="form-group">
              <label htmlFor="deductionType">Concept:</label>
              <select
                value={dataDeducion.Id_Concept}
                onChange={(e) =>
                  setDataDeduccion({
                    ...dataDeducion,
                    Id_Concept: e.target.value,
                  })
                }
              >
                <option disabled value="">
                  Selecciona un concepto
                </option>
                {deduccionesDetails.map((deduccion: any) => (
                  <option
                    key={deduccion.Id_Concept}
                    value={deduccion.Id_Concept}
                  >
                    {deduccion.Id_Concept} - {deduccion.Description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pagoPorPeriodo">Amount:</label>
              <input
                required
                type="number"
                min={0}
                onChange={(e) => {
                  setDataDeduccion({
                    ...dataDeducion,
                    Total_Amount: Number(e.target.value),
                  });
                }}
                id="pagoPorPeriodo"
              />
            </div>
            <div>
              <label htmlFor="">Balance:</label>
              <input
                required
                min={0}
                max={dataDeducion.Total_Amount}
                type="number"
                onChange={(e) =>
                  setDataDeduccion({
                    ...dataDeducion,
                    Balance: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="AcumuladoOResta">Accumulated or Deducted:</label>
              <select
                value={dataDeducion.Acumulated_Deducted}
                onChange={(e) =>
                  setDataDeduccion({
                    ...dataDeducion,
                    Acumulated_Deducted: e.target.value,
                  })
                }
                name=""
                id="AcumuladoOResta"
              >
                <option value="I">Accumulated</option>
                <option value="R">Deducted</option>
              </select>
            </div>
          </div>
          <div className="concept-Details">
            <div>
              <label htmlFor="">Initial Period</label>
              <input
                required
                onChange={(e) =>
                  setDataDeduccion({
                    ...dataDeducion,
                    Initial_Period: e.target.value,
                  })
                }
                type="date"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </form>
        <button
          onClick={handleSubmit}
          style={{ height: "40px" }}
          className="add-deduccionBTN"
          type="submit"
        >
          {dataDeducion.MovementType === "D" ? "Add Deduction" : "Add Income"}
        </button>
      </div>
    </div>
  );
};

export default CapturaDeducciones;
