import {parseDate} from "@internationalized/date";

export const fetchDateRange = async (mapApiUrl) => {
  try {
    const response = await fetch(mapApiUrl);
    const data = await response.json();
    if (data && data.startDate && data.endDate) {
      const start = parseDate(data.startDate.split("T")[0]);
      const end = parseDate(data.endDate.split("T")[0]);
      return {start, end};
    } else {
      throw new Error("Invalid data returned for date range.");
    }
  } catch (error) {
    console.error("Error fetching date range:", error);
    throw error;
  }
};
