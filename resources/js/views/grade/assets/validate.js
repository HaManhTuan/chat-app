import { NUMBER_HALF_SIZE } from '@/utils/validate';
export const validate = {
  data(){
    return {
      searchRules: {
        snz_name: [
          {
            required: true,
            message: '学年名を入力してください。',
          },
          {
            max: 100,
            message: '学年名は100文字以内で、入力してください。',
          },
        ],
        snz_school_type_id: [
          {
            required: true,
            message: '学校区分を選択してください。',
          },
        ],
        snz_actualgrade: [
          {
            required: true,
            message: '実学年を選択してください。',
          },
        ],
        snz_next_grade_id: [
          {
            required: true,
            message: '次学年を選択してください。',
          },
        ],
        snz_gradecode: [
          {
            required: true,
            message: '学年コードを入力してください',
          },
          {
            max: 3,
            message: '学校コードは3文字以内で、入力してください。',
          },
          {
            pattern: NUMBER_HALF_SIZE,
            message: '科目コードをは半角数字で、入力してください。',
            trigger: 'blur',
          },
        ],
        status: [
          {
            required: true,
          },
        ],
      },
    };
  },
};
