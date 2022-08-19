export const Validation = {
  data() {
    return {
      rules: {
        grade_id: [
          {
            required: true,
            message: 'Cannot null',
            trigger: 'blur',
          },
        ],
        course_id: [
          {
            required: true,
            message: 'Cannot null',
            trigger: 'blur',
          },
        ],
        snz_applicationdate: [
          {
            required: true,
            message: 'Cannot null',
            trigger: 'blur',
          },
        ],
        month_start_id: [
          {
            required: true,
            message: '体験開始月を選択してください。',
            trigger: 'blur',
          },
        ],

        month_end_id: [
          {
            required: true,
            message: '体験終了月を選択してください。',
            trigger: 'blur',
          },
        ],
        fee: [
          {
            required: true,
            message: '体験費用区分を選択してください。',
            trigger: 'blur',
          },
        ],
        subject_set_id: [
          {
            required: true,
            message: '科目セットを選択してください。',
            trigger: 'blur',
          },
        ],
      },
    };
  },
};
