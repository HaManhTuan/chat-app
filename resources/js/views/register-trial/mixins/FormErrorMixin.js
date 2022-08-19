export const FormErrorMixin = {
  methods: {
    printFormErrors(attribute, snzStudentcode) {
      if (this.errors !== null) {
        const err = _.find(this.errors, item => {
          return item.snz_studentcode === snzStudentcode;
        });
        if (
          typeof err !== 'undefined' &&
          typeof err[attribute] !== 'undefined'
        ) {
          return err[attribute][0];
        }
      }
      return '';
    },
  },
};
