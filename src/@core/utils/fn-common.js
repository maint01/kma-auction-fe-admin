export const numberWithCommas = (number) => {
  if (number) {
    return parseFloat(number)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    return '0';
  }
};
