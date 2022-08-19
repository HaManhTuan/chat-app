export const CantractInfoHistory = {
  data() {
    return {
      rules: {
        snz_name: [
          { required: true, message: '', trigger: 'blur' },
        ],
      },
    };
  },
};
export const CantractHistorySystem = {
  data() {
    return {
      rules: {
        status: [
          { required: true, message: '', trigger: 'change' },
        ],
      },
    };
  },
};
