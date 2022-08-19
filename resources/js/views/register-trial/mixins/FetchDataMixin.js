import GradeRequest from '@/api/gradeRequest';
import SubjectSetRequest from '@/api/SubjectSetRequest';
import DiscountRequest from '@/api/DiscountRequest';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
import CourseRequest from '@/api/CourseRequest';

const gradeRequest = new GradeRequest();
const subjectSetRequest = new SubjectSetRequest();
const discountRequest = new DiscountRequest();
const targetPeriodRequest = new TargetPeriodRequest();
const courseRequest = new CourseRequest();

export const FetchDataMixin = {
  methods: {
    async fetchGrade() {
      const option = [[]];
      const grade = await gradeRequest.getWithCondition({
        master_grade_screen: 0,
      });
      this.tableForm.list.forEach((item, index) => {
        option[index] = [];
        option[index].push(...grade, item.grade);
        option[index] = _.uniqBy(option[index], 'id');
      });
      this.selectBox.grade = option;
    },
    async fetchCourseByBusinessUnit(businessId) {
      return await courseRequest.getByBusinessId(
        undefined,
        this.displayScreen,
        businessId
      );
    },
    async getCourseNameById(id) {
      if (id) {
        const res = await courseRequest.getAreaList(
          undefined,
          this.displayScreen,
          id
        );
        return res.snz_name;
      } else {
        return null;
      }
    },
    async fetchCourseByBusinessUnitAndGrade(businessId, gradeId) {
      return await courseRequest.getByBusinessIdAndGradeId({
        business_id: businessId,
        grade_id: gradeId,
        display_screen: this.displayScreen,
      });
    },
    async fetchSubjectSet() {
      const subjectSetData = await subjectSetRequest.list();
      subjectSetData.map(item => {
        this.selectBox.subject_set.push({
          label: item.snz_name,
          value: item.id,
        });
      });
    },
    async fetchSubjectSetByBusinessUnit(id) {
      return await subjectSetRequest.getByBusinessId(id);
    },
    async fetchSubjectSetByCourse(id) {
      return await subjectSetRequest.getByCourseId(id);
    },

    async fetchSubjectSetByCourseAndGradeAndBusiness(
      gradeId,
      schoolYear,
      courseId,
      businessId
    ) {
      return await subjectSetRequest.getByCourseIdAndGradeIdAndBusinessId({
        grade_id: gradeId,
        school_year: schoolYear,
        course_id: courseId,
        business_id: businessId,
      });
    },

    async fetchTargetPeriod(params) {
      this.selectBox.targetPeriod = await targetPeriodRequest.getTargetPeriodByBusinessId(
        params
      );
    },

    async fetchTargetPeriodByBusinessUnit(businessId) {
      return await targetPeriodRequest.getTargetPeriodByBusinessId({
        business_id: businessId,
      });
    },

    async fetchDiscountAll() {
      const discountData = await discountRequest.list();
      discountData.map(item => {
        this.selectBox.discount_1.push({
          label: item.snz_name,
          value: item.id,
        });
        this.selectBox.discount_2.push({
          label: item.snz_name,
          value: item.id,
        });
      });
    },

    async fetchDiscountByStudentCodeAndGradeAndSchoolYear(
      studentCode,
      gradeId,
      schoolYear
    ) {
      return await discountRequest.getByStudentCodeAndGradeIdAndSchoolYear({
        student_code: studentCode,
        grade_id: gradeId,
        school_year: schoolYear,
        // expired_date: moment().format('YYYY/MM/DD HH:mm:ss'),
      });
    },
  },
};
