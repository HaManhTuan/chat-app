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
        :empty-text="CommonTxt.tableEmptyTxt"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column width="50px" type="selection" fixed :selectable="checkboxSelectable" />
        <el-table-column label="氏名" fixed min-width="116px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student.fullname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学年" width="91px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade ? scope.row.grade.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生徒コード" min-width="84px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_studentcode }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="85px">
          <template slot="header"> 生徒<br>ステータス </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_studentstatus | studentStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="コース" min-width="105px">
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
                {{ scope.row.course ? scope.row.course.snz_name : 'ー' }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="申込日" width="105px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.application_date`"
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
        <el-table-column label="出欠" width="72px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_willtojoin`"
              :show-message="true"
              :error="getError('snz_willtojoin', scope.$index)"
            >
              <TableSelectBox
                v-model="scope.row.snz_willtojoin"
                key-id="value"
                key-name="label"
                :auto-font="false"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :options="attendances"
                classes="select-attendance"
                placeholder="ー"
                clearable
                @change="()=>changeWillJoin(scope.$index)"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="科目セット" min-width="135px">
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
                :disabled="scope.row.snz_willtojoin===0 || disableRole(['viewonly', 'callcenter'])"
                :default-object="defaultSelection[scope.$index].subjects"
                :options="tableSelect[scope.$index].subjects"
                placeholder="ー"
                clearable
              />
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
        <el-table-column label="校舎" min-width="150px">
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
      </el-table>
    </el-form>
    <div class="footer">
      <el-row class="footer__group">
        <el-col :span="6">
          <div class="statistics">
            <span>受講：{{ joinInfo.join }}人</span><span>欠席：{{ joinInfo.notJoin }}人</span><span>未定：{{ joinInfo.unKnow }}人</span>
          </div>
        </el-col>
        <el-col :span="12">
          <CustomPagination
            v-show="last_page > 1"
            :total="total"
            :page.sync="searchForm.page"
            :limit.sync="searchForm.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination"
            @pagination="getList(searchForm)"
          />
        </el-col>
        <el-col :span="6">
          <div class="group-button">
            <!--            <ButtonExport-->
            <!--              :loading="exportLoading"-->
            <!--              type="excel"-->
            <!--              @export="handleExport"-->
            <!--            />-->
            <ButtonSave :disabled="disableRole(['viewonly', 'callcenter'])" :loading="saveLoading" @save="saveData" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
import ButtonSave from '../../../components/Common/Button/ButtonSave';
// import ButtonExport from '../../../components/Common/Button/ButtonExport';
import TableSelectBox from '../../../components/Common/TableSelectBox';
import SessionTraining from '@/api/SessionTraining';
import { studentStatusLabel } from '@/filters/studentStatus';
import { isArrayEqual } from '@/helpers/mixins/Compare';
import CommonSettings from '@/const/CommonSettings';
const sessionTraining = new SessionTraining();
export default {
  name: 'ListDatatable',
  components: { TableSelectBox, ButtonSave, CustomPagination },
  filters: {
    studentStatus: studentStatusLabel,
  },
  props: {
    registerStatusProp: { type: Number, default: 0 },
  },
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      listLoading: false,
      saveLoading: false,
      exportLoading: false,
      last_page: 1,
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
      joinInfo: {
        join: 0,
        notJoin: 0,
        unKnow: 0,
      },
      searchForm: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      originModel: {},
    };
  },

  created() {

  },
  methods: {
    checkboxSelectable(row, index) {
      if (!this.searchForm.register_status){
        return 1;
      }
      if (row.snz_application_pending_flag || (row.cantract_info && row.cantract_info.snz_application_pending_flag)) {
        return 0;
      }
      return 1;
    },
    handleEdit(row) {
      row.edit = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    tableHeaderColor() {
      return 'background-color: #535353;color:#fff';
    },
    tableRowClassName({ row, rowIndex }) {
      if (this.checkboxSelectable(row, rowIndex) === 0){
        return 'disabled-row';
      } else {
        return '';
      }
    },
    async handleExport() {
      this.exportLoading = true;
      await sessionTraining
        .exportResource(this.searchForm)
        .then(data => {
          this.createDownloadXlsFile('季節講習_', data);
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
    requestOptions(){
      const data = this.list.map(row => {
        return {
          business_id: row.businessunit_id,
          grade_id: row.snz_grade_id,
          snz_studentcode: row.snz_studentcode,
          snz_schoolyear: row.snz_schoolyear,
          snz_headdivision_code: row.business_unit.organization.snz_headdivision_code,
          snz_division_code: row.business_unit.organization.snz_division_code,
          snz_area_code: row.business_unit.organization.snz_area_code,
          snz_unit_code: row.business_unit.organization.snz_unit_code,
          course_id: row.snz_course_id,
        };
      });
      sessionTraining.getOptions(data, this.searchForm).then(res => {
        this.tableSelect = res.original;
      });
    },
    getJoinInfo(params) {
      sessionTraining.getJoinInfo({
        ...this.listQuery,
        ...params,
      }).then(res => {
        this.joinInfo = res.joinInfo;
      });
      return true;
    },
    tableRowStyle() {},
    async getList(params) {
      const query = this.buildQuery(params);
      window.history.replaceState(null, null, `?${query}`);
      this.searchForm = params;
      this.errors = [];
      this.listLoading = true;
      const res = await sessionTraining.list({
        ...this.listQuery,
        ...params,
      });
      const data = res.original;
      this.tableSelect = data.data.map(row => {
        return {
          subjects: [row.subject_set],
          discount0: row.cantract_discount[0] ? [row.cantract_discount[0].discount] : [],
          discount1: row.cantract_discount[1] ? [row.cantract_discount[1].discount] : [],
          discount2: row.cantract_discount[2] ? [row.cantract_discount[2].discount] : [],
          discount3: row.cantract_discount[3] ? [row.cantract_discount[3].discount] : [],
          discount4: row.cantract_discount[4] ? [row.cantract_discount[4].discount] : [],
        };
      });
      this.defaultSelection = data.data.map(row => {
        return {
          subjects: row.subject_set,
          discount0: row.cantract_discount[0] ? row.cantract_discount[0].discount : null,
          discount1: row.cantract_discount[1] ? row.cantract_discount[1].discount : null,
          discount2: row.cantract_discount[2] ? row.cantract_discount[2].discount : null,
        };
      });
      data.data.forEach(function(row, index) {
        row.snz_applicationdate = moment(row.snz_applicationdate)
          .utc()
          .utcOffset(9)
          .format();
        row.index = index;
      });
      this.list = data.data;
      this.total = data.total;
      this.last_page = data.last_page;
      this.$emit('setCurrentPageRecord', (data.to - data.from + 1));
      if (this.$refs.table) {
        this.$refs.table.$refs.bodyWrapper.scrollTop = 0;
      }
      this.listLoading = false;
      this.originModel = JSON.parse(JSON.stringify(this.list));
      this.getJoinInfo(params);
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
          await this.saveData();
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
    async saveData() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '保存するレコードがありません。',
        });
      } else {
        this.listLoading = true;
        this.saveLoading = true;
        const dataSelected = this.multipleSelection;
        const registerStatusProp = this.registerStatusProp;
        const course = this.searchForm.course;
        let lastSubject = null;
        const payload = this.list.map((row, index) => {
          const exist = _.find(dataSelected, (item) => {
            return item.snz_studentcode === row.snz_studentcode;
          });
          if (!exist) {
            return null;
          }
          return {
            contract_id: row.cantract_id,
            grade_id: row.snz_grade_id,
            student_code: row.snz_studentcode,
            student_status: row.snz_studentstatus,
            course_id: this.searchForm.register_status ? row.snz_course_id : course,
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
            register_status: registerStatusProp,
          };
        });
        if (dataSelected.length === 1) {
          lastSubject = this.tableSelect[dataSelected[0].index].subjects;
          if (this.list[dataSelected[0].index].subject_set) {
            const subject = _.cloneDeep(this.list[dataSelected[0].index].subject_set);
            lastSubject.push(subject);
          }
        }
        await sessionTraining.storeOrUpdate({ form: payload }, this.searchForm).then((res) => {
          this.errors = [];
          this.$message({
            message: this.commonText.saveSuccess,
            type: 'success',
          });
          if (dataSelected.length === 1) {
            const subject_set_id = dataSelected[0].snz_subjectset_id;
            const subjectSet = _.find(lastSubject, item => {
              return item.id === subject_set_id;
            });
            if (subjectSet && subjectSet.snz_update_subject_flag) {
              return this.redirectPage({
                name: 'cantractinfo-detail',
                params: {
                  id: res.original[0].id,
                  redirect: true,
                },
              });
            }
          }
          this.getList(this.searchForm);
        }).catch(err => {
          if (err.response.status === 422) {
            this.errors = err.response.data.errors;
          } else if (err.response && err.response.status === 424) {
            this.$message({
              type: 'error',
              message: err.response.data.original.message,
            });
          } else {
            this.$message({
              message: `${err.response.data.message}`,
              type: 'error',
              duration: 1500,
            });
          }
          // eslint-disable-next-line no-throw-literal
          throw 'cancel redirect';
        }).finally(() => {
          this.saveLoading = false;
          this.listLoading = false;
        });
      }
    },
    changeWillJoin(index) {
      if (!this.list[index].snz_willtojoin) {
        this.list[index].snz_subjectset_id = null;
        this.list[index].discount0 = null;
        this.list[index].discount1 = null;
        this.list[index].discount2 = null;
        this.list[index].discount3 = null;
        this.list[index].discount4 = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/list-table.scss';
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
