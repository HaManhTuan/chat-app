const StudentStatus = {
  INQUIRY: 125950000,
  EXPERIENCE_STUDENT: 125950001,
  INTERNAL_RAW: 125950002,
  MATE_RAW: 125950003,
  COMPLETION: 125950004,
  SCHEDULED_ENROLLMENT_STUDENT: 125950005,
  KYU_JUNIOR_COLLEGE_STUDENT: 125950006,
  RETIRED_STUDENTS: 125950007,
  ALUMNI: 125950008,

  OPTION_SNZ_TEST_CONTACT: [
    {
      value: 0,
      label: '－',
    },
    {
      value: 1,
      label: '✔',
    },
  ],

  OPTION_SNZ_RESULT_CONTACT: [
    {
      value: 0,
      label: '未',
    },
    {
      value: 1,
      label: '連絡済',
    },
  ],

  OPTION_SNZ_STUDENTSTATUS: [
    {
      value: 125950000,
      label: '問合せ',
    },
    {
      value: 125950001,
      label: '体験生',
    },
    {
      value: 125950002,
      label: '内部生',
    },
    {
      value: 125950003,
      label: 'メイト生',
    },
    {
      value: 125950004,
      label: '完了',
    },
    {
      value: 125950005,
      label: '入会予定生',
    },
    {
      value: 125950006,
      label: '休塾生',
    },
    {
      value: 125950007,
      label: '退塾生',
    },
    {
      value: 125950008,
      label: '卒業生',
    },
  ],

  OPTION_SEMESTER: [
    {
      value: 125950000,
      label: '1学期',
    },
    {
      value: 125950001,
      label: '2学期',
    },
    {
      value: 125950002,
      label: '3学期',
    },
    {
      value: 125950003,
      label: '前期',
    },
    {
      value: 125950004,
      label: '後期',
    },
    {
      value: 125950005,
      label: '学年末',
    },
  ],

  OPTION_SNZ_SCHOOLTESTNAME: [
    {
      value: 125950000,
      label: '1学期',
    },
    {
      value: 125950001,
      label: '2学期',
    },
    {
      value: 125950002,
      label: '3学期',
    },
    {
      value: 125950003,
      label: '前期',
    },
    {
      value: 125950004,
      label: '後期',
    },
    {
      value: 125950005,
      label: '学年末',
    },
  ],

  OPTION_SNZ_SCHOOLTESTTYPE: [
    {
      value: 125950000,
      label: '中間',
    },
    {
      value: 125950001,
      label: '期末',
    },
    {
      value: 125950002,
      label: '単元①',
    },
    {
      value: 125950003,
      label: '単元②',
    },
    {
      value: 125950004,
      label: '単元③',
    },
  ],

  SNZ_SELECSIONAPPSTATE_NOT_DECIDED: 125950000,
  SNZ_SELECSIONAPPSTATE_SUBMITTED: 125950001,
  SNZ_SELECSIONAPPSTATE_NOT_ENROLL: 125950002,
  OPTION_SNZ_SELECTIONAPPSTATE: [
    {
      value: 125950000,
      label: '未定',
    },
    {
      value: 125950001,
      label: '提出済',
    },
    {
      value: 125950002,
      label: '入会意思なし',
    },
  ],
  SNZ_SELECTIONRESULT_NOT_TEST: 10,
  SNZ_SELECTIONRESULT_PASS: 20,
  SNZ_SELECTIONRESULT_NOT_PASS: 30,
  OPTION_SNZ_SELECTIONRESULT: [
    {
      value: 10,
      label: '未受験',
    },
    {
      value: 20,
      label: '合格',
    },
    {
      value: 30,
      label: '不合格',
    },
  ],
  OPTION_GENDERCODE: [
    {
      value: 1,
      label: '女',
    },
    {
      value: 2,
      label: '男',
    },
  ],
  OPTION_SNZ_RELATIONSHIP: [
    {
      value: 125950000,
      label: '父・母',
    },
    {
      value: 125950001,
      label: '祖父母',
    },
    {
      value: 125950006,
      label: 'その他',
    },
  ],
};

export default StudentStatus;
