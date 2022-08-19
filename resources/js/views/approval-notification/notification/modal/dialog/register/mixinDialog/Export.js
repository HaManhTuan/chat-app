import ApprovalNotificationRequest from '@/api/ApprovalNotification/ApprovalNotificationRequest';
const approvalNotificationRequest = new ApprovalNotificationRequest();

export const Export = {
  data() {
    return {
      exportLoading: false,
    };
  },
  methods: {
    async handleExport() {
      this.exportLoading = true;
      await approvalNotificationRequest
        .exportDetail({
          id: this.id,
        })
        .then(data => {
          const nameScreen = '通知詳細_';
          this.createDownloadXlsFile(nameScreen, data);
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
  },
};
