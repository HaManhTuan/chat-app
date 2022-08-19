import RegisterTrialRequest from '@/api/RegisterTrialRequest';
const registerTrialRequest = new RegisterTrialRequest();

export const ExportMixin = {
  methods: {
    async handleExport() {
      this.exportLoading = true;
      await registerTrialRequest
        .exportResource(this.buildParamRequest())
        .then(data => {
          const nameScreen = '体験登録_';
          this.createDownloadXlsFile(nameScreen, data);
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
  },
};
