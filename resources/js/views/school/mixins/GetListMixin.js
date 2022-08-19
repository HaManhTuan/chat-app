import { addDefaultOption } from '@/helpers/AddDefaultOption';

import RegisterSchool from '@/api/RegisterSchool';

const registerSchool = new RegisterSchool();

export const GetListMixin = {
  methods: {
    async getList(params) {
      this.listLoading = true;
      this.fetchGrade();
      this.errors = [];
      if (params.page) {
        this.listQuery.page = params.page;
      }
      const res = await registerSchool.list({
        ...this.listQuery,
        ...params,
      });
      if (typeof res.data === 'undefined') {
        return [];
      }

      const list = res.data;
      let i = 0;
      list.map(item => {
        // item.grade_id = item.contract_grade_id || item.grade.id;
        item.school_year = item.school_year || moment().format('YYYY');
        if (item.snz_applicationdate) {
          item.snz_applicationdate = moment(item.snz_applicationdate)
            .utc()
            .utcOffset(9)
            .format();
        } else {
          this.$set(
            item,
            'snz_applicationdate',
            moment()
              .utc()
              .utcOffset(9)
              .format()
          );
        }
        this.$set(item, 'index', i);
        item.discount_1_id = parseInt(item.discount_1_id) || item.discount_1_id;
        item.discount_2_id = parseInt(item.discount_2_id) || item.discount_2_id;
        item.discount_3_id = parseInt(item.discount_3_id) || item.discount_3_id;
        /* ADD Default for discount option*/
        if (item.discount_1_id !== null && item.discount_1_name !== null) {
          item.selectBox_discount_1 = addDefaultOption.addDefaultValue(
            [
              {
                id: item.discount_1_id,
                snz_name: item.discount_1_name,
              },
            ],
            Object.values(item.selectBox_discount_1)
          );
        }
        if (item.discount_2_id !== null && item.discount_2_name !== null) {
          item.selectBox_discount_2 = addDefaultOption.addDefaultValue(
            [
              {
                id: item.discount_2_id,
                snz_name: item.discount_2_name,
              },
            ],
            Object.values(item.selectBox_discount_2)
          );
        }
        if (item.discount_3_id !== null && item.discount_3_name !== null) {
          item.selectBox_discount_3 = addDefaultOption.addDefaultValue(
            [
              {
                id: item.discount_3_id,
                snz_name: item.discount_3_name,
              },
            ],
            Object.values(item.selectBox_discount_3)
          );
        }
        i++;
      });
      this.tableForm.list = list;
      this.total = res.total;
      this.listQuery.last_page = res.last_page;
      this.listLoading = false;
      this.originModel = JSON.parse(JSON.stringify(this.tableForm.list));
    },
  },
};
