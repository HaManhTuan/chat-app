import { validNumberHalfSize } from '@/utils/validate';

export const SubjectSetDetail = {
  data() {
    const validateNumberHalfSize = (rule, value, callback) => {
      if (value && !validNumberHalfSize(value)) {
        callback(new Error('年度は半角の数字で、入力してください。'));
      } else if (value && value.length > 4) {
        callback(new Error('年度は4桁以内で、入力してください。'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        snz_name: [
          { required: true, message: '科目セットを入力してください。', trigger: 'none' },
          { max: 100, message: '科目セットは100文字以内で、入力してください。', trigger: 'none' },
        ],
        snz_display_name: [
          { required: true, message: '画面表示名を入力してください。', trigger: 'none' },
          { max: 100, message: '画面表示名は100文字以内で、入力してください。', trigger: 'none' },
        ],
        snz_schoolyear: [
          { validator: validateNumberHalfSize, trigger: 'none' },
        ],
        snz_brand: [
          { required: true, message: 'ブランドを選択してください。', trigger: 'none' },
        ],
        snz_course_id: [
          { required: true, message: 'コースを選択してください。', trigger: 'none' },
        ],
        snz_grade_id: [
          { required: true, message: '学年を選択してください。', trigger: 'none' },
        ],
        snz_calendar_pattern_id: [
          { required: true, message: 'カレンダーパターンを選択してください。', trigger: 'none' },
        ],
        snz_subject_id: [
          { required: true, message: '科目を選択してください。', trigger: 'none' },
        ],
        snz_startmonth_period_id: [
          { required: true, message: '開始月を選択してください。', trigger: 'none' },
        ],
        snz_endmonth_period_id: [
          { required: true, message: '終了月を選択してください。', trigger: 'none' },
        ],
      },
    };
  },
};
export const SubjectSystem = {
  data() {
    return {
      rules: {
        status: [
          { required: true, message: '', trigger: 'none' },
        ],
      },
    };
  },
};
