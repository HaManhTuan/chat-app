<template>
  <div v-loading="loading">
    <div v-if="true" v-loading="fullscreenLoading" class="app-container">
      <i
        v-show="generalFormError"
        class="el-icon-warning"
        style="position: absolute;top: 27px;left: 120px;z-index: 14;color: red;"
      />
      <i
        v-show="registerFormError"
        class="el-icon-warning"
        style="position: absolute;top: 27px;left: 236px;z-index: 14;color: red;"
      />
      <el-tabs v-model="activeTab" type="border-card" class="tab-custom">
        <el-tab-pane :key="1" label="全般" name="general">
          <el-scrollbar class="scroll-content">
            <general-component
              v-if="dataLoaded"
              ref="generalComponent"
              :subject-set.sync="subjectSet"
              @getCalendar="getCalendarTargetPeriod"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :key="2" label="科目" name="register">
          <el-scrollbar class="scroll-content">
            <register-component
              v-if="dataLoaded"
              ref="registerComponent"
              :subject-registers="subjectSet"
              :default-subject-mst="defaultSubjectMst"
              :default-target-period="defaultTargetPeriod"
              :list-loading="loadingSubjectRegister"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="システム" name="system">
          <el-scrollbar class="scroll-content">
            <system-component
              v-if="dataLoaded"
              ref="systemComponent"
              :subject-set="subjectSet"
            />
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <div class="group-button">
        <button-delete
          v-if="typeof $route.params.id !=='undefined' "
          class="delete"
          :loading="deleting"
          :disabled="acting"
          @delete="deleteData(false)"
        />
        <button-save :loading="acting" :disabled="deleting" @save="saveData" />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonSave from '../../components/Common/Button/ButtonSave';
import GeneralComponent from './components/GeneralComponent';
import { Message } from 'element-ui';
import SubjectSet from '@/api/SubjectSet';
import RegisterComponent from './components/RegisterComponent';
import SystemComponent from './components/SystemComponent';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
import { isEquivalent } from '@/mixins/object';
import ContractSubjectMstResource from '@/api/contractSubjectMst';
import { isArrayEqual } from '@/helpers/mixins/Compare';
import ButtonDelete from '@/components/Common/Button/ButtonDelete';

