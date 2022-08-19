import StudentStatus from '@/const/StudentStatus';

export const SelectBoxMixin = {
  data() {
    return {
      selectBox: {
        course: [],
        application_date: [],
        experience_start_month: [],
        experience_end_month: [],
        enter_month: [],
        selection_app_state: StudentStatus.OPTION_SNZ_SELECTIONAPPSTATE,
        selection_result: StudentStatus.OPTION_SNZ_SELECTIONRESULT,
        subject_set: [],
        discount_1: [],
        targetPeriod: [],
        grade: [],
      },
    };
  },
};
