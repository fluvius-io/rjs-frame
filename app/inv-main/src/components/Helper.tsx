const formatMoney = (number: number, currency: string = "VND") => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(number);
};

export { formatMoney };