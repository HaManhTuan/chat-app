import { addDefaultOption } from '@/helpers/AddDefaultOption';

import LearningTrialRequest from '@/api/LearningTrialRequest';
import moment from 'moment';
const learningTrialRequest = new LearningTrialRequest();
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
      const res = await learningTrialRequest.list({
        ...this.listQuery,
        ...params,
      });
      const list = res.data;
      let i = 0;
      list.map(item => {
        this.initDefaultValue(item);

        if (params.register_status === 0) {
          item.snz_applicationdate = moment(item.snz_applicationdate)
            .utc()
            .utcOffset(9)
            .format();
        } else {
          item.snz_applicationdate = moment(item.snz_applicationdate)
            .utc()
            .utcOffset(9)
            .format();
        }
        item.discount_1_id = parseInt(item.discount_1_id) || item.discount_1_id;
        item.subject_set_id = item.snz_subjectset_id;
        if (params.register_status === 0) {
          item.discount_1_id = null;
          item.discount_2_id = null;
          item.discount_3_id = null;
          item.discount_4_id = null;
          item.discount_5_id = null;
          item.subject_set_id = null;
          item.course_name = null;
          item.course_id = null;
        }
        this.$set(item, 'index', i);
        this.initSelectBoxDisable(item);

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
        if (item.discount_4_id !== null && item.discount_4_name !== null) {
          item.selectBox_discount_4 = addDefaultOption.addDefaultValue(
            [
              {
                id: item.discount_4_id,
                snz_name: item.discount_4_name,
              },
            ],
            Object.values(item.selectBox_discount_4)
          );
        }
        if (item.discount_5_id !== null && item.discount_5_name !== null) {
          item.selectBox_discount_5 = addDefaultOption.addDefaultValue(
            [
              {
                id: item.discount_5_id,
                snz_name: item.discount_5_name,
              },
            ],
            Object.values(item.selectBox_discount_5)
          );
        }
        if (
          item.subjectset_can_regist !== undefined &&
          item.subjectset_can_regist.length > 0
        ) {
          item.course_name = item.subjectset_can_regist[0].snz_name;
          item.course_id = item.subjectset_can_regist[0].id;
        }
        i++;
      });
      this.tableForm.list = list;
      this.total = res.total;
      this.listQuery.last_page = res.last_page;
      this.listLoading = false;
      this.originModel = _.cloneDeep(list);
      this.$emit('setCurrentPageRecord', res.to - res.from + 1);
      this.fetchTargetPeriod({ business_id: params.business_unit });
      this.fetchGrade();
      this.scrollTopTable();
    },
    initDefaultValue(row) {
      const defaultValue = {
        // course_id: row.course_id,
        // course_name: row.course_name,
        course_id: this.courseSearchId,
        course_name: this.filterCourse()
          ? this.filterCourse()[0].snz_name
          : null,

        grade_id: row.grade_id,
        subject_set_id: row.subject_set_id,
        snz_selectionresult: row.snz_selectionresult,
        snz_applicationdate: row.snz_applicationdate,
        selectBox_subject_set: row.selectBox_subject_set,
      };
      row.defautValue = defaultValue;
    },
    filterCourse() {
      const courseId = this.courseSearchId;
      if (this.courseSearchSelectBox.length > 0 && this.courseSearchId) {
        const result = _.filter(this.courseSearchSelectBox, function(o) {
          return o.id === courseId;
        });
        return result;
      } else {
        return null;
      }
    },
  },
};
