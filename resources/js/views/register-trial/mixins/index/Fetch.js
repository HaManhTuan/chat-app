import BusinessUnitRequest from '@/api/BusinessUnitRequest';
import CourseRequest from '@/api/CourseRequest';
import GradeRequest from '@/api/gradeRequest';

const gradeRequest = new GradeRequest();
const businessUnitRequest = new BusinessUnitRequest();
const courseRequest = new CourseRequest();

export const FetchMixin = {
  methods: {
    async searchGrade(query) {
      return await gradeRequest.gradeSearchName(query);
    },
    async searchCouse(query) {
      return await courseRequest.searchName(query);
    },
    async searchBusiness(query) {
      return await businessUnitRequest.searchName(query);
    },
    async fetchGrade() {
      this.selectBox.grade = await gradeRequest.getWithCondition({
        // select_add_id: [this.searchForm.grade],
        master_grade_screen: 0,
      });
      if (
        !_.includes(_.map(this.selectBox.grade, 'id'), this.searchForm.grade)
      ) {
        this.searchForm.grade = null;
      }
    },
    async fetchCourse() {
      this.selectBox.course = await courseRequest.list(
        undefined,
        'register-trial'
      );
    },
    async fetchCourseByBusinessUnit(businessId) {
      const courseData = await courseRequest.fetchCondition({
        display_screen: 'register-trial',
        business_id: businessId,
      });
      this.selectBox.course = courseData;
    },
  },
};
