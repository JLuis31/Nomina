"use client";
import "../EmployeeAdition/EmployeeAdition.scss";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "react-hot-toast";

const EmployeeAdition = (props: { cancelData: (dato: boolean) => void }) => {
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
    EmployeeType: "Full-time",
    startDate: "",
    salary: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      personalInformation.name === "" ||
      personalInformation.firstSurname === "" ||
      personalInformation.email === "" ||
      personalInformation.phone === "" ||
      personalInformation.address === "" ||
      jobDetails.startDate === "" ||
      jobDetails.salary === ""
    ) {
      toast.error(
        "Please fill in all required personal or job details fields."
      );
      return;
    }
    const combinedData = { ...personalInformation, ...jobDetails };
    toast.success("Employee added successfully!");
    setJobDetails({
      jobTitle: "",
      department: "",
      EmployeeType: "",
      startDate: "",
      salary: "",
    });
    setPersonalInformation({
      name: "",
      firstSurname: "",
      secondSurname: "",
      email: "",
      phone: "",
      address: "",
    });
    console.log("Personal Information:", combinedData);
  };

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="additions-employee">
        <h2>Add New Employee</h2>
        <div className="form-container">
          <form className="personal-information form1">
            <label className="label1" htmlFor="personal-information">
              Personal Information
            </label>
            <hr />
            <div className="personal-information-container">
              <div>
                <label htmlFor="name">Name</label>
                <input
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
                  placeholder="Enter phone number"
                  type="tel"
                  id="phone"
                  name="phone"
                  value={personalInformation.phone}
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
              Job Details
            </label>
            <hr />
            <div className="personal-information-container">
              <div>
                <label htmlFor="name">Job Title</label>
                <select
                  name="job-title"
                  id=""
                  value={jobDetails.jobTitle}
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, jobTitle: e.target.value })
                  }
                >
                  <option value="developer">Developer</option>
                  <option value="designer">Designer</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div>
                <label htmlFor="first-surname">Department</label>
                <select
                  value={jobDetails.department}
                  name="department"
                  id=""
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, department: e.target.value })
                  }
                >
                  <option value="hr">Human Resources</option>
                  <option value="it">IT</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
              <div>
                <label htmlFor="second-surname">Employee Type</label>
                <select
                  value={jobDetails.EmployeeType}
                  name="employee-type"
                  id=""
                  onChange={(e) =>
                    setJobDetails({
                      ...jobDetails,
                      EmployeeType: e.target.value,
                    })
                  }
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contractor">Contractor</option>
                </select>
              </div>
              <div>
                <label htmlFor="start-date">Start Date</label>
                <input
                  value={jobDetails.startDate}
                  type="date"
                  id="start-date"
                  name="start-date"
                  onChange={(e) =>
                    setJobDetails({ ...jobDetails, startDate: e.target.value })
                  }
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
                />
              </div>
            </div>
            <div className="buttons-container">
              {" "}
              <button
                onClick={() => props.cancelData(false)}
                type="button"
                className="cancel-button"
              >
                Cancel
              </button>
              <button type="submit" className="add-employee-button">
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
