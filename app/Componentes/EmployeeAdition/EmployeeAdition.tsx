"use client";
import "../EmployeeAdition/EmployeeAdition.scss";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import { Autocomplete } from "@react-google-maps/api";

const EmployeeAdition = ({
  cancelData,
  actualizarTabla,
}: {
  cancelData: (dato: boolean) => void;
  actualizarTabla: (dato: boolean) => void;
}) => {
  const autocompleteRef = useRef<any>(null);

  const [personalInformation, setPersonalInformation] = useState({
    name: "",
    firstSurname: "",
    secondSurname: "",
    email: "",
    phone: "",
    address: "",
    curp: "",
    rfc: "",
    State: "1",
    City: "1",
  });
  const [jobDetails, setJobDetails] = useState({
    jobTitle: "1",
    department: "1",
    employeeType: "1",
    startDate: new Date().toISOString().slice(0, 10),
    salary: "",
    status: "In Process",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      personalInformation.name === "" ||
      personalInformation.firstSurname === "" ||
      personalInformation.email === "" ||
      personalInformation.phone === "" ||
      personalInformation.address === "" ||
      jobDetails.startDate === "" ||
      jobDetails.salary === "" ||
      !personalInformation.email.includes("@") ||
      !personalInformation.email.includes(".com") ||
      personalInformation.curp === "" ||
      personalInformation.rfc === ""
    ) {
      toast.error(
        "Please fill in all required personal or job details fields."
      );
      return;
    }
    const combinedData = { ...personalInformation, ...jobDetails };

    try {
      const response = await axios.post(
        "/api/Employees/EmployeesAddition",
        combinedData
      );
      if (response.status === 201) {
        window.location.reload();
        toast.success("Employee added successfully!");
        setJobDetails({
          jobTitle: "Developer",
          department: "Human Resources",
          employeeType: "Full-time",
          startDate: new Date().toISOString().slice(0, 10),
          salary: "",
          status: "Active",
        });
        setPersonalInformation({
          ...personalInformation,
          name: "",
          firstSurname: "",
          secondSurname: "",
          email: "",
          phone: "",
          address: "",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;
        toast.error(`${data.message || "Ocurrió un error"}`);
      } else {
        toast.error("Failed to add employee. Please try again.");
      }
    }
  };

  const {
    departmentDetails,
    employeeTypesDetails,
    jobPositionsDetails,
    statesDetails,
    cityDetails,
  } = useUsersDetails();

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="additions-employee">
        <div className="form-container">
          <form className="personal-information form1">
            <h2>Add New Employee</h2>

            <label className="label1" htmlFor="personal-information">
              <b> Personal Information</b>
            </label>
            <hr />
            <div className="personal-information-container">
              <div className="fullname-container">
                <div>
                  <label htmlFor="name">Name*</label>
                  <input
                    required
                    placeholder="Enter name"
                    type="text"
                    id="name"
                    name="name"
                    maxLength={50}
                    value={personalInformation.name}
                    onChange={(e) =>
                      setPersonalInformation({
                        ...personalInformation,
                        name: e.target.value.trim(),
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="first-surname">First Surname*</label>
                  <input
                    required
                    placeholder="Enter first surname"
                    type="text"
                    id="first-surname"
                    name="first-surname"
                    value={personalInformation.firstSurname}
                    maxLength={50}
                    onChange={(e) =>
                      setPersonalInformation({
                        ...personalInformation,
                        firstSurname: e.target.value.trim(),
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="second-surname">Second Surname</label>
                  <input
                    placeholder="Enter second surname"
                    type="text"
                    id="second-surname"
                    name="second-surname"
                    value={personalInformation.secondSurname}
                    maxLength={50}
                    onChange={(e) =>
                      setPersonalInformation({
                        ...personalInformation,
                        secondSurname: e.target.value.trim(),
                      })
                    }
                  />
                </div>
              </div>

              <div className="extraInformation">
                {" "}
                <div>
                  <label htmlFor="email">Email*</label>
                  <input
                    required
                    placeholder="example@.com"
                    type="email"
                    id="email"
                    name="email"
                    maxLength={100}
                    value={personalInformation.email}
                    onChange={(e) =>
                      setPersonalInformation({
                        ...personalInformation,
                        email: e.target.value.trim(),
                      })
                    }
                  />
                </div>
                <div>
                  {" "}
                  <label htmlFor="phone">Phone Number*</label>
                  <input
                    required
                    placeholder="Enter phone number"
                    type="tel"
                    id="phone"
                    name="phone"
                    value={personalInformation.phone}
                    maxLength={10}
                    onChange={(e) =>
                      setPersonalInformation({
                        ...personalInformation,
                        phone: e.target.value.trim(),
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="curp">Curp*</label>
                  <input
                    type="text"
                    placeholder="Enter curp"
                    required
                    minLength={18}
                    maxLength={18}
                    style={{ textTransform: "uppercase" }}
                    onChange={(e) =>
                      setPersonalInformation({
                        ...personalInformation,
                        curp: e.target.value.trim(),
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="rfc">RFC*</label>
                  <input
                    type="text"
                    placeholder="Enter RFC"
                    required
                    style={{ textTransform: "uppercase" }}
                    minLength={13}
                    maxLength={13}
                    onChange={(e) =>
                      setPersonalInformation({
                        ...personalInformation,
                        rfc: e.target.value.trim(),
                      })
                    }
                  />
                </div>
              </div>

              <div className="extraInformation">
                {" "}
                <div>
                  <label htmlFor="state">State*</label>
                  <select
                    value={personalInformation.State}
                    onChange={(e) =>
                      setPersonalInformation({
                        ...personalInformation,
                        State: e.target.value,
                      })
                    }
                    name=""
                    id=""
                  >
                    {statesDetails.map((state) => (
                      <option key={state.Id_State} value={state.Id_State}>
                        {state.State}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="city">City*</label>
                  <select
                    value={personalInformation.City}
                    onChange={(e) =>
                      setPersonalInformation({
                        ...personalInformation,
                        City: e.target.value,
                      })
                    }
                    name=""
                    id=""
                  >
                    {cityDetails.map((city) => (
                      <option key={city.Id_City} value={city.Id_City}>
                        {city.City}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>

          {/* Duplicate form removed */}

          <form onSubmit={handleSubmit} className="personal-information form2">
            <label className="label1 job-details" htmlFor="job-details">
              <b>Details</b>
            </label>
            <hr />
            <div className="personal-information-container">
              <div className="extraInformation">
                <div>
                  <label htmlFor="job-title">Job Title*</label>
                  <select
                    required
                    name="job-title"
                    id="job-title"
                    value={jobDetails.jobTitle}
                    onChange={(e) =>
                      setJobDetails({ ...jobDetails, jobTitle: e.target.value })
                    }
                  >
                    {jobPositionsDetails.map((dept) => (
                      <option key={dept.Id_Job} value={dept.Id_Job}>
                        {dept.Description}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="department">Department*</label>
                  <select
                    required
                    name="department"
                    id="department"
                    value={jobDetails.department}
                    onChange={(e) =>
                      setJobDetails({
                        ...jobDetails,
                        department: e.target.value,
                      })
                    }
                  >
                    {departmentDetails.map((position) => (
                      <option
                        key={position.Id_Department}
                        value={position.Id_Department}
                      >
                        {position.Description}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="employee-type">Employee Type*</label>
                  <select
                    required
                    name="employee-type"
                    id="employee-type"
                    value={jobDetails.employeeType}
                    onChange={(e) =>
                      setJobDetails({
                        ...jobDetails,
                        employeeType: e.target.value,
                      })
                    }
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
              </div>
              <div className="extraInformation">
                <div>
                  {" "}
                  <label htmlFor="salary">Salary per hour*</label>
                  <input
                    placeholder="$0.00"
                    type="money"
                    id="salary"
                    name="salary"
                    maxLength={50}
                    value={`${jobDetails.salary}`}
                    onChange={(e) =>
                      setJobDetails({
                        ...jobDetails,
                        salary: e.target.value.trim(),
                      })
                    }
                    required
                  />
                </div>{" "}
                <div>
                  <label htmlFor="start-date">Start Date*</label>
                  <input
                    type="date"
                    id="start-date"
                    name="start-date"
                    value={jobDetails.startDate}
                    style={{
                      borderColor: jobDetails.startDate === "" ? "red" : "",
                    }}
                    onChange={(e) =>
                      setJobDetails({
                        ...jobDetails,
                        startDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div style={{ marginTop: "1rem" }}>
                {" "}
                <label htmlFor="status">Status*</label>
                <select
                  required
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, status: e.target.value })
                  }
                  name="status"
                  id=""
                  defaultValue={jobDetails.status}
                >
                  <option value="Active">Active</option>
                  <option value="In Process">In Process</option>
                </select>
              </div>
            </div>
            <div className="buttons-container">
              {" "}
              <button
                onClick={() => cancelData(false)}
                type="button"
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={() => actualizarTabla(true)}
                type="submit"
                className="add-employee-button"
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeAdition;
