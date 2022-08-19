export const FILE = {
  MAX_SIZE: 10485760,
  FORMATS: {
    'application/vnd.ms-excel': true,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true,
    'application/wps-office.xlsx': true,
  },
};

export const DATA_TARGET_IMPORT = [
  {
    label: '生徒情報',
    value: 1,
  },
  {
    label: '受講情報',
    value: 2,
  },
  {
    label: '休塾情報',
    value: 3,
  },
  {
    label: '退塾情報',
    value: 4,
  },
  {
    label: '受講科目マスター',
    value: 5,
  },
  {
    label: '開講コース',
    value: 6,
  },
  {
    label: '科目セット',
    value: 7,
  },
  {
    label: '期間',
    value: 8,
  },
  // {
  //   label: '生徒管理',
  //   value: 9,
  // },
  // {
  //   label: '生徒情報',
  //   value: 7,
  // },
  // {
  //   label: '受講情報',
  //   value: 8,
  // },
  // {
  //   label: '退塾情報',
  //   value: 1,
  // },
  // {
  //   label: '休塾情報',
  //   value: 2,
  // },
  // {
  //   label: '受講科目マスター',
  //   value: 5,
  // },
  // {
  //   label: '開講コース',
  //   value: 4,
  // },
  // {
  //   label: '科目セット',
  //   value: 6,
  // },
  // {
  //   label: '期間',
  //   value: 3,
  // },
];

export const IMPORT_STATUS = [
  {
    label: '提出済み',
    value: 0,
  },
  {
    label: '実装中',
    value: 1,
  },
  {
    label: '完了',
    value: 2,
  },
];

export const IMPORT_STATUS_VALUE = {
  'submitted': 0,
  'processing': 1,
  'done': 2,
};

export const STATUS_REASON_WITHDRAW = [
  {
    label: '転居・転校',
    value: 1,
  },
  {
    label: 'けが・病気・体調不良',
    value: 2,
  },
  {
    label: '学力不振',
    value: 3,
  },
  {
    label: '体力・時間的に無理',
    value: 4,
  },
  {
    label: '習い事・部活等との両立不可',
    value: 5,
  },
  {
    label: '意欲喪失',
    value: 6,
  },
  {
    label: '私立受験のため',
    value: 7,
  },
  {
    label: '通塾が困難',
    value: 8,
  },
  {
    label: '学校と進度が違う',
    value: 9,
  },
  {
    label: '進路決定（卒業）のため',
    value: 10,
  },
  {
    label: '他事業部・他校舎へ移籍',
    value: 12,
  },
  {
    label: 'その他',
    value: 11,
  },
];

export const STATUS_REASON_ABSENT = [
  {
    label: '転居・転校',
    value: 1,
  },
  {
    label: 'けが・病気・体調不良',
    value: 2,
  },
  {
    label: '学力不振',
    value: 3,
  },
  {
    label: '体力・時間的に無理',
    value: 4,
  },
  {
    label: '習い事・部活等との両立不可',
    value: 5,
  },
  {
    label: '意欲喪失',
    value: 6,
  },
  {
    label: '私立受験のため',
    value: 7,
  },
  {
    label: '通塾が困難',
    value: 8,
  },
  {
    label: '学校と進度が違う',
    value: 9,
  },
  {
    label: '進路決定（卒業）のため',
    value: 10,
  },
  {
    label: '他事業部・他校舎を体験',
    value: 12,
  },
  {
    label: 'その他',
    value: 11,
  },
];

