"use client";
import NavDesktop from "../NavDesktop/NavDesktop";
import "../../Componentes/CapturaDeducciones/CapturaDeducciones.scss";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import { useState, useEffect } from "react";

const CapturaDeducciones = () => {
  const {
    deduccionesDetails,
    empleadosDetails,
    valorUSDToMXN,
    departmentDetails,
    jobPositionsDetails,
  } = useUsersDetails();

  const [dataDeducion, setDataDeduccion] = useState({
    Id_Concepto: "",
    Id_Employee: "",
    Nombre: "",
    Id_Department: "",
    Id_JobPosition: "",
    Monto: "",
    Numero_Periodos: "",
    Pago_Por_Periodo: 0,
    MovementType: "D",
  });
  const [nombreInput, setNombreInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [pagoPorPeriodo, setPagoPorPeriodo] = useState(false);

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombreInput(value);
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

  const handleSuggestionClick = (empleado: any) => {
    const fullName = `${empleado.Name} ${empleado.First_SurName} ${empleado.Second_Surname}`;
    setNombreInput(fullName);
    setDataDeduccion({
      ...dataDeducion,
      Nombre: fullName,
      Id_Employee: empleado.Id_Employee,
      Id_Department: empleado.Id_Department,
      Id_JobPosition: empleado.Id_Job,
    });
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting Deduction/Income:", dataDeducion);
  };

  useEffect(() => {
    if (deduccionesDetails.length > 0 && !dataDeducion.Id_Concepto) {
      setDataDeduccion((prev) => ({
        ...prev,
        Id_Concepto: deduccionesDetails[0].Id_Concept,
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
            <label htmlFor="paymentPerPeriod">Payment per period</label>
            <input
              id="paymentPerPeriod"
              onChange={(e) => setPagoPorPeriodo(e.target.checked)}
              className="checkbox"
              type="checkbox"
            />
          </div>
          <div className="checkboxs2">
            <label htmlFor=""> Movement Type:</label>
            <select
              onChange={(e) =>
                setDataDeduccion({
                  ...dataDeducion,
                  MovementType: e.target.value,
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
          <div>
            <label htmlFor="">Id Employee</label>
            <input
              type="text"
              disabled
              defaultValue={
                empleadosDetails.find(
                  (empleado: any) =>
                    String(empleado.Id_Employee) ===
                    String(dataDeducion.Id_Employee)
                )?.Id_Employee || ""
              }
              value={dataDeducion.Id_Employee}
              readOnly
            />
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

          <div>
            <label htmlFor="">Job Position:</label>
            <input
              disabled
              type="text"
              defaultValue={
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
              defaultValue={
                departmentDetails.find(
                  (jobPosition: any) =>
                    String(jobPosition.Id_Department) ===
                    String(dataDeducion.Id_Department)
                )?.Description || ""
              }
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="deductionType">Deduction Type:</label>
            <select
              onChange={(e) =>
                setDataDeduccion({
                  ...dataDeducion,
                  Id_Concepto: e.target.value,
                })
              }
              name=""
              id=""
            >
              {deduccionesDetails.map((deduccion: any) => (
                <option
                  key={deduccion.Id_Deduction}
                  value={deduccion.Id_Deduction}
                >
                  {deduccion.Description}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pagoPorPeriodo">Monto:</label>
            <input
              onChange={(e) => {
                const monto = e.target.value;
                const periodos = dataDeducion.Numero_Periodos;
                const pagoPorPeriodo =
                  periodos && Number(periodos) !== 0
                    ? Math.floor(Number(monto) / Number(periodos))
                    : 0;
                setDataDeduccion({
                  ...dataDeducion,
                  Monto: monto,
                  Pago_Por_Periodo: pagoPorPeriodo,
                });
              }}
              type="text"
              id="pagoPorPeriodo"
            />
          </div>
          <div>
            <label htmlFor="">Numero de periodos:</label>
            <select
              value={dataDeducion.Numero_Periodos}
              onChange={(e) => {
                const periodos = e.target.value;
                const monto = dataDeducion.Monto;
                const pagoPorPeriodo =
                  periodos && Number(periodos) !== 0
                    ? Math.floor(Number(monto) / Number(periodos))
                    : 0;
                setDataDeduccion({
                  ...dataDeducion,
                  Numero_Periodos: periodos,
                  Pago_Por_Periodo: pagoPorPeriodo,
                });
              }}
              disabled={!pagoPorPeriodo}
            >
              <option value="">Selecciona...</option>
              <option value="3">3</option>
              <option value="6">6</option>
              <option value="9">9</option>
              <option value="12">12</option>
            </select>
          </div>
          <div>
            <label htmlFor="">Pago por periodo:</label>
            <input
              disabled={!pagoPorPeriodo}
              defaultValue={
                dataDeducion.Numero_Periodos &&
                Number(dataDeducion.Numero_Periodos) !== 0
                  ? Number(dataDeducion.Monto) /
                    Number(dataDeducion.Numero_Periodos)
                  : ""
              }
              type="text"
              name=""
              id=""
              readOnly
            />
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
