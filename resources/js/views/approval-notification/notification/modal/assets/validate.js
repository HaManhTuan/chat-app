import { MONEY_HALF_SIZE } from '@/utils/validate';

export const ModalCourseFee = {
  data() {
    return {
      rules: {
        // 1
        tuition_fee_3weeks_first_term: [
          // { required: true, message: '授業料（3週）は入力してください。', trigger: 'change' },
          {
            min: 1,
            max: 11,
            message: '授業料には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '授業料に半角数字で、入力してください。',
            trigger: 'blur',
          },
        ],
        // 2
        tuition_fee_3weeks_second_term: [
          // { required: true, message: '授業料（3週）は入力してください。', trigger: 'change' },
          {
            min: 1,
            max: 11,
            message: '授業料には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '授業料に半角数字で、入力してください。',
            trigger: 'blur',
          },
        ],
        // 3
        tuition_fee_4weeks_first_term: [
          // { required: true, message: '授業料（4週）は入力してください。', trigger: 'change' },
          {
            min: 1,
            max: 11,
            message: '授業料には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '授業料に半角数字で、入力してください。',
            trigger: 'blur',
          },
        ],
        // 4
        tuition_fee_4weeks_second_term: [
          // { required: true, message: '授業料（4週）は入力してください。', trigger: 'change' },
          {
            min: 1,
            max: 11,
            message: '授業料には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '授業料に半角数字で、入力してください。',
            trigger: 'blur',
          },
        ],
        // 5
        teaching_materials_and_test_fees_first_term: [
          // { required: true, message: '教材およびテスト費は入力してください。', trigger: 'change' },
          {
            min: 1,
            max: 11,
            message: '教材およびテスト費には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '教材およびテスト費に半角数字で入力してください。',
            trigger: 'blur',
          },
        ],
        // 6
        teaching_materials_and_test_fees_second_term: [
          // { required: true, message: '教材およびテスト費は入力してください。', trigger: 'change' },
          {
            min: 1,
            max: 11,
            message: '教材およびテスト費には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '教材およびテスト費に半角数字で入力してください。',
            trigger: 'blur',
          },
        ],
        // 7
        spring_training_tuition_fee: [
          // {
          //   required: true,
          //   message: '授業料は入力してください。',
          //   trigger: 'change',
          // },
          {
            min: 1,
            max: 11,
            message: '授業料には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '授業料に半角数字で、入力してください。',
            trigger: 'blur',
          },
        ],
        // 8
        spring_training_teaching_materials_and_test_fees: [
          // {
          //   required: true,
          //   message: '教材およびテスト費は入力してください。',
          //   trigger: 'change',
          // },
          {
            min: 1,
            max: 11,
            message: '教材およびテスト費には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '教材およびテスト費に半角数字で入力してください。',
            trigger: 'blur',
          },
        ],
        // 9
        summer_training_tuition_fee: [
          // {
          //   required: true,
          //   message: '授業料は入力してください。',
          //   trigger: 'change',
          // },
          {
            min: 1,
            max: 11,
            message: '授業料には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '授業料に半角数字で、入力してください。',
            trigger: 'blur',
          },
        ],
        // 10
        summer_training_teaching_materials_and_test_fees: [
          // {
          //   required: true,
          //   message: '教材およびテスト費は入力してください。',
          //   trigger: 'change',
          // },
          {
            min: 1,
            max: 11,
            message: '教材およびテスト費には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '教材およびテスト費に半角数字で入力してください。',
            trigger: 'blur',
          },
        ],
        // 11
        winter_training_tuition_fee: [
          // {
          //   required: true,
          //   message: '授業料は入力してください。',
          //   trigger: 'change',
          // },
          {
            min: 1,
            max: 11,
            message: '授業料には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '授業料に半角数字で、入力してください。',
            trigger: 'blur',
          },
        ],
        // 12
        winter_training_teaching_materials_and_test_fees: [
          // {
          //   required: true,
          //   message: '教材およびテスト費は入力してください。',
          //   trigger: 'change',
          // },
          {
            min: 1,
            max: 11,
            message: '教材およびテスト費には9桁以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: MONEY_HALF_SIZE,
            message: '教材およびテスト費に半角数字で入力してください。',
            trigger: 'blur',
          },
        ],
      },
    };
  },
};
