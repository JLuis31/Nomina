"use client";

import "../TablesToConfigure/TablesToConfigure.scss";
import { useState } from "react";
import { motion } from "framer-motion";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import axios from "axios";
import toast from "react-hot-toast";

const TablesToConfigure = (props) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0, 0, 0.58, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.42, 0, 1, 1] as [number, number, number, number],
      },
    },
  };

  const {
    setDepartmentDetails,
    setEmployeeTypesDetails,
    setJobPositionsDetails,
    setPayFrequencyDetails,
    setDeduccionesDetails,
    setStatesDetails,
    setCityDetails,
    departmentDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    payFrequencyDetails,
    deduccionesDetails,
    statesDetails,
    cityDetails,
  } = useUsersDetails();

  const [selectedOption, setSelectedOption] = useState({
    ConceptType: "I",
    department: "1",
    Id_Concept: "",
    Name: "",
    IncomeTax: "0",
    SocialSec: "0",
  });

  const handleAddItem = async () => {
    if (selectedOption.department === "5") {
      if (selectedOption.Name === "" || selectedOption.Id_Concept === "") {
        toast.error("Description and Id Concept cannot be empty");
        return;
      }
    }

    try {
      const response = await axios.post(
        "/api/ValuesConfiguration",
        selectedOption
      );

      if (response.status === 200) {
        toast.success("Item added successfully");
        props.cancelData(false);

        switch (response.data.department) {
          case "1":
            setDepartmentDetails([
              ...departmentDetails,
              response.data.addedData,
            ]);
            break;
          case "2":
            setEmployeeTypesDetails([
              ...employeeTypesDetails,
              response.data.addedData,
            ]);
            break;
          case "3":
            setJobPositionsDetails([
              ...jobPositionsDetails,
              response.data.addedData,
            ]);
            break;
          case "4":
            setPayFrequencyDetails([
              ...payFrequencyDetails,
              response.data.addedData,
            ]);
            break;
          case "5":
            setDeduccionesDetails([
              ...deduccionesDetails,
              response.data.addedData,
            ]);
            break;
          case "6":
            setStatesDetails([...statesDetails, response.data.addedData]);
            break;
          case "7":
            setCityDetails([...cityDetails, response.data.addedData]);
            break;
          case "6":
            setStatesDetails([...statesDetails, response.data.addedData]);
            break;
          case "7":
            setCityDetails([...cityDetails, response.data.addedData]);
            break;
        }
      }

      if (response.status === 400) {
        toast.error("Error adding item: " + response);
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error adding item: " + error.response?.data.message);
        return;
      }
    }
  };

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div>
        {" "}
        <div className="edit-modal">
          <div className="options">
            <h2>Add New Item</h2>
            <hr style={{ marginTop: "0", marginBottom: "0" }} />
            <label style={{ marginBottom: "-.5rem" }} htmlFor="">
              Item type{" "}
            </label>
            <select
              onChange={(e) =>
                setSelectedOption({
                  ...selectedOption,
                  department: e.target.value,
                })
              }
              name="edit"
              id=""
            >
              <option value="1">Department</option>
              <option value="2">Employee Type</option>
              <option value="3">Job Positions</option>
              <option value="4">Payment Frequency</option>
              <option value="5">Incomes / Deductions</option>
              <option value="6">States</option>
              <option value="7">Cities</option>
            </select>
            {selectedOption.department === "5" && (
              <div className="input-name">
                <label htmlFor="">Id Concept</label>
                <input
                  onChange={(e) =>
                    setSelectedOption({
                      ...selectedOption,
                      Id_Concept: e.target.value.trim(),
                    })
                  }
                  type="text"
                  maxLength={10}
                />
                <label style={{ marginTop: "1rem" }} htmlFor="">
                  Concept Type
                </label>
                <select
                  onChange={(e) =>
                    setSelectedOption({
                      ...selectedOption,
                      ConceptType: e.target.value,
                    })
                  }
                  name=""
                  id=""
                >
                  <option value="I">Income</option>
                  <option value="D">Deduction</option>
                </select>
              </div>
            )}
            <div className="input-name">
              {" "}
              <label htmlFor="Name">Description</label>
              <input
                onChange={(e) =>
                  setSelectedOption({
                    ...selectedOption,
                    Name: e.target.value.trim(),
                  })
                }
                type="text"
                id="Name"
                name="Name"
                maxLength={50}
              />
            </div>

            {selectedOption.department === "5" && (
              <div>
                {" "}
                <div style={{ marginBottom: "1rem" }} className="input-name">
                  <label htmlFor="">Income Tax</label>
                  <select name="" id="">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
                <div className="input-name">
                  <label htmlFor="">Social Security</label>
                  <select name="" id="">
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                  </select>
                </div>
              </div>
            )}

            <div className="form-group2">
              {" "}
              <button onClick={handleAddItem} className="guardar">
                Add Item
              </button>
              <button
                onClick={() => props.cancelData(false)}
                className="cancelar"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TablesToConfigure;
