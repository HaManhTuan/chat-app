<template>
  <div class="page-body">
    <!-- TABLE -->
    <el-form ref="tableForm" :model="tableForm">
      <el-table
        ref="singleTable"
        v-loading="listLoading"
        class="block-table editable-table"
        :data="tableForm.list"
        fit
        height="100%"
        highlight-current-row
        style="width: 100%"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :row-class-name="tableRowClassName"
        :empty-text="CommonTxt.tableEmptyTxt"
      >
        <!-- FULLNAME -->
        <el-table-column label="氏名" min-width="112px" fixed>
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">{{ scope.row.student.fullname }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END FULLNAME -->
        <!-- GRADE -->
        <el-table-column label="学年" min-width="106px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.grade_id`"
              :rules="rules.grade_id"
              :show-message="showError"
            >
              <el-select
                v-model="scope.row.grade_id"
                popper-class="select-inside-table"
                filterable
                placeholder="ー"
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                @change="handleChangeGrade(scope.$index, scope.row)"
              >
                <el-option
                  v-for="item in selectBox.grade[scope.$index]"
                  :key="`grade_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END GRADE -->
        <!-- STUDENT CODE -->
        <el-table-column label="生徒コード" min-width="83px">
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{ scope.row.snz_studentcode }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END STUDENT CODE -->
        <!-- STUDENT STATUS -->
        <el-table-column width="60px">
          <template slot="header">生徒<br>ステータス </template>
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{
                  scope.row.snz_studentstatus
                    | getStatusLabel
                    | formatMinCharacters(3)
                }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END STUDENT STATUS -->
        <!-- SCHOOL YEAR -->
        <el-table-column label="年度" width="50px">
          <template slot-scope="scope">
            <el-form-item
              :show-message="true"
              :error="getError('school_year', scope.$index)"
            >
              <span>
                {{ scope.row.school_year | formatMinCharacters(4) }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END SCHOOL YEAR -->
        <!-- COURSE -->
        <el-table-column label="コース" min-width="146px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.course_id`"
              :rules="rules.course_id"
              :show-message="true"
              :error="getError('course_id', scope.$index)"
            >
              <el-input
                v-model="scope.row.course_name"
                class="el-input"
                disabled
              />
              <input v-model="scope.row.course_id" type="hidden">
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END COURSE -->
        <!-- APPLICATION DATE -->
        <el-table-column label="申込日" width="80px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_applicationdate`"
              :rules="rules.snz_applicationdate"
              :show-message="true"
              :error="getError('application_date', scope.$index)"
            >
              <el-date-picker
                v-model="scope.row.snz_applicationdate"
                prefix-icon="_calendar"
                type="date"
                format="MM/dd"
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
        <!-- END APPLICATION DATE -->
        <!-- EXPERIENCE START MONTH -->
        <el-table-column label="体験開始月" min-width="97px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.month_start_id`"
              :rules="rules.month_start_id"
              :show-message="true"
              :error="getError('month_start', scope.$index)"
            >
              <el-select
                v-model="scope.row.month_start_id"
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
                  v-for="item in selectBox.targetPeriod"
                  :key="`month_start_${scope.$index}_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END EXPERIENCE START MONTH -->
        <!-- EXPERIENCE END MONTH -->
        <el-table-column label="体験終了月" min-width="97px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.month_end_id`"
              :rules="rules.month_end_id"
              :show-message="true"
              :error="getError('month_end', scope.$index)"
            >
              <el-select
                v-model="scope.row.month_end_id"
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
                  v-for="item in selectBox.targetPeriod"
                  :key="`month_end_${scope.$index}_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END EXPERIENCE END MONTH -->
        <!-- EXPERIENCE FEE -->
        <el-table-column min-width="77px">
          <template slot="header"> 体験費用<br>区分 </template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.fee`"
              :rules="rules.fee"
              :show-message="true"
              :error="getError('fee', scope.$index)"
            >
              <el-select
                v-model="scope.row.fee"
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
                  v-for="item in selectBox.experience_fee"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END EXPERIENCE FEE -->
        <!-- SUBJECT SET -->
        <el-table-column label="科目セット" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.subject_set_id`"
              :rules="rules.subject_set_id"
              :show-message="true"
              :error="getError('subject_set_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.subject_set_id"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                filterable
                clearable
                placeholder="ー"
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :class="
                  getClass(
                    scope.row.subject_set_id,
                    scope.row.selectBox_subject_set,
                    'id',
                    'snz_display_name'
                  )
                "
              >
                <el-option
                  v-for="item in scope.row.selectBox_subject_set"
                  :key="`subject_set_${item.id}`"
                  :label="item.snz_display_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END SUBJECT SET -->
        <!-- DISCOUNT 1 -->
        <el-table-column label="割引1" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.discount_1_id`"
              :rules="rules.discount_1_id"
              :show-message="true"
              :error="getError('discount_1_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.discount_1_id"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                filterable
                clearable
                placeholder="ー"
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :class="
                  getClass(
                    scope.row.discount_1_id,
                    scope.row.selectBox_discount_1,
                    'id',
                    'snz_name'
                  )
                "
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_1"
                  :key="`discount_1_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END DISCOUNT 1 -->
        <!-- DISCOUNT 2 -->
        <el-table-column label="割引2" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.discount_2_id`"
              :rules="rules.discount_2_id"
              :show-message="true"
              :error="getError('discount_2_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.discount_2_id"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                filterable
                clearable
                placeholder="ー"
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :class="
                  getClass(
                    scope.row.discount_2_id,
                    scope.row.selectBox_discount_2,
                    'id',
                    'snz_name'
                  )
                "
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_2"
                  :key="`discount_2_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END DISCOUNT 2 -->
        <!-- DISCOUNT 3 -->
        <el-table-column label="割引3" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.discount_3_id`"
              :rules="rules.discount_3_id"
              :show-message="true"
              :error="getError('discount_3_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.discount_3_id"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                filterable
                clearable
                placeholder="ー"
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :class="
                  getClass(
                    scope.row.discount_3_id,
                    scope.row.selectBox_discount_3,
                    'id',
                    'snz_name'
                  )
                "
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_3"
                  :key="`discount_3_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END DISCOUNT 3 -->
        <!-- DISCOUNT 4 -->
        <el-table-column label="割引4" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.discount_4_id`"
              :rules="rules.discount_4_id"
              :show-message="true"
              :error="getError('discount_4_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.discount_4_id"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                filterable
                clearable
                placeholder="ー"
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :class="
                  getClass(
                    scope.row.discount_4_id,
                    scope.row.selectBox_discount_4,
                    'id',
                    'snz_name'
                  )
                "
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_4"
                  :key="`discount_4_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END DISCOUNT 4 -->
        <!-- DISCOUNT 5 -->
        <el-table-column label="割引5" min-width="120px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.discount_5_id`"
              :rules="rules.discount_5_id"
              :show-message="true"
              :error="getError('discount_5_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.discount_5_id"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                filterable
                clearable
                placeholder="ー"
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :class="
                  getClass(
                    scope.row.discount_5_id,
                    scope.row.selectBox_discount_5,
                    'id',
                    'snz_name'
                  )
                "
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_5"
                  :key="`discount_5_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END DISCOUNT 5 -->
        <!-- BUSINESS UNIT -->
        <el-table-column label="校舎" width="168px">
          <template slot-scope="scope">
            <el-form-item
              :show-message="true"
              :error="getError('business_id', scope.$index)"
            >
              <span
                :class="{
                  ellipsis: true,
                  'is-error': getError('business_id', scope.$index),
                }"
              >
                {{ scope.row.business_unit.name }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END BUSINESS UNIT -->
        <!-- SAVE BUTTON -->
        <el-table-column
          label="保存"
          width="62px"
          class="text-center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-form-item class="flex justify-content-center align-item-center">
              <el-button
                :disabled="Boolean(scope.row.snz_application_pending_flag || (scope.row.cantract_info && scope.row.cantract_info.snz_application_pending_flag) || disableRole(['viewonly', 'callcenter']))"
                class="btn__action btn-download"
                size="mini"
                @click.prevent="updateData([scope.row], false)"
              >
                <svg-icon
                  icon-class="icon_download_002"
                  style="font-size: 15px"
                />
              </el-button>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END SAVE BUTTON -->
      </el-table>
    </el-form>
    <!-- END TABLE -->
    <!-- FOOTER -->
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
            @pagination="getList(paramsSearch)"
          />
        </el-col>
        <el-col :span="6">
          <!--          <div class="group-button">-->
          <!--            <ButtonExport-->
          <!--              :loading="exportLoading"-->
          <!--              :disabled="disableRole(['viewonly', 'callcenter'])"-->
          <!--              type="excel"-->
          <!--              @export="handleExport"-->
          <!--            />-->
          <!--          </div>-->
        </el-col>
      </el-row>
    </div>
    <!-- END FOOTER -->
  </div>
</template>

<script>
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
// import ButtonExport from '@/components/Common/Button/ButtonExport';
import { Validation } from '../assets/validate';
import { FetchDataMixin } from '../mixins/FetchDataMixin';
import { FormErrorMixin } from '../mixins/FormErrorMixin';
import { DatePickerMixin } from '@/helpers/mixins/DatePickerMixin';
import { GetListMixin } from '../mixins/GetListMixin';
import { HandleChangeMixin } from '../mixins/HandleChangeMixin';
import { autoSelectSize } from '@/mixins/autoSelectSize';
import { UpdateDataMixin } from '../mixins/UpdateDataMixin';
import { studentStatusLabel } from '@/filters/studentStatus';

import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';
import { diffArrayObject, isArrayEqual } from '@/helpers/mixins/Compare';
import CommonSettings from '@/const/CommonSettings';

export default {
  name: 'ListDatatable',
  directives: { permission, role },

  components: { CustomPagination },
  filters: {
    formatMinCharacters: (value, length) =>
      value ? value.substring(0, length) : value,
    formatDate: date => moment(date).format('YYYY/MM/DD'),
    filterFee: fee => (fee === 0 ? '無償' : '有償'),
    getStatusLabel: studentStatusLabel,
  },
  mixins: [
    Validation,
    DatePickerMixin,
    FetchDataMixin,
    FormErrorMixin,
    GetListMixin,
    HandleChangeMixin,
    // HandleRouteLeave,
    // SelectBoxMixin,
    UpdateDataMixin,
    autoSelectSize,
  ],
  /*
   */
  props: {
    registerStatusProp: { type: Number, default: 0 },
    paramsSearch: { type: Object, default: null },
    exportLoading: { type: Boolean, default: false },
  },
  data() {
    return {
      displayScreen: 'register-trial',
      errors: [],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        last_page: 1,
      },
      tableForm: {
        list: [],
      },
      datePicker: null,
      originModel: {},
      total: 0,
      showError: false,
      dataWaitingUpdate: [],
      multipleSelection: [],
    };
  },
  watch: {
    'listQuery.page'(newVal) {
      this.$emit('setPage', newVal);
    },
  },
  created() {
    // this.fetchGrade();
  },

  methods: {
    changeDatePicker(event) {
      console.log(event);
    },
    beforeRouteLeave(to, from, next) {
      if (
        isArrayEqual(this.tableForm.list, this.originModel) ||
        to.params.redirect ||
        to.name === 'err_404' ||
        to.name === 'err_403'
      ) {
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
          const diff = diffArrayObject(this.tableForm.list, this.originModel);
          await this.updateData(diff);
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
    handleChange(newVal, oldVal) {
      // hide error
      this.showError = false;
      const index = this.dataWaitingUpdate.findIndex(item => {
        return item.id === newVal.id;
      });
      if (index !== -1) {
        this.dataWaitingUpdate.splice(index, 1, newVal);
      } else {
        this.dataWaitingUpdate.push(newVal);
      }
    },
    tableHeaderColor() {
      return 'background-color: #535353;color:#fff;padding-left:10px';
    },
    tableRowStyle() {
      return 'padding-left:10px';
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.snz_application_pending_flag || (row.cantract_info && row.cantract_info.snz_application_pending_flag) === 1){
        return 'disabled-row';
      } else {
        return '';
      }
    },
    handleExport() {
      this.$emit('handleExport');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/list.scss';
/deep/ .el-table .disabled-row{
  background-color: #f0f0f0 !important;
  &:hover > td{
    background-color: #f0f0f0 !important;
  }
}
</style>
