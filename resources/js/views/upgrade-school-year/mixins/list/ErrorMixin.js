export const ErrorMixin = {
  methods: {
    getErrorPayload(attribute, index) {
      if (this.errors !== null) {
        const key = `payload.${index}.${attribute}`;
        if (this.errors[key]) {
          return this.errors[key][0];
        }
      }
      return '';
    },
  },
};
