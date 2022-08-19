import { isArrayEqual } from '@/helpers/mixins/Compare';

export const BeforeLeave = {
  methods: {
    beforeRouteLeave(to, from, next) {
      if (isArrayEqual(this.tableForm.list, this.originModel)) {
        return next();
      }
      this.$confirm(
        'このページを終了する前に、変更を保存しますか',
        '保存されていない変更',
        {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }
      )
        .then(async() => {
          await this.saveTable();
          next();
        })
        .catch(action => {
          if (action === 'cancel') {
            next();
          } else {
            next(false);
          }
        });
    },
  },
};
