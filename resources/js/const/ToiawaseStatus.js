const toiawaseStatus = {
  END_BEFORE_INTERVIEW_TEXT: '面談前にアプローチ終了',
  CANCEL_INTERVIEW_TEXT: '面談キャンセルしてアプローチ終了',
  END_INTERVIEW_TEXT: '面談後にアプローチ終了',
  END_BEFORE_INTERVIEW: 1,
  CANCEL_INTERVIEW: 2,
  END_INTERVIEW: 3,
  OPTION_SNZ_APPROACHEND: [
    {
      value: '',
      label: 'ー',
      disabled: false,
    },
    {
      value: 1,
      label: '面談前にアプローチ終了',
      disabled: false,
    },
    {
      value: 2,
      label: '面談キャンセルしてアプローチ終了',
      disabled: false,
    },
    {
      value: 3,
      label: '面談後にアプローチ終了',
      disabled: false,
    },
  ],

  OPTION_SNZ_SUPPORTSTATUS: [
    {
      value: 1,
      label: '問合せのみ',
    },
    {
      value: 3,
      label: '来室予約',
    },
    {
      value: 4,
      label: '来室済',
    },
    {
      value: 5,
      label: '完了',
    },
    {
      value: 6,
      label: '架電中',
    },
    {
      value: 7,
      label: '架電終了',
    },
  ],

  SENT: 1,
  NOT_SENT_YET: 0,
  OPTION_SNZ_DOCUMENTSENT: [
    {
      value: 0,
      label: '未',
    },
    {
      value: 1,
      label: '送付済',
    },
  ],

  OPTION_SNZ_CUSTOMER_REQUEST: [
    {
      value: 1,
      label: '体験希望',
    },
    {
      value: 2,
      label: '見学や説明希望',
    },
    {
      value: 3,
      label: '検討段階',
    },
  ],

  OPTION_COGNITIVE_MEDIUM: [
    {
      value: 1,
      label: '新聞折込のチラシ',
    },
    {
      value: 2,
      label: '新聞折込以外のチラシ',
    },
    {
      value: 3,
      label: 'ダイレクトメール（ハガキなど)',
    },
    {
      value: 4,
      label: 'WEB検索・WEB広告',
    },
    {
      value: 5,
      label: '塾ナビなどの塾紹介サイト等',
    },
    {
      value: 6,
      label: 'Facebook・Twitter・Youtube・LINEなど',
    },
    {
      value: 7,
      label: '校舎の看板',
    },
    {
      value: 8,
      label: '全公立展',
    },
    {
      value: 9,
      label: '駅や電車などの交通広告',
    },
    {
      value: 10,
      label: '知人・友人の紹介',
    },
    {
      value: 11,
      label: '保護者からの紹介',
    },
    {
      value: 12,
      label: 'その他',
    },
  ],

  OPTION_SNZ_ENTERSTUDENT: [
    {
      value: 1,
      label: 'A',
    },
    {
      value: 2,
      label: 'B',
    },
    {
      value: 3,
      label: 'C',
    },
    {
      value: 4,
      label: 'D',
    },
  ],

  OPTION_SNZ_INQUIRYTYPE: [
    {
      value: 1,
      label: '電話',
    },
    {
      value: 2,
      label: '来校',
    },
    {
      value: 3,
      label: 'Web問合せ(HP)',
    },
    {
      value: 4,
      label: 'Web問合せ(塾ナビ)',
    },
    {
      value: 5,
      label: 'ボイスワープ',
    },
    {
      value: 6,
      label: 'Web問合せ(塾シル)',
    },
    {
      value: 7,
      label: 'その他',
    },
  ],

  OPTION_SNZ_ACTIVESTATUS: [
    {
      value: 125950000,
      label: '未着手',
    },
    {
      value: 125950001,
      label: '対応中',
    },
    {
      value: 125950002,
      label: '完了',
    },
  ],
};

export default toiawaseStatus;
