import UpgradeSchoolYearRequest from '@/api/UpgradeSchoolYearRequest';
const upgradeSchoolYearRequest = new UpgradeSchoolYearRequest();

export const ExportMixin = {
  methods: {
    async handleExport() {
      this.exportLoading = true;
      await upgradeSchoolYearRequest
        .exportResource(this.buildParamRequest())
        .then(data => {
          const nameScreen = '更新有無_';
          this.createDownloadXlsFile(nameScreen, data);
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
  },
};
