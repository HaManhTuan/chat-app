import { HALF_SIZE } from '@/utils/validate';
export const validate = {
  data(){
    return {
      searchRules: {
        snz_name: [
          {
            required: true,
            message: '割引名を入力してください。',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '割引名は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_discountcd: [
          {
            required: true,
            message: '割引コードを入力してください。',
            trigger: 'blur',
          },
          {
            max: 20,
            message: '割引コードは20文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: HALF_SIZE,
            message: '割引コードは半角の数字で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_schoolyear: [
          {
            pattern: /(^[0-9]{4}$)+/,
            message: ' 数字は半角だけ入力してください。',
            trigger: 'blur',
          },
        ],
        status: [
          {
            required: true,
          },
        ],
        discountName: [
          {
            max: 100,
            message: '割引名は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        discountCode: [
          {
            max: 20,
            message: '割引コードは20文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: HALF_SIZE,
            message: '割引コードは半角の数字で、入力してください。',
            trigger: 'blur',
          },
        ],
      },
    };
  },
};
