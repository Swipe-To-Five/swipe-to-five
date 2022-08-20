export const getOneMonthLater = (): Date => {
  const today = new Date(Date.now());
  today.setMonth(today.getMonth() + 1);

  return today;
};
