export default {
  methods: {
    getCurrentSchoolYear() {
      const d = new Date();
      const month = d.getMonth();
      let year = d.getFullYear();
      if (month <= 1) {
        year = year - 1;
      }
      return year;
    },
    getSchoolYearOption() {
      const year = this.getCurrentSchoolYear();
      return [
        {
          label: `${year - 1} 年度`,
          value: year - 1,
        },
        {
          label: `${year} 年度`,
          value: year,
        },
        {
          label: `${year + 1} 年度`,
          value: year + 1,
        },
      ];
    },
  },
};
