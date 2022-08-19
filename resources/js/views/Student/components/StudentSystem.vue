<template>
  <div v-if="form" class="student-system">
    <el-form ref="form" v-loading="formLoading" label-width="100px" :rules="rules" :model="modelForm">
      <div class="card-body">
        <h3 class="title-1">システム</h3>
        <!-- ROW 1 -->
        <el-row>
          <!-- 1.1 -->
          <el-col :span="8">
            <el-form-item label-width="124px" label="校舎" prop="business_unit.id" :rules="rules.business_unit.id">
              <el-select
                v-model="modelForm.business_unit.id"
                filterable
                placeholder=""
                no-data-text="データはありません。"
                :disabled="disableRole([])"
                :popper-append-to-body="false"
                class="remove-mb-el-select"
                clearable
              >
                <el-option
                  v-for="item in businessUnitList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 1.2 created_at -->
          <el-col :span="8">
            <el-form-item label-width="100px" label="作成日" prop="ct_created_at">
              <el-date-picker
                v-model="modelForm.ct_created_at"
                prefix-icon="abc"
                type="date"
                placeholder=""
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                :disabled="true"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 20px" />
              </span>
            </el-form-item>
          </el-col>
          <!-- 1.3 -->
          <el-col :span="8">
            <el-form-item label-width="150px" label="学年更新対象" prop="snz_gradeupdate">
              <el-select
                v-model="modelForm.snz_gradeupdate"
                filterable
                placeholder=""
                no-data-text="データはありません。"
                :disabled="disableRole([])"
                :popper-append-to-body="false"
                class="remove-mb-el-select"
                clearable
              >
                <el-option
                  v-for="item in GradeUpdate"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 1 -->

        <!-- ROW 2 -->
        <el-row>
          <!-- 2.1 studentCode -->
          <el-col :span="8">
            <el-form-item label-width="124px" label="生徒コード" prop="snz_studentcode">
              <InputNumber v-model="modelForm.snz_studentcode" clearable />
            </el-form-item>
          </el-col>
          <!-- 2.2 -->
          <el-col :span="8">
            <el-form-item label-width="100px" label="作成者" prop="ct_created_by">
              <el-select
                v-model="modelForm.ct_created_by"
                clearable
                placeholder=""
                no-data-text="データはありません。"
                :popper-append-to-body="false"
                class="remove-mb-el-select"
                :disabled="true"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 2.3 -->
          <el-col :span="8">
            <el-form-item label-width="150px" label="学年表示切替処理" prop="snz_gradedispswitched">
              <el-input v-model="modelForm.snz_gradedispswitched" clearable :disabled="disableRole([])" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 2 -->

        <!-- ROW 3 -->
        <el-row>
          <!-- 3.1 -->
          <el-col :span="8">
            <el-form-item label-width="124px" label="生徒ステータス" prop="snz_studentstatus">
              <el-select
                v-model="modelForm.snz_studentstatus"
                placeholder=""
                no-data-text="データはありません。"
                :popper-append-to-body="false"
                class="remove-mb-el-select"
                :disabled="disableRole([])"
                clearable
              >
                <el-option
                  v-for="item in studentStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 3.2 -->
          <el-col :span="8">
            <el-form-item label-width="100px" label="修正日" prop="ct_updated_at">
              <el-date-picker
                v-model="modelForm.ct_updated_at"
                prefix-icon="abc"
                type="date"
                placeholder=""
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                :picker-options="datePickerOptions"
                :disabled="true"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 20px" />
              </span>
            </el-form-item>
          </el-col>
          <!-- 3.3 -->
          <el-col :span="8">
            <el-form-item label-width="150px" label="カレンダーパターン" prop="snz_calendar_pattern_id">
              <el-select
                v-model="modelForm.business_unit.snz_calendar_pattern_id"
                clearable
                placeholder=""
                no-data-text="データはありません。"
                :popper-append-to-body="false"
                class="remove-mb-el-select"
                :disabled="true"
              >
                <el-option
                  v-for="item in carlendarPatternList"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 3 -->

        <!-- ROW 4 -->
        <el-row type="flex" justify="space-around" class="">
          <!-- 4.1 snz_internalcode -->
          <el-col :span="8">
            <el-form-item label-width="124px" label="内部コード" prop="snz_internalcode">
              <InputNumber v-model="modelForm.snz_internalcode" clearable />
            </el-form-item>
          </el-col>
          <!-- 4.2 -->
          <el-col :span="8">
            <el-form-item label-width="100px" label="修正者" prop="ct_modified_by">
              <el-select
                v-model="modelForm.ct_modified_by"
                placeholder=""
                no-data-text="データはありません。"
                :popper-append-to-body="false"
                class="remove-mb-el-select"
                :disabled="true"
                clearable
              >
                <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 4.3 -->
          <el-col :span="8">
            <el-form-item label-width="150px" label="ステータス" prop="status">
              <el-select
                v-model="modelForm.status"
                filterable
                placeholder=""
                no-data-text="データはありません。"
                :disabled="disableRole([])"
                :popper-append-to-body="false"
                class="remove-mb-el-select"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 4 -->

        <!-- ROW 5 -->
        <el-row type="flex" justify="space-around" class="last-row">
          <!-- 5.1 snz_lastchangedate -->
          <el-col :span="8">
            <el-form-item label-width="124px" label="最新異動日" prop="snz_lastchangedate">
              <el-date-picker
                v-model="modelForm.snz_lastchangedate"
                prefix-icon="abc"
                type="date"
                placeholder=""
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                :picker-options="datePickerOptions"
                :disabled="false"
                clearable
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
          <!-- 5.2 -->
          <el-col :span="8">
            <el-form-item label-width="100px" label="修正操作日" prop="snz_updatedate">
              <el-date-picker
                v-model="modelForm.snz_updatedate"
                prefix-icon="abc"
                type="date"
                placeholder=""
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                :picker-options="datePickerOptions"
                :disabled="false"
                clearable
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
          <!-- 5.3 -->
          <el-col :span="8">
            <el-form-item label-width="150px" label="主所属" prop="mainAffiliation">
              <el-select
                v-model="modelForm.mainAffiliation"
                filterable
                placeholder=""
                no-data-text="データはありません。"
                :popper-append-to-body="false"
                class="remove-mb-el-select"
                clearable
              >
                <el-option
                  v-for="item in studentCodeList"
                  :key="item.snz_studentcode"
                  :label="item.snz_studentcode"
                  :value="item.snz_studentcode"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 5 -->
      </div>
    </el-form>
  </div>
