import { prisma } from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const Id_Employee = searchParams.get("Id_Employee");
  const Id_PayFrequency = searchParams.get("Id_PayFrequency");

  const result = await prisma.$queryRaw`
    SELECT 
      EMP.Id_Employee,
      CONCAT(EMP.Name, ' ', EMP.First_SurName, ' ', EMP.Second_Surname) as FullName,
      EMP.Salary as SalaryPerHour,
      PAYD.Id_Concept as Id_Concept_Detail,
      PAYD.Id_Concept_Type as Id_Concept_Type_Detail, 
      PAYD.Amount as Amount_Detail,
      EMPE.Id_Concept as Id_Concept_Exception,
      EMPE.Id_Concept_Type as Id_Concept_Type_Exception,
      CASE
        WHEN EMPE.Per_Amount > 0 then EMPE.Per_Amount
        WHEN EMPE.Per_Hour > 0 then EMPE.Per_Hour * EMP.Salary
      END as Amount_Exception,
      PAYR.Incomes_Sumatory,
      PAYR.Deductions_Sumatory,
      PAYR.Total_Tax_Deductions,
      PAYR.Net_Pay
    FROM Payment_Records as PAYR
    INNER JOIN Employees as EMP
      ON PAYR.Id_Employee = EMP.Id_Employee
    LEFT JOIN Payroll_Detail as PAYD
      ON EMP.Id_Employee = PAYD.Id_Employee
    LEFT JOIN Employee_Exceptions as EMPE
      ON EMP.Id_Employee = EMPE.Id_Employee
    WHERE PAYR.Id_PayFrequency = ${Id_PayFrequency}
      AND PAYR.Id_Employee = ${Id_Employee}
    	AND PAYR.Id_Period = (
        SELECT MAX(Id_Period)
        FROM Payment_Records
        WHERE Id_Employee = ${Id_Employee}
          AND Id_PayFrequency = ${Id_PayFrequency}
	)	
    ORDER BY EMP.Id_Employee
  `;

  return new Response(JSON.stringify(result), { status: 200 });
}
