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
  } = useUsersDetails();

  const [selectedOption, setSelectedOption] = useState({
    department: "1",
    Name: "",
  });

  const handleAddItem = async () => {
    try {
      const response = await axios.post(
        "/api/ValuesConfiguration",
        selectedOption
      );

      console.log(response);

      if (response.status === 200) {
        toast.success("Item added successfully");
        props.cancelData(false);
        const newDepartmentDetails = await axios.get(
          "/api/UsersDetails/Departments"
        );
        const newEmployeeTypesDetails = await axios.get(
          "/api/UsersDetails/EmployeeTypes"
        );
        const newJobPositionsDetails = await axios.get(
          "/api/UsersDetails/JobPositions"
        );
        const newPayFrequencyDetails = await axios.get(
          "/api/UsersDetails/PayFrequency"
        );
        setDepartmentDetails(newDepartmentDetails.data);
        setEmployeeTypesDetails(newEmployeeTypesDetails.data);
        setJobPositionsDetails(newJobPositionsDetails.data);
        setPayFrequencyDetails(newPayFrequencyDetails.data);
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
        <div className="tables-to-configure">
          <div className="options">
            <h2>Add New Item</h2>
            <p>Create a new item in the selected category.</p>
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
              <option value="4">Pay Frequency</option>
            </select>
            <div className="input-name">
              {" "}
              <label htmlFor="Name">Name</label>
              <input
                onChange={(e) =>
                  setSelectedOption({ ...selectedOption, Name: e.target.value })
                }
                type="text"
                id="Name"
                name="Name"
              />
            </div>

            <button onClick={handleAddItem} className="add-new-item">
              Add Item
            </button>
            <button onClick={() => props.cancelData(false)} className="cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TablesToConfigure;
