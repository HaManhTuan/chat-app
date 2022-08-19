export const addDefaultOption = {
  addDefaultValue(defaultValue, options) {
    if (_.isEmpty(defaultValue)) {
      return options;
    }
    return _.unionBy(defaultValue, options, 'id');
  },
};
