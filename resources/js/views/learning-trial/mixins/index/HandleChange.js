import { SearchMixin } from './Search';

export const HandleChangeMixin = {
  mixins: [SearchMixin],
  methods: {
    async handleChangeBusiness() {
      this.searchForm.experienceCourseId = null;
      this.searchForm.experienceStartMonth = null;
      if (this.searchForm.businessUnit != null) {
        this.fetchCourseAnnualAndShortTermByBusinessId(
          this.searchForm.businessUnit
        );
        this.fetchTargetPeriodByBusinessId(this.searchForm.businessUnit);
      } else {
        this.fetchCourseAnnualAndShortTerm();
        this.fetchTargetPeriodByListOwnerBusinessUnit();
      }
    },

    async handleChangeRegisterStatus() {
      this.handleSearch();
    },
  },
};
