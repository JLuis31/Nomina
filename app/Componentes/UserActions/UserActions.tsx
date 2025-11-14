"use client";
import { useState } from "react";
import "../UserActions/UserActions.scss";
import { motion } from "framer-motion";

const UserActions = (props: { cancelData: (value: boolean) => void }) => {
  const [userActions, setSecondUserActions] = useState({
    employeeID: "",
    name: "",
    firstSurname: "",
    secondSurname: "",
    email: "",
    phone: "",
    address: "",
    jobTitle: "",
    department: "",
    employeeStatus: "",
    salary: "",
    payFrequency: "",
    bankAccountNumber: "",
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

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="UserActions-container">
        <div className="UserActions-information">
          <h4>Jose Luis (Id: {124575})</h4>
          <label htmlFor="position"> Position: Software Engineer</label>
          <label htmlFor="department">Department: IT</label>
        </div>
        <div className="UserActions-edit">
          <form>
            <h3>Employee Profile</h3>
            <div className="UserActions-buttons">
              {" "}
              <button
                onClick={() => props.cancelData(false)}
                className="cancel-button"
                type="button"
              >
                Cancel
              </button>
              <button className="submit-button" type="submit">
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
                  value={userActions.name}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      name: e.target.value,
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
                  value={userActions.firstSurname}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      firstSurname: e.target.value,
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
                  value={userActions.secondSurname}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      secondSurname: e.target.value,
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
                  value={userActions.email}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      email: e.target.value,
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
                  value={userActions.phone}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      phone: e.target.value,
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
                  value={userActions.address}
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      address: e.target.value,
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
                  value={userActions.employeeID}
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
                  value={userActions.jobTitle}
                  name=""
                  id=""
                >
                  <option value="software-engineer">Software Engineer</option>
                  <option value="product-manager">Product Manager</option>
                  <option value="designer">Designer</option>
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
                  value={userActions.department}
                  name=""
                  id=""
                >
                  <option value="it">IT</option>
                  <option value="hr">HR</option>
                  <option value="finance">Finance</option>
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
                  value={userActions.employeeStatus}
                  name=""
                  id=""
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
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
                  value={userActions.salary}
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
                  value={userActions.payFrequency}
                  name=""
                  id=""
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                {" "}
                <label htmlFor="department">Bank Account Number</label>
                <input
                  onChange={(e) =>
                    setSecondUserActions({
                      ...userActions,
                      bankAccountNumber: e.target.value,
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
