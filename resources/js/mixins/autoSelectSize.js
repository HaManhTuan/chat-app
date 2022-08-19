export const autoSelectSize = {
  methods: {
    getClass(value, options, idAtt = 'value', labelAtt = 'label') {
      const item = _.find(options, item => {
        return item[idAtt] === value;
      });

      if (item && item[labelAtt] && item[labelAtt].length > 7) {
        return 'small-select-font';
      }
    },
  },
};
