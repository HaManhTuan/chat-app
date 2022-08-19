import { validNumberHalfSize } from '../../../utils/validate';

export const validate = {
  data(){
    const validateRemarks = (rule, value, callback) => {
      if (value && validNumberHalfSize(value)) {
        callback(new Error('備考 は2000文字以内で、入力してください。'));
      } else {
        callback();
      }
    };
    const validateLastName = (rule, value, callback) => {
      if (value && validNumberHalfSize(value)) {
        callback(new Error('姓 は100文字以内で、入力してください。'));
      } else {
        callback();
      }
    };
    const validateFirstName = (rule, value, callback) => {
      if (value && validNumberHalfSize(value)) {
        callback(new Error('姓 は100文字以内で、入力してください。'));
      } else {
        callback();
      }
    };
    return {
      searchRules: {
        snz_studentcode: [
          {
            required: true,
            message: '紹介してくれた生徒を選択してください。',
            trigger: 'none',
          },
        ],
        snz_remarks: [
          { max: 2000, message: '備考 は2000文字以内で、入力してください。', trigger: 'none' },
          { validator: validateRemarks, trigger: 'none' },
        ],
        snz_introductionstatus: [
          {
            required: true,
            message: '紹介ステータスを選択してください。',
            trigger: 'none',
          },
        ],
        snz_lastname: [
          { max: 100, message: '姓 は100文字以内で、入力してください。', trigger: 'none' },
          { validator: validateLastName, trigger: 'none' },
        ],
        snz_firstname: [
          { max: 100, message: '名 は100文字以内で、入力してください。', trigger: 'none' },
          { validator: validateFirstName, trigger: 'none' },
        ],
        status: [
          {
            required: true,
            message: 'ステータスを入力してください。',
            trigger: 'none',
          },
        ],
      },
    };
  },
};
