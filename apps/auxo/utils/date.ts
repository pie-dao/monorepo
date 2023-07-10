export default function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export const sanitizeDate = (monthYear: string) => {
  if (!monthYear) return '';
  const parts = monthYear.split('-');

  if (parts[1].length === 2) {
    return monthYear;
  }

  const year = parts[0];
  let month = parts[1];

  if (month.length === 1) {
    month = '0' + month;
  }

  return `${year}-${month}`;
};
