<template>
  <!-- Form -->
  <div>
    <el-dialog
      v-if="!saveLoading"
      title="変則申請"
      :visible.sync="showDialog"
      :before-close="closeModal"
      class="custom-dialog"
      @open="init"
    >
      <el-form ref="anomalousForm" :model="form">
        <!-- ROW 1-->
        <el-row>
          <el-col>
            <el-form-item
              class="custom-date"
              label="変則終了予定月"
              prop="snz_scheduled_end_month"
              :rules="[
                {
                  required: true,
                  message: '変則終了予定月を選択してください',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <SearchSelectBox
                ref="changePeriod"
                v-model="form.snz_scheduled_end_month"
                :search-function="searchNameTargetPeriod"
                key-name="snz_name"
                key-id="id"
                placeholder=""
                :popper-append-to-body="true"
                :append-query="{ businessunit_id: form.businessunit_id }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 1-->
        <!-- ROW 2-->
        <el-row>
          <el-col>
            <el-form-item
              label="変則申請理由"
              prop="snz_application_reason"
              :rules="[
                {
                  required: true,
                  message: '変則申請理由を入力してください。',
                  trigger: ['blur', 'change'],
                },
                {
                  max: 2000,
                  message: '変則申請理由は2000文字以内で、入力してください。',
                  trigger: ['blur', 'change'],
                },
              ]"
            >
              <el-input
                v-model="form.snz_application_reason"
                type="textarea"
                :rows="4"
                placeholder=""
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 2-->
      </el-form>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <el-button class="cancel" @click="closeModal">
          <svg-icon icon-class="_cancel" />
          <span>キャンセル</span>
        </el-button>
        <el-button class="button-save" :loading="saveLoading || loading" @click="requestClick">
          <svg-icon icon-class="white_document" />
          <span>変則申請</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import role from '@/directive/role';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import contractStatus from '@/const/ContractInfo';
import CommonSettings from '@/const/CommonSettings';
import StudentStatus from '@/const/StudentStatus';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';

const targetPeriodRequest = new TargetPeriodRequest();

export default {
  name: 'AnomalousRequest',
  directives: { role },
  components: {
    SearchSelectBox,
  },
  mixins: [],
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      required: true,
    },
    originForm: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      contractStatus: contractStatus,
      selectData: [],
      saveLoading: false,
      activeType: 1,
    };
  },
  computed: {
    StudentStatus() {
      return StudentStatus;
    },
  },
  async created() {
    this.saveLoading = true;
    await this.init();
    this.saveLoading = false;
  },
  methods: {
    init() {
      var model = JSON.parse(JSON.stringify(this.form));
      model.snz_scheduled_end_month = model.snz_application_pending_flag && model.newest_approval_notification ? model.newest_approval_notification.snz_scheduled_end_month : null;
      model.snz_application_reason = model.snz_application_pending_flag && model.newest_approval_notification ? model.newest_approval_notification.snz_application_reason : null;
      this.$set(this.form, 'snz_scheduled_end_month', model.snz_scheduled_end_month);
      this.$set(this.form, 'snz_application_reason', model.snz_application_reason);
      this.$set(this.originForm, 'snz_scheduled_end_month', model.snz_scheduled_end_month);
      this.$set(this.originForm, 'snz_application_reason', model.snz_application_reason);
    },
    async searchNameTargetPeriod(query) {
      return targetPeriodRequest.searchName(query);
    },
    async initTarget(){
      this.$nextTick(() => {
        if (this.$refs.changePeriod) {
          this.$refs.changePeriod.init();
        }
      });
    },
    closeModal() {
      this.$emit('close');
      this.$refs.anomalousForm.clearValidate();
    },
    async requestClick() {
      this.$emit('save-request');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/modal';

.custom-dialog::v-deep .el-dialog .el-dialog__body .el-form-item.radio-button-custom {
  justify-content: space-between;
  margin-left: 80px;
}

.custom-dialog::v-deep {
  .el-dialog {
    height: unset;
    width: 1060px;
    .el-dialog__header {
      .el-dialog__title {
        font-weight: 500;
      }
    }
    .el-dialog__footer {
      margin-top: 70px !important;
    }
  }
}
.el-checkbox__inner {
  background: none !important;
  border: none !important;

  &:after {
    border-color: #1a1714 !important;
    border-width: 4px !important;
    top: 0 !important;
    width: 8px !important;
    height: 15px !important;
    left: 0;
    transform: rotate(45deg) scaleY(1);
    box-sizing: content-box;
    content: '';
  }
}
/deep/.el-form-item__error{
  min-width: 500px;
}
</style>
