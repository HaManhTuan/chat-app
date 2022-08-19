<template>
  <!-- Form -->
  <div>
    <el-dialog
      title="退塾情報を登録"
      :before-close="closeModal"
      :visible.sync="dialogFormWithDrawalVisible"
      top="52px"
      class="custom-dialog withdrawl"
    >
      <h3 class="btn-dual">#{{ originFormWithDrawRegister.id_approval_notification }}</h3>
      <el-form ref="formWithDraw" :rules="rules" :model="originFormWithDrawRegister">
        <!--row-1-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="年度" prop="created_at">
              <el-date-picker
                v-model="originFormWithDrawRegister.created_at"
                format="yyyy"
                disabled
                type="date"
                prefix-icon="abc"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退塾年月" prop="snz_withdrawalmonth_period_id">
              <search-select-box
                v-model="originFormWithDrawRegister.snz_withdrawalmonth_period_id"
                :search-function="searchTargetPeriod"
                :default-data="dataTargetPeriod"
                key-name="snz_name"
                :append-query="{pattern_id: originFormWithDrawRegister.patternId}"
                placeholder=""
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                @onChange="handleChange('snz_withdrawalmonth_period_id')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!--row-2-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="校舎" prop="snz_request_from_businessunit_id">
              <el-input v-model="originFormWithDrawRegister.snz_request_to_businessunit_id" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" class="description">
              <p class="des pos-1">生徒の最終在籍月を入力</p>
              <p class="des">例)2021年6月末退塾なら、2106神とする</p>
            </el-form-item>
          </el-col>
        </el-row>
        <!--row-3-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="学年" prop="snz_grade_id">
              <el-input v-model="originFormWithDrawRegister.snz_grade_id" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退塾理由" prop="snz_withdrawalreasonoption">
              <el-select v-model="originFormWithDrawRegister.snz_withdrawalreasonoption" clearable filterable placeholder="">
                <el-option v-for="(item,index) in selectDataReason" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!--row-4-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒コード" prop="snz_studentcode">
              <el-input v-model="originFormWithDrawRegister.snz_studentcode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="退塾理由その他" prop="snz_withdrawalreason">
              <el-input v-model="originFormWithDrawRegister.snz_withdrawalreason" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <!--row-5-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒氏名" prop="fullname">
              <el-input v-model="originFormWithDrawRegister.fullname" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!--row-6-->
        <!--        <el-row>-->
        <!--          <el-col :span="12">-->
        <!--            <el-form-item label="申込区分" prop="fullname">-->
        <!--              <el-input v-model="originFormWithDrawRegister.fullname" disabled />-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
      </el-form>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <el-button class="cancel" @click="closeModal">
          <svg-icon icon-class="_cancel" />
          <span>キャンセル</span>
        </el-button>
        <button-save-with-drawal @save="saveWithDrawl" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SearchSelectBox from '../../../../components/Common/SearchSelectBox';
import { ModalWithDrawalRegister } from '../mixins/modal/withdrawal/validate';
import { STATUS_REASON_WITHDRAW as statusReason } from '../../../../const/ImportStatus';
import role from '@/directive/role';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
import ButtonSaveWithDrawal from './components/modal/ButtonSaveWithDrawal';
const targetPeriodRequest = new TargetPeriodRequest();

export default {
  components: {
    ButtonSaveWithDrawal,
    SearchSelectBox,
  },
  directives: { role },
  mixins: [ModalWithDrawalRegister],
  props: {
    dialogFormWithDrawalVisible: {
      type: Boolean,
      default: false,
    },
    originFormWithDrawRegister: {
      type: Object,
      required: true,
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
      this.$emit('closeModalWithDrawal');
    },
    saveWithDrawl() {
      this.$emit('saveWithDrawalClick');
    },
    handleChange(prop) {
      this.$refs.formWithDraw.clearValidate(prop);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/modal/absent/style';
.btn-dual{
  position: absolute;
  top: 31px;
  right: 104px;
  color: #1A1714;
  font-size: 22px;
}
.custom-dialog::v-deep .el-form-item.el-form-item--medium {
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
.custom-dialog::v-deep .el-dialog .el-dialog__body .el-form-item.description {
  margin-left: 190px;
  justify-content: center;
}
.el-form-item::v-deep .el-form-item__content.el-form-item__content .des {
  padding: 0px;
  margin: 2px 0px 2px -20px;
}
.el-form-item::v-deep .el-form-item__content.el-form-item__content .pos-1 {
  line-height: 0px;
}
</style>
