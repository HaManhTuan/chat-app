<template>
  <!-- Form -->
  <div>
    <el-dialog
      title="承認依頼"
      :visible.sync="showDialog"
      :before-close="closeModal"
      class="custom-dialog"
      @open="init"
    >
      <h3 class="btn-dual">#{{ form.id }}</h3>
      <el-form ref="form" v-loading="loading" :model="form">
        <el-row justify="space-around">
          <el-col :span="8">
            <el-form-item v-if="form.student" label="生徒氏名" prop="snz_student_code" label-width="30">
              <router-link :to="{ name: 'StudentDetail', params: { id: form.snz_student_code }}" class="input-link">{{ form.student.fullname }}</router-link>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学年" prop="snz_grade_id" label-width="30">
              <span v-if="form.grade" class="input-disable">{{ form.grade.snz_name }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="校舎" prop="snz_request_from_businessunit_id" label-width="30">
              <span v-if="form.request_from_business" class="input-disable">{{ form.request_from_business.name }} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <hr>
        <el-row justify="space-around">
          <el-col :span="8">
            <el-form-item label="カテゴリ" prop="snz_application_category" label-width="30">
              <router-link v-if="form.snz_application_category === AppCategory.CATEGORY_SUBJECT_ABNORNAL" :to="{ name: 'cantractinfo-detail', params: { id: form.snz_cantractinfo_id }}" class="input-link">{{ form.snz_application_category | mapOptions(categoryOption) }}</router-link>
              <span v-else class="input-disable">{{ form.snz_application_category | mapOptions(categoryOption) }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="受講開始月" prop="business_id" label-width="30">
              <span class="input-disable">{{ startMonth }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="移籍元校舎" prop="snz_request_to_businessunit_id" label-width="30">
              <span v-if="form.request_to_business" class="input-disable">{{ form.request_to_business.name }} </span>
              <span v-else class="input-disable">{{ 'ー' }} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row justify="space-around">
          <el-col :span="8">
            <el-form-item label="コース" prop="snz_course_id" label-width="30">
              <span class="input-disable">{{ form.course ? form.course.snz_name : 'ー' }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="変則終了予定月" prop="scheduled_end_month" label-width="30">
              <span class="input-disable">{{ (form.scheduled_end_month && form.snz_application_category === AppCategory.CATEGORY_SUBJECT_ABNORNAL) ? form.scheduled_end_month.snz_name : 'ー' }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="8" />
        </el-row>
        <el-row justify="start">
          <el-col :span="8">
            <el-form-item label="通年申請" prop="snz_application_reason" label-width="30">
              <span class="input-disable">{{ form | request_year }} </span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="申請理由" prop="snz_application_reason" label-width="30">
              <span class="input-disable request-year">{{ form.snz_application_category === AppCategory.CATEGORY_SUBJECT_ABNORNAL ? form.snz_application_reason : 'ー' }} </span>
            </el-form-item>
          </el-col>
        </el-row>
        <hr>
        <el-row justify="space-between">
          <el-col>
            <el-form-item label="承認者コメント" prop="snz_note" label-width="30">
              <el-input v-model="form.snz_note" class="i-comment" placeholder="" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <p class="text">登録内容を確認してボタンを選択してください。</p>
        <div class="group-btn">
          <el-button
            v-if="form.snz_application_category === AppCategory.CATEGORY_SUBJECT_ABNORNAL"
            v-role="['subject','organization']"
            :loading="loadingReject"
            :disabled="loadingManageApprove || loadingApprove"
            class="cancel"
            @click="reject"
          >
            <svg-icon icon-class="_cancel" />
            <span>却下</span>
          </el-button>
          <el-button
            v-show="form.snz_application_category === AppCategory.CATEGORY_SUBJECT_ABNORNAL"
            v-role="['subject']"
            class="bt-user"
            :loading="loadingManageApprove"
            :disabled="loadingReject || loadingApprove"
            @click="mangerApprove"
          >
            <svg-icon icon-class="person_check" />
            <span>部長承認</span>
          </el-button>
          <el-button
            v-role="['subject','organization']"
            class="btn-check"
            :loading="loadingApprove"
            :disabled="loadingReject || loadingManageApprove"
            @click="approve"
          >
            <svg-icon icon-class="icon_checkbox" />
            <span>承認</span>
          </el-button>
        </div>
        <div class="mt-12 group-btn2">
          <el-button
            v-if="form.snz_application_category===AppCategory.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL"
            v-role="['school']"
            class="bt-user pd-0"
            :loading="loadingParallelLearning"
            :disabled="loadingOpenAbsent|| loadingOpenWithdrawal || loadingShowModalFee"
            @click="parallelLearning"
          >
            <span>併塾</span>
          </el-button>
          <el-button
            v-if="applicationCategory===AppCategory.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL"
            v-role="['school','system']"
            class="bt-user pd-0"
            style="width: fit-content;"
            :loading="loadingOpenAbsent"
            :disabled="loadingParallelLearning|| loadingOpenWithdrawal || loadingShowModalFee"
            @click="openAbsent"
          >
            <span>休塾</span>
          </el-button>
          <el-button
            v-show="applicationCategory===AppCategory.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL"
            v-role="['school','system']"
            class="bt-user pd-0"
            :loading="loadingOpenWithdrawal"
            :disabled="loadingParallelLearning|| loadingOpenAbsent || loadingShowModalFee"
            @click="openWithdrawal"
          >
            <span>退塾</span>
          </el-button>
          <el-button
            v-show="applicationCategory===AppCategory.CATEGORY_SUBJECT_ABNORNAL"
            v-role="['employee','parttime']"
            class="model-fee"
            :loading="loadingShowModalFee"
            :disabled="form.snz_approve_status===APPROVE_STATUS.REJECTED || loadingParallelLearning|| loadingOpenAbsent || loadingOpenWithdrawal"
            @click="showModalFee()"
          >
            <svg-icon icon-class="edit_note" />
            <span>受講費用を入力する</span>
          </el-button>
          <ModalApproveCourseFee
            class=""
            :idrecord="idRecord"
            :show="showModalFeee"
            @close="closeModalFee()"
            @hideButtonCourseFee="hideButCourseFee()"
          />
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import role from '@/directive/role';
import contractStatus from '@/const/ContractInfo';
import ApprovalAcceptedResource from '@/api/ApprovalNotification/ApprovalAccepted';
import CommonSettings from '@/const/CommonSettings';
import { mapOptions } from '@/filters/mapOptions';
import { CategoryOption } from '@/const/ApprovalNotification/Category';
import ModalApproveCourseFee from '@/views/approval-notification/notification/modal/ModalApproveCourseFee';
import { request_year } from '@/views/approval-notification/filters';
import StudentStatus from '@/const/StudentStatus';
import AppCategory from '@/const/ApprovalNotification/AppCategory';
import { APPROVE_STATUS } from '@/const/ApprovalNotification/Status';
const approvalAccepted = new ApprovalAcceptedResource();

export default {
  name: 'ApproveDetail',
  directives: { role },
  components: {
    ModalApproveCourseFee,
  },
  filters: {
    mapOptions: mapOptions,
    request_year: request_year,
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    id: {
      type: [String, Number],
      required: false,
      default: 0,
    },
    statusStudent: {
      type: [String, Number],
      required: false,
      default: 0,
    },
    applicationCategory: {
      type: [String, Number],
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      categoryOption: CategoryOption,
      commonText: CommonSettings.COMMON_TXT,
      contractStatus: contractStatus,
      saveLoading: false,
      loading: false,
      loadingReject: false,
      loadingManageApprove: false,
      loadingApprove: false,
      loadingParallelLearning: false,
      loadingOpenAbsent: false,
      loadingOpenWithdrawal: false,
      loadingShowModalFee: false,
      idRecord: null,
      showButModalFee: false,
      form: {},
      showModalFeee: false,
      StudentStatus,
      AppCategory,
      APPROVE_STATUS,
    };
  },
  computed: {
    startMonth: function() {
      if (this.form.snz_application_category === AppCategory.CATEGORY_SUBJECT_ABNORNAL && this.form.start_month) {
        return this.form.start_month.snz_name;
      }
      if (this.form.snz_application_category === AppCategory.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL && this.form.contract_info) {
        if (this.form.contract_info.snz_application_type === contractStatus.SNZ_APPLICATION_TYPE_EXPERIENCE) {
          return this.form.contract_info.experience_start_month.snz_name;
        }
        if (this.form.contract_info.snz_application_type === contractStatus.SNZ_APPLICATION_TYPE_JOIN) {
          return this.form.contract_info.enter_month.snz_name;
        }
      }
      return 'ー';
    },
  },
  methods: {
    async init() {
      this.loading = true;
      this.roles = this.$store.getters.roles;
      this.form = await approvalAccepted.get(this.id);
      if (this.form.course_fee != null) {
        this.showButModalFee = true;
      } else {
        this.showButModalFee = false;
      }
      this.loading = false;
    },
    closeModal() {
      this.$emit('close');
      this.$refs.form.clearValidate();
    },
    getForm() {
      return {
        id: this.form.id,
        snz_note: this.form.snz_note,
      };
    },
    async approve() {
      this.loadingApprove = true;
      await approvalAccepted.approvalById(this.form.id, this.getForm())
        .then(async(res) => {
          this.$message({
            type: 'success',
            message: this.commonText.saveSuccess,
          });
          this.$refs.form.clearValidate();
          // Count Notification
          const resCount = await approvalAccepted.countNotification();
          const data = resCount.original.data ? resCount.original.data : {};
          const total = resCount.original.total ? resCount.original.total : null;
          await this.$store.dispatch('app/setDataNotification', data);
          await this.$store.dispatch('app/setTotalNotification', total);
          this.closeModal();
        }).catch(res => {
          if (res.response.status === 424) {
            this.$message({
              type: 'error',
              message: res.response.data.original.message,
            });
          }
          if (res.response.status === 422) {
            this.$refs.form.injectFormValidates(res.response);
            this.$refs.form.focusFieldError();
          }
        }).finally(() => {
          this.loadingApprove = false;
        });
    },
    async mangerApprove() {
      this.loadingManageApprove = true;
      await approvalAccepted.mangerApprove(this.getForm())
        .then(async(res) => {
          this.$message({
            type: 'success',
            message: this.commonText.saveSuccess,
          });
          this.$refs.form.clearValidate();
          // Count Notification
          const resCount = await approvalAccepted.countNotification();
          const data = resCount.original.data ? resCount.original.data : {};
          const total = resCount.original.total ? resCount.original.total : null;
          await this.$store.dispatch('app/setDataNotification', data);
          await this.$store.dispatch('app/setTotalNotification', total);
          this.closeModal();
        }).catch(res => {
          if (res.response.status === 424) {
            this.$message({
              type: 'error',
              message: res.response.data.original.message,
            });
          }
          if (res.response.status === 422) {
            this.$refs.form.injectFormValidates(res.response);
            this.$refs.form.focusFieldError();
          }
        }).finally(() => {
          this.loadingManageApprove = false;
        });
    },
    async reject() {
      this.loadingReject = true;
      await approvalAccepted.reject(this.form.id)
        .then(async(res) => {
          this.$message({
            type: 'success',
            message: this.commonText.saveSuccess,
          });
          // Count Notification
          const resCount = await approvalAccepted.countNotification();
          const data = resCount.original.data ? resCount.original.data : {};
          const total = resCount.original.total ? resCount.original.total : null;
          await this.$store.dispatch('app/setDataNotification', data);
          await this.$store.dispatch('app/setTotalNotification', total);
          this.closeModal();
        }).catch(res => {
          if (res.response.status === 424) {
            this.$message({
              type: 'error',
              message: res.response.data.original.message,
            });
          }
        }).finally(() => {
          this.loadingReject = false;
        });
    },
    async parallelLearning() {
      this.loadingParallelLearning = true;
      await approvalAccepted.parallelLearning(this.form.id, this.getForm())
        .then(() => {
          this.$message({
            type: 'success',
            message: this.commonText.saveSuccess,
          });
          this.closeModal();
        }).catch(res => {
          if (res.response.status === 424) {
            this.$message({
              type: 'error',
              message: res.response.data.original.message,
            });
          }
          if (res.response.status === 422) {
            this.$refs.form.injectFormValidates(res.response);
            this.$refs.form.focusFieldError();
          }
        }).finally(() => {
          this.loadingParallelLearning = false;
        });
    },
    async saveContract() {
      await this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.saveLoading = true;
          await approvalAccepted.update(this.form.id, {
            contract_info: this.form.id,
            business_id: this.form.business_unit.id,
            snz_cantractinfo_change_period: this.form.snz_cantractinfo_change_period,
            snz_subjectset_id: this.form.snz_change_subjectset_id,
            snz_experiencecancel1: this.form.snz_experiencecancel1,
            snz_experiencecancel2: this.form.snz_experiencecancel2,
            business_closing_month_period_id: this.form.business_unit.snz_closing_month_period_id,
            change_cantractinfo_type: this.form.change_cantractinfo_type,
            snz_cantractinfo_finish_target_period: this.form.snz_cantractinfo_finish_target_period,
          }).then(() => {
            this.$emit('init');
            this.closeModal();
            this.$message({
              type: 'success',
              message: this.commonText.saveSuccess,
            });
            this.$refs.form.clearValidate();
          }).catch(err => {
            if (err.response.status === 422) {
              this.$refs.form.injectFormValidates(err.response);
              this.scrollTop();
            }
          }).finally(() => {
            this.saveLoading = false;
          });
        }
      });
    },
    showModalFee(){
      if (this.showButModalFee) {
        this.$message({
          type: 'error',
          message: 'この承認依頼の受講費用を既に入力していますので、再登録できません。',
        });
        return;
      }
      this.showModalFeee = true;
      this.idRecord = this.id;
    },
    closeModalFee() {
      this.showModalFeee = false;
    },
    async openAbsent() {
      this.$emit('openAbsent');
    },
    openWithdrawal() {
      this.$emit('openWithdrawal');
    },
    hideButCourseFee() {
      this.showButModalFee = true;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/modal/modal";

.i-small{
  input{
    width: 164px;
  }
}
.request-year{
  width: 524px !important;
}
.i-comment{
  width: 850px;
}
.bt-user{
  background-color: #1467B3;
  &:hover{
    background-color: #1467B3;
  }
}
.btn-check{
  background-color: #C70000;
  &:hover{
    background-color: #C70000;
  }
}
.btn-dual{
  position: absolute;
  top: 31px;
  right: 104px;
  color: #1A1714;
  font-size: 22px;
}
hr{
  margin-bottom: 20px;
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
      padding: 0 30px 80px 55px;
      .text {
        display: table;
        font-weight: 600;
      }
      .mt-12{
        margin-top: 12px !important;
        .model-fee {
          background-color: #343434;
          width: unset !important;
        }
      }
    }
  }
}
/deep/.el-form-item__error{
  min-width: 500px;
}
.input-disable{
  width: 197px;
  font-size: 15px;
  background-color: #f0f0f0;
  border: 1px #f0f0f0 solid;
  border-radius: 6px;
  padding-left: 10px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
}
.input-link{
  @extend .input-disable;
  color: #1467B3;
}
/deep/.label.el-form-item__label{
  padding-left: 18px;
}
.group-btn{
  position: absolute;
  right: 34px;
  bottom: 76px;
  button{
    width: fit-content !important;
  }
}
.group-btn2{
  position: absolute;
  right: 11px;
  button{
    width: fit-content !important;
  }
}
</style>
