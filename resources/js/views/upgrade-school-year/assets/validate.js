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
        course: [
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
        app_state_id: [
          {
            required: true,
            message: '入会選抜申込書を選択してください。',
            trigger: 'blur',
          },
        ],
        selection_result_id: [
          {
            required: true,
            message: '入会選抜試験を選択してください。',
            trigger: 'blur',
          },
        ],
        enter_month_id: [
          {
            required: true,
            message: '入会月を選択してください。',
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
