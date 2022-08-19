import {
  DOT_NOT_FIRST,
  EMAIL_FORMAT,
  KANA_FULL_WIDTH,
  KANA_FULL_WIDTH_OR_HALFWIDTH,
  NUMBER_HALF_SIZE,
  TELEPHONE_LENGTH,
  ZERO_FIRST,
} from '@/utils/validate/pattern';
import Promise from 'lodash/_Promise';

export const ModalRegister = {
  data() {
    return {
      rules: {
        snz_schoolyear: [
          {
            required: true,
            message: '年度を選択してください',
            trigger: 'blur',
          },
        ],
        snz_businessunit_id: [
          {
            required: true,
            message: '校舎を選択してください',
            trigger: 'blur',
          },
        ],
        snz_grade_name: [
          {
            required: true,
            message: '学年を選択してください',
            trigger: 'blur',
          },
        ],
        snz_studentcode: [
          {
            required: true,
            message: '生徒コードを選択してください',
            trigger: 'blur',
          },
        ],
        fullname: [
          {
            required: true,
            message: '生徒氏名を選択してください',
            trigger: 'blur',
          },
        ],
        snz_withdrawalreason: [
          {
            max: 2000,
            message: '退塾理由その他に2000文字以内で、入力してください。',
          },
        ],
        status: [
          {
            required: true,
            message: 'ステータスを選択してください',
            trigger: 'change',
          },
        ],
      },
      rulesStartAbsent: {
        snz_schoolyear: [
          {
            required: true,
            message: '年度を選択してください',
            trigger: 'blur',
          },
        ],
        snz_businessunit_id: [
          {
            required: true,
            message: '校舎を選択してください',
            trigger: 'blur',
          },
        ],
        snz_grade_name: [
          {
            required: true,
            message: '学年を選択してください',
            trigger: 'blur',
          },
        ],
        snz_studentcode: [
          {
            required: true,
            message: '生徒コードを選択してください',
            trigger: 'blur',
          },
        ],
        fullname: [
          {
            required: true,
            message: '生徒氏名を選択してください',
            trigger: 'blur',
          },
        ],
        snz_startmonth_period_id: [
          {
            required: true,
            message: '休塾開始月を選択してください',
            trigger: 'change',
          },
        ],
        snz_absentreasonoption: [
          {
            required: true,
            message: '休塾理由を選択してください',
            trigger: 'change',
          },
        ],
        snz_absentreasonother: [
          {
            max: 2000,
            message: '休塾理由その他に2000文字以内で、入力してください。',
          },
        ],
        status: [
          {
            required: true,
            message: 'ステータスを選択してください',
            trigger: 'change',
          },
        ],
      },
      rulesEndAbsent: {
        snz_schoolyear: [
          {
            required: true,
            message: '年度を選択してください',
            trigger: 'blur',
          },
        ],
        snz_businessunit_id: [
          {
            required: true,
            message: '校舎を選択してください',
            trigger: 'blur',
          },
        ],
        snz_grade_name: [
          {
            required: true,
            message: '学年を選択してください',
            trigger: 'blur',
          },
        ],
        snz_studentcode: [
          {
            required: true,
            message: '生徒コードを選択してください',
            trigger: 'blur',
          },
        ],
        fullname: [
          {
            required: true,
            message: '生徒氏名を選択してください',
            trigger: 'blur',
          },
        ],
        snz_endmonth_period_id: [
          {
            required: true,
            message: '休塾開始月を選択してください',
            trigger: 'change',
          },
        ],
        status: [
          {
            required: true,
            message: 'ステータスを選択してください',
            trigger: 'change',
          },
        ],
      },
      rulesEditAbsent: {
        snz_absentreasonother: [
          {
            max: 2000,
            message: '休塾理由その他に2000文字以内で、入力してください。',
          },
        ],
        status: [
          {
            required: true,
            message: 'ステータスを選択してください',
            trigger: 'change',
          },
        ],
      },
    };
  },
};

export const EditContactInfo = {
  data() {
    return {
      rules: {
        snz_schoolyear: [{ required: true, message: '', trigger: 'change' }],
        business_unit: [{ required: true, message: '', trigger: 'change' }],
        grade: [{ required: true, message: '', trigger: 'change' }],
        snz_studentcode: [{ required: true, message: '', trigger: 'change' }],
        student: {
          fullname: [{ required: true, message: '', trigger: 'change' }],
        },
        course: [
          {
            required: true,
            message: 'コースを選択してください。',
            trigger: 'change',
          },
        ],
      },
    };
  },
};

