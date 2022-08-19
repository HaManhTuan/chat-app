import { Category } from '@/const/ApprovalNotification/Category';

export const search = {
  data() {
    return {
      searchForm: {
        studentName: null,
        category: [
          Category.SUBJECT_IRREGULARITIES.value,
          Category.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL.value,
        ],
        startApplyDate: null,
        endApplyDate: null,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.handleSearch();
    });
  },
  methods: {
    buildParamsRequest() {
      return {
        student_name: this.searchForm.studentName,
        category: this.searchForm.category,
        start_apply_date: this.searchForm.startApplyDate,
        end_apply_date: this.searchForm.endApplyDate,
      };
    },
    async handleSearch() {
      const param = _.assign({ page: 1 }, this.buildParamsRequest());
      this.$refs.listDataTableElement.getList(param);
    },
  },
};
