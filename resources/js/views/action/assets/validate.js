export const ActionDetail = {
  data(){
    return {
      rules: {
        snz_actionby_user_id: [
          { required: true, message: '対応者を選択してください。', trigger: 'blur' },
        ],
        snz_studentcode: [
          { required: true, message: '対応生徒氏名を選択してください。', trigger: 'blur' },
        ],
        snz_actioncontents: [
          { max: 2000, message: '対応内容は2000文字以内で、入力してください。', trigger: ['blur'] },
        ],
        status: [
          { required: true, message: 'ステータスを選択してください。', trigger: 'blur' },
        ],
      },
    };
  },
};
