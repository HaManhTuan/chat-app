<template>
  <div v-loading="loadingScreen" class="app-container">
    <!--    <i class="el-icon-warning" style="position: relative; top: 16px;left: 303px;z-index: 14; color: red;"></i>-->
    <i
      v-show="inputFormError"
      v-if="ableRole(['system', 'viewonly', 'callcenter'])"
      class="el-icon-warning"
      style="position: absolute; top: 26px;left: 127px;z-index: 14; color: red;"
    />
    <i
      v-show="othersFormError"
      v-if="ableRole(['system'])"
      class="el-icon-warning"
      style="position: absolute; top: 26px;left: 249px;z-index: 14; color: #ff0000;"
    />
    <div class="card-body__content content">
      <el-tabs
        ref="scroll_tab"
        v-model="activeTab"
        type="border-card"
        class="tab-custom"
        @tab-click="tabClick"
      >
        <el-tab-pane label="受講入力" name="inputContract">
          <el-scrollbar class="scroll-content">
            <input-cantractinfo
              v-if="!fullscreenLoading"
              ref="inputContract"
              :form.sync="form"
              :target-period-options.sync="targetPeriodOptions"
              :default-subject-options="defaultSubjectOptions"
              :default-discount-options="defaultDiscountOptions"
              :errors.sync="errors"
              :disabled-field.sync="disabledField"
              :display-field.sync="displayField"
              @clearError="prop => handleClearError(prop)"
              @loadingFullScreen="isLoading => handleLoading(isLoading)"
              @changeDiscount="value => (form = value)"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="その他" name="history" :lazy="true">
          <el-scrollbar class="scroll-content">
            <ListCantractinfor ref="ListCantractinfor" />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          v-if="ableRole(['system', 'parttime', 'employee'])"
          label="システム"
          name="system"
          :lazy="true"
        >
          <system
            ref="system"
            :form.sync="form"
            :disabled-field.sync="disabledField"
            @changeDisableField="changeDisableField"
            @closeLoading="closeLoading"
          />
        </el-tab-pane>
      </el-tabs>
      <div class="group-button">
        <el-button
          v-role="['system']"
          class="delete"
          :loading="deleteLoading"
          @click="deleteClick"
        >
          <svg-icon icon-class="_trash_w" />
          <span>削除</span>
        </el-button>
        <button-save
          style="background: #c70000"
          :loading="saveLoading"
          :disabled="disableRole(['viewonly', 'callcenter'])"
          @save="saveClick"
        />
      </div>
    </div>
    <anomalous-request
      v-if="!fullscreenLoading"
      ref="anomalousRequest"
      :show-dialog="showDialog"
      :loading="saveRequestLoading"
      :form.sync="form"
      :origin-form.sync="originForm"
      @close="closeModal"
      @save-request="saveRequest"
    />
    <!--    <error-popup-->
    <!--      v-if="!fullscreenLoading"-->
    <!--      :error-popup-show.sync="errorPopupShow"-->
    <!--      @close="closeErrorPopup"-->
    <!--    />-->
  </div>
</template>
<script>
import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';
import ButtonSave from '@/components/Common/Button/ButtonSave';
import { approachWebText } from '@/filters/contact';
import { studentStatusLabel } from '@/filters/studentStatus';
import CommonSettings from '@/const/CommonSettings';
import InputCantractinfo from './components/input-cantractinfo';
import ListCantractinfor from './components/list-cantractinfor';
import CantractInfoResource from '@/api/cantractInfo';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
import SubjectMstRequest from '@/api/contractSubjectMst';
import ContractInfoResource from '@/api/contractInfo';
import { InputCantractInfoMixin } from '@/views/cantractinfo/mixins/InputCantractInfo';
import _ from 'lodash';
import { CantractInfoDetail } from '@/views/cantractinfo/assets/validate';
import System from '@/views/cantractinfo/components/system';
import DiscountRequest from '@/api/DiscountRequest';
import AnomalousRequest from '@/views/cantractinfo/modal/AnomalousRequest';

