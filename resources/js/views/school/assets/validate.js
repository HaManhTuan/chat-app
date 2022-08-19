import { NUMBER_HALF_SIZE } from '@/utils/validate';

export const registrationValidate = {
  data() {
    return {
      rules: {
        grade_id: [
          {
            required: true,
            message: 'Cannot null',
            trigger: 'blur',
          },
        ],
        course_id: [
          {
            required: true,
            message: 'Cannot null',
            trigger: 'blur',
          },
        ],
        snz_applicationdate: [
          {
            required: true,
            message: 'Cannot null',
            trigger: 'blur',
          },
        ],
        month_start_id: [
          {
            required: true,
            message: '体験開始月を選択してください。',
            trigger: 'blur',
          },
        ],

        month_end_id: [
          {
            required: true,
            message: '体験終了月を選択してください。',
            trigger: 'blur',
          },
        ],
        fee: [
          {
            required: true,
            message: '体験費用区分を選択してください。',
            trigger: 'blur',
          },
        ],
        subject_set_id: [
          {
            required: true,
            message: '科目セットを選択してください。',
            trigger: 'blur',
          },
        ],
      },
    };
  },
};

export const validate = {
  data() {
    return {
      rules: {
        snz_name: [
          {
            required: true,
            message: '学校名を入力してください。',
            trigger: 'none',
          },
          {
            max: 100,
            message: '学校名は100文字以内で、入力してください。',
            trigger: 'none',
          },
        ],
        snz_schoolcode: [
          {
            max: 6,
            message: '学校コードは半角数字で入力してください。',
            trigger: 'none',
          },
          { pattern: NUMBER_HALF_SIZE, message: '学校コードは半角数字で入力してください。', trigger: 'none' },
        ],
        status: [
          {
            required: true,
            message: '学校名を入力してください。',
            trigger: 'none',
          },
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
