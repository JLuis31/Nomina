"use client";

import "../TablesToConfigure/TablesToConfigure.scss";
import { useState } from "react";
import { motion } from "framer-motion";

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
            <select name="edit" id="">
              <option value="Department">Department</option>
              <option value="Employee Type">Employee Type</option>
              <option value="Job Positions">Job Positions</option>
            </select>
            <div className="input-name">
              {" "}
              <label htmlFor="Name">Name</label>
              <input type="text" id="Name" name="Name" />
            </div>

            <button className="add-new-item">Add Item</button>
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
