export const Status = {
  WAITING_FOR_1ST_STAGE_APPROVAL: {
    label: '１段階承認待ち',
    value: 1,
  },
  WAITING_FOR_2ST_STAGE_APPROVAL: {
    label: '2段階承認待ち',
    value: 2,
  },
  WAITING_FOR_APPROVAL_TO_COLLECT_TUTTION_FEES: {
    label: '授業料収受の承認待ち',
    value: 3,
  },
  APPROVED: {
    label: '承認済み',
    value: 4,
  },
  REJECTED: {
    label: '却下',
    value: 5,
  },
};

export const APPROVE_STATUS = {
  WAITING_FOR_1ST_STAGE_APPROVAL: 1,
  WAITING_FOR_2ST_STAGE_APPROVAL: 2,
  WAITING_FOR_APPROVAL_TO_COLLECT_TUTTION_FEES: 3,
  APPROVED: 4,
  REJECTED: 5,
};
