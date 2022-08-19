import { SelectBoxMixin } from './SelectBoxMixin';

import CourseRequest from '@/api/CourseRequest';
import DiscountRequest from '@/api/DiscountRequest';
import StudentStatus from '@/const/StudentStatus';
import { ID_DISCOUNT_FREE } from '@/const/Discount';

const courseRequest = new CourseRequest();
const discountRequest = new DiscountRequest();

export const HandleChangeMixin = {
  data() {
    return {};
  },
  mixins: [SelectBoxMixin],
  methods: {
    initSelectBoxDisable(row) {
      const selectBoxDisable = {
        snz_applicationdate: false,
        selection_result: true,
        enter_month: true,
        subject_set: true,
        discount_1: true,
        discount_2: true,
        discount_3: true,
        discount_4: true,
        discount_5: true,
        course_id: true,
        grade_id: true,
        month_start: true,
        month_end: true,
        snz_selectionappstate: false,
      };
      if (
        row.snz_selectionappstate ===
        StudentStatus.SNZ_SELECSIONAPPSTATE_SUBMITTED
      ) {
        selectBoxDisable.selection_result = false;
        if (
          row.snz_selectionresult === StudentStatus.SNZ_SELECTIONRESULT_PASS
        ) {
          selectBoxDisable.enter_month = false;
          selectBoxDisable.subject_set = false;
          selectBoxDisable.discount_1 = false;
          selectBoxDisable.discount_2 = false;
          selectBoxDisable.discount_3 = false;
          selectBoxDisable.discount_4 = false;
          selectBoxDisable.discount_5 = false;
          selectBoxDisable.course_id = false;
          selectBoxDisable.grade_id = false;
          selectBoxDisable.snz_selectionappstate = true;
          selectBoxDisable.selection_result = true;
          selectBoxDisable.snz_applicationdate = true;
        }
      }
      row.selectBoxDisable = selectBoxDisable;
    },
    async handleChangeGrade(index, row) {
      const courseData = await courseRequest.fetchCourseAnnualAndShortTerm({
        business_id: row.business_id,
        grade_id: row.grade_id,
        school_year: row.snz_schoolyear,
        display_screen: 'learning-trial',
      });
      row.selectBox_course = courseData;
      row.subject_set_id = null;
      row.selectBox_subject_set = [];
      const k = _.filter(courseData, item => {
        return item.id === row.defautValue.course_id;
      });
      if (!k.length) {
        row.course_id = null;
        row.course_name = '';
        row.selectBox_subject_set = [];
        row.subject_set_id = null;
      } else {
        row.course_id = row.defautValue.course_id;
        row.course_name = row.defautValue.course_name;
        // row.selectBox_subject_set = row.defautValue.selectBox_subject_set;
        // row.subject_set_id = row.defautValue.subject_set_id;
        this.handleChangeCourse(index, row);
      }

      /* HANDLE DISCOUNT */
      if (row.discount_1_id !== ID_DISCOUNT_FREE) {
        row.discount_1_id = null;
      }
      if (row.discount_2_id !== ID_DISCOUNT_FREE) {
        row.discount_2_id = null;
      }
      if (row.discount_3_id !== ID_DISCOUNT_FREE) {
        row.discount_3_id = null;
      }
      if (row.discount_4_id !== ID_DISCOUNT_FREE) {
        row.discount_4_id = null;
      }
      if (row.discount_5_id !== ID_DISCOUNT_FREE) {
        row.discount_5_id = null;
      }
      const discountData = await discountRequest.getByStudentCodeAndGradeIdAndSchoolYear(
        {
          student_code: row.snz_studentcode,
          grade_id: row.grade_id,
          school_year: row.snz_schoolyear,
        }
      );
      row.selectBox_discount_1 = discountData;
      row.selectBox_discount_2 = discountData;
      row.selectBox_discount_3 = discountData;
      row.selectBox_discount_4 = discountData;
      row.selectBox_discount_5 = discountData;
    },

    handleChangeApplicationState(index, row) {
      // Chưa Nộp
      if (
        row.snz_selectionappstate ===
        StudentStatus.SNZ_SELECSIONAPPSTATE_NOT_DECIDED
      ) {
        // row.snz_selectionresult = row.defautValue.snz_selectionresult;
        row.snz_selectionresult = StudentStatus.SNZ_SELECTIONRESULT_NOT_TEST;
        row.selectBoxDisable.selection_result = true;
        this.handleChangeSelectionResult(index, row);
      }
      // Đã Nộp
      if (
        row.snz_selectionappstate ===
        StudentStatus.SNZ_SELECSIONAPPSTATE_SUBMITTED
      ) {
        row.selectBoxDisable.selection_result = false;
        this.selectBox.selection_result =
          StudentStatus.OPTION_SNZ_SELECTIONRESULT;
        this.handleChangeSelectionResult(index, row);
      }
      // Không Học
      if (
        row.snz_selectionappstate ===
        StudentStatus.SNZ_SELECSIONAPPSTATE_NOT_ENROLL
      ) {
        // row.snz_selectionresult = row.defautValue.snz_selectionresult;
        row.selectBoxDisable.selection_result = true;
        row.snz_selectionresult = StudentStatus.SNZ_SELECTIONRESULT_NOT_TEST;
        row.course_name = '';
        row.course_id = null;
        this.handleChangeSelectionResult(index, row);
      } else {
        row.course_name = row.defautValue.course_name;
        row.course_id = row.defautValue.course_id;
      }
    },

    handleChangeSelectionResult(index, row) {
      // Chưa Thi
      if (
        row.snz_selectionresult === StudentStatus.SNZ_SELECTIONRESULT_NOT_TEST
      ) {
        this.setDisable7Columns(index, row);
      }
      // Đỗ
      if (row.snz_selectionresult === StudentStatus.SNZ_SELECTIONRESULT_PASS) {
        row.selectBoxDisable.enter_month = false;
        row.selectBoxDisable.subject_set = false;
        row.selectBoxDisable.discount_1 = false;
        row.selectBoxDisable.discount_2 = false;
        row.selectBoxDisable.discount_3 = false;
        row.selectBoxDisable.discount_4 = false;
        row.selectBoxDisable.discount_5 = false;
        if (row.have_free_discount === true) {
          row.discount_1_id = ID_DISCOUNT_FREE;
        }
        row.selectBoxDisable.course_id = false;
        row.selectBoxDisable.grade_id = false;
      }
      // Trượt
      if (
        row.snz_selectionresult === StudentStatus.SNZ_SELECTIONRESULT_NOT_PASS
      ) {
        this.setDisable7Columns(index, row);
      }
      if (row.snz_selectionresult !== StudentStatus.SNZ_SELECTIONRESULT_PASS) {
        row.snz_applicationdate = row.defautValue.snz_applicationdate;
      }
    },

    setDisable7Columns(index, row) {
      // Disable other column ignore app_state and selection_result
      row.snz_entermonth_period_id = null;
      row.selectBoxDisable.enter_month = true;

      row.subject_set_id = null;
      row.selectBoxDisable.subject_set = true;

      row.discount_1_id = null;
      row.selectBoxDisable.discount_1 = true;
      row.discount_2_id = null;
      row.selectBoxDisable.discount_2 = true;
      row.discount_3_id = null;
      row.selectBoxDisable.discount_3 = true;
      row.discount_4_id = null;
      row.selectBoxDisable.discount_4 = true;
      row.discount_5_id = null;
      row.selectBoxDisable.discount_5 = true;

      row.course.id = row.defautValue.course_id
        ? row.defautValue.course_id
        : null;
      row.selectBoxDisable.course_id = true;

      row.grade_id = row.defautValue.grade_id ? row.defautValue.grade_id : null;
      row.selectBoxDisable.grade_id = true;
    },

    async handleChangeCourse(index, row) {
      if (row.course_id) {
        row.subject_set_id = null;
        row.selectBox_subject_set = await this.fetchSubjectSetByCourseAndGradeAndBusiness(
          row.grade_id,
          this.schoolYearProp,
          row.course.id,
          row.business_id
        );
      }
    },
  },
};