const contractSubjectMstResource = new ContractSubjectMstResource();
const targetPeriodRequest = new TargetPeriodRequest();
const subjectSet = new SubjectSet();
export default {
  components: {
    ButtonDelete,
    ButtonSave,
    GeneralComponent,
    RegisterComponent,
    SystemComponent,
  },
  metaInfo: {
    title: '科目セット詳細',
  },
  data() {
    return {
      subjectSet: {
        snz_name: '',
        snz_schoolyear: '',
        snz_display_name: '',
        snz_grade_id: '',
        snz_brand: '',
        snz_update_subject_flag: 0,
        snz_course_id: '',
        snz_calendar_pattern_id: '',
        data: [],
        status: 1,
        contract_subject_mst_subject_sets: [],
      },
      fullscreenLoading: true,
      targetPeriods: [],
      isError: false,
      acting: false,
      deleting: false,
      dataOriginal: {},
      dataOriginalSubjectMst: [{
        snz_default_section: 1,
        snz_endmonth_period_id: '',
        snz_startmonth_period_id: '',
        snz_subject_id: '',
      }],
      generalFormError: false,
      registerFormError: false,
      loading: false,
      dataLoaded: false,
      activeTab: 'general',
      defaultSubjectMst: [],
      defaultTargetPeriod: [],
      loadingSubjectRegister: true,
    };
  },
  async created() {
    if (typeof this.$route.params.id !== 'undefined') {
      await this.getData();
      await this.getOptionDefault();
    } else {
      this.dataOriginal = JSON.parse(JSON.stringify(this.subjectSet));
    }
    this.dataLoaded = true;
    this.loading = false;
    this.loadingSubjectRegister = false;
    this.fullscreenLoading = false;
  },
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect) {
      return next();
    }
    if (this.dataLoaded) {
      const dataGen = this.$refs.generalComponent.formData;
      const dataRe = this.$refs.registerComponent.tableForm.data;
      const dataSys = this.$refs.systemComponent.formData;
      const dataAll = {
        ...dataGen,
        ...dataSys,
      };
      const isEmpty = _.every(this.dataOriginalSubjectMst.concat(dataRe), {
        snz_subject_id: '',
        snz_startmonth_period_id: '',
        snz_endmonth_period_id: '',
      });
      if ((!_.isEmpty(this.dataOriginal) && !isEquivalent(this.dataOriginal, dataAll)) ||
        (!isArrayEqual(this.dataOriginalSubjectMst, dataRe) && !isEmpty)) {
        this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }).then(async() => {
          this.generalFormError = false;
          this.registerFormError = false;
          await this.validateData();
          // UPDATE
          if (!this.generalFormError && !this.registerFormError && typeof this.$route.params.id !== 'undefined') {
            await subjectSet.update(this.$route.params.id, { ...dataAll, data: dataRe }).then(() => {
              Message({
                message: this.CommonTxt.saveSuccess,
                type: 'success',
                duration: 1500,
              });
              return next();
            }).catch(err => {
              if (err.response.status === 422) {
                this.getTabError(err.response.data.errors);
                this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
                this.$refs.registerComponent.$refs.tableForm.injectFormValidates(err.response);
                this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
                setTimeout(() => {
                  this.$refs.generalComponent.$refs.formData.focusFieldError();
                  this.$refs.registerComponent.$refs.tableForm.focusFieldError();
                  this.$refs.systemComponent.$refs.formData.focusFieldError();
                }, 0);
              }
              if (err.response.status === 424) {
                Message({
                  message: this.CommonTxt.deleteNotPermission,
                  type: 'error',
                  duration: 1500,
                });
              }
              if (err.response.status === 410) {
                this.redirectPage({ 'name': 'err_404', params: { redirect: true }});
              }
              if (err.response.status === 500) {
                Message({
                  message: this.CommonTxt.anotherError,
                  type: 'error',
                  duration: 1500,
                });
              }
            });
          } else if (!this.generalFormError && !this.registerFormError && typeof this.$route.params.id === 'undefined') {
            // CREATE
            await subjectSet.store({ ...dataAll, data: dataRe }).then(() => {
              this.dataOriginal = {};
              this.dataOriginalSubjectMst = [];
              Message({
                message: this.CommonTxt.saveSuccess,
                type: 'success',
                duration: 1500,
              });
              return next({ params: { redirect: true }});
            }).catch(err => {
              if (err.response.status === 422) {
                this.getTabError(err.response.data.errors);
                this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
                this.$refs.registerComponent.$refs.tableForm.injectFormValidates(err.response);
                this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
                setTimeout(() => {
                  this.$refs.generalComponent.$refs.formData.focusFieldError();
                  this.$refs.registerComponent.$refs.tableForm.focusFieldError();
                  this.$refs.systemComponent.$refs.formData.focusFieldError();
                }, 0);
              }
              if (err.response.status === 500) {
                Message({
                  message: this.CommonTxt.anotherError,
                  type: 'error',
                  duration: 1500,
                });
              }
            });
          }
        }).catch((action) => {
          if (action === 'cancel') {
            return next();
          } else {
            return next(false);
          }
        });
      } else {
        return next();
      }
    } else {
      return next();
    }
  },
  methods: {
    async getCalendarTargetPeriod(id) {
      this.loadingSubjectRegister = true;
      // this.defaultTargetPeriod = await targetPeriodRequest.getOption({ snz_calendar_pattern_id: id });
      // Reset option target
      this.subjectSet.contract_subject_mst_subject_sets.forEach(item => {
        item.snz_startmonth_period_id = '';
        item.snz_endmonth_period_id = '';
      });
      this.loadingSubjectRegister = false;
      this.$nextTick(() => {
        this.$refs.registerComponent.tableForm.data.forEach((item, index) => {
          this.$refs.registerComponent.$refs[`targetPeriod${index}`].init();
          this.$refs.registerComponent.$refs[`endPeriod${index}`].init();
        });
      });
    },
    async getData() {
      this.subjectSet = await subjectSet.get(this.$route.params.id);
      this.dataOriginal = JSON.parse(JSON.stringify(this.subjectSet));
      this.dataOriginalSubjectMst = JSON.parse(JSON.stringify(this.subjectSet.contract_subject_mst_subject_sets));
      if (this.dataOriginalSubjectMst.length === 0) {
        this.dataOriginalSubjectMst = [{
          snz_subject_id: '',
          snz_default_section: 1,
          snz_startmonth_period_id: '',
          snz_endmonth_period_id: '',
        }];
      }
    },
    async saveData() {
      this.generalFormError = false;
      this.registerFormError = false;
      const dataGen = this.$refs.generalComponent.formData;
      const dataRe = this.$refs.registerComponent.tableForm.data;
      const dataSys = this.$refs.systemComponent.formData;
      const dataAll = {
        ...dataGen,
        data: dataRe,
        ...dataSys,
      };
      if (dataSys.status === 0) {
        // Delete
        this.deleteData(true);
        return;
      }
      this.acting = true;
      await this.validateData();
      if (!this.generalFormError && !this.registerFormError && typeof this.$route.params.id !== 'undefined') {
        // UPDATE
        await this.update(dataAll);
      } else if (!this.generalFormError && !this.registerFormError && typeof this.$route.params.id === 'undefined') {
        // CREATE
        this.acting = true;
        await this.create(dataAll);
      }
      this.acting = false;
    },
    async validateData() {
      await this.$refs.generalComponent.$refs.formData.validate(valid => {
        if (!valid) {
          this.generalFormError = true;
          this.activeTab = 'general';
        } else {
          this.generalFormError = false;
        }
      });
      if (this.$refs.generalComponent.formData.snz_update_subject_flag !== 1) {
        await this.$refs.registerComponent.$refs.tableForm.validate(valid => {
          if (!valid) {
            this.registerFormError = true;
            this.activeTab = 'register';
          } else {
            this.registerFormError = false;
          }
        });
      } else {
        this.$refs.registerComponent.$refs.tableForm.fields.forEach(field => {
          field.clearValidate();
        });
      }
      if (this.generalFormError && this.registerFormError) {
        this.activeTab = 'general';
      }
      setTimeout(() => {
        this.$refs.generalComponent.$refs.formData.focusFieldError();
        this.$refs.registerComponent.$refs.tableForm.focusFieldError();
        this.$refs.systemComponent.$refs.formData.focusFieldError();
      }, 0);
    },
    deleteData(saveDelete = false) {
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(async() => {
        if (saveDelete) {
          this.acting = true;
        } else {
          this.deleting = true;
        }
        await subjectSet.destroy(this.$route.params.id).then(() => {
          Message({
            message: this.CommonTxt.deleteSuccess,
            type: 'success',
            duration: 1500,
          });
          const query = this.$route.params.query;
          this.redirectPage({ 'name': 'SubjectSet', params: { redirect: true }, query: query });
        }).catch((err) => {
          if (err.response.status === 424) {
            Message({
              message: this.CommonTxt.deleteNotPermission,
              type: 'error',
              duration: 1500,
            });
          }
          if (err.response.status === 410) {
            this.redirectPage({ 'name': 'err_404', params: { redirect: true }});
          }
        }).finally(() => {
          this.acting = false;
          this.deleting = false;
        });
      }).catch(() => {
        return false;
      });
    },
    getTabError(errors) {
      for (const item in errors) {
        const label = item.split('.');
        if (label.length > 1) {
          this.registerFormError = true;
          this.activeTab = 'register';
        } else {
          this.generalFormError = true;
          this.activeTab = 'general';
        }
      }
      if (this.generalFormError && this.registerFormError) {
        this.activeTab = 'general';
      }
    },
    async getOptionDefault() {
      // Get option default subject
      let arraySubject = _.map(this.subjectSet.contract_subject_mst_subject_sets, item => {
        return item.snz_subject_id;
      });
      arraySubject = _.uniq(arraySubject);
      this.defaultSubjectMst = (await contractSubjectMstResource.searchName({ id: arraySubject })).data;
      // Get option default target
      let arrayTarget = [];
      _.each(this.subjectSet.contract_subject_mst_subject_sets, item => {
        arrayTarget.push(item.snz_startmonth_period_id);
        arrayTarget.push(item.snz_endmonth_period_id);
      });
      arrayTarget = _.uniq(arrayTarget);
      this.defaultTargetPeriod = (await targetPeriodRequest.searchName(
        { id: arrayTarget, pattern_id: this.subjectSet.snz_calendar_pattern_id }
      )).data;
    },
    async create(dataAll) {
      await subjectSet.store(dataAll).then((res) => {
        this.dataOriginal = {};
        this.dataOriginalSubjectMst = [];
        this.$refs.generalComponent.formData.snz_update_subject_flag = 0;
        Message({
          message: this.CommonTxt.saveSuccess,
          type: 'success',
          duration: 1500,
        });
        this.redirectPage({ name: 'SubjectSetEdit', params: { id: res.id, redirect: true }});
      }).catch(err => {
        if (err.response.status === 422) {
          this.getTabError(err.response.data.errors);
          this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
          this.$refs.registerComponent.$refs.tableForm.injectFormValidates(err.response);
          this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
          setTimeout(() => {
            this.$refs.generalComponent.$refs.formData.focusFieldError();
            this.$refs.registerComponent.$refs.tableForm.focusFieldError();
            this.$refs.systemComponent.$refs.formData.focusFieldError();
          }, 0);
        }
        if (err.response.status === 500) {
          Message({
            message: this.CommonTxt.anotherError,
            type: 'error',
            duration: 1500,
          });
        }
      }).finally(() => {
        this.acting = false;
      });
    },
    async update(dataAll) {
      await subjectSet.update(this.$route.params.id, dataAll).then(res => {
        this.generalFormError = false;
        this.registerFormError = false;
        Message({
          message: this.CommonTxt.saveSuccess,
          type: 'success',
          duration: 1500,
        });
        delete res.contract_subject_mst;
        if (this.$refs.systemComponent.$data.formData.status !== 1) {
          this.dataOriginal = {};
          this.dataOriginalSubjectMst = [];
          this.redirectPage({ 'name': 'SubjectSet', params: { redirect: true }});
        } else {
          this.subjectSet = res;
          this.dataOriginal = JSON.parse(JSON.stringify(this.subjectSet));
          this.dataOriginalSubjectMst = JSON.parse(JSON.stringify(this.subjectSet.contract_subject_mst_subject_sets));
          if (this.dataOriginalSubjectMst.length === 0) {
            this.dataOriginalSubjectMst = [{
              snz_subject_id: '',
              snz_default_section: 1,
              snz_startmonth_period_id: '',
              snz_endmonth_period_id: '',
            }];
          }
          this.getOptionDefault();
        }
      }).catch(err => {
        if (err.response.status === 422) {
          this.getTabError(err.response.data.errors);
          this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
          this.$refs.registerComponent.$refs.tableForm.injectFormValidates(err.response);
          this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
          setTimeout(() => {
            this.$refs.generalComponent.$refs.formData.focusFieldError();
            this.$refs.registerComponent.$refs.tableForm.focusFieldError();
            this.$refs.systemComponent.$refs.formData.focusFieldError();
          }, 0);
        }
        if (err.response.status === 424) {
          Message({
            message: this.CommonTxt.deleteNotPermission,
            type: 'error',
            duration: 1500,
          });
        }
        if (err.response.status === 410) {
          this.redirectPage({ 'name': 'err_404', params: { redirect: true }});
        }
        if (err.response.status === 500) {
          Message({
            message: this.CommonTxt.anotherError,
            type: 'error',
            duration: 1500,
          });
        }
      }).finally(() => {
        this.acting = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles/edit";
</style>

