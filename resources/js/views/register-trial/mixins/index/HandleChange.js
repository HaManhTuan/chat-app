import { SearchMixin } from './Search';

export const HandleChangeMixin = {
  mixins: [SearchMixin],
  methods: {
    async handleChangeBusiness() {
      this.searchForm.course = null;
      if (this.searchForm.businessUnit) {
        await this.fetchCourseByBusinessUnit(this.searchForm.businessUnit);
      } else {
        await this.fetchCourse();
      }
    },
    async handleChangeRegisterStatus() {
      if (this.searchForm.registerStatus === 1) {
        this.searchForm.studentStatus = null;
        this.selectBox.studentStatus = [];
      } else {
        this.selectBox.studentStatus = [
          {
            value: 125950000,
            label: '問合せ', // contact
          },
          {
            value: 125950001,
            label: '体験生', // học thử
          },
          {
            value: 125950003,
            label: 'メイト生', // mate
          },
          {
            value: 125950004,
            label: '完了', // hoàn thành
          },
          {
            value: 125950007,
            label: '退塾生', // thôi học
          },
        ];
      }
      await this.handleSearch();
    },
  },
};
