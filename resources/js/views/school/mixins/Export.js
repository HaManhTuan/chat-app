import RegisterSchool from '@/api/RegisterSchool';

const registerSchool = new RegisterSchool();

export const ExportMixin = {
  methods: {
    async handleExport() {
      this.exportLoading = true;
      await registerSchool
        .exportResource(this.buildParamRequest())
        .then(data => {
          const nameScreen = '直入会_';
          this.createDownloadXlsFile(nameScreen, data);
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
  },
};
