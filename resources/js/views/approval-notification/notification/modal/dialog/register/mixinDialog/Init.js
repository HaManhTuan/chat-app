import { Category } from '@/const/ApprovalNotification/Category';
import { TransferProcessingResult } from '@/const/ApprovalNotification/TransferProcessingResult';
import { Status } from '@/const/ApprovalNotification/Status';

import ApprovalNotificationRequest from '@/api/ApprovalNotification/ApprovalNotificationRequest';
const approvalNotificationRequest = new ApprovalNotificationRequest();

export const Init = {
  data() {
    return {
      loading: false,
      form: null,
    };
  },
  methods: {
    async init() {
      this.loading = true;
      const res = await approvalNotificationRequest.getDetail({
        id: this.id,
      });
      this.form = res;
      this.defaultForm();
      this.loading = false;
    },
    defaultForm() {
      if (
        this.form.snz_application_category !==
        Category.SUBJECT_IRREGULARITIES.value
      ) {
        this.form.course = {};
        this.form.scheduled_end_month = {};
        this.form.snz_application_reason = null;
      }
      if (
        this.form.snz_application_category !==
        Category.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL.value
      ) {
        this.form.request_to_business = {};
        this.form.transfer_processing_result = null;
      }
      if (!this.form.scheduled_end_month) {
        this.form.scheduled_end_month = {};
      }
      this.form.snz_approve_status_text = this.filterStatus(
        this.form.snz_approve_status
      );
      this.form.transfer_processing_result_text = this.filterTransferProcessingResult(
        this.form.transfer_processing_result
      );
    },
    filterStatus(value) {
      if (value !== null && value !== 'ー') {
        const obj = _.find(Status, o => {
          return o.value === value;
        });
        return obj.label;
      }
    },
    filterTransferProcessingResult(value) {
      if (value !== null && value !== 'ー') {
        const obj = _.find(TransferProcessingResult, o => {
          return o.value === value;
        });
        return obj.label;
      }
    },
  },
};
