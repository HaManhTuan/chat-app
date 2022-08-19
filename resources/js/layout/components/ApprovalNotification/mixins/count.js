import ApprovalNotificationRequest from '@/api/ApprovalNotification/ApprovalNotificationRequest';

const approvalNotificationRequest = new ApprovalNotificationRequest();

export const count = {
  methods: {
    async countNotApproved() {
      const res = await approvalNotificationRequest.countNotApproved();
      return res;
    },
  },
};
