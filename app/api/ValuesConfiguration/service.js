import { ValuesRepository } from "./repository";

export async function addValue(data) {
  switch (data.department) {
    case "1": {
      if (await ValuesRepository.findDepartmentByName(data.Name)) {
        return { message: "Department already exists", status: 400 };
      }
      const addedData = await ValuesRepository.createDepartment(data.Name);
      return {
        message: "Item added successfully",
        department: data.department,
        addedData,
        status: 200,
      };
    }
    case "2": {
      if (await ValuesRepository.findEmployeeTypeByName(data.Name)) {
        return { message: "Employee type already exists", status: 400 };
      }
      const addedData = await ValuesRepository.createEmployeeType(data.Name);
      return {
        message: "Item added successfully",
        department: data.department,
        addedData,
        status: 200,
      };
    }
    case "3": {
      if (await ValuesRepository.findJobByName(data.Name)) {
        return { message: "Job already exists", status: 400 };
      }
      const addedData = await ValuesRepository.createJob(data.Name);
      return {
        message: "Item added successfully",
        department: data.department,
        addedData,
        status: 200,
      };
    }
    case "4": {
      if (await ValuesRepository.findPayFrequencyByName(data.Name)) {
        return { message: "Pay frequency already exists", status: 400 };
      }
      const addedData = await ValuesRepository.createPayFrequency(data.Name);
      return {
        message: "Item added successfully",
        department: data.department,
        addedData,
        status: 200,
      };
    }
    case "5": {
      if (await ValuesRepository.findConceptById(data.Id_Concept)) {
        return { message: "Deductions already exists", status: 400 };
      }
      const addedData = await ValuesRepository.createConcept({
        Description: data.Name.trim(),
        Id_Concept_Type: data.ConceptType,
        Id_Concept: data.Id_Concept,
        Income_Tax: data.IncomeTax === "1",
        Social_Sec: data.SocialSec === "1",
      });
      return {
        message: "Item added successfully",
        department: data.department,
        addedData,
        status: 200,
      };
    }
    case "6": {
      if (await ValuesRepository.findStateByName(data.Name)) {
        return { message: "State already exists", status: 400 };
      }
      const addedData = await ValuesRepository.createState(data.Name);
      return {
        message: "Item added successfully",
        department: data.department,
        addedData,
        status: 200,
      };
    }
    case "7": {
      if (await ValuesRepository.findCityByName(data.Name)) {
        return { message: "City already exists", status: 400 };
      }
      const addedData = await ValuesRepository.createCity(data.Name);
      return {
        message: "Item added successfully",
        department: data.department,
        addedData,
        status: 200,
      };
    }
    case "9": {
      if (await ValuesRepository.findUmaValueByYear(data.UMA_Year)) {
        return {
          message: `UMA Value for year ${data.UMA_Year} already exists`,
          status: 400,
        };
      }
      const addedData = await ValuesRepository.createUmaValue({
        UMA_Year: data.UMA_Year,
        UMA_Values: parseFloat(data.UMA_Value),
      });
      return {
        message: "Item added successfully",
        department: data.department,
        addedData,
        status: 200,
      };
    }
    default:
      return { message: "Invalid department", status: 400 };
  }
}

