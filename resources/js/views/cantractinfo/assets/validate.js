export const CantractInfoDetail = {
  data(){
    return {
      rules: {
        snz_grade_id: [
          { required: true, message: '学年を選択してください。', trigger: ['change', 'blur'] },
        ],
        businessunit_id: [
          { required: true, message: '校舎を入力してください。', trigger: ['change', 'blur'] },
        ],
        snz_schoolyear: [
          { required: true, message: '年度を入力してください。', trigger: ['change', 'blur'] },
        ],
        snz_course_id: [
          { required: true, message: 'コースを選択してください。', trigger: ['change'] },
        ],
        snz_application_type: [
          { required: true, message: '申込区分を選択してください。', trigger: ['change'] },
        ],
        snz_applicationdate: [
          { required: true, message: '申込日を選択してください。', trigger: ['change'] },
        ],
        snz_subjectset_id: [
          { required: true, message: '科目セットを選択してください。', trigger: ['change'] },
        ],
        snz_subjectcd: [
          { required: true, message: '科目コードを入力してください。', trigger: ['change'] },
        ],
        snz_subject_id: [
          { required: true, message: '科目を選択してください。', trigger: ['change'] },
        ],
        snz_startmonth_period_id: [
          { required: true, message: '開始月を選択してください。', trigger: ['change'] },
        ],
        snz_endmonth_period_id: [
          { required: true, message: '終了月を選択してください。', trigger: ['change'] },
        ],
      },
    };
  },
};
