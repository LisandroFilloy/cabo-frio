export const formatCurrency = (value: number) => `$${value}`;

export const parseCurrency = (value: string) => {
  const parsedValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  return isNaN(parsedValue) ? 0 : parsedValue;
};


export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0] + " / " + date.toTimeString().slice(0, 5);
};
