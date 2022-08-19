import { ChangeMixin } from './ChangeMixin';
import { ToggleSelectBoxMixin } from './ToggleSelectBoxMixin';
import Contact from '@/const/Contact';
import UpgradeSchoolYearRequest from '@/api/UpgradeSchoolYearRequest';
const upgradeSchoolYearRequest = new UpgradeSchoolYearRequest();

export const GetListMixin = {
  data() {
    return {
      tableForm: {
        list: [],
      },
      originModel: {},
    };
  },
  mixins: [ChangeMixin, ToggleSelectBoxMixin],
  methods: {
    async getList(params) {
      this.listLoading = true;
      this.errors = [];

      const query = this.buildQuery(params);
      window.history.replaceState(null, null, `?${query}`);

      if (params.page) {
        this.listQuery.page = params.page;
      }
      const res = await upgradeSchoolYearRequest.list({
        ...this.listQuery,
        ...params,
      });
      this.tableForm.list = res.data;
      let i = 0;
      this.tableForm.list.map(item => {
        this.$set(item, 'index', i);
        this.initDefaultValue(item);
        this.initSelectBoxDisable(item);
        this.handleValue(item);
        i++;
      });
      this.total = res.total;
      this.$emit('setCurrentPageRecord', res.to - res.from + 1);
      this.listQuery.last_page = res.last_page;
      this.listLoading = false;
      this.originModel = _.cloneDeep(this.tableForm.list);
    },

    initDefaultValue(row) {
      const defaultValue = row;
      row.defaultValue = _.cloneDeep(defaultValue);
    },
    handleValue(row) {
      if (row.snz_update === Contact.SNZ_UPDATE_PENDING) {
        this.disableBusiness(row);
        this.disableCourse(row);
        this.disableSubjectSet(row);
        this.disableMainSchool(row);
        this.disableEndReason(row);
        this.disableEndReason2(row);
      } else if (row.snz_update === Contact.SNZ_UPDATE_ACCEPT) {
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

      if (row.snz_update_course_id === null) {
        row.option_subject_set_of_student = [];
      }

      if (
        row.update_subject_set &&
        row.update_subject_set.snz_schoolyear &&
        parseInt(row.update_subject_set.snz_schoolyear) !==
          parseInt(this.schoolYearProp)
      ) {
        row.snz_update_subject_set_id = null;
        row.snz_update_course_id = null;
      }
      this.unionOption(row);
    },
    unionOption(row) {
      if (
        row.add_option_course_of_student.length > 0 &&
        row.contract_info_next_year_id === null
      ) {
        const newOptionCourse = _.union(row.option_course_of_student, [
          {
            id: row.add_option_course_of_student.id,
            snz_name: row.add_option_course_of_student.snz_name,
          },
        ]);
        row.option_course_of_student = newOptionCourse;
      }

      if (
        row.add_option_subject_set_of_student.length > 0 &&
        row.contract_info_next_year_id === null
      ) {
        const newOptionSubjectSet = _.union(row.option_subject_set_of_student, [
          {
            id: row.add_option_subject_set_of_student.id,
            snz_display_name:
              row.add_option_subject_set_of_student.snz_display_name,
          },
        ]);
        row.option_subject_set_of_student = newOptionSubjectSet;
      }
    },
  },
};
