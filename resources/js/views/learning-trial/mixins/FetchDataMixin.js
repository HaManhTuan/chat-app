import { SelectBoxMixin } from './SelectBoxMixin';

import CourseRequest from '@/api/CourseRequest';
import GradeRequest from '@/api/gradeRequest';
import SubjectSetRequest from '@/api/SubjectSetRequest';
import DiscountRequest from '@/api/DiscountRequest';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';

const courseRequest = new CourseRequest();
const gradeRequest = new GradeRequest();
const subjectSetRequest = new SubjectSetRequest();
const discountRequest = new DiscountRequest();
const targetPeriodRequest = new TargetPeriodRequest();

export const FetchDataMixin = {
  data() {
    return {};
  },
  mixins: [SelectBoxMixin],
  methods: {
    async fetchGrade() {
      const option = [[]];
      const grade = await gradeRequest.getWithCondition({
        master_grade_screen: 0,
      });
      this.tableForm.list.forEach((item, index) => {
        option[index] = [];
        option[index].push(...grade, item.contact.grade);
        option[index] = _.uniqBy(option[index], 'id');
      });
      this.selectBox.grade = option;
    },
    async fetchCourse() {
      this.selectBox.course = await courseRequest.list(
        undefined,
        'learning-trial'
      );
    },
    // async fetchSubjectSetByCourseId(courseId, index, row) {
    //   const subjectSetData = await subjectSetRequest.getByCourseId(courseId);
    //   row.subject_set_id = undefined;
    //   this.selectBox.subject_set[index] = [];
    //   if (subjectSetData.length > 0) {
    //     subjectSetData.map(item => {
    //       this.selectBox.subject_set[index].push({
    //         label: item.snz_name,
    //         value: item.id,
    //       });
    //     });
    //   }
    // },

    async fetchSubjectSetByCourseAndGradeAndBusiness(
      gradeId,
      schoolYear,
      courseId,
      businessId
    ) {
      const subjectSetData = await subjectSetRequest.getByCourseIdAndGradeIdAndBusinessId(
        {
          grade_id: gradeId,
          school_year: schoolYear,
          course_id: courseId,
          business_id: businessId,
        }
      );
      return subjectSetData;
    },
    async fetchDiscountAll() {
      const discountData = await discountRequest.list();
      discountData.map(item => {
        this.selectBox.discount_1.push({
          label: item.snz_name,
          value: item.id,
        });
      });
    },

    async fetchTargetPeriod(params) {
      this.selectBox.targetPeriod = await targetPeriodRequest.getTargetPeriodByBusinessId(
        params
      );
    },

    // async fetchSelectionAppState() {
    //   this.selectBox.selection_app_state =
    //     StudentStatus.OPTION_SNZ_SELECTIONAPPSTATE;
    // },

    // async fetchSelectionResult() {
    //   this.selectBox.selection_result = _.concat(
    //     this.selectBox.selection_result,
    //     StudentStatus.OPTION_SNZ_SELECTIONRESULT
    //   );
    // },
  },
};
