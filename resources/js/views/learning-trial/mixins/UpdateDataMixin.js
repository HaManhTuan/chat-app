// import { SelectBoxMixin } from './SelectBoxMixin';
import { Message } from 'element-ui';
import { GetListMixin } from './GetListMixin';

import LearningTrialRequest from '@/api/LearningTrialRequest';
const learningTrialRequest = new LearningTrialRequest();

export const UpdateDataMixin = {
  mixins: [GetListMixin],
  methods: {
    async updateData(updateData, batchSubmit = true) {
      this.errors = [];
      this.listLoading = true;
      const formData = [];
      const registerStatus = this.registerStatusProp;
      const schoolYear = this.schoolYearProp;
      updateData.forEach(function(data) {
        formData[data.index] = {
          register_status: registerStatus,
          contract_id: data.id,
          grade_id: data.grade_id,
          student_code: data.contact.snz_studentcode,
          student_status: data.contact.snz_studentstatus,
          course_id: data.course_id,
          application_date: data.snz_applicationdate,
          month_start: data.snz_experiencestartmonth_period_id,
          month_end: data.snz_experienceendmonth_period_id,
          app_state_id: data.snz_selectionappstate,
          selection_result_id: data.snz_selectionresult,
          enter_month_id: data.snz_entermonth_period_id,
          subject_set_id: data.subject_set_id,
          discount_1_id: data.discount_1_id,
          discount_2_id: data.discount_2_id,
          discount_3_id: data.discount_3_id,
          discount_4_id: data.discount_4_id,
          discount_5_id: data.discount_5_id,
          contract_info_discount_1_id: data.contract_info_discount_1_id,
          contract_info_discount_2_id: data.contract_info_discount_2_id,
          contract_info_discount_3_id: data.contract_info_discount_3_id,
          contract_info_discount_4_id: data.contract_info_discount_4_id,
          contract_info_discount_5_id: data.contract_info_discount_5_id,
          business_id: data.business_id,
          school_year: schoolYear,
          index: data.index,
        };
      });

      await learningTrialRequest
        .createOrUpdate({ form: formData })
        .then(res => {
          if (!batchSubmit) {
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
              }
            } else {
              Message({
                message: '変更しました。',
                type: 'success',
                duration: 1500,
              });
            }
          } else {
            Message({
              message: '変更しました。',
              type: 'success',
              duration: 1500,
            });
          }
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
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
  },
};
