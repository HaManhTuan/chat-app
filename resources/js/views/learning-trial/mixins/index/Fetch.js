import GradeRequest from '@/api/gradeRequest';
import CourseRequest from '@/api/CourseRequest';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
import BusinessUnitRequest from '@/api/BusinessUnitRequest';

const gradeRequest = new GradeRequest();
const courseRequest = new CourseRequest();
const targetPeriodRequest = new TargetPeriodRequest();
const businessResource = new BusinessUnitRequest();

export const FetchMixin = {
  methods: {
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    async searchGrade(query) {
      return await gradeRequest.gradeSearchName(query);
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
    async fetchCourseAnnualAndShortTerm() {
      const courseData = await courseRequest.fetchCourseAnnualAndShortTerm({
        display_screen: 'learning-trial',
      });
      this.selectBox.experience_course = courseData;
    },

    async fetchCourseAnnualAndShortTermByBusinessId(businessId) {
      const courseData = await courseRequest.fetchCourseAnnualAndShortTermByBusinessId(
        {
          display_screen: 'learning-trial',
          business_id: businessId,
        }
      );
      this.selectBox.experience_course = courseData;
    },
    async fetchTargetPeriodByListOwnerBusinessUnit() {
      const targetPeriodData = await targetPeriodRequest.getByListOwnerBusinessUnit();
      this.selectBox.experience_start_month = targetPeriodData;
    },

    async fetchTargetPeriodByBusinessId(businessId) {
      const targetPeriodData = await targetPeriodRequest.getTargetPeriodWithCondition(
        {
          business_id: businessId,
        }
      );
      this.selectBox.experience_start_month = targetPeriodData;
    },
  },
};