const targetPeriodRequest = new TargetPeriodRequest();
const cantractInfoResource = new CantractInfoResource();
const subjectMstRequest = new SubjectMstRequest();
const contractInfoResource = new ContractInfoResource();
const discountRequest = new DiscountRequest();

export default {
  name: 'CantractInfoDetail',
  metaInfo: {
    title: '受講情報詳細',
  },
  components: {
    AnomalousRequest,
    System,
    ButtonSave,
    InputCantractinfo,
    ListCantractinfor,
  },
  directives: { permission, role },
  filters: {
    approachWebText: approachWebText,
    studentStatus: studentStatusLabel,
  },
  mixins: [InputCantractInfoMixin, CantractInfoDetail],
  async beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404' || to.name === 'err_403') {
      return next();
    }
    const checkEqual = await this.checkChange();
    if ((this.tabIndex === 0 || this.tabIndex === 1) && checkEqual) {
      return next();
    }
    if (this.tabIndex === 2 && checkEqual) {
      return next();
    }
    this.$confirm(
      'このページを終了する前に、変更を保存しますか',
      '保存されていない変更',
      {
        confirmButtonText: '保存して続行',
        cancelButtonText: '変更の破棄',
        type: 'warning',
        distinguishCancelAndClose: true,
      }
    )
      .then(() => {
        this.saveClick();
      })
      .catch(action => {
        if (action === 'cancel') {
          next();
        } else {
          next(false);
        }
      });
  },
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      id: null,
      saveLoading: false,
      saveRequestLoading: false,
      deleteLoading: false,
      form: {
        snz_scheduled_end_month: null,
        snz_application_reason: null,
      },
      originForm: {},
      fullscreenLoading: false,
      loadingScreen: true,
      targetPeriodOptions: [],
      defaultSubjectOptions: [],
      defaultDiscountOptions: [],
      errors: {},
      tabIndex: 0,
      activeTab: 'inputContract',
      inputFormError: false,
      othersFormError: false,
      disabledField: {},
      displayField: {},
      reloadHistory: false,
      showDialog: false,
      errorPopupShow: false,
    };
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.fullscreenLoading = true;
      this.activeTab = await this.getParameterByName('tab');
      this.tabIndex = await this.getTabIndex(this.activeTab);
      this.id = await this.$route.params.id.toString();
      await this.setModel();
      this.fullscreenLoading = false;
      this.loadingScreen = false;
    },

    async saveClick() {
      if (this.form.status === 1) {
        await this.validateCantractForm();
      } else {
        await this.deleteClick();
      }
    },
    async saveRequest() {
      this.saveRequestLoading = true;
      await this.$refs.anomalousRequest.$refs.anomalousForm.validate(
        async valid => {
          if (valid) {
            await this.saveData();
          } else {
            this.inputFormError = true;
            this.activeTab = 'inputContract';
            this.$nextTick(() => {
              if (this.$refs.anomalousRequest) {
                this.$refs.anomalousRequest.$refs.anomalousForm.focusFieldError();
              }
            });
            this.saveRequestLoading = false;
          }
          // if (this.inputFormError) {
          //   this.openErrorPopup();
          // }
        }
      );
    },
    async saveData() {
      if (this.showDialog) {
        this.saveRequestLoading = true;
      } else {
        this.saveLoading = true;
      }
      this.inputFormError = false;
      const checkEqual = await this.checkChange();
      if (checkEqual) {
        this.form.save_history = false;
      }
      await contractInfoResource
        .updateDetail(this.form.id, this.form)
        .then(() => {
          this.$message({
            type: 'success',
            message: this.commonText.saveSuccess,
          });
          this.originForm = JSON.parse(JSON.stringify(this.form));
          // if (this.showDialog) {
          //   this.redirectPage({ name: 'StudentDetail', params: { id: this.form.snz_studentcode, redirect: true }, query: { tab: 'tab2' }});
          // } else {
          // }
          this.inputFormError = false;
          this.$nextTick(() => {
            this.init();
            if (this.$refs.inputContract) {
              // this.$refs.inputContract.$refs.inputContractForm.clearValidate();
              this.$refs.inputContract.init();
              this.$refs.inputContract.initSubject();
              this.$refs.inputContract.initTarget();
              this.$refs.inputContract.initDiscount();
            }
            if (this.$refs.system) {
              this.$refs.system.init();
            }
          });
          this.reloadHistory = true;
          this.closeModal();
        })
        .catch(err => {
          if (err.response.status === 422) {
            const errorDatas = err.response.data.errors;
            //
            // get message err for subject
            //
            if (
              errorDatas.cantract_info_subjects &&
              errorDatas.cantract_info_subjects[0]
            ) {
              let cantractInfoErr = [];
              cantractInfoErr = _.merge(
                cantractInfoErr,
                errorDatas.cantract_info_subjects[0]
              );
              for (let i = 0; i <= cantractInfoErr.length; i++) {
                _.forEach(cantractInfoErr[i], function(value, key) {
                  const field = `cantract_info_subjects.${i}.${key}`;
                  err.response.data.errors[field] = [value];
                });
              }
            }
            if (errorDatas.discounts && errorDatas.discounts[0]) {
              let discountErr = [];
              discountErr = _.merge(discountErr, errorDatas.discounts[0]);
              for (let i = 0; i <= discountErr.length; i++) {
                _.forEach(discountErr[i], function(value, key) {
                  const field = `discounts.${i}.${key}`;
                  err.response.data.errors[field] = [value];
                });
              }
            }
            this.inputFormError = true;
            this.$refs.inputContract.$refs.inputContractForm.injectFormValidates(
              err.response
            );
            this.activeTab = 'inputContract';
            this.$nextTick(() => {
              if (this.$refs.inputContract) {
                this.$refs.inputContract.$refs.inputContractForm.focusFieldError();
                this.$refs.inputContract.initSubject();
                this.$refs.inputContract.initTarget();
                this.$refs.inputContract.initDiscount();
              }
            });
          } else {
            if (err.response.status === 424) {
              this.$message({
                type: 'error',
                message: err.response.data.original.message,
              });
            } else {
              this.$message({
                type: 'error',
                message: this.commonText.saveFail,
              });
            }
          }
          this.errors = err.response.data.errors;
        })
        .finally(() => {
          if (this.showDialog) {
            this.saveRequestLoading = false;
          } else {
            this.saveLoading = false;
          }
        });
      this.fullscreenLoading = false;
    },
    async validateCantractForm() {
      const checkEqual = await this.checkChange();
      if (checkEqual) {
        this.form.save_history = false;
      }
      this.saveLoading = true;
      await this.$refs.inputContract.$refs.inputContractForm.validate(
        async valid => {
          if (valid) {
            await contractInfoResource
              .checkValidateContractInfoDetail(this.form.id, this.form)
              .then(() => {
                if (this.$refs.inputContract.$refs.inputContractForm) {
                  this.$refs.inputContract.$refs.inputContractForm.clearValidate();
                }
                this.inputFormError = false;
                /*
              NOTE:
              Flow hiện popup thay đổi: (28/02/2022)
                (
                  (
                    変更科目セット(snz_change_subjectset_id)」!= NULL &&
                    変更科目セット(snz_change_subjectset_id)」có flag bất thường
                  )
                  ||
                  (科目セット(snz_subjectset_id)」 có flag bất thường ON)
                )
             */
                if (
                  this.form.course &&
                  this.form.course.anomalous_change_flag &&
                  ((this.form.subject_set &&
                    this.form.subject_set.snz_update_subject_flag) ||
                    (this.form.subject_set_change &&
                      this.form.subject_set_change.snz_update_subject_flag))
                ) {
                  this.openDialog();
                } else {
                  this.saveData();
                }
              })
              .catch(err => {
                this.inputFormError = true;
                if (err.response.status === 422) {
                  const errorDatas = err.response.data.errors;
                  //
                  // get message err for subject
                  //
                  if (
                    errorDatas.cantract_info_subjects &&
                    errorDatas.cantract_info_subjects[0]
                  ) {
                    let cantractInfoErr = [];
                    cantractInfoErr = _.merge(
                      cantractInfoErr,
                      errorDatas.cantract_info_subjects[0]
                    );
                    for (let i = 0; i <= cantractInfoErr.length; i++) {
                      _.forEach(cantractInfoErr[i], function(value, key) {
                        const field = `cantract_info_subjects.${i}.${key}`;
                        err.response.data.errors[field] = [value];
                      });
                    }
                  }
                  if (errorDatas.discounts && errorDatas.discounts[0]) {
                    let discountErr = [];
                    discountErr = _.merge(discountErr, errorDatas.discounts[0]);
                    for (let i = 0; i <= discountErr.length; i++) {
                      _.forEach(discountErr[i], function(value, key) {
                        const field = `discounts.${i}.${key}`;
                        err.response.data.errors[field] = [value];
                      });
                    }
                  }
                } else {
                  if (err.response.status === 424) {
                    this.$message({
                      type: 'error',
                      message: err.response.data.original.message,
                    });
                  } else {
                    this.$message({
                      type: 'error',
                      message: this.commonText.saveFail,
                    });
                  }
                }
                this.$refs.inputContract.$refs.inputContractForm.injectFormValidates(
                  err.response
                );
                this.activeTab = 'inputContract';
                this.$nextTick(() => {
                  if (this.$refs.inputContract) {
                    this.$refs.inputContract.$refs.inputContractForm.focusFieldError();
                    this.$refs.inputContract.initSubject();
                    this.$refs.inputContract.initTarget();
                    this.$refs.inputContract.initDiscount();
                  }
                });
                this.errors = err.response.data.errors;
              })
              .finally(() => {
                this.saveLoading = false;
              });
          } else {
            this.inputFormError = true;
            this.activeTab = 'inputContract';
            this.$nextTick(() => {
              if (this.$refs.inputContract) {
                this.$refs.inputContract.$refs.inputContractForm.focusFieldError();
                this.$refs.inputContract.initSubject();
                this.$refs.inputContract.initTarget();
                this.$refs.inputContract.initDiscount();
              }
            });
          }
        }
      );
      this.saveLoading = false;
      this.fullscreenLoading = false;
    },
    // openErrorPopup(){
    //   this.errorPopupShow = true;
    //   this.showDialog = false;
    // },
    // closeErrorPopup() {
    //   this.errorPopupShow = false;
    //   this.showDialog = true;
    // },
    async checkChange() {
      if (
        !this.originForm.discounts ||
        this.originForm.discounts.length === 0
      ) {
        this.form = this.expectedDiscountNull(this.form);
      }
      const model = JSON.stringify(await this.expectedTargetOptions(this.form));
      const originForm = JSON.stringify(
        await this.expectedTargetOptions(this.originForm)
      );
      if (_.isEqual(model, originForm)) {
        return true;
      } else {
        return false;
      }
    },
    async deleteClick() {
      this.$confirm(this.commonText.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      })
        .then(async() => {
          this.deleteLoading = true;
          this.destroy();
        })
        .finally(() => {
          this.deleteLoading = false;
        });
    },
    async destroy() {
      await contractInfoResource
        .destroy(this.$route.params.id)
        .then(response => {
          this.$message({
            type: 'success',
            message: '削除しました。',
          });
          const query = _.pickBy(this.$route.params.query, function(
            value,
            key
          ) {
            return !(value === undefined || value === null || value === '');
          });
          this.redirectPage({
            name: 'cantractinfo-index',
            params: { redirect: true },
            query: query,
          });
        })
        .catch(error => {
          const response = error.response;
          if (response.status === 410) {
            this.$router.push({ name: 'err_404' });
          } else {
            this.$message({
              type: 'error',
              message: 'この操作は実行できません。',
            });
          }
        });
    },
    catchValidate() {
      this.$alert(
        '<i class="el-icon-warning error-icon-status"></i> 赤い警告の感嘆符があるタブで、エラーのフィールドをチェックしてください。',
        '警告',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'はい',
        }
      );
      this.closeLoading();
    },
    afterCheckValidate() {
      // todo
    },
    closeLoading() {
      // todo
    },
    changeDisableField() {
      this.disabledField = this.setDisabledField(this.form);
    },
    async setModel() {
      const res = await cantractInfoResource.get(this.$route.params.id);
      this.form = JSON.parse(JSON.stringify(res));
      this.form.business_closing_month_period_id = this.form.business_unit
        ? this.form.business_unit.snz_closing_month_period_id || null
        : null;
      this.form.snz_student_enter_date = this.form.student
        ? this.form.student.snz_enterdate
        : null;
      await this.setDefault();
      this.form.cantract_info_subjects = this.initListSubject(
        this.form.cantract_info_subjects,
        this.subjectOptions,
        this.targetPeriodOptions,
        false
      );
      this.form = await this.setCantractMonth(this.form);
      this.originForm = JSON.parse(JSON.stringify(this.form));
    },
    async setDefault() {
      const subjectOptions = await subjectMstRequest.searchName({
        snz_subjectset_id: this.form.snz_subjectset_id,
        snz_default_section: 1,
        snz_brand: this.form.snz_brand,
      });
      this.defaultSubjectOptions = subjectOptions.data;
      const targets = await targetPeriodRequest.searchName({
        businessunit_id: this.form.businessunit_id,
        order_desc_start: true,
      });
      this.defaultDiscountOptions = await this.getDiscountDefault();
      this.targetPeriodOptions = targets.data;
      this.disabledField = await this.setDisabledField(this.form, this.role);
      this.displayField = await this.setDisplayField(this.form);
    },
    tabClick(tab) {
      this.tabIndex = parseInt(tab.index);
      this.activeTab = tab._props.name;
      const url = new URL(window.location);
      url.searchParams.set('tab', tab._props.name);
      window.history.pushState({}, '', url);
      if (this.tabIndex === 1 && this.reloadHistory) {
        this.$refs.ListCantractinfor.getList();
        this.reloadHistory = false;
      }
      // todo
    },
    // Get tab name
    getParameterByName(name, url = window.location.href) {
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) {
        return this.activeTab;
      }
      if (!results[2]) {
        return this.activeTab;
      }
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    getTabIndex(name) {
      switch (name) {
        case 'history':
          return 1;
        case 'system':
          return 2;
        default:
          return 0;
      }
    },
    async getDiscountDefault() {
      const query = {
        student_code: this.form.snz_studentcode,
        grade_id: this.form.snz_grade_id,
        school_year: this.form.snz_schoolyear,
        businessunit_id: this.form.businessunit_id,
      };
      const res = await discountRequest.searchNameDiscount(query);
      return res.data;
    },
    handleClearError(prop) {
      if (prop) {
        this.$refs.inputContract.$refs.inputContractForm.clearValidate(prop);
      }
    },
    handleLoading(isLoading) {
      this.fullscreenLoading = isLoading;
    },
    openDialog() {
      this.showDialog = true;
      this.$nextTick(() => {
        if (this.$refs.anomalousRequest) {
          this.$refs.anomalousRequest.initTarget();
          if (this.$refs.anomalousRequest.$refs.anomalousForm) {
            this.$refs.anomalousRequest.$refs.anomalousForm.clearValidate();
          }
        }
      });
    },
    closeModal() {
      this.inputFormError = false;
      this.form.snz_scheduled_end_month = null;
      this.form.snz_application_reason = null;
      this.$nextTick(() => {
        if (this.$refs.anomalousRequest.$refs.anomalousForm) {
          this.$refs.anomalousRequest.$refs.anomalousForm.clearValidate();
        }
      });
      this.showDialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
//#app{
//  height: 100vh;
//  .el-scrollbar__wrap{
//    overflow-x: hidden;
//  }
//  .el-scrollbar{
//    height: 100%;
//  }
//}
//.app-container {
//  overflow-y: auto;
//}

.app-container::v-deep {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 17px;

    .header__name {
      margin: 0;
      font-size: 26px;
      font-family: Noto Sans JP, sans-serif;
      font-weight: 400;
    }

    .info-status {
      display: flex;
      align-items: center;

      .info-status__item {
        display: flex;
        align-items: center;
        min-width: 140px;
        border-left: 2px solid #2e67ad;
        padding: 5px 35px 5px 10px;

        &:last-child {
          padding-right: 0;
        }

        h4 {
          color: #1467b3;
          font-size: 12px;
          font-weight: 400;
          margin: 0 10px 0 0;
        }

        p {
          margin: 0;
          font-size: 15px;
        }
      }
    }
  }

  .tab-custom {
    border: none;
    box-shadow: none;
    height: calc(100% - 108px);

    .el-tabs__content {
      height: calc(100vh - 206px);
      width: 100%;

      .el-tab-pane {
        height: 100%;

        .scroll-content {
          height: 100%;
        }
      }
    }

    & > .el-tabs__header {
      background-color: #f0f0f0;
      border: none;

      .el-tabs__nav {
        width: 100%;
        display: flex;

        .el-tabs__item.is-top {
          font-size: 15px;
          font-weight: 500 !important;
          font-weight: 400;
          background: #898989;
          color: #e0e0e0;
          height: 43px;
          line-height: 43px;
          width: 119px;
          text-align: center;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border: none;
          padding: 0;

          &:first-child {
            border-top-left-radius: 8px;
          }

          &:hover {
            background: #525252;
          }

          &:not(:last-child) {
            margin-right: 5px;
          }

          &.is-active {
            background: #ffffff;
            color: #1467b3;
            font-family: Noto Sans JP, sans-serif;
            font-weight: 500 !important;

            &:before {
              content: '';
              position: absolute;
              left: 50%;
              bottom: 0;
              transform: translateX(-50%);
              width: 59px;
              border-bottom: 4px solid #1467b3;
            }
          }
        }
      }
    }

    & > .el-tabs__content {
      padding: 0;
    }

    .card-body {
      h3 {
        font-size: 18px;
        color: #1a1714;
        margin: 0;
        padding-bottom: 20px;
        font-family: Noto Sans JP, sans-serif;
        font-weight: normal;
      }

      padding: 20px 30px 0;

      .el-col.el-col-12 {
        padding-right: 60px;
      }

      .el-form-item__label {
        padding: 0 10px 0 0;
      }
    }
  }

  .group-button {
    display: flex;
    justify-content: flex-end;
    position: relative;
    padding-bottom: 25px;
    padding-top: 17px;

    button {
      border-radius: 100px;
      color: #fff;
      height: 45px;
      border: none;

      span {
        font-size: 15px;
        font-family: Noto Sans JP, sans-serif;
      }

      &.delete {
        background: #343434;
        margin-right: 12px;
      }

      svg {
        font-size: 18px;
        vertical-align: -3px;
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .line {
    border-top: 1px solid #d6d6d6;
    margin-top: 20px;
    margin-right: 30px;
  }
}

.group-button::v-deep {
  float: right;

  button {
    i,
    svg {
      font-weight: bold;
      margin-right: 2px;
      vertical-align: -4px;
    }

    i {
      font-size: 20px;
    }

    svg {
      width: 24px;
      height: 17px;
    }

    span {
      vertical-align: middle;
    }

    &:hover {
      opacity: 0.8;
    }
  }
}

/deep/ .el-scrollbar__wrap {
  margin-bottom: 0 !important;
  overflow-x: hidden !important;
}

/deep/ .el-checkbox__inner {
  &:after {
    top: 1px !important;
  }
}
/deep/ .el-scrollbar__view {
  height: 100%;

  .card-body {
    height: 100%;
  }
}
</style>