export const StudentDetail = {
  data() {
    const CHECK_VALID_POSTAL_CODE = (
      rule,
      value,
      callback,
      source,
      options
    ) => {
      return new Promise((resolve, reject) => {
        if (value) {
          fetch('https://api.zipaddress.net?zipcode=' + value)
            .then(res => res.json())
            .then(out => {
              switch (out.code) {
                case 404:
                case 400:
                  reject(callback(new Error('該当する住所が見つかりません。')));
                  break;
              }
              this.dataZipCode = out;
              resolve(callback());
            })
            .catch(err => reject(callback(new Error(err))));
        } else {
          this.dataZipCode = null;
          resolve(callback());
        }
      });
    };
    return {
      rules: {
        lastname: [
          {
            required: true,
            message: '姓を入力してください。',
            trigger: 'blur',
          },
          {
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
        firstname: [
          {
            required: true,
            message: '名を入力してください。',
            trigger: 'blur',
          },
          {
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
        snz_grade_id: [
          {
            required: true,
            message: '学年を選択してください。',
            trigger: 'blur',
          },
        ],
        birthdate: [
          {
            required: true,
            message: '生年月日は過去日を入力してください。',
            trigger: 'blur',
          },
        ],
        gendercode: [
          {
            required: true,
            message: '性別を選択してください。',
            trigger: 'blur',
          },
        ],
        telephone1: [
          {
            required: true,
            message: '電話番号1を入力してください。',
            trigger: 'blur',
          },
          {
            pattern: NUMBER_HALF_SIZE,
            message: '電話番号1は半角数字10桁または11桁で入力してください。',
            trigger: 'blur',
          },
          {
            pattern: TELEPHONE_LENGTH,
            message: '電話番号1は半角数字10桁または11桁で入力してください。',
            trigger: 'blur',
          },
          {
            pattern: ZERO_FIRST,
            message: '電話番号1は電話番号の形式で入力してください。',
            trigger: 'blur',
          },
        ],
        telephone2: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: '電話番号2は半角数字10桁または11桁で入力してください。',
            trigger: 'blur',
          },
          {
            pattern: TELEPHONE_LENGTH,
            message: '電話番号2は半角数字10桁または11桁で入力してください。',
            trigger: 'blur',
          },
          {
            pattern: ZERO_FIRST,
            message: '電話番号2は電話番号の形式で入力してください。',
            trigger: 'blur',
          },
        ],
        fax: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: 'FAX番号は半角数字10桁または11桁で入力してください。',
            trigger: 'blur',
          },
          {
            pattern: TELEPHONE_LENGTH,
            message: 'FAX番号は半角数字10桁または11桁で入力してください。',
            trigger: 'blur',
          },
          {
            pattern: ZERO_FIRST,
            message: 'FAX番号は電話番号の形式で入力してください。',
            trigger: 'blur',
          },
        ],
        snz_emergencytelephone: [
          {
            pattern: NUMBER_HALF_SIZE,
            message:
              '緊急連絡先電話番号は半角数字10桁または11桁で入力してください。',
            trigger: 'blur',
          },
          {
            pattern: TELEPHONE_LENGTH,
            message:
              '緊急連絡先電話番号は半角数字10桁または11桁で入力してください。',
            trigger: 'blur',
          },
          {
            pattern: ZERO_FIRST,
            message: '緊急連絡先電話番号は電話番号の形式で入力してください。',
            trigger: 'blur',
          },
        ],
        yomilastname: [
          {
            required: true,
            message: 'フリガナ(姓)は全角カナで入力してください。',
            trigger: 'blur',
          },
          {
            max: 100,
            message: 'フリガナ(姓)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: KANA_FULL_WIDTH,
            message: 'フリガナ(姓)は全角カナで入力してください。',
            trigger: 'blur',
          },
        ],
        yomifirstname: [
          {
            required: true,
            message: 'フリガナ(名)は全角カナで入力してください。',
            trigger: 'blur',
          },
          {
            max: 100,
            message: 'フリガナ(名)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: KANA_FULL_WIDTH,
            message: 'フリガナ(名)は全角カナで入力してください。',
            trigger: 'blur',
          },
        ],
        address1_postalcode: [
          {
            required: true,
            message: '郵便番号は全角カナで入力してください。',
            trigger: 'blur',
          },
          {
            len: 7,
            message: '郵便番号は7桁で入力してください。',
            trigger: 'blur',
          },
          {
            pattern: NUMBER_HALF_SIZE,
            message: '郵便番号は半角数字で入力してください。',
            trigger: 'blur',
          },
          { validator: CHECK_VALID_POSTAL_CODE, trigger: 'blur' },
        ],
        address1_city: [
          {
            required: true,
            message: '都道府県・市区町村は全角カナで入力してください。',
            trigger: 'blur',
          },
          {
            max: 200,
            message: '都道府県・市区町村は200桁で入力してください。',
            trigger: 'blur',
          },
        ],
        address1_line1: [
          {
            required: true,
            message: '番地は全角カナで入力してください。',
            trigger: 'blur',
          },
          {
            max: 250,
            message: '番地は250桁で入力してください。',
            trigger: 'blur',
          },
        ],
        address1_line2: [
          {
            max: 250,
            message: '建物名は250桁で入力してください。',
            trigger: 'blur',
          },
        ],
        snz_contactable: [
          {
            max: 100,
            message: '連絡可能時間帯は100桁で入力してください。',
            trigger: 'blur',
          },
        ],
        snz_emergency: [
          {
            max: 100,
            message: '緊急連絡先名称は100桁で入力してください。',
            trigger: 'blur',
          },
        ],
        emailaddress1: [
          {
            pattern: DOT_NOT_FIRST,
            message:
              '@の直前に「.(ドット)」があるメールアドレスは登録できません。',
            trigger: 'blur',
          },
          {
            pattern: EMAIL_FORMAT,
            message: 'メールアドレスは「xxx@xxx.xx」の形式で入力してください。',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '生徒メールアドレスは100桁で入力してください。',
            trigger: 'change',
          },
        ],
        emailaddress2: [
          {
            pattern: DOT_NOT_FIRST,
            message:
              '@の直前に「.(ドット)」があるメールアドレスは登録できません。',
            trigger: 'blur',
          },
          {
            pattern: EMAIL_FORMAT,
            message: 'メールアドレスは「xxx@xxx.xx」の形式で入力してください。',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '保護者メールアドレスは100桁で入力してください。',
            trigger: 'blur',
          },
        ],
        snz_managerlastname: [
          {
            required: true,
            message: '姓(保護者)を入力してください。',
            trigger: 'change',
          },
          {
            pattern: KANA_FULL_WIDTH_OR_HALFWIDTH,
            message:
              '姓(保護者)漢字・全角カナまたは半角英字で入力してください。',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '姓(保護者)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_managerfirstname: [
          {
            required: true,
            message: '名(保護者)を入力してください。',
            trigger: 'change',
          },
          {
            pattern: KANA_FULL_WIDTH_OR_HALFWIDTH,
            message:
              '名(保護者)は漢字・全角カナまたは半角英字で入力してください。',
            trigger: 'blur',
          },
          {
            max: 100,
            message: '名(保護者)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_relationship: [
          {
            required: true,
            message: '続柄を選択してください。',
            trigger: 'blur',
          },
        ],
        snz_yomimanagerlastname: [
          {
            required: true,
            message: 'フリガナ(保護者(姓))を入力してください。',
            trigger: 'blur',
          },
          {
            max: 100,
            message: 'フリガナ(保護者(姓))は100文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: KANA_FULL_WIDTH,
            message: 'フリガナ(保護者(姓))は全角カナで入力してください。',
            trigger: 'blur',
          },
        ],
        snz_yomimanagerfirstname: [
          {
            required: true,
            message: 'フリガナ(保護者(名))を入力してください。',
            trigger: 'blur',
          },
          {
            max: 100,
            message: 'フリガナ(保護者(名)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
          {
            pattern: KANA_FULL_WIDTH,
            message: 'フリガナ(保護者(名))は全角カナで入力してください。',
            trigger: 'blur',
          },
        ],
        snz_seatconsiderationremarks: [
          {
            max: 100,
            message: '座席配慮備考は100桁で入力してください。',
            trigger: 'blur',
          },
        ],
        snz_requestscommunication: [
          {
            max: 2000,
            message: '要望・通信は2000文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
      },
    };
  },
};

export const StudentReciprocal = {
  data() {
    var CHECK_MAX_SCORE = (rule, value, callback) => {
      if (value > 100) {
        return callback(
          new Error('入会選抜試験結果(理科)は0~100の整数で、入力してください。')
        );
      } else {
        callback();
      }
    };
    return {
      rules: {
        // Reciprocal
        snz_testenglish: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: '英語は0~100の整数で、入力してください。',
            trigger: 'change',
          },
          {
            validator: CHECK_MAX_SCORE,
            message: '英語は0~100の整数で、入力してください。',
            trigger: 'change',
          },
        ],
        snz_testmathematics: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: '数学・算数は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
          {
            validator: CHECK_MAX_SCORE,
            message: '数学・算数は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_testlanguage: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: '国語は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
          {
            validator: CHECK_MAX_SCORE,
            message: '国語は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_selectionscoreenglish: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: '英語は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
          {
            validator: CHECK_MAX_SCORE,
            message: '英語は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_selectionscoremathematics: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: '数学は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
          {
            validator: CHECK_MAX_SCORE,
            message: '数学は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_selectionscorelanguage: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: '国語は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
          {
            validator: CHECK_MAX_SCORE,
            message: '国語は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_selectionscorescience: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: '理科は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
          {
            validator: CHECK_MAX_SCORE,
            message: '理科は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_selectionscorescociety: [
          {
            pattern: NUMBER_HALF_SIZE,
            message: '社会は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
          {
            validator: CHECK_MAX_SCORE,
            message: '社会は0~100の整数で、入力してください。',
            trigger: 'blur',
          },
        ],
        // Choice
        snz_choiceschool: [
          {
            max: 100,
            message: '第１志望校は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_choiceschool2: [
          {
            max: 100,
            message: '第２志望校は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_choiceschool3: [
          {
            max: 100,
            message: '第３志望校は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_choiceschool4: [
          {
            max: 100,
            message: '第４志望校は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_choiceschool5: [
          {
            max: 100,
            message: '第５志望校は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        new_bukasudo: [
          {
            max: 100,
            message: '部活動・習い事等は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        // score
        snz_learningsun: [
          {
            max: 100,
            message: '習い事(日)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_learningmon: [
          {
            max: 100,
            message: '習い事(月)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_learningtue: [
          {
            max: 100,
            message: '習い事(火)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_learningwed: [
          {
            max: 100,
            message: '習い事(水)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_learningthu: [
          {
            max: 100,
            message: '習い事(木)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_learningfri: [
          {
            max: 100,
            message: '習い事(金)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
        snz_learningsat: [
          {
            max: 100,
            message: '習い事(土)は100文字以内で、入力してください。',
            trigger: 'blur',
          },
        ],
      },
    };
  },
};

export const StudentSystemValidate = {
  data() {
    return {
      rules: {
        business_unit: {
          id: [
            {
              required: true,
              message: '校舎を選択してください。',
              trigger: 'change',
            },
          ],
        },
        snz_studentcode: [
          {
            required: true,
            message: '生徒コードを入力してください。',
            trigger: 'change',
          },
          {
            max: 100,
            message: '生徒コードは100文字以内で、入力してください。',
            trigger: 'change',
          },
        ],
        snz_internalcode: [
          {
            required: true,
            message: '内部コードを選択してください。',
            trigger: 'change',
          },
          {
            max: 100,
            message: '内部コードは100文字以内で、入力してください。',
            trigger: 'change',
          },
        ],
        mainAffiliation: [
          {
            required: true,
            message: 'マスターリンクを選択してください。',
            trigger: 'change',
          },
        ],
        snz_studentstatus: [
          {
            required: true,
            message: '学生ステータスを選択してください。',
            trigger: 'change',
          },
        ],
        snz_gradedispswitched: [
          { max: 100, message: '最大長は100文字です', trigger: 'change' },
        ],
        status: [
          {
            required: true,
            message: 'ステータスを選択してください。',
            trigger: 'change',
          },
        ],
      },
    };
  },
};
