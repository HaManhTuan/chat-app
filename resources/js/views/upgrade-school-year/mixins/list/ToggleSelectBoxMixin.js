export const ToggleSelectBoxMixin = {
  methods: {
    disableBusiness(row) {
      row.disable.snz_update_businessunit_id = true;
      row.snz_update_businessunit_id = null;
    },
    enableBusiness(row) {
      row.disable.snz_update_businessunit_id = false;
      // row.snz_update_businessunit_id =
      //   row.defaultValue.snz_update_businessunit_id;
    },
    disableCourse(row) {
      row.disable.snz_update_course_id = true;
      row.snz_update_course_id = null;
    },
    enableCourse(row) {
      row.disable.snz_update_course_id = false;
      // row.snz_update_course_id = row.defaultValue.snz_update_course_id;
    },
    disableSubjectSet(row) {
      row.disable.snz_update_subject_set_id = true;
      row.snz_update_subject_set_id = null;
    },
    enableSubjectSet(row) {
      row.disable.snz_update_subject_set_id = false;
      // row.snz_update_subject_set_id =
      //   row.defaultValue.snz_update_subject_set_id;
    },
    disableMainSchool(row) {
      row.disable.snz_update_main_school_id = true;
      row.snz_update_main_school_id = null;
    },
    enableMainSchool(row) {
      row.disable.snz_update_main_school_id = false;
      // row.snz_update_main_school_id =
      //   row.defaultValue.snz_update_main_school_id;
    },
    disableEndReason(row) {
      row.disable.snz_endreason = true;
      row.snz_endreason = null;
    },
    enableEndReason(row) {
      row.disable.snz_endreason = false;
      // row.snz_endreason =
      //   row.defaultValue.snz_endreason;
    },
    disableEndReason2(row) {
      row.disable.snz_endreason2 = true;
      row.snz_endreason2 = null;
    },
    enableEndReason2(row) {
      row.disable.snz_endreason2 = false;
      // row.snz_endreason =
      //   row.defaultValue.snz_endreason;
    },
  },
};
