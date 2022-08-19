<template>
  <!-- Form -->
  <div>
    <el-dialog
      title="受講内容変更"
      :visible.sync="showDialog"
      :before-close="closeModal"
      class="custom-dialog"
      @open="init"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <!-- ROW 1-->
        <el-row>
          <el-col :span="12">
            <el-form-item class="custom-date" label="年度" prop="snz_schoolyear">
              <el-date-picker
                v-model="form.snz_schoolyear"
                disabled
                type="year"
                placeholder="Pick a year"
                prefix-icon="abc"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="radio-button-custom">
              <el-radio-group v-model="form.change_cantractinfo_type" size="medium" @change="changeCantracInfoType">
                <el-radio :label="0" :disabled="Boolean(statusContactType)">科目変更</el-radio>
                <el-radio :label="1" :disabled="!Boolean(form.course.snz_cantractinfo_finish_flag)">受講終了</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 1-->
        <!-- ROW 2-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="校舎" prop="business_id">
              <el-input v-if="form.business_unit" v-model="form.business_unit.name" disabled />
              <el-input v-else v-model="form.business_unit" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="!Boolean(form.change_cantractinfo_type)"
              label="受講変更開始月"
              :rules="[
                {
                  required: !(form.snz_experiencecancel1 || form.snz_experiencecancel2),
                  message: '受講変更開始月を選択してください',
                  trigger: 'blur',
                },
              ]"
              prop="snz_cantractinfo_change_period"
            >
              <SearchSelectBox
                ref="changePeriod"
                v-model="form.snz_cantractinfo_change_period"
                :search-function="searchMonth"
                key-name="snz_name"
                :disabled="Boolean(form.snz_experiencecancel1 || form.snz_experiencecancel2)"
                :append-query="{pattern_id: form.business_unit.snz_calendar_pattern_id, order_desc_start: true}"
                placeholder=""
              />
            </el-form-item>
            <el-form-item
              v-else
              label="受講変更終了月"
              :rules="[
                {
                  required: Boolean(form.change_cantractinfo_type),
                  message: '受講変更終了月を選択してください',
                  trigger: 'blur',
                },
              ]"
              prop="snz_cantractinfo_finish_target_period"
            >
              <SearchSelectBox
                ref="changePeriod"
                v-model="form.snz_cantractinfo_finish_target_period"
                :search-function="searchMonth"
                key-name="snz_name"
                :append-query="{pattern_id: form.business_unit.snz_calendar_pattern_id}"
                placeholder=""
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 2-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="学年" prop="grade">
              <el-input v-if="form.grade" v-model="form.grade.snz_name" disabled />
              <el-input v-else v-model="form.grade" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="科目セット"
              :rules="[
                {
                  required: form.change_cantractinfo_type === activeType ? !Boolean(form.change_cantractinfo_type) : !(form.snz_experiencecancel1 || form.snz_experiencecancel2),
                  message: '科目セットを選択してください',
                  trigger: 'blur',
                },
              ]"
              prop="snz_change_subjectset_id"
            >
              <SearchSelectBox
                ref="changeSubjectSet"
                v-model="form.snz_change_subjectset_id"
                :search-function="searchSubjectSet"
                key-name="snz_display_name"
                :disabled="Boolean((form.snz_experiencecancel1 || form.snz_experiencecancel2) || form.change_cantractinfo_type)"
                :append-query="{
                  snz_brand: form.business_unit.snz_brand,
                  pattern_id: form.business_unit.snz_calendar_pattern_id,
                  or_school_year_null: form.snz_schoolyear,
                  course_id: form.snz_course_id,
                  id:form.snz_subjectset_id,
                  grade_id:form.snz_grade_id
                }"
                placeholder=""
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒コード" prop="snz_studentcode">
              <el-input v-model="form.snz_studentcode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.contact.snz_studentstatus === StudentStatus.EXPERIENCE_STUDENT" label="体験事前キャンセル" prop="snz_experiencecancel1">
              <el-select
                v-model="form.snz_experiencecancel1"
                :disabled="Boolean(form.snz_application_type != contractStatus.SNZ_APPLICATION_TYPE_EXPERIENCE || !!form.snz_experiencecancel2 || form.change_cantractinfo_type)"
                @change="changeExperienceCancel1"
              >
                <el-option :value="0" label="ー" />
                <el-option :value="1" label="✓">
                  <span class="el-checkbox__inner" />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒氏名" prop="student.fullname">
              <el-input v-model="form.student.fullname" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.contact.snz_studentstatus === StudentStatus.EXPERIENCE_STUDENT" class="custom-date" label="体験途中キャンセル">
              <el-select
                v-model="form.snz_experiencecancel2"
                :disabled="Boolean(!!form.snz_experiencecancel1 || form.snz_application_type != contractStatus.SNZ_APPLICATION_TYPE_EXPERIENCE || form.change_cantractinfo_type)"
                @change="changeExperienceCancel2"
              >
                <el-option :value="0" label="ー" />
                <el-option :value="1" label="✓">
                  <span class="el-checkbox__inner" />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="custom-date" label="申込区分" prop="snz_application_type">
              <el-select v-model="form.snz_application_type" disabled>
                <el-option
                  v-for="(item,index) in contractStatus.SNZ_APPLICATION_TYPE"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="custom-date" label="コース" prop="course">
              <el-input v-if="form.course" v-model="form.course.snz_name" disabled />
              <el-input v-else v-model="form.course" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" />
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <el-button class="cancel" @click="closeModal">
          <svg-icon icon-class="_cancel" />
          <span>キャンセル</span>
        </el-button>
        <button-transfer :loading="saveLoading" @save="saveContract" />
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ButtonTransfer from '../../../components/Common/Button/ButtonTransfer';
import { EditContactInfo } from '../assets/validate';
import role from '@/directive/role';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import TargetPeriodResource from '@/api/TargetPeriodRequest';
import contractStatus from '@/const/ContractInfo';
import ContractInfoResource from '@/api/contractInfo';
import SubjectSetResource from '@/api/SubjectSet';
import CommonSettings from '@/const/CommonSettings';
import StudentStatus from '@/const/StudentStatus';

