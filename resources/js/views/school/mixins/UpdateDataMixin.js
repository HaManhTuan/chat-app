import { Message } from 'element-ui';

import RegisterSchool from '@/api/RegisterSchool';
import { GetListMixin } from './GetListMixin';

const registerRequest = new RegisterSchool();

export const UpdateDataMixin = {
  mixins: [GetListMixin],
  methods: {
    formatData(data) {
      return {
        register_status: this.registerStatusProp,
        contract_id: data.contract_id,
        student_name: data.student.fullname,
        grade_id: data.grade_id,
        student_code: data.snz_studentcode,
        student_status: data.snz_studentstatus,
        course_id: data.course_id,
        school_year: data.school_year,
        application_date: data.snz_applicationdate,
        subject_set_id: data.subject_set_id,
        discount_1_id: data.discount_1_id,
        discount_2_id: data.discount_2_id,
        discount_3_id: data.discount_3_id,
        contract_info_discount_1_id: data.contract_info_discount_1_id,
        contract_info_discount_2_id: data.contract_info_discount_2_id,
        business_id: data.business_unit.id,
        snz_entermonth_period_id: data.snz_entermonth_period_id,
        index: data.index,
      };
    },
    async updateData(data) {
      this.listLoading = true;
      this.errors = [];
      const payload = data.map(data => {
        return this.formatData(data);
      });
      const formData = [];
      payload.forEach(function(data) {
        formData[data.index] = data;
      });
      await registerRequest
        .createOrUpdate({ form: formData })
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
          throw 'cancel redirect';
        }).finally(() => {
          this.listLoading = false;
        });
    },
    updateArrayData(id, item = null) {
      const index = this.tableForm.list.findIndex(item => {
        return id === item.id;
      });
      if (item) {
        this.tableForm.list.splice(index, 1, item);
      } else {
        this.tableForm.list.splice(index, 1);
      }
      const index2 = this.dataWaitingUpdate.findIndex(item => {
        return id === item.id;
      });
      this.dataWaitingUpdate.splice(index2, 1);
    },
  },
};
