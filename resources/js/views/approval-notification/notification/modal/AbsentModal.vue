<template>
  <div>
    <el-dialog
      title="休塾開始を登録"
      :before-close="closeModal"
      :visible.sync="dialogFormStartAbsentVisible"
      top="52px"
      class="custom-dialog absent-end-month"
    >
      <h3 class="btn-dual">#{{ originFormStartAbsent.id_approval_notification }}</h3>
      <el-form ref="formStartAbsent" :rules="rules" :model="originFormStartAbsent">
        <!--row-1-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="年度" prop="created_at">
              <el-date-picker
                v-model="originFormStartAbsent.created_at"
                format="yyyy"
                disabled
                type="date"
                prefix-icon="abc"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="休塾開始月" prop="snz_startmonth_period_id">
              <search-select-box
                v-model="originFormStartAbsent.snz_startmonth_period_id"
                :search-function="searchTargetPeriod"
                :default-data="dataTargetPeriod"
                key-name="snz_name"
                :append-query="{pattern_id: originFormStartAbsent.patternId}"
                placeholder=""
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                @onChange="handleChange('snz_startmonth_period_id')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--row-2-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="校舎" prop="snz_request_from_businessunit_id">
              <el-input v-model="originFormStartAbsent.snz_request_to_businessunit_id" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="休塾理由" prop="snz_absentreasonoption">
              <el-select v-model="originFormStartAbsent.snz_absentreasonoption" clearable filterable placeholder="">
                <el-option v-for="(item,index) in selectDataReason" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--row-3-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="学年" prop="snz_grade_id">
              <el-input v-model="originFormStartAbsent.snz_grade_id" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="休塾理由その他" prop="snz_absentreasonother">
              <el-input v-model="originFormStartAbsent.snz_absentreasonother" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--row-4-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒コード" prop="snz_studentcode">
              <el-input v-model="originFormStartAbsent.snz_studentcode" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!--row-5-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒氏名" prop="fullname">
              <el-input v-model="originFormStartAbsent.fullname" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <el-button class="cancel" @click="closeModal">
          <svg-icon icon-class="_cancel" />
          <span>キャンセル</span>
        </el-button>
        <button-save-with-drawal @save="saveStartAbsentClick" />
      </span>
    </el-dialog>
  </div>
</template>

<script>

import SearchSelectBox from '../../../../components/Common/SearchSelectBox';
import { ModalAbsentRegister } from '../mixins/modal/absent/validate';
import { STATUS_REASON_WITHDRAW as statusReason } from '../../../../const/ImportStatus';
import role from '@/directive/role';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
const targetPeriodRequest = new TargetPeriodRequest();
import ButtonSaveWithDrawal from './components/modal/ButtonSaveWithDrawal';

export default {
  components: {
    ButtonSaveWithDrawal,
    SearchSelectBox,
  },
  directives: { role },
  mixins: [ModalAbsentRegister],
  props: {
    dialogFormStartAbsentVisible: {
      type: Boolean,
      default: false,
    },
    originFormStartAbsent: {
      type: Object,
      default: () => {},
    },
    dataTargetPeriod: {
      type: Array,
      required: true,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      selectDataReason: statusReason,
    };
  },
  methods: {
    async searchTargetPeriod(query) {
      return await targetPeriodRequest.searchName(query);
    },
    closeModal() {
      this.$emit('closeStartAbsent');
    },
    saveStartAbsentClick() {
      this.$emit('saveStartAbsentClick');
    },
    handleChange(prop) {
      this.$refs.formStartAbsent.clearValidate(prop);
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-dual{
  position: absolute;
  top: 31px;
  right: 104px;
  color: #1A1714;
  font-size: 22px;
}
.custom-dialog.absent-end-month::v-deep .el-form-item.el-form-item--medium {
  margin-bottom: 25px !important;
}
.custom-dialog::v-deep .el-dialog .el-dialog__body .el-form-item.el-form-item--medium .el-input .el-input__inner{
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}

.custom-dialog::v-deep .el-dialog .el-dialog__body .el-form-item .el-textarea.el-input--medium{
  textarea::-webkit-scrollbar {
    width: 10px;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: darkgrey;
    border-radius: 8px;
    background-clip: padding-box;
  }
}

@import '../styles/modal/absent/style';
</style>
