import { SearchMixin } from './Search';
import { FetchMixin } from './Fetch';

export const HandleChangeMixin = {
  mixins: [SearchMixin, FetchMixin],
  methods: {
    async handleChangeBusiness() {
      this.searchForm.course = null;
      this.$nextTick(() => {
        this.$refs.searchCourse.init();
      });
    },
    changeCourse(value) {
      this.searchForm.course = value;
      this.handleSearch();
    },
  },
};
