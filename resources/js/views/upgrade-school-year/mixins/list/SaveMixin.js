import { Message } from 'element-ui';

import UpgradeSchoolYearRequest from '@/api/UpgradeSchoolYearRequest';
const upgradeSchoolYearRequest = new UpgradeSchoolYearRequest();

export const SaveMixin = {
  data() {
    return {
      saveLoading: false,
      multipleSelection: [],
    };
  },
  methods: {
    async saveTable() {
      this.saveLoading = true;
      const dataSelected = this.multipleSelection;
      if (dataSelected.length > 0) {
        const payload = this.tableForm.list.map(row => {
          const exist = _.find(dataSelected, item => {
            return item.id === row.id;
          });
          if (!exist) {
            return null;
          }
          return {
            index: row.index,
            id: row.id,
            student_code: row.snz_studentcode,
            school_year: this.schoolYearProp,
            contract_info_next_year_id: row.contract_info_next_year_id,
            name: row.contact.student.fullname,
            update_status: row.snz_update,
            update_grade_id: row.snz_update_grade_id,
            update_business_unit_id: row.snz_update_businessunit_id,
            update_course_id: row.snz_update_course_id,
            update_subject_set_id: row.snz_update_subject_set_id,
            update_main_school_id: row.snz_update_main_school_id,
            end_reason: row.snz_endreason,
            end_reason_2: row.snz_endreason2,
          };
        });
        await upgradeSchoolYearRequest
          .store({ payload })
          .then(res => {
            Message({
              message: res.original.message,
              type: 'success',
              duration: 1500,
            });
            this.getList(this.paramsSearch);
          })
          .catch(err => {
            if (err.response.status === 422) {
              this.errors = err.response.data.errors;
            } else {
              Message({
                message: `${err.response.data.message}`,
                type: 'error',
                duration: 1500,
              });
            }
            // eslint-disable-next-line no-throw-literal
            throw 'Cancel Redirect';
          })
          .finally(() => {
            this.listLoading = false;
            this.saveLoading = false;
          });
      } else {
        Message({
          message: `保存するレコードがありません。`,
          type: 'error',
          duration: 1500,
        });
        this.listLoading = false;
        this.saveLoading = false;
        // eslint-disable-next-line no-throw-literal
        throw 'Cancel Redirect';
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
