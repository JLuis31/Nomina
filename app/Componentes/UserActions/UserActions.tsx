"use client";
import { useState } from "react";
import "../UserActions/UserActions.scss";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";

const UserActions = (props) => {
  const [userActions, setSecondUserActions] = useState({
    employeeID: props.selectedEmployee?.Id_Employee || "",
    name: props.selectedEmployee?.Name || "",
    firstSurname: props.selectedEmployee?.First_SurName || "",
    secondSurname: props.selectedEmployee?.Second_SurName || "",
    email: props.selectedEmployee?.Email || "",
    phone: props.selectedEmployee?.Phone_Number || "",
    address: props.selectedEmployee?.Address || "",
    jobTitle: props.selectedEmployee?.Id_Job || "",
    department: props.selectedEmployee?.Id_Department || "",
    employeeType: props.selectedEmployee?.Id_Employee_type || "",
    employeeStatus: props.selectedEmployee?.Status || "",
    salary: props.selectedEmployee?.Salary || "",
    payFrequency:
      props.selectedEmployee?.Id_PayFrequency === 0
        ? 1
        : props.selectedEmployee?.Id_PayFrequency || "",
    bankAccountNumber: props.selectedEmployee?.BankAccountNumber || "",
  });

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
    departmentDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    payFrequencyDetails,
  } = useUsersDetails();

  const getDepartmentDescription = (id: number) => {
    const department = departmentDetails.find((d) => d.Id_Department === id);
    return department ? department.Description : "Unknown";
  };

  const getJobPositionDescription = (id: number) => {
    const jobPosition = jobPositionsDetails.find((j) => j.Id_Job === id);
    return jobPosition ? jobPosition.Description : "Unknown";
  };

  const handlePut = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put("/api/Employees/SpecificEmployee", {
        Id_Employee: props.selectedEmployee?.Id_Employee,
        UserData: userActions,
      });
      if (response.status === 200) {
        props.onUpdate();
        toast.success("Employee updated successfully!", { duration: 2000 });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          `Error updating employee: ${
            error.response?.data?.message || error.message
          }`
        );
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
      <div className="UserActions-container">
        <div className="UserActions-information">
          <h4>
            {props.selectedEmployee?.Name} (Id:{" "}
            {props.selectedEmployee?.Id_Employee})
          </h4>
          <label htmlFor="position">
            {" "}
            Position: {getJobPositionDescription(props.selectedEmployee.Id_Job)}
          </label>
          <label htmlFor="department">
            Department:{" "}
            {getDepartmentDescription(props.selectedEmployee.Id_Department)}
          </label>
        </div>
        <hr style={{ opacity: 0.3 }} />
        <div className="UserActions-edit">
          <form>
            <h3>Employee Profile</h3>
            <div className="UserActions-buttons">
              {" "}
              <button
                onClick={() => {
                  props.cancelData(false);
                }}
                className="cancel-button"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={(e) => handlePut(e)}
                className="submit-button"
                type="submit"
              >
                Save Changes
              </button>
            </div>
            <hr />
            <h4 className="texto-informacionPersonal">Personal Information</h4>
            <div className="UserActions-personalInformation">
              {" "}
              <div>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  defaultValue={props.selectedEmployee.Name}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      name: e.target.value.trim(),
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="first-surname">First Surname</label>
                <input
                  type="text"
                  id="first-surname"
                  name="first-surname"
                  placeholder="Enter your first surname "
                  required
                  defaultValue={props.selectedEmployee.First_SurName}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      firstSurname: e.target.value.trim(),
                    })
                  }
                />
              </div>
              <div>
                {" "}
                <label htmlFor="second-surname">Second Surname</label>
                <input
                  type="text"
                  id="second-surname"
                  name="second-surname"
                  placeholder="Enter your second surname"
                  defaultValue={props.selectedEmployee.Second_Surname}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      secondSurname: e.target.value.trim(),
                    })
                  }
                />
              </div>
              <div>
                {" "}
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  defaultValue={props.selectedEmployee.Email}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      email: e.target.value.trim(),
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  required
                  defaultValue={props.selectedEmployee.Phone_Number}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      phone: e.target.value.trim(),
                    })
                  }
                />
              </div>
              <div>
                {" "}
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Enter your address"
                  required
                  defaultValue={props.selectedEmployee.Address}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      address: e.target.value.trim(),
                    })
                  }
                />
              </div>
            </div>
            <hr className="hr-job-information" />
            <h4 className="texto-informacionPersonal">Job Information</h4>
            <div className="UserActions-personalInformation">
              {" "}
              <div>
                <label htmlFor="employee-id">Employee ID</label>
                <input
                  type="text"
                  id="employee-id"
                  name="employee-id"
                  defaultValue={props.selectedEmployee.Id_Employee}
                  readOnly
                  disabled
                />
              </div>
              <div>
                {" "}
                <label htmlFor="job-title">Job Title</label>
                <select
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      jobTitle: e.target.value,
                    })
                  }
                  defaultValue={props.selectedEmployee.Id_Job}
                  name=""
                  id=""
                >
                  {jobPositionsDetails.map((position) => (
                    <option key={position.Id_Job} value={position.Id_Job}>
                      {position.Description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {" "}
                <label htmlFor="department">Department</label>
                <select
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      department: e.target.value,
                    })
                  }
                  defaultValue={props.selectedEmployee.Id_Department}
                  name=""
                  id=""
                >
                  {departmentDetails.map((dept) => (
                    <option key={dept.Id_Department} value={dept.Id_Department}>
                      {dept.Description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="employeeType">Employee Type</label>
                <select
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      employeeType: e.target.value,
                    })
                  }
                  defaultValue={props.selectedEmployee.Id_Employee_type}
                  name=""
                  id=""
                >
                  {employeeTypesDetails.map((type) => (
                    <option
                      key={type.Id_Employee_type}
                      value={type.Id_Employee_type}
                    >
                      {type.Description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="employee-status">Employee Status</label>
                <select
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      employeeStatus: e.target.value,
                    })
                  }
                  defaultValue={
                    props.selectedEmployee.Status === "1"
                      ? "Active"
                      : props.selectedEmployee.Status === "2"
                      ? "Inactive"
                      : props.selectedEmployee.Status === "3"
                      ? "On Leave"
                      : "In Process"
                  }
                  name=""
                  id=""
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="In Process">In Process</option>
                </select>
              </div>
            </div>

            <hr className="hr-job-information" />
            <h4 className="texto-informacionPersonal">Payroll Information</h4>
            <div className="UserActions-personalInformation">
              {" "}
              <div>
                <label htmlFor="salary">Salary</label>
                <input
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      salary: e.target.value,
                    })
                  }
                  type="money"
                  id="salary"
                  name="salary"
                  defaultValue={`${props.selectedEmployee.Salary}`}
                />
              </div>
              <div>
                {" "}
                <label htmlFor="pay-frequency">Pay Frequency</label>
                <select
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      payFrequency: e.target.value,
                    })
                  }
                  name=""
                  id=""
                  defaultValue={props.selectedEmployee.Id_PayFrequency}
                >
                  {payFrequencyDetails.map((payFreq) => (
                    <option
                      key={payFreq.Id_PayFrequency}
                      value={payFreq.Id_PayFrequency}
                    >
                      {payFreq.Description}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {" "}
                <label htmlFor="department">Bank Account Number</label>
                <input
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      bankAccountNumber: e.target.value.trim(),
                    })
                  }
                  type="text"
                  id="bank-account"
                  name="bank-account"
                  value={userActions.bankAccountNumber}
                />
              </div>
            </div>
            <hr className="hr-job-information" />
          </form>
          <div className="desactivate-employee">
            {" "}
            <button>Desactivate Employee</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserActions;
