import Contact from '@/const/Contact';
import { FetchDataMixin } from './FetchDataMixin';
import { ToggleSelectBoxMixin } from './ToggleSelectBoxMixin';

export const ChangeMixin = {
  mixins: [FetchDataMixin, ToggleSelectBoxMixin],

  methods: {
    initSelectBoxDisable(row) {
      const disable = {
        snz_update: false,
        snz_update_businessunit_id: false,
        snz_update_course_id: false,
        snz_update_subject_set_id: false,
        snz_update_main_school_id: false,
        snz_endreason: false,
        snz_endreason2: false,
      };
      disable.snz_update = false;
      if (row.snz_update === Contact.SNZ_UPDATE_PENDING) {
        disable.snz_update_businessunit_id = true;
        disable.snz_update_course_id = true;
        disable.snz_update_subject_set_id = true;
        disable.snz_update_main_school_id = true;
        disable.snz_endreason = true;
        disable.snz_endreason2 = true;
      } else if (row.snz_update === Contact.SNZ_UPDATE_ACCEPT) {
        disable.snz_update_businessunit_id = false;
        disable.snz_update_course_id = false;
        disable.snz_update_subject_set_id = false;
        disable.snz_update_main_school_id = false;
        disable.snz_endreason = true;
        disable.snz_endreason2 = true;
      } else {
        disable.snz_update_businessunit_id = true;
        disable.snz_update_course_id = true;
        disable.snz_update_subject_set_id = true;
        disable.snz_update_main_school_id = true;
        disable.snz_endreason = false;
        disable.snz_endreason2 = false;
      }

      row.disable = disable;
    },
    handleChangeUpdateStatus(currentValue, obj, row) {
      if (currentValue === Contact.SNZ_UPDATE_PENDING) {
        this.disableBusiness(row);
        this.disableCourse(row);
        this.disableSubjectSet(row);
        this.disableMainSchool(row);
        this.disableEndReason(row);
        this.disableEndReason2(row);
      } else if (currentValue === Contact.SNZ_UPDATE_ACCEPT) {
        row.snz_update_businessunit_id =
          row.defaultValue.snz_update_businessunit_id;
        this.handleChangeBusinessUnit(
          _,
          { id: row.snz_update_businessunit_id },
          row
        );
        this.enableBusiness(row);
        this.enableCourse(row);
        this.enableSubjectSet(row);
        this.enableMainSchool(row);
        this.disableEndReason(row);
        this.disableEndReason2(row);
      } else {
        this.disableBusiness(row);
        this.disableCourse(row);
        this.disableSubjectSet(row);
        this.disableMainSchool(row);
        this.enableEndReason(row);
        this.enableEndReason2(row);
      }
    },
    async handleChangeBusinessUnit(currentValue, obj, row) {
      const businessId = obj !== null ? obj.id : null;
      const schoolYear = this.schoolYearProp
        ? parseInt(this.schoolYearProp)
        : moment().year;
      const gradeId = row.snz_update_grade_id;

      const resCourse = await this.fetchCourseByCondition(
        businessId,
        schoolYear,
        gradeId
      );
      row.option_course_of_student = resCourse;
      if (row.option_course_of_student.length === 1) {
        row.snz_update_course_id = row.option_course_of_student[0].id;
      } else {
        row.snz_update_course_id = null;
      }
      this.handleChangeCourse(_, { id: row.snz_update_course_id }, row);
      row.option_subject_set_of_student = null;
      row.snz_update_subject_set_id = null;
    },

    async handleChangeCourse(currentValue, obj, row) {
      const courseId = obj !== null ? obj.id : null;
      const businessId = row.snz_update_businessunit_id;
      const schoolYear = this.schoolYearProp
        ? parseInt(this.schoolYearProp)
        : moment().year;
      const gradeId = row.snz_update_grade_id;

      const resSubjectSet = await this.fetchSubjectSetByCondition(
        gradeId,
        courseId,
        businessId,
        schoolYear
      );
      row.snz_update_subject_set_id = null;
      row.option_subject_set_of_student = resSubjectSet;
    },
  },
};
