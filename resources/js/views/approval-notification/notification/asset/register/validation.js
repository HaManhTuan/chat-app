export const validation = {
  data() {
    const beforeOrEqualEndDate = (rule, value, callback) => {
      if (value) {
        const startDate = moment(value);
        const endDate =
          this.searchForm.endApplyDate !== null
            ? moment(this.searchForm.endApplyDate)
            : null;
        if (endDate !== null) {
          if (startDate.isAfter(endDate)) {
            callback(
              new Error(
                '申請日の範囲に開始日は終了日の以前で、入力してください。'
              )
            );
          }
        }
      }
      callback();
    };
    const afterOrEqualStartDate = (rule, value, callback) => {
      if (value) {
        const endDate = moment(value);
        const startDate =
          this.searchForm.startApplyDate !== null
            ? moment(this.searchForm.startApplyDate)
            : null;
        if (endDate !== null) {
          if (startDate.isAfter(endDate)) {
            callback(
              new Error(
                '申請日の範囲に開始日は終了日の以前で、入力してください。'
              )
            );
          }
        }
      }
      callback();
    };
    return {
      rules: {
        startApplyDate: [
          {
            validator: beforeOrEqualEndDate,
            trigger: 'blur',
          },
        ],
        endApplyDate: [
          {
            validator: afterOrEqualStartDate,
            trigger: 'blur',
          },
        ],
      },
    };
  },
};
