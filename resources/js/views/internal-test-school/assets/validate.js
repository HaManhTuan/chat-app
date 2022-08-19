export const validate = {
  data(){
    return {
      formRules: {
        testName: [
          {
            required: true,
            message: '学校名を入力してください。',
            trigger: 'blur',
          },
        ],
        studentName: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
        subjectName: [
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
