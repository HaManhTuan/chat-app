export const validate = {
  data(){
    return {
      formRules: {
        studentName: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
        grade: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
        testName: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
        testType: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
        createdAt: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
        status: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
      },
    };
  },
};
