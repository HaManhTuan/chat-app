import Contact from '@/const/Contact';
import { mapGetters } from 'vuex';

import CourseRequest from '@/api/CourseRequest';
import SubjectSetRequest from '@/api/SubjectSetRequest';
import SchoolResource from '@/api/school';

const courseRequest = new CourseRequest();
const subjectSetRequest = new SubjectSetRequest();
const schoolRequest = new SchoolResource();

export const FetchDataMixin = {
  data() {
    return {
      selectBox: {
        school: [],
        updateStatus: Contact.OPTION_UPDATE_STATUS,
        reason: Contact.OPTION_WITHDRAWAL_REASON,
        businessUnit: [],
      },
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  created() {
    this.fetchSchool();
    this.setBusiness();
  },
  methods: {
    async fetchSchool() {
      const res = await schoolRequest.fetchAll();
      this.selectBox.school = _.mapValues(_.groupBy(res, 'snz_school_type_id'));
    },
    setBusiness() {
      this.selectBox.businessUnit = this.currentBusiness;
    },
    async fetchCourseByCondition(businessId, schoolYear, gradeId) {
      const columnSelect = ['id', 'snz_name'];
      const res = await courseRequest.fetchCondition({
        grade_id: gradeId,
        business_id: businessId,
        school_year: schoolYear,
        column_select: columnSelect,
        display_screen: 'register-school',
      });
      return res;
    },

    async fetchSubjectSetByCondition(
      gradeId,
      courseId,
      businessId,
      schoolYear
    ) {
      const res = await subjectSetRequest.getByCondition({
        grade_id: gradeId,
        course_id: courseId,
        business_id: businessId,
        school_year: schoolYear,
      });
      return res;
    },
  },
};
