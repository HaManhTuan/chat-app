export const ModalWithDrawalRegister = {
  data() {
    return {
      rules: {
        created_at: [
          { required: true, message: '年度を選択してください', trigger: 'change' },
        ],
        snz_request_from_businessunit_id: [
          { required: true, message: '校舎を選択してください', trigger: 'change' },
        ],
        snz_grade_id: [
          { required: true, message: '学年を選択してください', trigger: 'change' },
        ],
        snz_withdrawalmonth_period_id: [
          { required: true, message: '退塾開始月を選択してください。', trigger: 'change' },
        ],
        snz_withdrawalreasonoption: [
          { required: true, message: '退塾理由を選択してください', trigger: ['change', 'blur'] },
        ],
        snz_studentcode: [
          { required: true, message: '生徒コードを選択してください', trigger: 'change' },
        ],
        fullname: [
          { required: true, message: '生徒氏名を選択してください', trigger: 'change' },
        ],
        snz_withdrawalreason: [
          { max: 2000, message: '退塾理由その他は2000文字以内で、入力してください。' },
        ],
      },
    };
  },
};
