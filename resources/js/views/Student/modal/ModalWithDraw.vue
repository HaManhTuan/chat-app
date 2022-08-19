<template>
  <!-- Form -->
  <div>
    <el-dialog
      title="退塾情報を登録"
      :before-close="closeModal"
      :visible.sync="dialogFormVisible"
      top="52px"
      class="custom-dialog"
    >
      <el-form ref="form" :rules="rules" :model="originFormRegister">
        <!-- ROW 1-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="校舎" prop="snz_businessunit_id">
              <el-input v-model="originFormRegister.snz_businessunit_id" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['system','parttime','employee']" label="作成日">
              <el-date-picker
                v-model="originFormRegister.created_at"
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
              <el-input v-model="originFormRegister.snz_grade_name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['system','parttime','employee']" label="作成者">
              <el-select v-model="originFormRegister.user_id" disabled placeholder="">
                <el-option v-for="(item,index) in userCreated" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 2-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒コード" prop="snz_studentcode">
              <el-input v-model="originFormRegister.snz_studentcode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['system','parttime','employee']" class="custom-date" label="修正日">
              <el-date-picker
                v-model="originFormRegister.updated_at"
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
              <el-input v-model="originFormRegister.fullname" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['system','parttime','employee']" label="修正者">
              <el-select v-model="originFormRegister.modified_by_user_id" disabled placeholder="">
                <el-option v-for="(item,index) in userCreated" :key="index" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              class="custom-date custom-hint"
              label="退塾年月"
              :rules="[
                {
                  required: Boolean(originFormRegister.status),
                  message: '退塾年月を選択してください', trigger: 'change'
                },
              ]"
              prop="snz_withdrawalmonth_period_id"
            >
              <search-select-box
                v-model="originFormRegister.snz_withdrawalmonth_period_id"
                :search-function="searchTargetPeriod"
                :default-data="dataTargetPeriod"
                key-name="snz_name"
                :append-query="{pattern_id: originFormRegister.patternId}"
                placeholder=""
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                @onChange="handleChange('snz_withdrawalmonth_period_id')"
              />
              <span class="des pos-1">生徒の最終在籍月を入力</span>
              <span class="des">例)2021年6月末退塾なら、2106神とする</span>
            </el-form-item>
          </el-col>
          <el-col v-role="['system']" :span="12">
            <el-form-item label="ステータス" prop="status">
              <el-select v-if="dialogStatus==='update'" v-model="originFormRegister.status" prop="region" placeholder="">
                <el-option v-for="(item,index) in dataStatus" :key="index" :label="item.label" :value="item.value" />
              </el-select>
              <el-select v-else v-model="originFormRegister.status" prop="region" placeholder="">
                <el-option v-for="(item,index) in dataStatusSystem" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="退塾理由"
              :rules="[
                {
                  required: Boolean(originFormRegister.status),
                  message: '退塾理由を選択してください', trigger: 'change'
                },
              ]"
              prop="snz_withdrawalreasonoption"
            >
              <el-select v-model="originFormRegister.snz_withdrawalreasonoption" clearable placeholder="">
                <el-option v-for="(item,index) in selectDataReason" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="退塾理由その他" prop="snz_withdrawalreason">
              <el-input v-model="originFormRegister.snz_withdrawalreason" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <el-button class="cancel" @click="closeModal">
          <svg-icon icon-class="_cancel" />
          <span>キャンセル</span>
        </el-button>
        <el-button v-if="ableRole(['system'])" v-show="dialogStatus==='update'" class="delete" @click="deleteWithDraw">
          <svg-icon icon-class="_trash_w" />
          <span>削除</span>
        </el-button>
        <button-save @save="saveClick" />
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
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    originFormRegister: {
      type: Object,
      required: true,
    },
    dialogStatus: {
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
    dataStatusSystem: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectDataReason: statusReason,
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    saveClick() {
      this.$emit('saveWithDraw');
    },
    deleteWithDraw() {
      this.$emit('deleteWithDraw');
    },
    async searchTargetPeriod(query) {
      return await targetPeriodRequest.searchName(query);
    },
    handleChange(prop) {
      this.$refs.form.clearValidate(prop);
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-dialog::v-deep .el-dialog {
  height: 680px !important;
}
.custom-dialog::v-deep .el-form-item.el-form-item--medium {
  margin-bottom: 21px !important;
}
.custom-hint::v-deep .el-form-item__error {
  top: 39%;
}
@import '../styles/modalWithDraw';
</style>
