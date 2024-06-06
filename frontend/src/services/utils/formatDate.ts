export const formatDateString = (inputDate: string) => {
  const parts = inputDate.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return inputDate;
};