const targetPeriodResource = new TargetPeriodResource();
const contractInfoResource = new ContractInfoResource();
const subjectSetResource = new SubjectSetResource();

export default {
  name: 'EditContractInfo',
  directives: { role },
  components: {
    ButtonTransfer,
    SearchSelectBox,
  },
  mixins: [EditContactInfo],
  props: {
    showDialog: {
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
    statusContactType: {
      type: String,
      default: '',
      required: false,
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
  methods: {
    init() {
      this.$nextTick(() => {
        if (this.$refs.changePeriod) {
          this.$refs.changePeriod.init();
        }
        if (this.$refs.changeSubjectSet) {
          this.$refs.changeSubjectSet.init();
        }
      });
    },
    async searchMonth(query) {
      return await targetPeriodResource.searchName(query);
    },
    async searchSubjectSet(query) {
      return await subjectSetResource.searchName(query);
    },
    closeModal() {
      this.$emit('close');
      this.$refs.form.clearValidate();
    },
    async saveContract() {
      await this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.saveLoading = true;
          await contractInfoResource.update(this.form.id, {
            contract_info: this.form.id,
            business_id: this.form.business_unit.id,
            snz_cantractinfo_change_period: this.form.snz_cantractinfo_change_period,
            snz_subjectset_id: this.form.snz_change_subjectset_id,
            snz_experiencecancel1: this.form.snz_experiencecancel1,
            snz_experiencecancel2: this.form.snz_experiencecancel2,
            business_closing_month_period_id: this.form.business_unit.snz_closing_month_period_id,
            change_cantractinfo_type: this.form.change_cantractinfo_type,
            snz_cantractinfo_finish_target_period: this.form.snz_cantractinfo_finish_target_period,
          }).then((res) => {
            if (res.original && res.original.status === 500) {
              this.$message({
                type: 'error',
                message: res.original.message,
              });
              return;
            }
            this.$message({
              type: 'success',
              message: this.commonText.saveSuccess,
            });
            this.$refs.form.clearValidate();
            this.$nextTick(() => {
              let redirect = false;
              if (this.$refs.changeSubjectSet && this.form.snz_change_subjectset_id) {
                const subject = this.$refs.changeSubjectSet.options.find(o => o.id === this.form.snz_change_subjectset_id);
                if (subject && subject.snz_update_subject_flag) {
                  redirect = true;
                  return this.redirectPage({
                    name: 'cantractinfo-detail',
                    params: {
                      id: this.form.id,
                      redirect: true,
                    },
                  });
                }
              }
              if (!redirect) {
                this.$emit('init');
                this.closeModal();
              }
            });
          }).catch(err => {
            if (err.response.status === 422) {
              if (err.response.data.errors.snz_subjectset_id) {
                err.response.data.errors.snz_change_subjectset_id = err.response.data.errors.snz_subjectset_id;
              }
              this.$refs.form.injectFormValidates(err.response);
              this.scrollTop();
            }
          }).finally(() => {
            this.saveLoading = false;
          });
        }
      });
    },

    changeExperienceCancel1() {
      if (this.form.snz_experiencecancel1) {
        this.form.snz_cantractinfo_change_period = null;
        this.form.snz_change_subjectset_id = null;
        this.form.snz_experiencecancel2 = 0;
      } else {
        this.setOriginData();
      }
    },
    changeExperienceCancel2() {
      if (this.form.snz_experiencecancel2) {
        this.form.snz_experiencecancel1 = 0;
        this.setOriginData();
      }
    },
    setOriginData() {
      this.form.snz_cantractinfo_change_period = this.originForm.snz_cantractinfo_change_period;
      this.form.snz_change_subjectset_id = this.originForm.snz_change_subjectset_id;
    },
    changeCantracInfoType() {
      this.form.snz_cantractinfo_change_period = this.originForm.snz_cantractinfo_change_period;
      this.form.snz_change_subjectset_id = this.originForm.snz_change_subjectset_id;
      this.form.snz_experiencecancel1 = this.originForm.snz_experiencecancel1;
      this.form.snz_experiencecancel2 = this.originForm.snz_experiencecancel2;
      this.form.snz_cantractinfo_finish_target_period = this.originForm.snz_cantractinfo_finish_target_period;
      this.$refs.form.clearValidate();
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
    width: 1016px;
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

/deep/.el-radio__inner {
  width: 20px;
  height: 20px;
}
/deep/.el-radio__input.is-checked {
  .el-radio__inner {
    border-color: #1467b3;
    background: #ffffff;
  }
  .el-radio__inner::after {
    background-color: #1467b3;
    width: 10px;
    height: 10px;
    left: 9px;
    top: 9px
  }
}
/deep/ .el-radio__input.is-checked + .el-radio__label {
  color: #1a1714;
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
