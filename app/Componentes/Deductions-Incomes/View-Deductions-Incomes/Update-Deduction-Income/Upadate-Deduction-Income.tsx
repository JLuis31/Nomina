"use client";
import { useState } from "react";
import "../Update-Deduction-Income/Update-Deduction-Income.scss";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateDeductionIncome = (props) => {
  const [updateData, setUpdateData] = useState({
    Id: props.dataRow[0].Id_Movement,
    Name: props.dataRow[0].FullName,
    Total_Amount: props.dataRow[0].Total_Amount,
    Balance: props.dataRow[0].Deduction,
    Concept_Type: props.dataRow[0].Id_Concept_Type,
    Description: props.dataRow[0].Description,
  });

  console.log("Update Data:", updateData);

  const UpdateDeductionIncome = async () => {
    try {
      const response = await axios.put(`/api/DeductionsIncomes`, {
        dataFinal: updateData,
        dataInicial: props.dataRow[0],
      });

      if (response.status === 200) {
        toast.success(response.data.message, { duration: 2000 });
        props.setRefreshTable();
        props.modalOpen(false);
      }
      if (response.status === 208) {
        toast.error(response.data.message, { duration: 2000 });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Error updating calendar", { duration: 2000 });
      }
    }
  };

  return (
    <div className="edit-modal">
      <h3>Edit Amounts</h3>
      <hr />

      <div className="form-group">
        <div>
          <label htmlFor="">Id</label>
          <input
            disabled
            maxLength={10}
            defaultValue={updateData.Id}
            type="text"
          />
        </div>
        <div>
          <label htmlFor="">Name</label>
          <input
            disabled
            maxLength={100}
            defaultValue={updateData.Name}
            type="text"
          />
        </div>

        <div>
          <label htmlFor="">Concept Type</label>
          <input
            disabled
            maxLength={50}
            defaultValue={
              updateData.Concept_Type === "D" ? "Deduction" : "Income"
            }
            type="text"
          />
        </div>

        <div>
          <label htmlFor="">Description</label>
          <input
            disabled
            maxLength={100}
            defaultValue={updateData.Description}
            type="text"
          />
        </div>

        <div>
          <label htmlFor="">Total Amount</label>
          <input
            maxLength={10}
            defaultValue={updateData.Total_Amount}
            type="text"
          />
        </div>
        <div>
          <label htmlFor="">Balance</label>
          <input maxLength={10} defaultValue={updateData.Balance} type="text" />
        </div>
      </div>

      <div className="form-group2">
        <button className="guardar">Save</button>
        <button className="cancelar" onClick={() => props.modalOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UpdateDeductionIncome;
