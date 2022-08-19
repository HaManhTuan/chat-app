import GradeRequest from '@/api/gradeRequest';
import CourseRequest from '@/api/CourseRequest';
// import TargetPeriodRequest from '@/api/TargetPeriodRequest';
import BusinessUnitRequest from '@/api/BusinessUnitRequest';

const gradeRequest = new GradeRequest();
const courseRequest = new CourseRequest();
// const targetPeriodRequest = new TargetPeriodRequest();
const businessResource = new BusinessUnitRequest();

export const FetchMixin = {
  created() {
    //
  },
  methods: {
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    async searchGrade(query) {
      return await gradeRequest.gradeSearchName(query);
    },

    async fetchGrade() {
      const response = await gradeRequest.getWithCondition({
        // select_add_id: [this.searchForm.grade],
        master_grade_screen: 0,
      });
      this.selectBox.grade = response;
      if (
        !_.includes(_.map(this.selectBox.grade, 'id'), this.searchForm.grade)
      ) {
        this.searchForm.grade = null;
      }
    },

    async searchCourse(query) {
      return await courseRequest.searchName(query);
    },
  },
};
