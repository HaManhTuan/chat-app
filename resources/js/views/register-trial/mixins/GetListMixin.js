import RegisterTrialRequest from '@/api/RegisterTrialRequest';

const registerTrialRequest = new RegisterTrialRequest();

export const GetListMixin = {
  methods: {
    async getList(params) {
      this.listLoading = true;

      this.errors = [];

      const query = this.buildQuery(params);
      window.history.replaceState(null, null, `?${query}`);

      if (params.page) {
        this.listQuery.page = params.page;
      }
      const res = await registerTrialRequest.list({
        ...this.listQuery,
        ...params,
      });
      if (typeof res.data === 'undefined') {
        return [];
      }

      const list = res.data;
      let i = 0;
      list.map(item => {
        this.handleDataRow(item, params);
        this.$set(item, 'index', i);
        this.initDefaultValue(item);
        i++;
      });

      this.tableForm.list = list;
      this.total = res.total;
      this.listQuery.last_page = res.last_page;
      this.listLoading = false;
      this.originModel = _.cloneDeep(list);
      this.$emit('setCurrentPageRecord', res.to - res.from + 1);
      this.fetchGrade();
      this.fetchTargetPeriod({ business_id: params.business_unit });
      this.scrollTopTable();
    },

    async handleDataRow(item, params) {
      item.grade_id = item.grade?.id || item.snz_grade_id;
      item.snz_studentstatus =
        item.snz_studentstatus || item.contact.snz_studentstatus;
      item.course_id = null || item.course?.id || item.course_id;
      item.school_year =
        item.school_year ||
        params.school_year.toString() ||
        moment().format('YYYY');
      if (item.snz_applicationdate) {
        item.snz_applicationdate = moment(item.snz_applicationdate).format();
      } else {
        this.$set(item, 'snz_applicationdate', moment().format());
      }
      item.month_start_id = item.snz_experiencestartmonth_period_id || null;
      item.month_end_id = item.snz_experienceendmonth_period_id || null;
      item.fee = item.snz_experiencefee || 0;
      item.subject_set_id = item.snz_subjectset_id || null;

      /* HANDLE DISCOUNT */
      if (item.discount_1_id) {
        item.discount_1_id = parseInt(item.discount_1_id) || null;
      } else {
        item.discount_1_id =
          item.discount_1_id ||
          (item.cantract_discount && item.cantract_discount.length)
            ? parseInt(item.cantract_discount[0].discount.id)
            : null;
        item.discount_1_name =
          item.cantract_discount && item.cantract_discount.length
            ? item.cantract_discount[0].discount.name
            : null;
      }

      if (item.discount_2_id) {
        item.discount_2_id = parseInt(item.discount_2_id) || null;
      } else {
        item.discount_2_id =
          item.cantract_discount && item.cantract_discount.length > 1
            ? parseInt(item.cantract_discount[1].discount.id)
            : null;
        item.discount_2_name =
          item.cantract_discount && item.cantract_discount.length > 1
            ? parseInt(item?.cantract_discount[1].discount.name)
            : null;
      }

      if (item.discount_3_id) {
        item.discount_3_id = parseInt(item.discount_3_id) || null;
      } else {
        item.discount_3_id =
          item.cantract_discount && item.cantract_discount.length > 1
            ? parseInt(item.cantract_discount[2].discount.id)
            : null;
        item.discount_3_name =
          item.cantract_discount && item.cantract_discount.length > 1
            ? parseInt(item?.cantract_discount[2].discount.name)
            : null;
      }

      if (item.discount_4_id) {
        item.discount_4_id = parseInt(item.discount_4_id) || null;
      } else {
        item.discount_4_id =
          item.cantract_discount && item.cantract_discount.length > 1
            ? parseInt(item.cantract_discount[3].discount.id)
            : null;
        item.discount_4_name =
          item.cantract_discount && item.cantract_discount.length > 1
            ? parseInt(item?.cantract_discount[3].discount.name)
            : null;
      }

      if (item.discount_5_id) {
        item.discount_5_id = parseInt(item.discount_5_id) || null;
      } else {
        item.discount_5_id =
          item.cantract_discount && item.cantract_discount.length > 1
            ? parseInt(item.cantract_discount[4].discount.id)
            : null;
        item.discount_5_name =
          item.cantract_discount && item.cantract_discount.length > 1
            ? parseInt(item?.cantract_discount[4].discount.name)
            : null;
      }

      if (!params.register_status) {
        item.discount_1_id = null;
        item.discount_2_id = null;
        item.discount_3_id = null;
        item.discount_4_id = null;
        item.discount_5_id = null;
      }
      if (params.register_status) {
        item.selectBox_subject_set = [item.subject_set];
      }

      /* ADD Default for discount option*/
      // if (item.discount_1_id && item.discount_1_name) {
      //   item.selectBox_discount_1 = addDefaultOption.addDefaultValue(
      //     [
      //       {
      //         id: item.discount_1_id,
      //         snz_name: item.discount_1_name,
      //       },
      //     ],
      //     Object.values(item.selectBox_discount_1)
      //   );
      // }
      // if (item.discount_2_id && item.discount_2_name) {
      //   item.selectBox_discount_2 = addDefaultOption.addDefaultValue(
      //     [
      //       {
      //         id: item.discount_2_id,
      //         snz_name: item.discount_2_name,
      //       },
      //     ],
      //     Object.values(item.selectBox_discount_2)
      //   );
      // }
    },
    initDefaultValue(row) {
      const defaultValue = {
        contact_next_year: row.contact_next_year,
        course_id: row.course_id,
        course_name: row.course_name,
        selectBox_subject_set: row.selectBox_subject_set,
        subject_set_id: row.subject_set_id,
      };
      row.defaultValue = _.cloneDeep(defaultValue);
    },
  },
};