</template>
<script>
import { StudentSystemValidate } from '../assets/validate';
import StudentSystem from '@/api/studentSystem';
import studentStatus from '@/const/StudentStatus';
import schoolStatus from '@/const/SchoolStatus';
import CommonSettings from '@/const/CommonSettings';
import { options as GradeUpdate } from '@/const/GradeUpdate';
import { options as statusOptions } from '@/const/active';
import InputNumber from '@/components/Common/InputNumber';

const studentSystem = new StudentSystem();

export default {
  components: {
    InputNumber,
  },
  filters: {
    // filterGradeUpdate: value => {
    //   return filterOption(value, GradeUpdate);
    // },
  },
  mixins: [StudentSystemValidate],
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formLoading: false,
      modelForm: null,
      GradeUpdate: GradeUpdate,
      commonText: CommonSettings.COMMON_TXT,
      schoolStatus: schoolStatus,
      statusOptions: statusOptions,
      studentStatus: studentStatus.OPTION_SNZ_STUDENTSTATUS,
      genderOption: studentStatus.OPTION_GENDERCODE,
      relationshipOptions: studentStatus.OPTION_SNZ_RELATIONSHIP,
      gradeOption: [],
      schoolType: null,
      updateSubmit: false,
      originForm: null,
      schoolOptions: [],
      businessUnitList: null,
      userList: null,
      studentCodeList: null,
      studentCode: null,
      internalCode: null,
      carlendarPatternList: null,
      datePickerOptions: {
        disabledDate(date) {
          return date > new Date();
        },
      },
    };
  },
  async created() {
    this.roles = this.$store.getters.roles;
    const form = _.cloneDeep(this.form);
    form.mainAffiliation = null;
    this.modelForm = form;
    this.studentCode = this.$route.params.id;
    this.init();
    if (this.roles[0] !== 'system') {
      this.$router.push('/403', true);
    }
  },
  methods: {
    async init() {
      this.formLoading = true;
      this.studentCodeOrigin = this.form.snz_studentcode;
      this.tabCurrent = this.$route.query.tab;
      await this.getMainAffiliation();
      await this.getBusinessunitList();
      await this.getUserList();
      await this.getCalendarPatternList();
      await this.getStudentCodeList();
      this.originForm = _.cloneDeep(this.modelForm);
      this.formLoading = false;
    },
    async getBusinessunitList(){
      const resBusinessunitList = await studentSystem.getBusinessunitList();
      this.businessUnitList = resBusinessunitList;
    },
    async getUserList(){
      const resUserList = await studentSystem.getUserList();
      this.userList = resUserList;
    },
    async getCalendarPatternList(){
      const resCarlendarPatternList = await studentSystem.getCalendarPatternList();
      this.carlendarPatternList = resCarlendarPatternList;
    },
    async getStudentCodeList(){
      const resStudentCodeList = await studentSystem.getStudentCodeList({ internalCode: this.modelForm.snz_internalcode });
      this.studentCodeList = resStudentCodeList;
    },
    async getMainAffiliation(){
      const resMainAffiliation = await studentSystem.getMainAffiliation(this.modelForm.snz_internalcode);
      this.modelForm.mainAffiliation = resMainAffiliation.snz_studentcode;
    },
    async checkStatus() {
      return this.modelForm.status;
    },
    async updateStudentSystem() {
      await studentSystem.updateStudentSystem(
        this.studentCode,
        this.modelForm
      ).then(async success => {
        if (this.studentCodeOrigin !== this.modelForm.snz_studentcode) {
          this.$router.push({
            name: 'StudentDetail',
            params: { id: this.modelForm.snz_studentcode },
            query: { tab: this.tabCurrent },
          });
        }
        if (success) {
          await this.getMainAffiliation();
          this.originForm = _.cloneDeep(this.modelForm);
        }
      }).catch(err => {
        if (err.response.status === 422) {
          this.$refs.form.injectFormValidates(err.response);
          this.scrollTop();
        }
      }).finally(async() => {
        await this.getStudentCodeList();
        this.$emit('stopLoading');
      });
    },
    async delete() {
      this.$confirm(this.commonText.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(async(valid) => {
        if (valid) {
          const result = await studentSystem.delete(this.studentCode);
          if (result) {
            this.$message({
              message: '削除しました。',
              type: 'success',
            });
            this.$router.push({
              name: 'StudentList',
              params: { redirect: true },
            });
          } else {
            this.$message({
              message: '連携のデータがありますので、削除できません。',
              type: 'error',
            });
          }
        }
      }).catch(() => {
        return false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
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
.icon-input__calendar {
  position: absolute;
  top: 0;
  right: 11px;
  pointer-events: none !important;
}
.title-1{
  padding-bottom: 20px !important;
}
.student-system::v-deep {
  .el-form-item__content {
    position: absolute !important;
  }

  .card-body {
    .el-select-dropdown{
      width: 110px !important;
    }
    .el-select-dropdown__wrap{
      overflow: auto;
    }
    // padding-right: 0px !important;
    .el-col-8 {
      .el-form-item {
        margin-bottom: 13px;
      }

      .el-form-item__content {
        width: 213px;
          position: absolute;
      }
      .communication {
        .el-form-item__content {
          min-width: 282px;
          position: absolute;
          height: 94px;
        }
      }
    }

    .el-col-10,
    .el-col-14 {
      .el-form-item {
        margin-bottom: 13px;
      }

      .el-form-item__content {
        width: 313px;
        position: absolute !important;
      }
    }

    .last-row {
      .el-form-item {
        margin-bottom: 20px;
      }
    }

    &:last-child {
      margin-bottom: 10px;
    }
  }
}
/deep/.my-textarea{
  textarea {
    width: 245px;
    height: 90px;
    resize: none;
  }
}
/deep/.el-form-item__error{
  min-width: 500px;
}
</style>
