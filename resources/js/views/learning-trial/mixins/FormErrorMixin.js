export const FormErrorMixin = {
  methods: {
    printFormErrors(attribute, contractId) {
      if (this.errors !== null) {
        const err = _.find(this.errors, item => {
          return item.id === contractId;
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
