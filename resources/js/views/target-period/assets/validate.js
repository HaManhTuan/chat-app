import { validNumberHalfSize } from '@/utils/validate';

export const TargetPeriodDetail = {
  data() {
    const validateYearCode = (rule, value, callback) => {
      if (value && !validNumberHalfSize(value)) {
        callback(new Error('年コードは半角の数字で、入力してください。'));
      } else {
        callback();
      }
    };
    const validateMonthCode = (rule, value, callback) => {
      if (value && !validNumberHalfSize(value)) {
        callback(new Error('月コードは半角の数字で、入力してください。'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        snz_name: [
          { required: true, message: '期間名を入力してください。', trigger: 'none' },
          { max: 100, message: '期間名は100文字以内で、入力してください。', trigger: 'none' },
        ],
        snz_yearcode: [
          { max: 4, message: '年コードは4文字以内で、入力してください。', trigger: 'none' },
          { validator: validateYearCode, trigger: 'none' },
        ],
        snz_monthcode: [
          { max: 2, message: '月コードは2文字以内で、入力してください。', trigger: 'none' },
          { validator: validateMonthCode, trigger: 'none' },
        ],
        snz_date_start: [
          { required: true, message: '開始日を選択してください。', trigger: 'none' },
        ],
        snz_date_end: [
          { required: true, message: '終了日を選択してください。', trigger: 'none' },
        ],
        snz_calendar_pattern_id: [
          { required: true, message: 'カレンダーパターンを選択してください。', trigger: 'none' },
        ],
        snz_closingyearmonth: [
          { required: true, message: '対象締め年月を選択してください。', trigger: 'none' },
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
