<template>
  <div class="list-table">
    <el-form ref="tableForm">
      <el-table
        ref="table"
        v-loading="listLoading"
        class="list-table editable-table"
        :data="list"
        fit
        height="100%"
        highlight-current-row
        style="width: 100%"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :row-class-name="tableRowClassName"
        :empty-text="CommonTxt.tableEmptyTxt"
      >
        <el-table-column label="氏名" fixed min-width="116px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student.fullname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学年" width="91px">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.grade ? scope.row.grade.snz_name : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生徒コード" min-width="84px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_studentcode }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="110px">
          <template slot="header"> 生徒<br>ステータス </template>
          <template slot-scope="scope">
            <span>{{ scope.row.snz_studentstatus | studentStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="コース" min-width="66px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`${scope.$index}.course_id`"
              :show-message="true"
              :error="getError('course_id', scope.$index)"
            >
              <span
                :class="{
                  ellipsis: true,
                  'is-error': getError('course_id', scope.$index),
                }"
              >
                {{ scope.row.course ? scope.row.course.snz_name : '' }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="申込日" width="125px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_applicationdate`"
              :show-message="true"
              :error="getError('application_date', scope.$index)"
            >
              <el-date-picker
                v-model="scope.row.snz_applicationdate"
                prefix-icon="_calendar"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                placeholder=""
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :editable="false"
                popper-class="select-inside-table"
                :picker-options="pickerBeginDateBefore"
              />
              <span class="icon-input__calendar">
                <svg-icon
                  icon-class="_calendar_white"
                  style="font-size: 17px"
                />
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="科目セット" min-width="85px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`${scope.$index}.subject_set_id`"
              :show-message="true"
              :error="getError('subject_set_id', scope.$index)"
            >
              <TableSelectBox
                v-model="scope.row.snz_subjectset_id"
                key-id="id"
                key-name="snz_display_name"
                :auto-font="false"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :default-object="defaultSelection[scope.$index].subjects"
                :options="tableSelect[scope.$index].subjects"
                placeholder="ー"
                clearable
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="受講開始月" min-width="97px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.month_start_id`"
              :show-message="true"
              :error="getError('month_start', scope.$index)"
            >
              <el-select
                v-model="scope.row.snz_cantractstartmonth_period_id"
                popper-class="select-inside-table"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                filterable
                clearable
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder="ー"
              >
                <el-option
                  v-for="item in tableSelect[scope.$index].entermonthOptions"
                  :key="`month_start_${scope.$index}_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="割引1" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`${scope.$index}.discount_1_id`"
              :show-message="true"
              :error="getError('discount_1_id', scope.$index)"
            >
              <TableSelectBox
                v-model="scope.row.discount0"
                key-id="id"
                key-name="snz_name"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :default-object="defaultSelection[scope.$index].discount0"
                :options="tableSelect[scope.$index].discount0"
                placeholder="ー"
                clearable
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="割引2" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`${scope.$index}.discount_2_id`"
              :show-message="true"
              :error="getError('discount_2_id', scope.$index)"
            >
              <TableSelectBox
                v-model="scope.row.discount1"
                key-id="id"
                key-name="snz_name"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :default-object="defaultSelection[scope.$index].discount1"
                :options="tableSelect[scope.$index].discount1"
                placeholder="ー"
                clearable
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="割引3" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`${scope.$index}.discount_3_id`"
              :show-message="true"
              :error="getError('discount_3_id', scope.$index)"
            >
              <TableSelectBox
                v-model="scope.row.discount2"
                key-id="id"
                key-name="snz_name"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :default-object="defaultSelection[scope.$index].discount2"
                :options="tableSelect[scope.$index].discount2"
                placeholder="ー"
                clearable
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="割引4" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`${scope.$index}.discount_4_id`"
              :show-message="true"
              :error="getError('discount_4_id', scope.$index)"
            >
              <TableSelectBox
                v-model="scope.row.discount3"
                key-id="id"
                key-name="snz_name"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :default-object="defaultSelection[scope.$index].discount3"
                :options="tableSelect[scope.$index].discount2"
                placeholder="ー"
                clearable
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="割引5" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`${scope.$index}.discount_5_id`"
              :show-message="true"
              :error="getError('discount_5_id', scope.$index)"
            >
              <TableSelectBox
                v-model="scope.row.discount4"
                key-id="id"
                key-name="snz_name"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :default-object="defaultSelection[scope.$index].discount4"
                :options="tableSelect[scope.$index].discount2"
                placeholder="ー"
                clearable
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="校舎" min-width="112px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`${scope.$index}.business_id`"
              :show-message="true"
              :error="getError('business_id', scope.$index)"
            >
              <span
                :class="{
                  ellipsis: true,
                  'is-error': getError('business_id', scope.$index),
                }"
              >
                {{ scope.row.business_unit ? scope.row.business_unit.name : '' }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column
          label="保存"
          width="50px"
          class="text-center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-form-item class="flex justify-content-center align-item-center">
              <el-button
                class="btn__action btn-download"
                size="mini"
                :disabled="Boolean(
                  (registerStatusProp && (scope.row.snz_application_pending_flag || (scope.row.cantract_info && scope.row.cantract_info.snz_application_pending_flag))) ||
                    disableRole(['viewonly', 'callcenter']))"
                @click.prevent="saveData([scope.row])"
              >
                <svg-icon
                  icon-class="icon_download_002"
                  style="font-size: 15px"
                />
              </el-button>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="footer">
      <el-row class="footer__group">
        <el-col :span="6" />
        <el-col :span="12">
          <CustomPagination
            v-show="listQuery.last_page > 1"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination"
            @pagination="getList(searchForm)"
          />
        </el-col>
        <el-col :span="6">
          <!--          <div class="group-button">-->
          <!--            <ButtonExport-->
          <!--              :loading="exportLoading"-->
          <!--              type="excel"-->
          <!--              @export="handleExport"-->
          <!--            />-->
          <!--          </div>-->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
// import ButtonExport from '../../../components/Common/Button/ButtonExport';
import TableSelectBox from '../../../components/Common/TableSelectBox';
import SubjectSetRequest from '@/api/SubjectSetRequest';
import RegisterOther from '@/api/RegisterOther';
import { studentStatusLabel } from '@/filters/studentStatus';
import { isArrayEqual, diffArrayObject } from '@/helpers/mixins/Compare';
import CommonSettings from '@/const/CommonSettings';
import { DatePickerMixin } from '@/helpers/mixins/DatePickerMixin';

const registerOther = new RegisterOther();
const subjectSetRequest = new SubjectSetRequest();

export default {
  name: 'ListDatatable',
  components: { TableSelectBox, CustomPagination },
  filters: {
    studentStatus: studentStatusLabel,
  },
  mixins: [DatePickerMixin],
  props: {
    registerStatusProp: { type: Number, default: 0 },
  },
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      listLoading: false,
      saveLoading: false,
      exportLoading: false,
      listQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        last_page: 1,
      },
      list: [],
      total: 0,
      multipleSelection: [],
      attendances: [
        {
          value: 0,
          label: 'Ｘ',
        },
        {
          value: 1,
          label: '◯',
        },
      ],
      errors: [],
      tableSelect: [],
      defaultSelection: [],
      searchForm: null,
      originModel: {},
    };
  },
  watch: {
    'listQuery.page'(newVal) {
      this.$emit('setPage', newVal);
    },
  },
  created() {
  },
  methods: {
    handleEdit(row) {
      row.edit = true;
    },
    tableHeaderColor() {
      return 'background-color: #535353;color:#fff';
    },
    tableRowClassName({ row, rowIndex }) {
      if (!this.registerStatusProp){
        return 1;
      }
      if (row.snz_application_pending_flag || (row.cantract_info && row.cantract_info.snz_application_pending_flag) === 1){
        return 'disabled-row';
      } else {
        return '';
      }
    },
    async handleExport() {
      this.exportLoading = true;
      await registerOther
        .exportResource(this.searchForm)
        .then(data => {
          this.createDownloadXlsFile('その他_', data);
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
    requestOptions() {
      const data = this.list.map(row => {
        return {
          snz_calendar_pattern_id: row.business_unit.snz_calendar_pattern_id,
          business_id: row.businessunit_id,
          grade_id: row.snz_grade_id,
          snz_studentcode: row.snz_studentcode,
          snz_schoolyear: this.searchForm.school_year,
          snz_headdivision_code: row.business_unit.organization
            ? row.business_unit.organization.snz_headdivision_code
            : 0,
          snz_division_code: row.business_unit.organization
            ? row.business_unit.organization.snz_division_code
            : 0,
          snz_area_code: row.business_unit.organization
            ? row.business_unit.organization.snz_area_code
            : 0,
          snz_unit_code: row.business_unit.organization
            ? row.business_unit.organization.snz_unit_code
            : 0,
          course_id: row.snz_course_id,
        };
      });
      registerOther.getOptions(data, this.searchForm).then(res => {
        this.tableSelect = res.original;
      });
    },
    tableRowStyle() {},
    async getList(params, search = false) {
      this.searchForm = params;
      this.errors = [];
      if (!search){
        params.page = this.listQuery.page;
      }
      const query = this.buildQuery(params);
      window.history.replaceState(null, null, `?${query}`);
      if (search){
        this.listQuery.page = params.page;
      } else {
        params.page = this.listQuery.page;
      }
      this.listLoading = true;
      const res = await registerOther.list({
        ...this.listQuery,
        ...params,
      });
      const data = res.original;
      this.tableSelect = data.data.map(row => {
        return {
          courses: [],
          subjects: [row.subject_set],
          discount0: row.cantract_discount[0]
            ? [row.cantract_discount[0].discount]
            : [],
          discount1: row.cantract_discount[1]
            ? [row.cantract_discount[1].discount]
            : [],
          discount2: row.cantract_discount[2]
            ? [row.cantract_discount[2].discount]
            : [],
        };
      });
      this.defaultSelection = data.data.map(row => {
        return {
          subjects: row.subject_set,
          discount0: row.cantract_discount[0]
            ? row.cantract_discount[0].discount
            : null,
          discount1: row.cantract_discount[1]
            ? row.cantract_discount[1].discount
            : null,
          discount2: row.cantract_discount[2]
            ? row.cantract_discount[2].discount
            : null,
        };
      });
      data.data.forEach(function(row, index) {
        row.index = index;
        row.snz_applicationdate = moment(row.snz_applicationdate)
          .utc()
          .utcOffset(9)
          .format();
      });
      this.list = data.data;
      this.total = data.total;
      this.listQuery.last_page = data.last_page;
      if (this.$refs.table) {
        this.$refs.table.$refs.bodyWrapper.scrollTop = 0;
      }
      this.listLoading = false;
      this.originModel = JSON.parse(JSON.stringify(this.list));
      if (this.list.length) {
        this.requestOptions();
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.params.redirect || to.name === 'err_404') {
        return next();
      }
      if (isArrayEqual(this.list, this.originModel)) {
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
          const diff = diffArrayObject(this.list, this.originModel);
          await this.saveData(diff);
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
    async saveData(updateData) {
      this.saveLoading = true;
      this.listLoading = true;
      const registerStatusProp = this.registerStatusProp;
      const course = this.searchForm.course;
      const formData = [];
      updateData.forEach(function(row) {
        formData[row.index] = {
          contract_id: row.cantract_id,
          grade_id: row.snz_grade_id,
          student_code: row.snz_studentcode,
          student_status: row.snz_studentstatus,
          course_id: registerStatusProp ? row.snz_course_id : course,
          school_year: row.snz_schoolyear,
          application_date: row.snz_applicationdate,
          subject_set_id: row.snz_subjectset_id,
          discount_1_id: row.discount0,
          discount_2_id: row.discount1,
          discount_3_id: row.discount2,
          discount_4_id: row.discount3,
          discount_5_id: row.discount4,
          business_id: row.business_unit.id,
          snz_willtojoin: row.snz_willtojoin,
          month_start: row.snz_cantractstartmonth_period_id,
          register_status: registerStatusProp,
        };
      });
      let lastSubject = [];
      if (updateData.length === 1) {
        lastSubject = this.tableSelect[updateData[0].index].subjects;
        if (this.list[updateData[0].index].subject_set) {
          const subject = _.cloneDeep(
            this.list[updateData[0].index].subject_set
          );
          lastSubject.push(subject);
        }
      }
      await registerOther
        .storeOrUpdate({ form: formData }, this.searchForm)
        .then(res => {
          this.errors = [];
          this.$message({
            message: this.commonText.saveSuccess,
            type: 'success',
          });
          if (updateData.length === 1) {
            const subject_set_id = updateData[0].snz_subjectset_id;
            const subjectSet = _.find(lastSubject, item => {
              return item.id === subject_set_id;
            });
            if (subjectSet && subjectSet.snz_update_subject_flag) {
              this.redirectPage({
                name: 'cantractinfo-detail',
                params: {
                  id: res.original[0].id,
                  redirect: true,
                },
              });
            }
          }
          this.getList(this.searchForm);
        })
        .catch(err => {
          if (err.response.status === 422) {
            this.errors = err.response.data.errors;
          } else {
            this.$message({
              message: `${err.response.data.message}`,
              type: 'error',
              duration: 1500,
            });
          }
          // eslint-disable-next-line no-throw-literal
          throw 'cancel redirect';
        })
        .finally(() => {
          this.saveLoading = false;
          this.listLoading = false;
        });
    },
    async handleChangeCourse(index, row) {
      if (row.snz_course_id) {
        this.$set(this.list[index], 'snz_subjectset_id', null);
        const subjects = await this.fetchSubjectSetByCourseAndGradeAndBusiness(
          row.snz_grade_id,
          row.snz_schoolyear,
          row.snz_course_id,
          row.snz_businessunit_id
        );
        this.$set(this.tableSelect[index], 'subjects', subjects);
      } else {
        this.$set(this.tableSelect[index], 'subjects', []);
      }
    },
    async fetchSubjectSetByCourseAndGradeAndBusiness(
      gradeId,
      schoolYear,
      courseId,
      businessId
    ) {
      return subjectSetRequest.getByCourseIdAndGradeIdAndBusinessId({
        grade_id: gradeId,
        school_year: schoolYear,
        course_id: courseId,
        business_id: businessId,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../session-traning/styles/list-table';
@import '../styles/listDatabase';
/deep/ .group-button {
  float: right;
  padding-top: 8px;
}
/deep/ .el-table .disabled-row{
  background-color: #f0f0f0 !important;
  &:hover > td{
    background-color: #f0f0f0 !important;
  }
}
</style>
