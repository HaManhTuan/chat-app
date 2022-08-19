<template>
  <div class="student-detail">
    <el-form
      ref="form"
      :rules="rules"
      :model="history"
    >
      <div class="card-body">
        <h3>
          全般
        </h3>
        <!-- FIRST ROW -->
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="96px" label="生徒氏名" prop="snz_name">
              <el-input v-model="history.student.fullname" disabled />
            </el-form-item>
            <el-form-item label-width="96px" label="校舎" prop="snz_name">
              <el-select
                v-model="history.businessunit_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.business_unit?history.business_unit:{}]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="96px" label="受講学年" prop="snz_name">
              <el-select
                v-model="history.snz_grade_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.grade?history.grade:{}]"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="年度" label-width="96px">
              <el-input v-model="history.snz_schoolyear" disabled />
            </el-form-item>
            <el-form-item label="コース" label-width="96px" prop="snz_name">
              <el-select
                v-model="history.snz_course_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.course?history.course:{}]"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="96px" label="申込区分" prop="snz_name">
              <el-select
                v-model="history.snz_application_type"
                placeholder=""
                disabled
              >
                <el-option
                  v-for="item in applicationTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="96px" label="申込日" prop="snz_name" style="margin-bottom: 20px;">
              <el-date-picker
                v-model="history.snz_applicationdate"
                disabled
                prefix-icon="none"
                type="date"
                format="yyyy/MM/dd"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" />
              </span>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <el-form-item label="クーリングオフ期限" label-width="136px">
              <el-date-picker
                v-model="history.snz_coolingoffdate"
                disabled
                prefix-icon="none"
                type="date"
                format="yyyy/MM/dd"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" />
              </span>
            </el-form-item>
            <el-form-item label="受講区分" label-width="136px" prop="snz_contract_type">
              <el-select
                v-model="history.snz_contract_type"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in contractOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="136px" label="受講開始月">
              <el-select
                v-model="history.snz_cantractstartmonth_period_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.contract_start_month?history.contract_start_month:{}]"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="136px" label="受講終了月">
              <el-select
                v-model="history.snz_cantractendmonth_period_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.contract_end_month?history.contract_end_month:{}]"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="136px" label="科目セット" prop="snz_name">
              <el-select
                v-model="history.snz_subjectset_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.subject_set?history.subject_set:{}]"
                  :key="item.id"
                  :label="item.snz_display_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体験費用区分" label-width="136px">
              <el-select
                v-model="history.snz_experiencefee"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in experienceFeeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="入会月" label-width="136px">
              <el-select
                v-model="history.snz_entermonth_period_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.enter_month?history.enter_month:{}]"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="入会選抜申込書提出" label-width="136px">
              <el-select
                v-model="history.snz_selectionappstate"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in selectAppStateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!--入会選抜試験合否-->
            <el-form-item label="入会選抜試験合否" label-width="136px" prop="snz_selectionresult">
              <el-select
                v-model="history.snz_selectionresult"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in selectionResultOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
      </div>
      <div class="line" />
      <div class="card-body">
        <h3>
          体験
        </h3>
        <!-- FIRST ROW -->
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="136px" label="体験開始月">
              <el-select
                v-model="history.snz_experiencestartmonth_period_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.experience_start_month?history.experience_start_month:{}]"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="体験途中キャンセル" label-width="136px" style="margin-bottom: 20px;">
              <el-select
                v-model="history.snz_experiencecancel2"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in cancelOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体験終了月" label-width="133px">
              <el-select
                v-model="history.snz_experienceendmonth_period_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.experience_end_month?history.experience_end_month:{}]"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="体験事前キャンセル" label-width="148px">
              <el-select
                v-model="history.snz_experiencecancel1"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in cancelOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
      </div>
      <div class="line" />
      <div class="card-body">
        <h3>
          科目
        </h3>
        <el-table
          class="table-content"
          :data="history.subjects"
          row-key="id"
        >
          <el-table-column width="255px" label="科目">
            <template slot-scope="scope">
              <el-form-item>
                <el-select
                  v-model="scope.row.snz_subject_id"
                  placeholder=""
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  clearable
                  filterable
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                  disabled
                >
                  <el-option
                    v-for="item in [scope.row.subject?scope.row.subject:{}]"
                    :key="item.id"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="255px" label="開始月">
            <template slot-scope="scope">
              <el-form-item>
                <el-select
                  v-model="scope.row.snz_startmonth_period_id"
                  placeholder=""
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  clearable
                  filterable
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                  disabled
                >
                  <el-option
                    v-for="item in [scope.row.start_target_period?scope.row.start_target_period:{}]"
                    :key="item.id"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="255px" label="終了月">
            <template slot-scope="scope">
              <el-form-item>
                <el-select
                  v-model="scope.row.snz_endmonth_period_id"
                  placeholder=""
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  clearable
                  filterable
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                  disabled
                >
                  <el-option
                    v-for="item in [scope.row.end_target_period?scope.row.end_target_period:{}]"
                    :key="item.id"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="ableRole(['system'])" align="center" width="35px" label="削除">
            <template slot-scope="scope">
              <el-button
                v-if="scope.$index !==0"
                class="btn-delete"
                @click="deleteHistorySubject(scope.$index)"
              >
                <svg-icon icon-class="_trash" />
              </el-button>
            </template>
          </el-table-column>
          <template slot="append">
            <tr>
              <td rowspan="4" style="padding: 0">
                <el-button
                  icon="el-icon-circle-plus"
                  class="add"
                  disabled
                  :style="!ableRole(['system'])?'width:735px':''"
                >
                  科目を追加
                </el-button>
              </td>
            </tr>
          </template>
        </el-table>
      </div>
      <div class="line" />
      <div class="card-body">
        <h3>
          割引・キャンペーン
        </h3>
        <el-table
          class="table-content"
          :data="history.discount_history"
          row-key="id"
          height="calc(100% - 0px)"
          :show-header="false"
        >
          <el-table-column width="407px">
            <template slot-scope="scope">
              <el-form-item label="割引１" label-width="52px" class="w-356">
                <el-select
                  v-model="scope.row.snz_discount_id"
                  placeholder=""
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  clearable
                  filterable
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                  disabled
                >
                  <el-option
                    v-for="item in [scope.row.discount?scope.row.discount:{}]"
                    :key="item.id"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <template slot="append">
            <tr>
              <td rowspan="4" style="padding: 0">
                <el-button icon="el-icon-circle-plus" class="add last" disabled>
                  割引を追加
                </el-button>
              </td>
            </tr>
          </template>
        </el-table>
      </div>
    </el-form>
  </div>
</template>
<script>
import { CantractInfoHistory } from '@/views/cantractinfo-history/assets/validate';
import ContractInfo from '@/const/ContractInfo';
import {
  contractOptions,
  experienceCancelOptions,
  experienceFeeOptions,
  selectAppStateOptions,
  selectionResultOptions,
} from '@/const/CantractInfo';

export default {
  mixins: [CantractInfoHistory],
  props: {
    cantractHistory: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      history: this.cantractHistory,
      applicationTypeOptions: ContractInfo.SNZ_APPLICATION_TYPE,
      contractOptions: contractOptions,
      experienceFeeOptions: experienceFeeOptions,
      selectAppStateOptions: selectAppStateOptions,
      selectionResultOptions: selectionResultOptions,
      cancelOption: experienceCancelOptions,
    };
  },
  async created() {
  },
  methods: {
    deleteHistorySubject(index) {
      this.history.subjects.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./../styles/general";
</style>
