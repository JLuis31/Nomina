"use client";
import "../EmployeeAdition/EmployeeAdition.scss";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

const EmployeeAdition = ({
  cancelData,
  actualizarTabla,
}: {
  cancelData: (dato: boolean) => void;
  actualizarTabla: (dato: boolean) => void;
}) => {
  const [personalInformation, setPersonalInformation] = useState({
    name: "",
    firstSurname: "",
    secondSurname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [jobDetails, setJobDetails] = useState({
    jobTitle: "Developer",
    department: "Human Resources",
    employeeType: "Full-time",
    startDate: new Date().toISOString().slice(0, 10),
    salary: "",
    status: "Active",
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
      !personalInformation.email.includes(".com")
    ) {
      toast.error(
        "Please fill in all required personal or job details fields."
      );
      return;
    }
    console.log(jobDetails);
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
              <div>
                <label htmlFor="name">Name</label>
                <input
                  required
                  placeholder="Enter name"
                  type="text"
                  id="name"
                  name="name"
                  value={personalInformation.name}
                  onChange={(e) =>
                    setPersonalInformation({
                      ...personalInformation,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="first-surname">First Surname</label>
                <input
                  required
                  placeholder="Enter first surname"
                  type="text"
                  id="first-surname"
                  name="first-surname"
                  value={personalInformation.firstSurname}
                  onChange={(e) =>
                    setPersonalInformation({
                      ...personalInformation,
                      firstSurname: e.target.value,
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
                  onChange={(e) =>
                    setPersonalInformation({
                      ...personalInformation,
                      secondSurname: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  required
                  placeholder="example@.com"
                  type="email"
                  id="email"
                  name="email"
                  value={personalInformation.email}
                  onChange={(e) =>
                    setPersonalInformation({
                      ...personalInformation,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                {" "}
                <label htmlFor="phone">Phone</label>
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
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label htmlFor="address">Address</label>
                <input
                  required
                  placeholder="Enter address"
                  type="text"
                  id="address"
                  name="address"
                  value={personalInformation.address}
                  onChange={(e) =>
                    setPersonalInformation({
                      ...personalInformation,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </form>

          {/* Duplicate form removed */}

          <form onSubmit={handleSubmit} className="personal-information form2">
            <label className="label1 job-details" htmlFor="job-details">
              <b> Job Details</b>
            </label>
            <hr />
            <div className="personal-information-container">
              <div>
                <label htmlFor="job-title">Job Title</label>
                <select
                  required
                  name="job-title"
                  id="job-title"
                  value={jobDetails.jobTitle}
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, jobTitle: e.target.value })
                  }
                >
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>
              <div>
                <label htmlFor="department">Department</label>
                <select
                  required
                  name="department"
                  id="department"
                  value={jobDetails.department}
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, department: e.target.value })
                  }
                >
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="IT">IT</option>
                </select>
              </div>
              <div>
                <label htmlFor="employee-type">Employee Type</label>
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
                  <option value="Full-Time">Full-time</option>
                  <option value="Part-Time">Part-time</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>
              <div>
                <label htmlFor="start-date">Start Date</label>
                <input
                  type="date"
                  id="start-date"
                  name="start-date"
                  value={jobDetails.startDate}
                  style={{
                    borderColor: jobDetails.startDate === "" ? "red" : "",
                  }}
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, startDate: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                {" "}
                <label htmlFor="salary">Salary</label>
                <input
                  placeholder="$0.00"
                  type="money"
                  id="salary"
                  name="salary"
                  value={jobDetails.salary}
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, salary: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                {" "}
                <label htmlFor="status">Status</label>
                <select
                  required
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, status: e.target.value })
                  }
                  name="status"
                  id=""
                >
                  <option value="Active">Active</option>
                  <option value="InProcess">In Process</option>
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
