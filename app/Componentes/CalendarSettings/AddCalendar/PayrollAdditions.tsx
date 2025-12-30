"use client";

import { useState, useEffect } from "react";
import "./PayrollAdditions.scss";
import { useUsersDetails } from "@/app/Context/UsersDetailsContext";
import axios from "axios";
import toast from "react-hot-toast";

const PayrollAdditions = (props) => {
  const { payFrequencyDetails } = useUsersDetails();

  const [data, setData] = useState({
    Id_PayFrequency: payFrequencyDetails[0]?.Id_PayFrequency,
    Year: 0,
    Id_Period: props.calendarDetails.length === 0 ? "1" : "",
    Month: 1,
    Period_Start: "",
    Period_End: "",
  });

  const [specificPeriods, setSpecificPeriods] = useState([]);

  useEffect(() => {
    if (data.Year !== 0 && data.Id_PayFrequency) {
      const nextPeriod =
        specificPeriods.length > 0
          ? Math.max(...specificPeriods.map((p) => Number(p.Id_Period))) + 1
          : 1;
      setData((prev) => ({ ...prev, Id_Period: String(nextPeriod) }));
    }
  }, [specificPeriods, data.Year, data.Id_PayFrequency]);

  const fetchPeriods = async () => {
    try {
      const response = await axios.get("/api/Calendars/SpecificPeriods", {
        params: {
          year: data.Year,
          payFrequencyId: data.Id_PayFrequency,
        },
      });
      if (response.status === 200) {
        setSpecificPeriods(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting Data:", data);

    if (data.Year === 0 || data.Period_Start === "" || data.Period_End === "") {
      toast.error("Please fill in all required fields.", { duration: 2000 });
      return;
    }

    try {
      const response = await axios.post("/api/Calendars", data);

      if (response.status === 200) {
        toast.success("Payroll Addition created successfully!");
        await fetchPeriods();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  useEffect(() => {
    if (data.Year !== 0 && data.Id_PayFrequency) {
      fetchPeriods();
    }
  }, [data.Year, data.Id_PayFrequency]);

  return (
    <div className="edit-modal">
      <h3>Payroll Addition</h3>
      <hr />

      <div className="form-group-payroll-additions">
        <label htmlFor="">Payment Frequency</label>
        <select
          onChange={(e) =>
            setData({ ...data, Id_PayFrequency: e.target.value })
          }
          name=""
          id=""
        >
          {payFrequencyDetails.map((item) => (
            <option key={item.Id_PayFrequency} value={item.Id_PayFrequency}>
              {item.Description}
            </option>
          ))}
        </select>

        <div className="datesPeriods">
          {" "}
          <div>
            <label style={{ marginTop: "1rem" }} htmlFor="">
              Year
            </label>
            <select
              value={data.Year}
              onChange={(e) =>
                setData({ ...data, Year: Number(e.target.value) })
              }
              name=""
              id=""
            >
              <option value="0">Selecciona un año</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
              <option value={2029}>2029</option>
            </select>
          </div>
          <div>
            <label style={{ marginTop: "1rem" }} htmlFor="">
              Period
            </label>
            <input value={data.Id_Period} disabled type="text" />
          </div>
        </div>
        <label style={{ marginTop: "1rem" }} htmlFor="">
          Month
        </label>
        <select
          onChange={(e) => setData({ ...data, Month: Number(e.target.value) })}
          name=""
          id=""
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

        <div className="datesPeriods">
          <div>
            <label style={{ marginTop: "1rem" }} htmlFor="">
              Start Period
            </label>
            <input
              onChange={(e) => {
                setData({
                  ...data,
                  Period_Start: e.target.value,
                  Period_End: "",
                });
              }}
              type="date"
              defaultValue={data.Period_Start}
            />
          </div>
          <div>
            {" "}
            <label style={{ marginTop: "1rem" }} htmlFor="">
              End Period
            </label>
            <input
              onChange={(e) => setData({ ...data, Period_End: e.target.value })}
              type="date"
              min={
                data.Period_Start
                  ? new Date(
                      new Date(data.Period_Start).getTime() +
                        24 * 60 * 60 * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  : undefined
              }
              value={data.Period_End}
            />
          </div>
        </div>
      </div>

      <div className="form-group2">
        <button
          onClick={() => {
            handleSubmit();
            props.refreshTable();
          }}
          className="guardar"
        >
          Save
        </button>
        <button className="cancelar" onClick={() => props.modalOpen(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PayrollAdditions;
