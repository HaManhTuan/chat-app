
export const validate = {
  data(){
    return {
      searchRules: {
        name: [
          {
            required: true,
            message: '校舎名を入力してください。',
            trigger: 'none',
          },
          { max: 160, message: '校舎名は160文字以内で、入力してください。', trigger: ['none'] },
        ],
        parentbusinessunitid: [
          {
            required: true,
            message: '上位の部署を選択してください。',
            trigger: 'none',
          },
        ],
        snz_headdivision: [
          {
            required: true,
            message: '事業本部を選択してください。',
            trigger: 'none',
          },
        ],
        snz_divisionnm: [
          {
            required: true,
            message: '事業部を選択してください。',
            trigger: 'none',
          },
        ],
        snz_area: [
          {
            required: true,
            message: 'エリアを選択してください。',
            trigger: 'none',
          },
        ],
        organization_id: [
          {
            required: true,
            message: '組織名を選択してください。',
            trigger: 'none',
          },
        ],
        snz_graduation_grade: [
          {
            required: true,
            message: '卒業学年を選択してください。',
            trigger: 'none',
          },
        ],
        snz_calendar_pattern_id: [
          {
            required: true,
            message: 'カレンダーパターンを選択してください。',
            trigger: 'none',
          },
        ],
        snz_brand: [
          {
            required: true,
            message: 'ブランド区分を選択してください。',
            trigger: 'none',
          },
        ],
        snz_closing_month_period_id: [
          {
            required: true,
            message: '締め月を選択してください。',
            trigger: 'none',
          },
        ],
        snz_schoolmanager_user_id: [
          {
            required: true,
            message: '教室長を選択してください。',
            trigger: 'none',
          },
        ],
        snz_code: [
          {
            required: true,
            message: '教室コードを入力してください。',
            trigger: 'none',
          },
          {
            max: 3,
            message: '教室コード は3文字以内で、入力してください。',
            trigger: 'none',
          },
        ],
        snz_cooperationschoolcd: [
          {
            max: 6,
            message: '連携用校舎コード は6文字以内で、入力してください。',
            trigger: 'none',
          },
        ],
        snz_crammanageschoolname: [
          {
            max: 160,
            message: '塾マネ校舎名は160文字以内で、入力してください。',
            trigger: 'none',
          },
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
