import moment from "moment";

export const isValidDateFormat = (
  dateStr: string,
  format: string = "DD/MM/YYYY"
): boolean => {
  // Parse the date with strict format validation
  const date = moment(dateStr, format, true);

  // Return whether the date is valid
  return date.isValid();
};
