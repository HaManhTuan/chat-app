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
        <el-table-column label="名前" fixed width="112px">
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{ scope.row.contact.student.fullname }}
              </span>
              <input v-model="scope.row.id" type="hidden">
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END FULLNAME -->
        <!-- GRADE DISABLE-->
        <el-table-column label="現在学年" width="106px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.grade_id`"
              :rules="rules.grade_id"
              :show-message="showError"
              :error="getError('grade_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.defautValue.grade_id"
                filterable
                placeholder="ー"
                loading-text="データなし"
                popper-class="select-inside-table"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                disabled
              >
                <span
                  v-for="(item, index) in selectBox.grade[scope.$index]"
                  :key="`grade_disable_${index}`"
                >
                  <el-option
                    v-if="item"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </span>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END GRADE DISABLE-->
        <!-- EXPERIENCE START MONTH -->
        <el-table-column label="体験開始月" min-width="97px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_experiencestartmonth_period_id`"
              :rules="rules.month_start_id"
              :show-message="true"
              :error="getError('month_start', scope.$index)"
            >
              <el-select
                v-model="scope.row.snz_experiencestartmonth_period_id"
                filterable
                clearable
                loading-text="データなし"
                popper-class="select-inside-table"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                :disabled="
                  disableRole(['viewonly', 'callcenter']) ||
                    scope.row.selectBoxDisable.month_start
                "
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
        <!-- SELECTION APP STATE -->
        <el-table-column min-width="122px">
          <template slot="header">入会選抜申込書</template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_selectionappstate`"
              :rules="rules.app_state_id"
              :show-message="true"
              :error="getError('app_state_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.snz_selectionappstate"
                :disabled="
                  disableRole(['viewonly', 'callcenter']) ||
                    scope.row.selectBoxDisable.snz_selectionappstate
                "
                placeholder="ー"
                loading-text="データなし"
                popper-class="select-inside-table"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                @change="handleChangeApplicationState(scope.$index, scope.row)"
              >
                <el-option
                  v-for="item in selectBox.selection_app_state"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END SELECTION APP STATE -->
        <!-- SELECTION RESULT -->
        <el-table-column min-width="81px">
          <template slot="header">入会<br>選抜試験</template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_selectionresult`"
              :rules="rules.selection_result_id"
              :show-message="true"
              :error="getError('selection_result_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.snz_selectionresult"
                :disabled="
                  scope.row.selectBoxDisable.selection_result ||
                    disableRole(['viewonly', 'callcenter'])
                "
                loading-text="データなし"
                popper-class="select-inside-table"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder="ー"
                @change="handleChangeSelectionResult(scope.$index, scope.row)"
              >
                <el-option
                  v-for="item in selectBox.selection_result"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END SELECTION APP STATE -->
        <!-- ENTER MONTH -->
        <el-table-column label="入会月" min-width="117px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_entermonth_period_id`"
              :rules="rules.enter_month_id"
              :show-message="true"
              :error="getError('enter_month_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.snz_entermonth_period_id"
                :disabled="
                  scope.row.selectBoxDisable.enter_month ||
                    disableRole(['viewonly', 'callcenter'])
                "
                filterable
                clearable
                loading-text="データなし"
                popper-class="select-inside-table"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder="ー"
              >
                <el-option
                  v-for="item in selectBox.targetPeriod"
                  :key="`entermonth_${scope.$index}_${item.id}`"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END ENTER MONTH -->
        <!-- SCHOOL YEAR -->
        <el-table-column label="年度" width="45px">
          <template slot-scope="scope">
            <el-form-item :show-message="true">
              <span>
                {{ scope.row.snz_schoolyear | formatMinCharacters(4) }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END SCHOOL YEAR -->
        <!-- GRADE -->
        <el-table-column label="入会時の学年" width="106px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.grade_id`"
              :rules="rules.grade_id"
              :show-message="showError"
              :error="getError('grade_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.grade_id"
                filterable
                placeholder="ー"
                loading-text="データなし"
                popper-class="select-inside-table"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                :disabled="
                  scope.row.selectBoxDisable.grade_id ||
                    disableRole(['viewonly', 'callcenter'])
                "
                @change="handleChangeGrade(scope.$index, scope.row)"
              >
                <span
                  v-for="(item, index) in selectBox.grade[scope.$index]"
                  :key="`grade_${index}`"
                >
                  <el-option
                    v-if="item"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </span>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END GRADE -->
        <!-- COURSE -->
        <el-table-column label="入会時のコース" min-width="147px">
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.course_id`"
              :rules="rules.course"
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
              :prop="`list.${scope.$index}.application_date`"
              :rules="rules.application_date"
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
                :disabled="
                  disableRole(['viewonly', 'callcenter']) ||
                    (!registerStatusProp &&
                    scope.row.snz_selectionresult !== 20) ||
                    scope.row.selectBoxDisable.snz_applicationdate
                "
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
        <!-- SUBJECT SET -->
        <el-table-column min-width="110px">
          <template slot="header">入会時の<br>科目セット</template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.subjectset_id`"
              :rules="rules.subject_set_id"
              :show-message="true"
              :error="getError('subject_set_id', scope.$index)"
            >
              <el-select
                v-model="scope.row.subject_set_id"
                placeholder="ー"
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                filterable
                clearable
                :disabled="
                  scope.row.selectBoxDisable.subject_set ||
                    disableRole(['viewonly', 'callcenter'])
                "
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
                  :key="item.id"
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
                popper-class="select-inside-table"
                filterable
                clearable
                :disabled="
                  scope.row.selectBoxDisable.discount_1 ||
                    disableRole(['viewonly', 'callcenter'])
                "
                loading-text="データなし"
                :class="
                  getClass(
                    scope.row.discount_1_id,
                    scope.row.selectBox_discount_1,
                    'id',
                    'snz_name'
                  )
                "
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder="ー"
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_1"
                  :key="item.id"
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
                popper-class="select-inside-table"
                filterable
                clearable
                :disabled="
                  scope.row.selectBoxDisable.discount_2 ||
                    disableRole(['viewonly', 'callcenter'])
                "
                loading-text="データなし"
                :class="
                  getClass(
                    scope.row.discount_2_id,
                    scope.row.selectBox_discount_2,
                    'id',
                    'snz_name'
                  )
                "
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder="ー"
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_2"
                  :key="item.id"
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
                popper-class="select-inside-table"
                filterable
                clearable
                :disabled="
                  scope.row.selectBoxDisable.discount_3 ||
                    disableRole(['viewonly', 'callcenter'])
                "
                loading-text="データなし"
                :class="
                  getClass(
                    scope.row.discount_3_id,
                    scope.row.selectBox_discount_3,
                    'id',
                    'snz_name'
                  )
                "
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder="ー"
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_3"
                  :key="item.id"
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
                popper-class="select-inside-table"
                filterable
                clearable
                :disabled="
                  scope.row.selectBoxDisable.discount_4 ||
                    disableRole(['viewonly', 'callcenter'])
                "
                loading-text="データなし"
                :class="
                  getClass(
                    scope.row.discount_4_id,
                    scope.row.selectBox_discount_4,
                    'id',
                    'snz_name'
                  )
                "
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder="ー"
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_4"
                  :key="item.id"
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
                popper-class="select-inside-table"
                filterable
                clearable
                :disabled="
                  scope.row.selectBoxDisable.discount_5 ||
                    disableRole(['viewonly', 'callcenter'])
                "
                loading-text="データなし"
                :class="
                  getClass(
                    scope.row.discount_5_id,
                    scope.row.selectBox_discount_5,
                    'id',
                    'snz_name'
                  )
                "
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder="ー"
              >
                <el-option
                  v-for="item in scope.row.selectBox_discount_5"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END DISCOUNT 5 -->
        <!-- STUDENT CODE -->
        <el-table-column label="生徒コード" min-width="87px">
          <template slot-scope="scope">
            <el-form-item>
              <span>{{ scope.row.contact.snz_studentcode }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END STUDENT CODE -->
        <!-- STUDENT STATUS -->
        <el-table-column width="64px">
          <template slot="header"> 生徒<br>ステータス</template>
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{
                  scope.row.contact.snz_studentstatus
                    | getStatusLabel
                    | formatMinCharacters(3)
                }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END STUDENT STATUS -->
        <!-- BUSINESS UNIT -->
        <el-table-column label="校舎" min-width="115px">
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
                {{ scope.row.contact.business_unit.name }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END BUSINESS UNIT -->
        <!-- SAVE BUTTON -->
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
                :disabled="
                  Boolean(
                    scope.row.snz_application_pending_flag ||
                      disableRole(['viewonly', 'callcenter'])
                  )
                "
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
          <!--              :disabled="-->
          <!--                exportLoading || disableRole(['viewonly', 'callcenter'])-->
          <!--              "-->
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
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
// import ButtonExport from '../../../components/Common/Button/ButtonExport';
// import Selectbox from '../../../components/Common/Selectbox';
// import { Message } from 'element-ui';
import { autoSelectSize } from '@/mixins/autoSelectSize';
import { Validation } from '../assets/validate';
import { DatePickerMixin } from '@/helpers/mixins/DatePickerMixin';
import { EditDataMixin } from '../mixins/EditDataMixin';
import { FetchDataMixin } from '../mixins/FetchDataMixin';
import { GetListMixin } from '../mixins/GetListMixin';
import { HandleChangeMixin } from '../mixins/HandleChangeMixin';
import { UpdateDataMixin } from '../mixins/UpdateDataMixin';
import { studentStatusLabel } from '@/filters/studentStatus';

import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';
import { diffArrayObject, isArrayEqual } from '@/helpers/mixins/Compare';

import { FormErrorMixin } from '../mixins/FormErrorMixin';

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
    EditDataMixin,
    FetchDataMixin,
    FormErrorMixin,
    GetListMixin,
    HandleChangeMixin,
    UpdateDataMixin,
    autoSelectSize,
  ],
  props: {
    registerStatusProp: { type: Number, default: 0 },
    schoolYearProp: {
      type: [String, Number],
      default: moment().format('YYYY'),
    },
    paramsSearch: { type: Object, default: null },
    exportLoading: { type: Boolean, default: false },
    courseSearchId: {
      type: Number || String,
      default: null,
    },
    courseSearchSelectBox: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      errors: [],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        last_page: 1,
      },
      tableForm: {
        list: [],
      },
      originModel: {},
      total: 0,
      showError: false,
      watchTracker: [],
      dataWaitingUpdate: [],
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
  mounted() {
    //
  },

  methods: {
    beforeRouteLeave(to, from, next) {
      if (
        isArrayEqual(this.tableForm.list, this.originModel) ||
        to.params.redirect ||
        to.name === 'err_404'
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

    tableHeaderColor() {
      return 'background-color: #535353;color:#fff;padding-left:10px';
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.snz_application_pending_flag === 1) {
        return 'disabled-row';
      } else {
        return '';
      }
    },
    tableRowStyle() {
      return 'padding-left:10px';
    },

    async handleExport() {
      this.$emit('handleExport');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/list.scss';
/deep/ .el-table .disabled-row {
  background-color: #f0f0f0 !important;
  &:hover > td {
    background-color: #f0f0f0 !important;
  }
}
</style>
