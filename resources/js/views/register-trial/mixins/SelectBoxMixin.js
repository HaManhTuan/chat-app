export const SelectBoxMixin = {
  data() {
    return {
      selectBox: {
        experience_fee: [
          {
            value: 0,
            label: '無償', // Free
          },
          {
            value: 1,
            label: '有償', // Pay Fee
          },
        ],
        grade: [],
        experience_start_month: [],
        experience_end_month: [],
        subject_set: [],
        discount_1: [],
        discount_2: [],
        targetPeriod: [],
      },
    };
  },
};
