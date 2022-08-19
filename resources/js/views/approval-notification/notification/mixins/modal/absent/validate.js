export const ModalAbsentRegister = {
  data() {
    return {
      rules: {
        created_at: [
          { required: true, message: '休塾開始月を選択してください', trigger: 'change' },
        ],
        snz_request_from_businessunit_id: [
          { required: true, message: '休塾開始月を選択してください', trigger: 'change' },
        ],
        snz_startmonth_period_id: [
          { required: true, message: '休塾開始月を選択してください', trigger: 'change' },
        ],
        snz_absentreasonoption: [
          { required: true, message: '休塾理由を選択してください', trigger: 'change' },
        ],
        snz_grade_id: [
          { required: true, message: '休塾理由を選択してください', trigger: 'change' },
        ],
        snz_absentreasonother: [
          { max: 2000, message: '休塾理由その他に2000文字以内で、入力してください。' },
        ],
        snz_studentcode: [
          { required: true, message: '休塾理由を選択してください', trigger: 'change' },
        ],
        fullname: [
          { required: true, message: '休塾理由を選択してください', trigger: 'change' },
        ],
      },
    };
  },
};
