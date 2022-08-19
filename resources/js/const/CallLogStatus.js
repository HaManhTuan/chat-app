const callLogStatus = {
  OPTION_SNZ_CALL_STATUS: [
    {
      value: 10,
      label: '架電中',
    },
    {
      value: 20,
      label: '来室予約',
    },
    {
      value: 30,
      label: '架電終了',
    },
    {
      value: 40,
      label: '来室済み',
    },
    {
      value: 50,
      label: '完了',
    },
  ],

  OPTION_SNZ_CALL_RESULT: [
    {
      value: 1,
      label: '不在',
    },
    {
      value: 2,
      label: '留守電',
    },
    {
      value: 3,
      label: '面談',
    },
    {
      value: 4,
      label: '再TEL',
    },
    {
      value: 5,
      label: '検討',
    },
    {
      value: 6,
      label: '現在使用されていない',
    },
    {
      value: 7,
      label: '重複',
    },
    {
      value: 8,
      label: '無効内容',
    },
    {
      value: 9,
      label: '辞退',
    },
    {
      value: 10,
      label: '公立中高一貫（神奈川）',
    },
    {
      value: 11,
      label: '公立中高一貫（他県）',
    },
    {
      value: 12,
      label: 'TEL禁止',
    },
    {
      value: 13,
      label: '内部生',
    },
    {
      value: 14,
      label: 'すでに予約済',
    },
    {
      value: 15,
      label: 'その他',
    },
  ],

  OPTION_SNZ_TAIOUSYA: [
    {
      value: 1,
      label: '父',
    },
    {
      value: 2,
      label: '母',
    },
    {
      value: 3,
      label: '本人',
    },
    {
      value: 4,
      label: 'その他',
    },
  ],
};

export default callLogStatus;
