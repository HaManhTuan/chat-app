import ApprovalNotificationRequest from '@/api/ApprovalNotification/ApprovalNotificationRequest';
const approvalNotificationRequest = new ApprovalNotificationRequest();

// import { Category } from '@/const/ApprovalNotification/Category';

export const getList = {
  data() {
    return {
      listLoading: false,

      listQuery: {
        page: 1,
        limit: 20,
        last_page: 1,
      },

      total: 0,

      tableForm: {
        list: [],
      },
    };
  },
  methods: {
    async getList(params) {
      this.listLoading = true;

      const query = this.buildQuery(params || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);

      if (params.page) {
        this.listQuery.page = params.page;
      }

      const res = await approvalNotificationRequest.getRegister({
        ...this.listQuery,
        ...params,
      });
      this.tableForm.list = res.data;
      this.total = res.total;
      this.listQuery.last_page = res.last_page;
      this.listLoading = false;
    },
  },
};
