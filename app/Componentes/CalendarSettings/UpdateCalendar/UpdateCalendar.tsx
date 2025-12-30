"use client";
import { useState } from "react";
import "../UpdateCalendar/UpdateCalendar.scss";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateCalendar = (props) => {
  const [updateData, setUpdateData] = useState({
    Description: props.dataRow[0].Description,
    Year: props.dataRow[0].Year,
    Month: props.dataRow[0].Month,
    Status: props.dataRow[0].Status,
    Id_PayFrequency: props.dataRow[0].Id_PayFrequency,
    Id_Period: props.dataRow[0].Id_Period,
    Period_Start: props.dataRow[0].Period_Start,
    Period_End: props.dataRow[0].Period_End,
  });

  const UpdateCalendar = async () => {
    try {
      const response = await axios.put(`/api/Calendars`, {
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
      <h3>Edit Calendar</h3>
      <hr />

      <div className="form-group-update-calendar">
        <label style={{ marginTop: "1rem" }} htmlFor="">
          Year
        </label>
        <select
          defaultValue={props.dataRow[0].Year}
          name=""
          id=""
          onChange={(e) =>
            setUpdateData({ ...updateData, Year: e.target.value })
          }
        >
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
          <option value={2028}>2028</option>
          <option value={2029}>2029</option>
        </select>
        <label style={{ marginTop: "1rem" }} htmlFor="">
          Month
        </label>
        <select
          defaultValue={props.dataRow[0].Month}
          name=""
          id=""
          onChange={(e) =>
            setUpdateData({ ...updateData, Month: e.target.value })
          }
        >
          <option value={1}>January</option>
          <option value={2}>February</option>
          <option value={3}>March</option>
          <option value={4}>April</option>
          <option value={5}>May</option>
          <option value={6}>June</option>
          <option value={7}>July</option>
          <option value={8}>August</option>
          <option value={9}>September</option>
          <option value={10}>October</option>
          <option value={11}>November</option>
          <option value={12}>December</option>
        </select>
        <label style={{ marginTop: "1rem" }} htmlFor="">
          Status
        </label>
        <select
          onChange={(e) =>
            setUpdateData({ ...updateData, Status: e.target.value })
          }
          defaultValue={props.dataRow[0].Status}
          name=""
          id=""
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>

        <div className="datesPeriods">
          <div>
            <label style={{ marginTop: "1rem" }} htmlFor="">
              Start Period
            </label>
            <input
              onChange={(e) => {
                setUpdateData({
                  ...updateData,
                  Period_Start: e.target.value,
                  Period_End: "",
                });
              }}
              type="date"
              value={
                updateData.Period_Start
                  ? updateData.Period_Start.split("T")[0]
                  : ""
              }
            />
          </div>
          <div>
            {" "}
            <label style={{ marginTop: "1rem" }} htmlFor="">
              End Period
            </label>
            <input
              onChange={(e) =>
                setUpdateData({ ...updateData, Period_End: e.target.value })
              }
              type="date"
              min={
                updateData.Period_Start
                  ? new Date(
                      new Date(updateData.Period_Start).getTime() +
                        24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
              value={
                updateData.Period_End ? updateData.Period_End.split("T")[0] : ""
              }
            />
          </div>
        </div>
      </div>

      <div className="form-group2">
        <button className="guardar" onClick={UpdateCalendar}>
          Save
        </button>
        <button className="cancelar" onClick={() => props.modalOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UpdateCalendar;
