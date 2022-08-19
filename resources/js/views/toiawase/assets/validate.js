import {
  DOT_NOT_FIRST,
  EMAIL_FORMAT,
  KANA_FULL_WIDTH,
  KANA_FULL_WIDTH_OR_HALFWIDTH,
  NUMBER_HALF_SIZE,
  TELEPHONE_LENGTH,
  ZERO_FIRST,
} from '@/utils/validate/pattern';

export const StudentDetail = {
  data() {
    return {
      rules: {
        lastname: [
          {
            required: true,
            message: '生徒名(姓)を入力してください。',
            trigger: ['change'],
          },
          {
            max: 100,
            message: '生徒名(姓)は100文字以内で、入力してください。',
            trigger: ['change'],
          },
          {
            pattern: KANA_FULL_WIDTH_OR_HALFWIDTH,
            message:
              '生徒名(姓)漢字・全角カナまたは半角英字で入力してください。',
            trigger: 'blur',
          },
        ],
        firstname: [
          {
            max: 100,
            message: '生徒名(名)は100文字以内で、入力してください。',
            trigger: ['change'],
          },
          {
            pattern: KANA_FULL_WIDTH_OR_HALFWIDTH,
            message:
              '生徒名(名)漢字・全角カナまたは半角英字で入力してください。',
            trigger: 'blur',
          },
        ],
        snz_grade_id: [
          {
            required: true,
            message: '学年を選択してください。',
            trigger: ['change'],
          },
        ],
        snz_telephone: [
          {
            required: true,
            message: '電話番号を入力してください。',
            trigger: ['change'],
          },
          {
            pattern: TELEPHONE_LENGTH,
            message: '電話番号は半角数字10桁または11桁で入力してください。',
            trigger: ['change'],
          },
          {
            pattern: NUMBER_HALF_SIZE,
            message: '電話番号は半角数字10桁または11桁で入力してください。',
            trigger: ['change'],
          },
          {
            pattern: ZERO_FIRST,
            message: '電話番号は電話番号の形式で入力してください。',
            trigger: ['change'],
          },
        ],
        snz_yomifirstname: [
          {
            max: 100,
            message: 'フリガナ(名)は100文字以内で、入力してください。',
            trigger: ['change'],
          },
          {
            pattern: KANA_FULL_WIDTH,
            message: 'フリガナ(名)は全角カナで入力してください。',
            trigger: ['change'],
          },
        ],
        snz_yomilastname: [
          {
            required: true,
            message: 'フリガナ(姓)を入力してください。',
            trigger: ['change'],
          },
          {
            max: 100,
            message: 'フリガナ(姓)は100文字以内で、入力してください。',
            trigger: ['change'],
          },
          {
            pattern: KANA_FULL_WIDTH,
            message: 'フリガナ(姓)は全角カナで入力してください。',
            trigger: ['change'],
          },
        ],
        snz_approachend_reason: [
          {
            max: 2000,
            message: '終了理由は2000文字以内で、入力してください。 ',
            trigger: ['change'],
          },
        ],
        snz_inquirydate: [
          {
            required: true,
            message: '問合せ日を選択してください。',
            trigger: ['change'],
          },
        ],
        snz_inquirytype: [
          {
            required: true,
            message: '問合せ方法を選択してください。',
            trigger: ['change'],
          },
        ],
        snz_contact_content: [
          {
            required: true,
            message: '問合せ内容を入力してください。',
            trigger: ['change'],
          },
          {
            max: 2000,
            message: '問合せ内容は2000文字以内で、入力してください。 ',
            trigger: ['change'],
          },
        ],
        snz_calldetail: [
          {
            max: 2000,
            message: '架電詳細は2000文字以内で、入力してください。',
            trigger: ['change'],
          },
        ],
        new_next_action: [
          {
            max: 2000,
            message:
              '面談詳細と次のアクションは2000文字以内で、入力してください。',
            trigger: ['change'],
          },
        ],
        snz_action: [
          {
            max: 2000,
            message: '対応内容は2000文字以内で、入力してください。',
            trigger: ['change'],
          },
        ],
        student_emailaddress: [
          {
            pattern: DOT_NOT_FIRST,
            message:
              '@の直前に「.(ドット)」があるメールアドレスは登録できません。',
            trigger: 'change',
          },
          {
            pattern: EMAIL_FORMAT,
            message: 'メールアドレスは「xxx@xxx.xx」の形式で入力してください。',
            trigger: ['change'],
          },
          {
            max: 100,
            message: '生徒メールアドレスは100文字以内で、入力してください。',
            trigger: ['change'],
          },
        ],
        class: [
          {
            max: 100,
            message: ' 教室は100文字以内で、入力してください。',
            trigger: ['change'],
          },
        ],
        manager_emailaddress: [
          {
            pattern: DOT_NOT_FIRST,
            message:
              '@の直前に「.(ドット)」があるメールアドレスは登録できません。',
            trigger: 'change',
          },
          {
            max: 100,
            message: '保護者メールアドレスは100文字以内で、入力してください。',
            trigger: ['change'],
          },
          {
            pattern: EMAIL_FORMAT,
            message: 'メールアドレスは「xxx@xxx.xx」の形式で入力してください。',
            trigger: ['change'],
          },
        ],
        snz_businessunit_id: [
          {
            required: true,
            message: '校舎を選択してください。',
            trigger: ['change'],
          },
        ],
      },
    };
  },
};
