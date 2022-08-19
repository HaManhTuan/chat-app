import ApprovalAcceptedResource from '@/api/ApprovalNotification/ApprovalAccepted';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
const approvalAccepted = new ApprovalAcceptedResource();
const targetPeriodRequest = new TargetPeriodRequest();

export const checkExistApproval = {
  methods: {
    async showAbsent() {
      this.$refs.approveDetail.loadingOpenAbsent = true;
      const statusCanShow = [125950002, 125950006];
      const statusStudent = this.dataCurrentRow.contact.snz_studentstatus ?? null;
      if (statusStudent && statusCanShow.includes(this.statusStudent)) {
        const patterId = this.dataCurrentRow?.request_to_business?.snz_calendar_pattern_id || null;
        this.defaultTargetPeriod = await targetPeriodRequest.getOption({ snz_calendar_pattern_id: patterId });
        await approvalAccepted.checkExistApproval({
          id_approval_notification: this.dataCurrentRow.id, type: null, snz_studentcode: this.dataCurrentRow.snz_student_code }).then(res => {
          if (res) {
            this.originFormStartAbsent = {
              id_approval_notification: this.dataCurrentRow.id ?? null,
              created_at: this.dataCurrentRow.created_at ?? null,
              snz_startmonth_period_id: undefined,
              patternId:
                this.dataCurrentRow.request_to_business?.snz_calendar_pattern_id ||
                null,
              snz_request_from_businessunit_id:
                this.dataCurrentRow.request_from_business?.name || null,
              snz_request_to_businessunit_id:
                this.dataCurrentRow.request_to_business?.name || null,
              snz_absentreasonoption: null,
              snz_grade_id: this.dataCurrentRow.grade?.snz_name || null,
              snz_absentreasonother: null,
              snz_studentcode: this.dataCurrentRow.snz_student_code || null,
              fullname: this.dataCurrentRow.student?.fullname || null,
            };
            // this.showDialog = false;
            this.dialogFormStartAbsentVisible = true;
            this.$nextTick(() => {
              this.$refs['startAbsent'].$refs.formStartAbsent.clearValidate();
            });
          }
        }).catch(e => {
          const responseCode = e.response.status;
          if (responseCode === 424) {
            this.$message({
              type: 'error',
              message: e.response.data.original.message,
            });
          }
        }).finally(() => {
          // this.showDialog = false;
          // this.listLoading = false;
          // this.getList();
          this.$refs.approveDetail.loadingOpenAbsent = false;
        });
      } else {
        await approvalAccepted.reject(this.dataCurrentRow.id).then(() => {
          this.$message({
            type: 'error',
            message: 'この承認依頼は処理済みです。',
          });
        }).catch(res => {
          this.$message({
            type: 'error',
            message: res.response.data.original.message,
          });
        }).finally(() => {
          // this.showDialog = false;
          // this.listLoading = false;
          // this.getList();
          this.$refs.approveDetail.loadingOpenAbsent = false;
        });
      }
    },
    async showWithDrawal() {
      this.$refs.approveDetail.loadingOpenWithdrawal = true;
      const statusCanShow = [125950002, 125950006];
      const statusStudent = this.dataCurrentRow.contact.snz_studentstatus ?? null;
      if (statusStudent && statusCanShow.includes(this.statusStudent)) {
        const patterId = this.dataCurrentRow?.request_to_business?.snz_calendar_pattern_id || null;
        this.defaultTargetPeriod = await targetPeriodRequest.getOption({ snz_calendar_pattern_id: patterId });
        await approvalAccepted.checkExistApproval({
          id_approval_notification: this.dataCurrentRow.id, type: 1, snz_studentcode: this.dataCurrentRow.snz_student_code }).then(res => {
          if (res) {
            this.originFormWithDrawRegister = {
              id_approval_notification: this.dataCurrentRow.id ?? null,
              created_at: this.dataCurrentRow.created_at ?? null,
              snz_request_from_businessunit_id:
                this.dataCurrentRow.request_from_business?.name || null,
              snz_request_to_businessunit_id:
                this.dataCurrentRow.request_to_business?.name || null,
              snz_grade_id: this.dataCurrentRow.grade?.snz_name || null,
              snz_studentcode: this.dataCurrentRow.snz_student_code || null,
              fullname: this.dataCurrentRow.student?.fullname || null,
              snz_withdrawalmonth_period_id: undefined,
              patternId:
                this.dataCurrentRow.request_to_business?.snz_calendar_pattern_id ||
                null,
              snz_withdrawalreasonoption: null,
              snz_withdrawalreason: null,
            };
            // this.showDialog = false;
            this.dialogFormWithDrawalVisible = true;
            this.$nextTick(() => {
              this.$refs['withdrawal'].$refs.formWithDraw.clearValidate();
            });
          }
        }).catch(e => {
          const responseCode = e.response.status;
          if (responseCode === 424) {
            this.$message({
              type: 'error',
              message: e.response.data.original.message,
            });
          }
        }).finally(() => {
          // this.showDialog = false;
          // this.listLoading = false;
          // this.getList();
          this.$refs.approveDetail.loadingOpenWithdrawal = false;
        });
      } else {
        await approvalAccepted.reject(this.dataCurrentRow.id).then(() => {
          this.$message({
            type: 'error',
            message: 'この承認依頼は処理済みです。',
          });
        }).catch(res => {
          this.$message({
            type: 'error',
            message: res.response.data.original.message,
          });
        }).finally(() => {
          // this.showDialog = false;
          // this.listLoading = false;
          // this.getList();
          this.$refs.approveDetail.loadingOpenWithdrawal = false;
        });
      }
    },
  },
};
