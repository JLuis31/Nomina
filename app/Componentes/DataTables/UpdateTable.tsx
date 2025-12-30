"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const UpdateTable = (props) => {
  const {
    setStatesDetails,
    setCityDetails,
    setPayFrequencyDetails,
    setDepartmentDetails,
    setEmployeeTypesDetails,
    setJobPositionsDetails,
    setDeduccionesDetails,
    departmentDetails,
    payFrequencyDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    deduccionesDetails,
    cityDetails,
    statesDetails,
  } = useUsersDetails();

  const [data, setData] = useState({
    id: props.selectedDeduction.Id_Concept,
    description:
      props.selectedDeduction.Description ||
      props.selectedDeduction.State ||
      props.selectedDeduction.City,
    concept_Type: props.selectedDeduction.Id_Concept_Type,
    income_Tax: props.selectedDeduction.Income_Tax ? 1 : 2,
    social_Security: props.selectedDeduction.Social_Security ? 1 : 2,
    concept_Selected: props.selectedDeduction,
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.put(`/api/ValuesConfiguration`, { data });
      if (response.status === 200) {
        toast.success(response.data.message, { duration: 2000 });
        props.isOpen(false);

        console.log("Update Response:", response.data.department);
        switch (response.data.department) {
          case "States":
            setStatesDetails(
              statesDetails.map((state) =>
                state.Id_State === response.data.updatedData.Id_State
                  ? response.data.updatedData
                  : state
              )
            );

            break;
          case "Cities":
            setCityDetails(
              cityDetails.map((city) =>
                city.Id_City === response.data.updatedData.Id_City
                  ? response.data.updatedData
                  : city
              )
            );
            break;
          case "Pay Frequency":
            setPayFrequencyDetails(
              payFrequencyDetails.map((pay) =>
                pay.Id_PayFrequency ===
                response.data.updatedData.Id_PayFrequency
                  ? response.data.updatedData
                  : pay
              )
            );
            break;
          case "Departments":
            setDepartmentDetails(
              departmentDetails.map((dep) =>
                dep.Id_Department === response.data.updatedData.Id_Department
                  ? response.data.updatedData
                  : dep
              )
            );
            break;
          case "Employee Types":
            setEmployeeTypesDetails(
              employeeTypesDetails.map((type) =>
                type.Id_Employee_type ===
                response.data.updatedData.Id_Employee_type
                  ? response.data.updatedData
                  : type
              )
            );

            break;
          case "Job Positions":
            setJobPositionsDetails(
              jobPositionsDetails.map((position) =>
                position.Id_Job === response.data.updatedData.Id_Job
                  ? response.data.updatedData
                  : position
              )
            );
            break;
          case "Deductions":
            setDeduccionesDetails(
              deduccionesDetails.map((deduction) =>
                deduction.Id_Concept === response.data.updatedData.Id_Concept
                  ? response.data.updatedData
                  : deduction
              )
            );

            break;
        }
      }

      if (response.status === 204) {
        toast.error(response.data.message, { duration: 2000 });
      }

      if (response.status === 208) {
        toast.error(response.data.message, { duration: 2000 });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error updating record", { duration: 2000 });
      }
    }
  };

  return (
    <div className="edit-modal">
      <h3>
        Edit{" "}
        {props.selectedDeduction.Department === "Deductions"
          ? "Concepts"
          : props.selectedDeduction.Department}
      </h3>
      <hr />

      <div className="form-group">
        {props.selectedDeduction.Department === "Deductions" && (
          <div className="idConcept">
            {" "}
            <label htmlFor="">Id Concept</label>
            <input
              onChange={(e) => setData({ ...data, id: e.target.value })}
              defaultValue={props.selectedDeduction.Id_Concept}
              maxLength={10}
              type="text"
            />
          </div>
        )}
        <label htmlFor="">Description</label>
        {props.selectedDeduction.Department === "Cities" ? (
          <input
            type="text"
            onChange={(e) => setData({ ...data, description: e.target.value })}
            defaultValue={props.selectedDeduction.City}
          />
        ) : props.selectedDeduction.Department === "States" ? (
          <input
            onChange={(e) => setData({ ...data, description: e.target.value })}
            defaultValue={props.selectedDeduction.State}
          />
        ) : (
          <input
            onChange={(e) => setData({ ...data, description: e.target.value })}
            defaultValue={props.selectedDeduction.Description}
          />
        )}
      </div>

      {props.selectedDeduction.Department === "Deductions" && (
        <div>
          <div className="form-group">
            <label htmlFor="">Concept Type</label>
            <select
              onChange={(e) =>
                setData({ ...data, concept_Type: e.target.value })
              }
              style={{ marginTop: "0" }}
              className="selectUpdate"
              defaultValue={props.selectedDeduction.Id_Concept_Type}
            >
              <option value="I">Income</option>
              <option value="D">Deduction</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="">Tax Income</label>
            <select
              onChange={(e) =>
                setData({
                  ...data,
                  income_Tax: e.target.value === "Yes" ? 1 : 2,
                })
              }
              style={{ marginTop: "0" }}
              className="selectUpdate"
              defaultValue={props.selectedDeduction.Income_Tax ? "Yes" : "No"}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="">Social Security</label>
            <select
              onChange={(e) =>
                setData({
                  ...data,
                  social_Security: e.target.value === "Yes" ? 1 : 2,
                })
              }
              style={{ marginTop: "0" }}
              className="selectUpdate"
              defaultValue={
                props.selectedDeduction.Social_Security ? "Yes" : "No"
              }
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      )}

      <div className="form-group2">
        <button className="guardar" onClick={handleSubmit}>
          Save
        </button>
        <button className="cancelar" onClick={() => props.isOpen(false)}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default UpdateTable;