export async function updateValue(data) {
  const department = data.data?.concept_Selected?.Department;
  switch (department) {
    case "Departments": {
      const current = await ValuesRepository.findDepartmentById(
        data.data.concept_Selected.Id_Department,
      );
      if (current?.Description === data.data.description) {
        return { message: "No changes detected.", status: 200 };
      }
      const updatedData = await ValuesRepository.updateDepartment(
        data.data.concept_Selected.Id_Department,
        data.data.description,
      );
      return {
        message: `Record Departments updated successfully`,
        department,
        updatedData,
        status: 200,
      };
    }
    case "Employee Types": {
      const current = await ValuesRepository.findEmployeeTypeById(
        data.data.concept_Selected.Id_Employee_type,
      );
      if (current?.Description === data.data.description) {
        return { message: "No changes detected.", status: 200 };
      }
      const updatedData = await ValuesRepository.updateEmployeeType(
        data.data.concept_Selected.Id_Employee_type,
        data.data.description,
      );
      return {
        message: `Record Employee Types updated successfully`,
        department,
        updatedData,
        status: 200,
      };
    }
    case "Job Positions": {
      const current = await ValuesRepository.findJobById(
        data.data.concept_Selected.Id_Job,
      );
      if (current?.Description === data.data.description) {
        return { message: "No changes detected.", status: 200 };
      }
      const updatedData = await ValuesRepository.updateJob(
        data.data.concept_Selected.Id_Job,
        data.data.description,
      );
      return {
        message: `Record Job Positions updated successfully`,
        department,
        updatedData,
        status: 200,
      };
    }
    case "Pay Frequency": {
      const current = await ValuesRepository.findPayFrequencyById(
        data.data.concept_Selected.Id_PayFrequency,
      );
      if (current?.Description === data.data.description) {
        return { message: "No changes detected.", status: 200 };
      }
      const updatedData = await ValuesRepository.updatePayFrequency(
        data.data.concept_Selected.Id_PayFrequency,
        data.data.description,
      );
      return {
        message: `Record Pay Frequency updated successfully`,
        department,
        updatedData,
        status: 200,
      };
    }
    case "States": {
      const current = await ValuesRepository.findStateById(
        data.data.concept_Selected.Id_State,
      );
      if (current?.State === data.data.description) {
        return { message: "No changes detected.", status: 200 };
      }
      const updatedData = await ValuesRepository.updateState(
        data.data.concept_Selected.Id_State,
        data.data.description,
      );
      return {
        message: `Record States updated successfully`,
        department,
        updatedData,
        status: 200,
      };
    }
    case "Cities": {
      const current = await ValuesRepository.findCityById(
        data.data.concept_Selected.Id_City,
      );
      if (current?.City === data.data.description) {
        return { message: "No changes detected.", status: 200 };
      }
      const updatedData = await ValuesRepository.updateCity(
        data.data.concept_Selected.Id_City,
        data.data.description,
      );
      return {
        message: `Record Cities updated successfully`,
        department,
        updatedData,
        status: 200,
      };
    }
    case "Deductions": {
      const ExistingConcept = await ValuesRepository.findConceptByIdForUpdate(
        data.data.Id_Concept,
      );
      if (
        ExistingConcept &&
        ExistingConcept.Id_Concept !== data.data.concept_Selected.Id_Concept
      ) {
        return { message: "Concept id already exists.", status: 400 };
      }
      if (data.data.is_Default_Concept === 1) {
        await ValuesRepository.createDefaultConcept({
          Id_Concept: data.data.Id_Concept,
          Description: data.data.description.trim(),
          Id_PayFrequency: Number(data.data.payment_Frequency) || 0,
          Id_Concept_Type: data.data.concept_Type,
          Per_Hour: 0,
          Per_Amount: 0,
        });
      }
      if (data.data.is_Default_Concept === 2) {
        await ValuesRepository.deleteDefaultConcept(
          data.data.concept_Selected.Id_Concept,
          data.data.payment_Frequency,
        );
      }
      await ValuesRepository.updateEmployeesMovements(
        data.data.concept_Selected.Id_Concept,
        data.data.Id_Concept,
      );
      const updatedData = await ValuesRepository.updateConcept(
        data.data.concept_Selected.Id_Concept,
        {
          Id_Concept: String(data.data.Id_Concept),
          Description: data.data.description.trim(),
          Id_Concept_Type: data.data.concept_Type,
          Income_Tax: data.data.income_Tax === 1 ? true : false,
          Social_Sec: data.data.social_Security === 1 ? true : false,
          Is_Default_Concept:
            data.data.is_Default_Concept === 2
              ? false
              : Boolean(data.data.is_Default_Concept),
        },
      );
      await ValuesRepository.updateDefaultConcepts(
        data.data.concept_Selected.Id_Concept,
        {
          Id_Concept: String(data.data.Id_Concept),
          Description: data.data.description.trim(),
          Id_Concept_Type: data.data.concept_Type,
        },
      );
      return {
        message: `Record Deductions updated successfully`,
        department,
        updatedData,
        status: 200,
      };
    }
    case "UMA Values": {
      const current = await ValuesRepository.findUmaById(
        data.data.concept_Selected.Id_UMA,
      );
      if (
        current?.UMA_Year === data.data.UMA_Year &&
        current?.UMA_Values === parseFloat(data.data.UMA_Values) &&
        current?.Is_Active === (data.data.UMA_Status === "1" ? true : false)
      ) {
        return { message: "UMA Year already exists.", status: 400 };
      }
      await ValuesRepository.updateUmaValuesMany(
        data.data.concept_Selected.Id_UMA,
      );
      const updatedData = await ValuesRepository.updateUmaValues(
        data.data.concept_Selected.Id_UMA,
        {
          UMA_Year: data.data.UMA_Year,
          UMA_Values: parseFloat(data.data.UMA_Values),
          Is_Active: data.data.UMA_Status === "1" ? true : false,
        },
      );
      return {
        message: `Record UMA Values updated successfully`,
        department,
        updatedData,
        status: 200,
      };
    }
    default:
      return { message: "Invalid department", status: 400 };
  }
}
