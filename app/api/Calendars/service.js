import {
  getAllCalendars,
  findOverlappingPeriod,
  findCalendarByPK,
  updateCalendar,
  createCalendar,
  deleteCalendar,
  findPeriodsByPayFrequencyAndYear,
} from "./repository";

export async function fetchCalendars() {
  return getAllCalendars();
}

export async function updateCalendarService(data) {
  const overlapping = await findOverlappingPeriod({
    Year: Number(data.dataFinal.Year),
    Id_PayFrequency: Number(data.dataInicial.Id_PayFrequency),
    OR: [
      {
        Period_Start: { lte: new Date(data.dataFinal.Period_End) },
        Period_End: { gte: new Date(data.dataFinal.Period_Start) },
      },
    ],
    NOT: {
      Year: Number(data.dataInicial.Year),
      Id_PayFrequency: Number(data.dataInicial.Id_PayFrequency),
      Id_Period: Number(data.dataInicial.Id_Period),
    },
  });
  if (overlapping) {
    return {
      message: "The specified period overlaps with an existing period.",
      status: 400,
    };
  }
  const pk = {
    Year: Number(data.dataInicial.Year),
    Id_PayFrequency: Number(data.dataInicial.Id_PayFrequency),
    Id_Period: Number(data.dataInicial.Id_Period),
  };
  const existe = await findCalendarByPK(pk);
  if (!existe) {
    return { message: "No record found", status: 404 };
  }
  await updateCalendar(pk, {
    Year: Number(data.dataFinal.Year),
    Month: Number(data.dataFinal.Month),
    Status: data.dataFinal.Status,
  });
  return { message: "Calendar updated successfully", status: 200 };
}

export async function createCalendarService(data) {
  const overlapping = await findOverlappingPeriod({
    Year: data.Year,
    Id_PayFrequency: Number(data.Id_PayFrequency),
    OR: [
      {
        Period_Start: { lte: new Date(data.Period_End) },
        Period_End: { gte: new Date(data.Period_Start) },
      },
    ],
  });
  if (overlapping) {
    return {
      message: "The specified period overlaps with an existing period.",
      status: 400,
    };
  }
  await createCalendar({
    Id_PayFrequency: Number(data.Id_PayFrequency),
    Id_Period: Number(data.Id_Period),
    Month: data.Month,
    Year: data.Year,
    Period_Start: new Date(data.Period_Start),
    Period_End: new Date(data.Period_End),
  });
  return { message: "Calendar created successfully", status: 200 };
}

export async function deleteCalendarService({
  Year,
  Id_PayFrequency,
  Id_Period,
}) {
  await deleteCalendar({ Year, Id_PayFrequency, Id_Period });
  return {
    message: `Period ${Id_Period} from year ${Year} deleted successfully`,
    status: 200,
  };
}

export async function getPeriods(payFrequencyId, year) {
  return findPeriodsByPayFrequencyAndYear(payFrequencyId, year);
}
