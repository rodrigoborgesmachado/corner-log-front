import { startOfWeek, addDays, format } from "date-fns";

export const putDateOnPatternSimple = (date) => {
  if (!date) return ''; // Return empty string if date is null or undefined

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return ''; // Return empty string if parsedDate is invalid
  }

  // Format day, month, and year
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

export const putDateOnPattern = (date) => {
    if (!date) return ''; // Return empty string if date is null or undefined

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return ''; // Return empty string if parsedDate is invalid
    }

    // Format day, month, and year
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = parsedDate.getFullYear();

    // Format hours and minutes
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

export const putDateOnPatternOnlyDate = (date) => {
  if (!date) return ''; // Return empty string if date is null or undefined

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return ''; // Return empty string if parsedDate is invalid
  }

  // Format day, month, and year
  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getLastDayOfWeek = (year, weekNumber) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = (weekNumber - 1) * 7 + (firstDayOfYear.getDay() === 0 ? 0 : (8 - firstDayOfYear.getDay())); // Adjust for weeks starting on Monday
    const lastDayOfWeek = new Date(year, 0, daysOffset + 6);
    return lastDayOfWeek.toLocaleDateString();
};

export const getLastDayOfWeekByDate = (date) => {
    const lastDayOfWeek = addDays(startOfWeek(date, { weekStartsOn: 1 }), 6); 
    return format(lastDayOfWeek, "yyyy-MM-dd"); // Format as YYYY-MM-DD
};

export const copyToMemory = async (text) => {
  if (!text) return false;

  try {
      await navigator.clipboard.writeText(text);
      return true;
  } catch (err) {
      console.error("Erro ao copiar o texto: ", err);
      return false;
  }
};
