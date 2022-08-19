import moment from 'moment';

export const CreateFormDataMixin = {
  methods: {
    createBaseForm() {
      this.baseForm = {
        patternId: this.form.business_unit?.snz_calendar_pattern_id || null,
        snz_businessunit_id: this.form.business_unit?.name || null,
        snz_grade_name: this.form.grade?.snz_name || null,
        snz_studentcode: this.form?.snz_studentcode || null,
        fullname: this.form?.fullname || null,
        user_id: null,
        modified_by_user_id: null,
        created_at: null,
        updated_at: null,
        statusStudent: this.form.snz_studentstatus || null,
      };
      this.originFormRegister = { ...this.baseForm, ... this.originFormRegister };
      this.originFormStartAbsent = { ...this.baseForm, ... this.originFormStartAbsent };
      this.originFormEndAbsent = { ...this.baseForm, ... this.originFormEndAbsent };
    },
    resetOriginFormRegister() {
      this.originFormRegister = {
        patternId: this.form.business_unit?.snz_calendar_pattern_id || null,
        snz_businessunit_id: this.form.business_unit?.name || null,
        snz_grade_name: this.form.grade?.snz_name || null,
        snz_studentcode: this.form?.snz_studentcode || null,
        fullname: this.form?.fullname || null,
        user_id: null,
        modified_by_user_id: null,
        created_at: null,
        updated_at: null,
        snz_withdrawalmonth_period_id: '',
        snz_withdrawalreasonoption: '',
        snz_withdrawalreason: '',
        status: 1,
        statusStudent: this.form.snz_studentstatus || null,
      };
    },
    resetOriginFormStartAbsent() {
      this.originFormStartAbsent = {
        patternId: this.form.business_unit?.snz_calendar_pattern_id || null,
        snz_businessunit_id: this.form.business_unit?.name || null,
        snz_grade_name: this.form.grade?.snz_name || null,
        snz_studentcode: this.form?.snz_studentcode || null,
        fullname: this.form?.fullname || null,
        user_id: null,
        modified_by_user_id: null,
        created_at: null,
        updated_at: null,
        snz_startmonth_period_id: '',
        snz_absentreasonoption: '',
        snz_absentreasonother: '',
        status: 1,
        statusStudent: this.form.snz_studentstatus || null,
      };
    },
    resetOriginFormEndAbsent() {
      this.originFormEndAbsent = {
        patternId: this.form.business_unit?.snz_calendar_pattern_id || null,
        snz_businessunit_id: this.form.business_unit?.name || null,
        snz_grade_name: this.form.grade?.snz_name || null,
        snz_studentcode: this.form?.snz_studentcode || null,
        fullname: this.form?.fullname || null,
        modified_by_user_id: null,
        user_id: null,
        created_at: null,
        updated_at: null,
        snz_endmonth_period_id: '',
        snz_absentreasonoption: '',
        snz_absentreasonother: '',
        status: 1,
        statusStudent: this.form.snz_studentstatus || null,
      };
    },
    resetOriginFormEditAbsent() {
      this.originFormEditAbsent = {
        patternId: this.form.business_unit?.snz_calendar_pattern_id || null,
        snz_businessunit_id: this.form.business_unit?.name || null,
        snz_grade_name: this.form.grade?.snz_name || null,
        snz_studentcode: this.form?.snz_studentcode || null,
        fullname: this.form?.fullname || null,
        modified_by_user_id: null,
        user_id: null,
        created_at: moment().format('yyyy/MM/DD') || null,
        updated_at: moment().format('yyyy/MM/DD') || null,
        snz_startmonth_period_id: null,
        snz_endmonth_period_id: null,
        snz_absentreasonoption: '',
        snz_absentreasonother: '',
        status: 1,
        statusStudent: this.form.snz_studentstatus || null,
      };
    },
  },
};
