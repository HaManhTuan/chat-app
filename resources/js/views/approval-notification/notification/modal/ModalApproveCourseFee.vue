<template>
  <div>
    <el-dialog
      title="受講費用"
      :visible.sync="show"
      :before-close="closeModal"
      top="52px"
      :append-to-body="true"
      class="custom-dialog-t"
    >
      <el-form ref="modelForm" :rules="rules" :model="modelForm">
        <h3 class="mt-0 title-2">通常月</h3>
        <div class="form-above">
          <el-row class="d-flex">
            <el-form-item class="form-above_label">
              <p class="label-above">前期</p>
              <p class="label-above">後期</p>
            </el-form-item>
          </el-row>
          <el-row class="d-flex">
            <!-- 1 -->
            <el-form-item
              class="err-first"
              label="授業料（3週）"
              prop="tuition_fee_3weeks_first_term"
            >
              <el-input
                v-model="modelForm.tuition_fee_3weeks_first_term"
                clearable
                @change="onChange($event, 'ip1')"
              />
            </el-form-item>
            <!-- 2 -->
            <el-form-item
              class="err-second"
              prop="tuition_fee_3weeks_second_term"
            >
              <el-input
                v-model="modelForm.tuition_fee_3weeks_second_term"
                clearable
                @change="onChange($event, 'ip2')"
              />
            </el-form-item>
          </el-row>
          <el-row class="d-flex">
            <!-- 3 -->
            <el-form-item
              class="err-first"
              label="授業料（4週）"
              prop="tuition_fee_4weeks_first_term"
            >
              <el-input
                v-model="modelForm.tuition_fee_4weeks_first_term"
                clearable
                @change="onChange($event, 'ip3')"
              />
            </el-form-item>
            <!-- 4 -->
            <el-form-item
              class="err-second"
              prop="tuition_fee_4weeks_second_term"
            >
              <el-input
                v-model="modelForm.tuition_fee_4weeks_second_term"
                clearable
                @change="onChange($event, 'ip4')"
              />
            </el-form-item>
          </el-row>
          <el-row class="d-flex">
            <!-- 5 -->
            <el-form-item
              class="err-first"
              label="教材およびテスト費"
              prop="teaching_materials_and_test_fees_first_term"
            >
              <el-input
                v-model="modelForm.teaching_materials_and_test_fees_first_term"
                clearable
                @change="onChange($event, 'ip5')"
              />
            </el-form-item>
            <!-- 6 -->
            <el-form-item
              class="err-second"
              prop="teaching_materials_and_test_fees_second_term"
            >
              <el-input
                v-model="modelForm.teaching_materials_and_test_fees_second_term"
                clearable
                @change="onChange($event, 'ip6')"
              />
            </el-form-item>
          </el-row>
        </div>
        <hr class="hr-modal-role">
        <div class="form-below">
          <div class="tag">
            <div class="tag-label">
              <p class="tag-label_label">春期講習</p>
            </div>
            <div class="tag-content">
              <el-form-item
                class="err-first"
                label="授業料"
                prop="spring_training_tuition_fee"
              >
                <!-- 7 -->
                <el-input
                  v-model="modelForm.spring_training_tuition_fee"
                  clearable
                  @change="onChange($event, 'ip7')"
                />
              </el-form-item>
              <el-form-item
                class="err-second"
                label="教材およびテスト費"
                prop="spring_training_teaching_materials_and_test_fees"
              >
                <!-- 8 -->
                <el-input
                  v-model="
                    modelForm.spring_training_teaching_materials_and_test_fees
                  "
                  clearable
                  @change="onChange($event, 'ip8')"
                />
              </el-form-item>
            </div>
          </div>
          <div class="tag">
            <div class="tag-label">
              <p class="tag-label_label">夏期講習</p>
            </div>
            <div class="tag-content">
              <el-form-item
                class="err-first"
                label="授業料"
                prop="summer_training_tuition_fee"
              >
                <!-- 9 -->
                <el-input
                  v-model="modelForm.summer_training_tuition_fee"
                  clearable
                  @change="onChange($event, 'ip9')"
                />
              </el-form-item>
              <el-form-item
                class="err-second"
                label="教材およびテスト費"
                prop="summer_training_teaching_materials_and_test_fees"
              >
                <!-- 10 -->
                <el-input
                  v-model="
                    modelForm.summer_training_teaching_materials_and_test_fees
                  "
                  clearable
                  @change="onChange($event, 'ip10')"
                />
              </el-form-item>
            </div>
          </div>
          <div class="tag">
            <div class="tag-label">
              <p class="tag-label_label">冬期講習</p>
            </div>
            <div class="tag-content">
              <el-form-item
                class="err-first"
                label="授業料"
                prop="winter_training_tuition_fee"
              >
                <!-- 11 -->
                <el-input
                  v-model="modelForm.winter_training_tuition_fee"
                  clearable
                  @change="onChange($event, 'ip11')"
                />
              </el-form-item>
              <el-form-item
                class="err-second"
                label="教材およびテスト費"
                prop="winter_training_teaching_materials_and_test_fees"
              >
                <!-- 12 -->
                <el-input
                  v-model="
                    modelForm.winter_training_teaching_materials_and_test_fees
                  "
                  clearable
                  @change="onChange($event, 'ip12')"
                />
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="group-button el container-3 form-footer">
          <ButtonCancel
            class="btn-cancel-fee"
            :disabled="disableCancel"
            :name="nameButtonCancel"
            @cancel="closeModal()"
          />
          <ButtonApprove
            class="btn-approve-fee"
            :loading="saveLoading"
            :disabled="disableSave"
            :name="nameButtonApprove"
            @save="saveCourseFee()"
          />
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import role from '@/directive/role';
import ButtonApprove from '@/components/Common/Button/ButtonApprove';
import ButtonCancel from '@/components/Common/Button/ButtonCancel';
import { ModalCourseFee } from './assets/validate';
import ApprovalNotificationRequest from '@/api/ApprovalNotification/ApprovalNotificationRequest';

