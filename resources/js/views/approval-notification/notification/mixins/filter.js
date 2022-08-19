import { Category } from '@/const/ApprovalNotification/Category';
import { Status } from '@/const/ApprovalNotification/Status';
import { TransferProcessingResult } from '@/const/ApprovalNotification/TransferProcessingResult';

export const filter = {
  filters: {
    filterCategory: value => {
      if (value && value !== 'ー') {
        const obj = _.find(Category, o => {
          return o.value === value;
        });
        return obj.label;
      }
    },
    filterStatus: value => {
      if (value && value !== 'ー') {
        const obj = _.find(Status, o => {
          return o.value === value;
        });
        return obj.label;
      }
    },
    filterTransferProcessingResult: value => {
      if (value !== null && value !== 'ー') {
        const obj = _.find(TransferProcessingResult, o => {
          return o.value === value;
        });
        return obj.label;
      }
    },
    filterBlank: value => {
      return value || 'ー';
    },
    formatDate: value => {
      if (value !== null && value !== 'ー') {
        return moment(value).format('yyyy/MM/DD');
      }
    },
  },
};
