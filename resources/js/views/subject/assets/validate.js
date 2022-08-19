import { HALF_SIZE } from '@/utils/validate';

export const SubjectDetail = {
  data() {
    const validateSubjectcd = (rule, value, callback) => {
      if (value && !HALF_SIZE.test(value)) {
        callback(new Error('科目コードは半角の数字で、入力してください。'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        snz_name: [
          { required: true, message: '科目名を入力してください。', trigger: 'none' },
          { max: 100, message: '科目名をは100文字以内で、入力してください。', trigger: 'none' },
        ],
        snz_subjectcd: [
          { required: true, message: '科目コードを入力してください。', trigger: 'none' },
          { max: 8, message: '科目コードをは8文字以内で、入力してください。', trigger: 'none' },
          { validator: validateSubjectcd, trigger: 'none' },
        ],
        snz_endmonth: [
          { required: false, message: '', trigger: 'none' },
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
          { required: true, message: '', trigger: 'change' },
        ],
      },
    };
  },
};
