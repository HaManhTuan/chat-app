import { SelectBoxMixin } from './SelectBoxMixin';

import CourseRequest from '@/api/CourseRequest';
import DiscountRequest from '@/api/DiscountRequest';
import { ID_DISCOUNT_FREE } from '@/const/Discount';
// import BrotherInformationRequest from '@/api/BrotherInformationRequest';
// import AdmissionFeeRequest from '@/api/AdmissionFeeRequest';

const courseRequest = new CourseRequest();
const discountRequest = new DiscountRequest();
// const brotherInformationRequest = new BrotherInformationRequest();
// const admissionFeeRequest = new AdmissionFeeRequest();

export const HandleChangeMixin = {
  mixins: [SelectBoxMixin],
  methods: {
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    async handleChangeGrade(index, row) {
      const courseData = await courseRequest.fetchCondition({
        display_screen: this.displayScreen,
        grade_id: row.grade_id,
        business_id: row.business_unit.id,
        school_year: row.school_year,
      });
      row.selectBox_course = courseData;
      const k = _.filter(courseData, item => {
        return item.id === row.defaultValue.course_id;
      });
      if (!k.length) {
        row.course_id = null;
        row.course_name = '';
      } else {
        row.course_id = row.defaultValue.course_id;
        row.course_name = row.defaultValue.course_name;
      }
      let subjects = [];
      if (row.course_id) {
        subjects = await this.fetchSubjectSetByCourseAndGradeAndBusiness(
          row.grade_id,
          row.school_year,
          row.course_id,
          row.business_unit.id
        );
      }
      if (subjects.length) {
        row.subject_set_id = row.defaultValue.subject_set_id;
        row.selectBox_subject_set = subjects;
      } else {
        row.subject_set_id = null;
        row.selectBox_subject_set = [];
      }
      const discountData = await discountRequest.getByStudentCodeAndGradeIdAndSchoolYear(
        {
          student_code: row.snz_studentcode,
          grade_id: row.grade_id,
          school_year: row.school_year,
        }
      );
      if (row.discount_1_id !== ID_DISCOUNT_FREE) {
        row.discount_1_id = null;
      }
      row.selectBox_discount_1 = discountData;
      row.discount_2_id = null;
      row.selectBox_discount_2 = discountData;
    },

    async handleChangeCourse(index, row) {
      if (row.course_id) {
        row.subject_set_id = null;

        row.selectBox_subject_set = await this.fetchSubjectSetByCourseAndGradeAndBusiness(
          row.grade_id,
          row.school_year,
          row.course_id,
          row.business_unit.id
        );
      }
    },

    // async handleChangeSubjectSet(index, row) {
    //   this.setCurrent(row);
    // },

    // async checkBrother(internalCode) {
    //   const res = await brotherInformationRequest.getByRegisterInternalCode(
    //     undefined,
    //     internalCode
    //   );
    //   if (res.length > 0) {
    //     const resultPromise = res.map(async item => {
    //       const brotherInternalCode = item.snz_registered_internalcode;
    //       if (brotherInternalCode) {
    //         const resultFee = await this.checkFee(brotherInternalCode);
    //         return resultFee === true;
    //       }
    //     });
    //     const arrPromise = await Promise.all(resultPromise);
    //     return arrPromise.some(item => item === true);
    //   }
    //   return false;
    // },
    // async checkFee(brotherInternalCode) {
    //   const res = await admissionFeeRequest.getByInternalCode(
    //     undefined,
    //     brotherInternalCode
    //   );
    //   return res.length > 0;
    // },
  },
};
