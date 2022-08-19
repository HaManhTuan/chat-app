import { Message } from 'element-ui';

import RegisterTrialRequest from '@/api/RegisterTrialRequest';
import { GetListMixin } from './GetListMixin';

const registerTrialRequest = new RegisterTrialRequest();

export const UpdateDataMixin = {
  mixins: [GetListMixin],
  methods: {
    formatData(data) {
      return {
        contract_id: data.id,
        student_name: data.student.fullname,
        grade_id: data.grade_id,
        student_code: data.snz_studentcode,
        student_status: data.snz_studentstatus,
        course_id: data.course_id,
        school_year: data.school_year,
        application_date: data.snz_applicationdate,
        month_start: data.month_start_id,
        month_end: data.month_end_id,
        fee: data.fee,
        subject_set_id: data.subject_set_id,
        discount_1_id: data.discount_1_id,
        contract_info_discount_1_id: data.contract_info_discount_1_id,
        discount_2_id: data.discount_2_id,
        contract_info_discount_2_id: data.contract_info_discount_2_id,
        discount_3_id: data.discount_3_id,
        contract_info_discount_3_id: data.contract_info_discount_3_id,
        discount_4_id: data.discount_4_id,
        contract_info_discount_4_id: data.contract_info_discount_4_id,
        discount_5_id: data.discount_5_id,
        contract_info_discount_5_id: data.contract_info_discount_5_id,
        business_id: data.business_unit.id,
        register_status: this.registerStatusProp ? 1 : 0,
        index: data.index,
      };
    },
    async updateData(data, batchSubmit = true) {
      this.listLoading = true;
      this.errors = [];
      const payload = data.map(data => {
        return this.formatData(data);
      });
      const formData = [];
      payload.forEach(function(data) {
        formData[data.index] = data;
      });
      await registerTrialRequest
        .createOrUpdate({ form: formData })
        .then(res => {
          if (batchSubmit) {
            Message({
              message: '変更しました。',
              type: 'success',
              duration: 1500,
            });
            // if (this.registerStatusProp === 0) {
            //   this.updateArrayData(data.id, res.item);
            // }
            this.getList(this.paramsSearch);
          } else {
            if (typeof res.subject_set !== 'undefined') {
              if (
                res.subject_set.snz_update_subject_flag === 1 ||
                res.subject_set.anomalous_change_flag === 1
              ) {
                this.$router.push({
                  name: 'cantractinfo-detail',
                  params: { id: res.id, redirect: true },
                });
              } else {
                Message({
                  message: '変更しました。',
                  type: 'success',
                  duration: 1500,
                });
                this.getList(this.paramsSearch);
              }
            } else {
              Message({
                message: '変更しました。',
                type: 'success',
                duration: 1500,
              });
              this.getList(this.paramsSearch);
            }
          }
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
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
  },
};
