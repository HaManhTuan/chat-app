import {
  KANA_FULL_WIDTH,
  KANA_FULL_WIDTH_OR_HALFWIDTH,
} from '@/utils/validate';

export const BrotherInformation = {
  data() {
    return {
      rules: {
        snz_lastname: [
          {
            required: true,
            message: '姓を入力してください。',
            trigger: ['change'],
          },
          {
            min: 1,
            max: 100,
            message: '姓は100文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: KANA_FULL_WIDTH_OR_HALFWIDTH,
            message: '漢字・全角カナまたは半角英字で入力してください。',
            trigger: 'blur',
          },
        ],
        snz_firstname: [
          {
            required: true,
            message: '名を入力してください。',
            trigger: ['change'],
          },
          {
            min: 1,
            max: 100,
            message: '名は100文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: KANA_FULL_WIDTH_OR_HALFWIDTH,
            message: '漢字・全角カナまたは半角英字で入力してください。',
            trigger: 'blur',
          },
        ],
        snz_yomilastname: [
          {
            required: true,
            message: '姓カナを入力してください。',
            trigger: ['change'],
          },
          {
            min: 1,
            max: 100,
            message: '姓カナは100文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: KANA_FULL_WIDTH,
            message: 'フリガナ（姓）は全角カナで入力してください。',
            trigger: ['blur'],
          },
        ],
        snz_yomifirstname: [
          {
            required: true,
            message: '名カナを入力してください。',
            trigger: ['change'],
          },
          {
            min: 1,
            max: 100,
            message: '名カナは100文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: KANA_FULL_WIDTH,
            message: 'フリガナ（名）は全角カナで入力してください。',
            trigger: ['blur'],
          },
        ],
        snz_grade_id: [
          {
            required: true,
            message: '学年を選択してください。',
            trigger: ['change'],
          },
        ],
        snz_relationship: [
          {
            required: true,
            message: '紹介者続柄を選択してください。',
            trigger: ['change'],
          },
        ],
        snz_register_for_internalcode: [
          { min: 1, max: 100, message: '最大100文字', trigger: 'blur' },
        ],
        snz_registered_internalcode: [
          {
            required: true,
            message: '内部コードが必要です。',
            trigger: ['change'],
          },
          { min: 1, max: 100, message: '最大100文字', trigger: 'blur' },
        ],
      },
    };
  },
};
