const filterOption = (value, options, default_val = null) => {
  let result = null;
  if (default_val) {
    result = default_val;
  }
  options.forEach(element => {
    if (element.value === value && value) {
      result = element.label;
    }
  });

  return result;
};

export default filterOption;
