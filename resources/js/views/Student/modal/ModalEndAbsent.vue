<template>
  <div>
    <el-dialog
      title="休塾終了を登録"
      :before-close="closeModal"
      :visible.sync="dialogFormEndAbsentVisible"
      top="52px"
      class="custom-dialog absent-end-month"
    >
      <el-form ref="formEndAbsent" :rules="rulesEndAbsent" :model="originFormEndAbsent">
        <!-- ROW 1-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="校舎" prop="snz_businessunit_id">
              <el-input v-model="originFormEndAbsent.snz_businessunit_id" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" label="作成日">
              <el-date-picker
                v-model="originFormEndAbsent.created_at"
                format="yyyy/MM/dd"
                disabled
                type="date"
                prefix-icon="abc"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 1-->
        <!-- ROW 2-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="学年" prop="snz_grade_name">
              <el-input v-model="originFormEndAbsent.snz_grade_name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" label="作成者">
              <el-select v-model="originFormEndAbsent.user_id" disabled placeholder="">
                <el-option v-for="(item,index) in userCreated" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 2-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒コード" prop="snz_studentcode">
              <el-input v-model="originFormEndAbsent.snz_studentcode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" class="custom-date" label="修正日">
              <el-date-picker
                v-model="originFormEndAbsent.updated_at"
                disabled
                type="date"
                format="yyyy/MM/dd"
                prefix-icon="abc"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒氏名" prop="fullname">
              <el-input v-model="originFormEndAbsent.fullname" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" label="修正者">
              <el-select v-model="originFormEndAbsent.user_id" disabled placeholder="">
                <el-option v-for="(item,index) in userCreated" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="custom-date" label="休塾終了月" prop="snz_endmonth_period_id">
              <search-select-box
                v-model="originFormEndAbsent.snz_endmonth_period_id"
                :search-function="searchTargetPeriod"
                :default-data="dataTargetPeriod"
                key-name="snz_name"
                :append-query="{pattern_id: originFormEndAbsent.patternId}"
                placeholder=""
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                @onChange="handleChange('snz_endmonth_period_id')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['system']" label="ステータス" prop="status">
              <el-select v-model="originFormEndAbsent.status" placeholder="" :disabled="dialogEndAbsentStatus==='create'">
                <el-option v-for="(item,index) in dataStatus" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <el-button class="cancel" @click="closeModal">
          <svg-icon icon-class="_cancel" />
          <span>キャンセル</span>
        </el-button>
        <!--        <el-button v-if="!disableRole(['school'])" v-show="dialogEndAbsentStatus==='update'">-->
        <!--          <svg-icon icon-class="_trash_w" />-->
        <!--          <span>削除</span>-->
        <!--        </el-button>-->
        <button-save @save="saveEndAbsentClick" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SearchSelectBox from '../../../components/Common/SearchSelectBox';
import { ModalRegister } from '../assets/validate';
import ButtonSave from '../../../components/Common/Button/ButtonSave';
import { STATUS_REASON_WITHDRAW as statusReason } from '../../../const/ImportStatus';
import role from '@/directive/role';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
const targetPeriodRequest = new TargetPeriodRequest();

export default {
  components: {
    ButtonSave, SearchSelectBox,
  },
  directives: { role },
  mixins: [ModalRegister],
  props: {
    dialogFormEndAbsentVisible: {
      type: Boolean,
      default: false,
    },
    originFormEndAbsent: {
      type: Object,
      required: true,
    },
    dialogEndAbsentStatus: {
      type: String,
      required: true,
    },
    dataTargetPeriod: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
    userCreated: {
      type: Array,
      required: true,
    },
    dataStatus: {
      type: Array,
      required: true,
    },
    isRetired: {
      type: Boolean,
      default: false,
    },
    isInterRaw: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectDataReason: statusReason,
    };
  },
  methods: {
    closeModal() {
      this.$emit('closePopupEndAbsent');
    },
    saveEndAbsentClick() {
      this.$emit('saveEndAbsentClick');
    },
    async searchTargetPeriod(query) {
      return await targetPeriodRequest.searchName(query);
    },
    handleChange(prop) {
      this.$refs.formEndAbsent.clearValidate(prop);
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-dialog.absent-end-month::v-deep .el-form-item.el-form-item--medium {
  margin-bottom: 25px !important;
}
@import '../styles/modalWithDraw';
</style>
