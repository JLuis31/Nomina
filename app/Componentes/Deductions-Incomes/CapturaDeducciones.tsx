"use client";
import NavDesktop from "../NavDesktop/NavDesktop";
import "./CapturaDeducciones.scss";
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

  const {
    deduccionesDetails,
    empleadosDetails,
    valorUSDToMXN,
    departmentDetails,
    jobPositionsDetails,
    payFrequencyDetails,
  } = useUsersDetails();

  const [dataDeducion, setDataDeduccion] = useState({
    Movement_Type: "",
    Id_Concept: "",
    Id_Employee: "",
    Name: "",
    Id_Department: "",
    Id_JobPosition: "",
    Id_PayFrequency: "",
    Total_Amount: 0,
    Balance: 0,
    Acumulated_Deducted: "",
    Id_Period: "",
  });

  const [nombreInput, setNombreInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [idInput, setIdInput] = useState("");
  const [idSuggestions, setIdSuggestions] = useState<any[]>([]);

  const [pagoPorPeriodo, setPagoPorPeriodo] = useState(false);
  const [paymentFrquencyByEmployee, setPaymentFrquencyByEmployee] = useState(
    []
  );

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombreInput(value);
    setIdInput("");
    if (value === "") {
      setDataDeduccion({
        ...dataDeducion,
        Name: "",
        Id_Employee: "",
        Id_JobPosition: "",
        Id_Department: "",
        Id_PayFrequency: "",
      });
    } else {
      setDataDeduccion({ ...dataDeducion, Nombre: value });
    }
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
    if (value === "") {
      setDataDeduccion({
        ...dataDeducion,
        Name: "",
        Id_Employee: "",
        Id_JobPosition: "",
        Id_Department: "",
        Id_PayFrequency: "",
      });
    } else {
      setDataDeduccion({
        ...dataDeducion,
        Id_Employee: value,
      });
    }
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
      Id_PayFrequency: empleado.Id_PayFrequency,
    });
    setSuggestions([]);
    idPaymentFrequencyChange(String(empleado.Id_PayFrequency));
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
      Id_PayFrequency: empleado.Id_PayFrequency,
    });
    setIdSuggestions([]);
    idPaymentFrequencyChange(String(empleado.Id_PayFrequency));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      dataDeducion.Balance < dataDeducion.Total_Amount ||
      dataDeducion.Balance === undefined ||
      dataDeducion.Total_Amount === undefined ||
      dataDeducion.Total_Amount === 0
    ) {
      toast.error(
        "Amount is required, and Balance cannot be less than Amount."
      );
      return;
    }

    if (dataDeducion.Id_Period === "" || dataDeducion.Id_Period === undefined) {
      toast.error("Period is required.");
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

    if (
      dataDeducion.Acumulated_Deducted === "" ||
      dataDeducion.Acumulated_Deducted === undefined
    ) {
      toast.error("Please select Accumulated or Deducted option.");
      return;
    }

    try {
      const response = await axios.post(
        "/api/EmployeesMovements",
        dataDeducion
      );

      if (response.status === 201) {
        if (dataDeducion.Movement_Type === "D") {
          toast.success(
            `Deduction added successfully to employee: ${dataDeducion.Name}`
          );
        } else {
          toast.success(
            `Income added successfully to employee: ${dataDeducion.Name}`
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
    if (!pagoPorPeriodo) {
      setDataDeduccion((prev) => ({
        ...prev,
        Numero_Periodos: "",
        Pago_Por_Periodo: 0,
      }));
    }
  }, [pagoPorPeriodo]);

  const idPaymentFrequencyChange = async (idInput: string) => {
    try {
      const response = await axios.get("/api/EmployeesMovements", {
        params: { idPaymentFrequency: idInput },
      });
      console.log("Payment Frequency Response:", response.data);

      setPaymentFrquencyByEmployee(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

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

        <form onSubmit={handleSubmit} className="deducciones-form">
          <div className="concept-Details">
            <div style={{ position: "relative" }}>
              <label htmlFor="idInput">Id Employee</label>
              <input
                id="idInput"
                type="number"
                value={idInput}
                min={1}
                onChange={(e) => {
                  idhandleIdChange(e);
                }}
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
                onChange={(e) => {
                  handleNombreChange(e);
                }}
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
            <div>
              <label htmlFor="deductionType">Concept:</label>
              <select
                value={dataDeducion.Id_Concept}
                onChange={(e) => {
                  const selectedConcept = deduccionesDetails.find(
                    (deduccion: any) =>
                      String(deduccion.Id_Concept).trim() ===
                      e.target.value.trim()
                  );
                  setDataDeduccion({
                    ...dataDeducion,
                    Id_Concept: e.target.value,
                    Movement_Type: selectedConcept?.Id_Concept_Type || "",
                    Acumulated_Deducted: "",
                  });
                }}
              >
                <option value="">Select a concept</option>
                {deduccionesDetails.map((deduccion: any) => (
                  <option
                    key={deduccion.Id_Concept}
                    value={deduccion.Id_Concept}
                  >
                    {deduccion.Id_Concept} {}- {deduccion.Description}{" "}
                    {deduccion.Id_Concept_Type === "I"
                      ? "(Income)"
                      : "(Deduction)"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pagoPorPeriodo">Amount:</label>
              <input
                required
                type="number"
                min={1}
                max={dataDeducion.Balance}
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
              <label htmlFor="AcumuladoOResta">Accumulated or Deducted:</label>
              <select
                value={dataDeducion.Acumulated_Deducted}
                onChange={(e) =>
                  setDataDeduccion({
                    ...dataDeducion,
                    Acumulated_Deducted: e.target.value,
                    Balance: e.target.value === "N" ? 0 : dataDeducion.Balance,
                  })
                }
                name=""
                id="AcumuladoOResta"
              >
                <option value="">Select an option</option>
                <option
                  disabled={
                    deduccionesDetails.find(
                      (deduccion: any) =>
                        String(deduccion.Id_Concept) ===
                        String(dataDeducion.Id_Concept)
                    )?.Id_Concept_Type === "D"
                  }
                  value="I"
                >
                  Accumulate
                </option>
                <option
                  disabled={
                    deduccionesDetails.find(
                      (deduccion: any) =>
                        String(deduccion.Id_Concept) ===
                        String(dataDeducion.Id_Concept)
                    )?.Id_Concept_Type === "I"
                  }
                  value="R"
                >
                  Deduct
                </option>
                <option value="N">Nothing</option>
              </select>
            </div>
            <div>
              <div>
                <label htmlFor="">Balance:</label>
                <input
                  disabled={dataDeducion.Acumulated_Deducted === "N"}
                  value={
                    dataDeducion.Acumulated_Deducted === "N"
                      ? 0
                      : dataDeducion.Balance
                  }
                  required
                  min={0}
                  type="number"
                  onChange={(e) =>
                    setDataDeduccion({
                      ...dataDeducion,
                      Balance: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="concept-Details">
            <div>
              <label htmlFor="periods">Periods</label>
              <select
                onChange={(e) => {
                  setDataDeduccion({
                    ...dataDeducion,
                    Id_Period: e.target.value,
                  });
                }}
                name="periods"
                id="periods"
              >
                <option value="">Select a period</option>
                {(paymentFrquencyByEmployee || []).map((period: any) => {
                  const start = period.Period_Start.split("T")[0];
                  const end = period.Period_End.split("T")[0];
                  return (
                    <option
                      key={period.Id_Period}
                      value={`${period.Id_PayFrequency}|${period.Id_Period}`}
                    >
                      {`🗓️ ${start} → ${end} (Period ${period.Id_Period})`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </form>
        <div className="form-group2">
          <button
            onClick={handleSubmit}
            style={{ height: "40px" }}
            className="add-deduccionBTN"
            type="submit"
          >
            {dataDeducion.Movement_Type === "D"
              ? "Add Deduction"
              : "Add Income"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CapturaDeducciones;
