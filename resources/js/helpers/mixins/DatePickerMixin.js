export const DatePickerMixin = {
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
};
