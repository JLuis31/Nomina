import {
  findEmployeeException,
  deletePayrollDetail,
  createEmployeeException,
  findEmployeeExceptionsByPayFrequency,
  deleteEmployeeExceptionById,
} from "./repository";

export async function saveExceptions(receivedData) {
  for (const key of Object.keys(receivedData.Exceptions)) {
    const ex = receivedData.Exceptions[key];
    const existingException = await findEmployeeException(
      receivedData.selectedEmployee.Id_Employee,
      ex.Id_Concept,
    );
    if (existingException) continue;
    await deletePayrollDetail(
      receivedData.selectedEmployee.Id_Employee,
      ex.Id_Concept,
    );
    await createEmployeeException({
      Id_Employee: receivedData.selectedEmployee.Id_Employee,
      Id_Concept: ex.Id_Concept,
      Id_PayFrequency: receivedData.selectedEmployee.Id_PayFrequency,
      Id_Concept_Type: ex.Id_Concept_Type,
      Per_Amount: parseFloat(ex.Per_Amount) || 0,
      Per_Hour: parseFloat(ex.Per_Hour) || 0,
    });
  }
  return { message: "Exceptions saved successfully", status: 200 };
}

export async function getExceptions(payFrequencyId) {
  return findEmployeeExceptionsByPayFrequency(payFrequencyId);
}

export async function removeException(idException, idConcept, idEmployee) {
  await deleteEmployeeExceptionById(idException);
  return {
    message: `Exception ${idConcept} deleted successfully for employee ${idEmployee}`,
    status: 200,
  };
}
