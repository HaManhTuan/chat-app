const Contact = {
  SNZ_UPDATE_PENDING: 125950000,
  SNZ_UPDATE_ACCEPT: 125950001,
  SNZ_UPDATE_IGNORE: 125950002,
  OPTION_UPDATE_STATUS: [
    {
      value: 125950000,
      label: '未定',
    },
    {
      value: 125950001,
      label: '更新',
    },
    {
      value: 125950002,
      label: '非更新',
    },
  ],
  OPTION_REASON: [
    {
      value: 125950000,
      label: '転居・転校',
    },
    {
      value: 125950010,
      label: '進路決定',
    },
    {
      value: 125950002,
      label: 'けが・病気',
    },
    {
      value: 125950003,
      label: '意欲喪失',
    },
    {
      value: 125950001,
      label: '学力不振',
    },
    {
      value: 125950030,
      label: 'その他',
    },
  ],
  OPTION_WITHDRAWAL_REASON: [
    {
      value: 1,
      label: '転居・転校',
    },
    {
      value: 2,
      label: 'けが・病気・体調不良',
    },
    {
      value: 3,
      label: '学力不振',
    },
    {
      value: 4,
      label: '体力・時間的に無理',
    },
    {
      value: 5,
      label: '習い事・部活等との両立不可',
    },
    {
      value: 6,
      label: '意欲喪失',
    },
    {
      value: 7,
      label: '私立受験のため',
    },
    {
      value: 8,
      label: '通塾が困難',
    },
    {
      value: 9,
      label: '学校と進度が違う',
    },
    {
      value: 10,
      label: '進路決定（卒業）のため',
    },
    {
      value: 12,
      label: '他事業部・他校舎へ移籍',
    },
    {
      value: 11,
      label: 'その他',
    },
  ],
  SNZ_CONTRACT_TYPE: [
    {
      value: 1,
      label: '体験月',
    },
    {
      value: 2,
      label: '入会月',
    },
    {
      value: 3,
      label: '受講変更月',
    },
    {
      value: 4,
      label: '受講変更開始月',
    },
    {
      value: 5,
      label: '更新',
    },
  ],
};

export default Contact;
