import { prisma } from "@/lib/prisma";

export const ValuesRepository = {
  // POST operations
  
  findDepartmentByName: (name) =>
    prisma.Departments.findFirst({ where: { Description: name } }),
  createDepartment: (name) =>
    prisma.Departments.create({ data: { Description: name.trim() } }),

  findEmployeeTypeByName: (name) =>
    prisma.Employee_Type.findFirst({ where: { Description: name } }),
  createEmployeeType: (name) =>
    prisma.Employee_Type.create({ data: { Description: name.trim() } }),

  findJobByName: (name) =>
    prisma.Jobs.findFirst({ where: { Description: name } }),
  createJob: (name) =>
    prisma.Jobs.create({ data: { Description: name.trim() } }),

  findPayFrequencyByName: (name) =>
    prisma.Pay_Frequency.findFirst({ where: { Description: name } }),
  createPayFrequency: (name) =>
    prisma.Pay_Frequency.create({ data: { Description: name.trim() } }),

  findConceptById: (id) =>
    prisma.Concepts.findFirst({ where: { Id_Concept: id } }),
  createConcept: (data) => prisma.Concepts.create({ data }),

  findStateByName: (name) => prisma.State.findFirst({ where: { State: name } }),
  createState: (name) => prisma.State.create({ data: { State: name.trim() } }),

  findCityByName: (name) => prisma.City.findFirst({ where: { City: name } }),
  createCity: (name) => prisma.City.create({ data: { City: name.trim() } }),

  findUmaValueByYear: (year) =>
    prisma.UMA_Values.findFirst({ where: { UMA_Year: year } }),
  createUmaValue: (data) => prisma.UMA_Values.create({ data }),

  // PUT operations
  findDepartmentById: (id) =>
    prisma.Departments.findUnique({ where: { Id_Department: id } }),
  updateDepartment: (id, description) =>
    prisma.Departments.update({
      where: { Id_Department: id },
      data: { Description: description.trim() },
    }),

  findEmployeeTypeById: (id) =>
    prisma.Employee_Type.findUnique({ where: { Id_Employee_type: id } }),
  updateEmployeeType: (id, description) =>
    prisma.Employee_Type.update({
      where: { Id_Employee_type: id },
      data: { Description: description.trim() },
    }),

  findJobById: (id) => prisma.Jobs.findUnique({ where: { Id_Job: id } }),
  updateJob: (id, description) =>
    prisma.Jobs.update({
      where: { Id_Job: id },
      data: { Description: description.trim() },
    }),

  findPayFrequencyById: (id) =>
    prisma.Pay_Frequency.findUnique({ where: { Id_PayFrequency: id } }),
  updatePayFrequency: (id, description) =>
    prisma.Pay_Frequency.update({
      where: { Id_PayFrequency: id },
      data: { Description: description.trim() },
    }),

  findStateById: (id) => prisma.State.findUnique({ where: { Id_State: id } }),
  updateState: (id, state) =>
    prisma.State.update({
      where: { Id_State: id },
      data: { State: state.trim() },
    }),

  findCityById: (id) => prisma.City.findUnique({ where: { Id_City: id } }),
  updateCity: (id, city) =>
    prisma.City.update({ where: { Id_City: id }, data: { City: city.trim() } }),

  findConceptByIdForUpdate: (id) =>
    prisma.Concepts.findFirst({ where: { Id_Concept: id } }),
  updateConcept: (id, data) =>
    prisma.Concepts.update({ where: { Id_Concept: id }, data }),
  updateDefaultConcepts: (oldId, newData) =>
    prisma.Default_Concepts.updateMany({
      where: { Id_Concept: String(oldId) },
      data: newData,
    }),
  createDefaultConcept: (data) => prisma.Default_Concepts.create({ data }),
  deleteDefaultConcept: (id, payFrequency) =>
    prisma.Default_Concepts.deleteMany({
      where: {
        Id_Concept: String(id),
        Id_PayFrequency: Number(payFrequency) || 0,
      },
    }),
  updateEmployeesMovements: (oldId, newId) =>
    prisma.Employees_Movements.updateMany({
      where: { Id_Concept: String(oldId) },
      data: { Id_Concept: String(newId) },
    }),

  findUmaById: (id) => prisma.UMA_Values.findUnique({ where: { Id_UMA: id } }),
  updateUmaValues: (id, data) =>
    prisma.UMA_Values.update({ where: { Id_UMA: id }, data }),
  updateUmaValuesMany: (id) =>
    prisma.UMA_Values.updateMany({
      where: { NOT: { Id_UMA: id } },
      data: { Is_Active: false },
    }),
};
