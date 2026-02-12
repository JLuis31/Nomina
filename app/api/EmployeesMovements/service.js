import {
  createEmployeeMovement,
  findOpenPayrolls,
  getAllEmployeeMovements,
  deleteEmployeeMovement,
} from "./repository";

export async function addEmployeeMovement(data) {
  const [payFrequency, period] = data.Id_Period.split("|");
  const movementData = {
    Id_Employee: data.Id_Employee,
    Id_Concept: data.Id_Concept,
    Id_Concept_Type: data.Movement_Type,
    Total_Amount: parseFloat(data.Total_Amount),
    Balance: parseFloat(data.Balance),
    Id_PayFrequency: Number(payFrequency),
    Id_Period: Number(period),
    Last_Time_Update: new Date(),
    Created_By: data.Created_By,
    Increase_or_Rest: data.Acumulated_Deducted,
    Is_Processed: false,
  };
  return createEmployeeMovement(movementData);
}

export async function getOpenPayrolls(idPaymentFrequency) {
  const currentYear = new Date().getFullYear();
  return findOpenPayrolls(idPaymentFrequency, currentYear);
}

export async function fetchAllMovements() {
  const result = await getAllEmployeeMovements();
  return result;
}

export async function removeEmployeeMovement(Id_Movement) {
  await deleteEmployeeMovement(Id_Movement);
  return { message: "Employee movement deleted successfully" };
}
