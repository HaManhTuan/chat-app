import LearningTrialRequest from '@/api/LearningTrialRequest';
const learningTrialRequest = new LearningTrialRequest();

export const ExportMixin = {
  methods: {
    async handleExport() {
      this.exportLoading = true;
      await learningTrialRequest
        .exportResource(this.buildParamRequest())
        .then(data => {
          const nameScreen = '体験結果更新_';
          this.createDownloadXlsFile(nameScreen, data);
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
  },
};