const approvalNotificationRequest = new ApprovalNotificationRequest();

export default {
  name: 'ModalApproveCourseFee',
  directives: { role },
  components: {
    ButtonApprove,
    ButtonCancel,
  },
  mixins: [ModalCourseFee],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    idrecord: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      saveLoading: false,
      disableSave: false,
      disableCancel: false,
      nameButtonApprove: '承認',
      nameButtonCancel: 'キャンセル',
      modelFormNull: null,
      modelFormToSubmit: null,
      modelForm: {
        approval_notification_id: '',
        tuition_fee_3weeks_first_term: '',
        tuition_fee_3weeks_second_term: '',
        tuition_fee_4weeks_first_term: '',
        tuition_fee_4weeks_second_term: '',
        teaching_materials_and_test_fees_first_term: '',
        teaching_materials_and_test_fees_second_term: '',
        spring_training_tuition_fee: '',
        spring_training_teaching_materials_and_test_fees: '',
        summer_training_tuition_fee: '',
        summer_training_teaching_materials_and_test_fees: '',
        winter_training_tuition_fee: '',
        winter_training_teaching_materials_and_test_fees: '',
      },
    };
  },
  created() {
    this.roles = this.$store.getters.roles;
    this.modelFormNull = _.clone(this.modelForm);
    this.modelFormToSubmit = _.clone(this.modelForm);
    this.buttonApprove = '承認';
  },
  methods: {
    async closeModal() {
      await this.resetData();
      this.$refs.modelForm.clearValidate();
      this.$emit('close');
    },
    async saveCourseFee() {
      this.modelFormToSubmit.approval_notification_id = this.idrecord;
      this.modelFormToSubmit.tuition_fee_3weeks_first_term = this.modelForm.tuition_fee_3weeks_first_term.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.tuition_fee_3weeks_second_term = this.modelForm.tuition_fee_3weeks_second_term.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.tuition_fee_4weeks_first_term = this.modelForm.tuition_fee_4weeks_first_term.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.tuition_fee_4weeks_second_term = this.modelForm.tuition_fee_4weeks_second_term.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.teaching_materials_and_test_fees_first_term = this.modelForm.teaching_materials_and_test_fees_first_term.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.teaching_materials_and_test_fees_second_term = this.modelForm.teaching_materials_and_test_fees_second_term.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.spring_training_tuition_fee = this.modelForm.spring_training_tuition_fee.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.spring_training_teaching_materials_and_test_fees = this.modelForm.spring_training_teaching_materials_and_test_fees.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.summer_training_tuition_fee = this.modelForm.summer_training_tuition_fee.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.summer_training_teaching_materials_and_test_fees = this.modelForm.summer_training_teaching_materials_and_test_fees.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.winter_training_tuition_fee = this.modelForm.winter_training_tuition_fee.replace(
        /,/g,
        ''
      );
      this.modelFormToSubmit.winter_training_teaching_materials_and_test_fees = this.modelForm.winter_training_teaching_materials_and_test_fees.replace(
        /,/g,
        ''
      );
      this.$refs.modelForm.validate().then(async valid => {
        if (valid) {
          this.saveLoading = true;
          this.disableSave = true;
          await approvalNotificationRequest
            .courseFeeCreate(this.modelFormToSubmit)
            .then(valid => {
              if (valid) {
                this.$message({
                  message: '変更しました。',
                  type: 'success',
                });
              }
              this.$emit('hideButtonCourseFee');
              this.closeModal();
            })
            .catch(error => {
              if (error.response.status === 422) {
                this.$refs.modelForm.injectFormValidates(error.response);
              }
              if (error.response.status === 424) {
                this.$message({
                  type: 'error',
                  message: error.response.data.original.message,
                });
                this.$emit('hideButtonCourseFee');
                this.closeModal();
              }
            })
            .finally(() => {
              this.saveLoading = false;
              this.disableSave = false;
            });
        }
      });
    },
    checkRole(btnRoles, type) {
      const myRoles = this.roles;
      const diff = myRoles.filter(x => btnRoles.includes(x));
      if (diff.length > 0) {
        if (type === 'can') {
          return false;
        } else {
          return true;
        }
      } else {
        if (type === 'can') {
          return true;
        } else {
          return false;
        }
      }
    },
    onChange(value, input) {
      const newVal = this.convertInsertComma(value);
      if (input === 'ip1') {
        this.modelForm.tuition_fee_3weeks_first_term = newVal;
      }
      if (input === 'ip2') {
        this.modelForm.tuition_fee_3weeks_second_term = newVal;
      }
      if (input === 'ip3') {
        this.modelForm.tuition_fee_4weeks_first_term = newVal;
      }
      if (input === 'ip4') {
        this.modelForm.tuition_fee_4weeks_second_term = newVal;
      }
      if (input === 'ip5') {
        this.modelForm.teaching_materials_and_test_fees_first_term = newVal;
      }
      if (input === 'ip6') {
        this.modelForm.teaching_materials_and_test_fees_second_term = newVal;
      }
      if (input === 'ip7') {
        this.modelForm.spring_training_tuition_fee = newVal;
      }
      if (input === 'ip8') {
        this.modelForm.spring_training_teaching_materials_and_test_fees = newVal;
      }
      if (input === 'ip9') {
        this.modelForm.summer_training_tuition_fee = newVal;
      }
      if (input === 'ip10') {
        this.modelForm.summer_training_teaching_materials_and_test_fees = newVal;
      }
      if (input === 'ip11') {
        this.modelForm.winter_training_tuition_fee = newVal;
      }
      if (input === 'ip12') {
        this.modelForm.winter_training_teaching_materials_and_test_fees = newVal;
      }
    },
    convertInsertComma(value) {
      const newValue = value.replace(/,/g, '');
      return newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    resetData() {
      this.modelForm = _.clone(this.modelFormNull);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/modal/approve/styles.scss';
</style>
