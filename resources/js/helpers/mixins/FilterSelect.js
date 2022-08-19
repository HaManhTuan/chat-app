export const filterOptions = (filterValue, allOptions) => {
  if (filterValue.replace(/\s/g, '').length > 0) {
    return allOptions.filter(option => option.includes(filterValue));
  } else {
    return allOptions;
  }
};
