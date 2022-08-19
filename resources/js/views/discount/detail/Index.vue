<template>
  <div>
    <div class="app-container">
      <i v-show="generalFormError" class="el-icon-warning" style="position: absolute; top: 26px;left: 121px;z-index: 14; color: red;" />
      <el-tabs v-model="activeTab" type="border-card" class="tab-custom">
        <el-tab-pane :key="1" label="全般" name="general">
          <el-scrollbar class="scroll-content">
            <general
              v-if="dataLoaded"
              ref="generalComponent"
              :discount.sync="discount"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :key="2" label="システム" name="system">
          <el-scrollbar class="scroll-content">
            <system ref="systemComponent" :discount="discount" />
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <div class="group-button">
        <el-button v-if="typeof $route.params.id !=='undefined' " class="delete" @click="deleteData">
          <svg-icon icon-class="_trash_w" />
          <span>削除</span>
        </el-button>
        <button-save :loading="acting" @save="saveData" />
      </div>
    </div>
  </div>
</template>
<script>
import General from './components/General';
import System from './components/System';
import { Message } from 'element-ui';
import ButtonSave from '../../../components/Common/Button/ButtonSave';
import { calcTimeWithTimeZone } from '@/helpers/mixins/CalcTimeZone';
import DiscountRequest from '@/api/DiscountRequest';
const discountRequest = new DiscountRequest();
export default {
  components: {
    General,
    System,
    ButtonSave,
  },
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    if (this.dataLoaded) {
      const dataGen = this.$refs.generalComponent.formData;
      const dataSys = this.$refs.systemComponent.formData;
      const dataAll = {
        ...dataGen,
        ...dataSys,
      };
      if (!_.isEmpty(this.dataOriginal) && !this.isEqualGrade(dataAll, this.discount._grades)) {
        this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }).then(() => {
          this.updateDataGeneral();
          if (!this.isError && typeof this.$route.params.id !== 'undefined') {
            discountRequest.update(this.$route.params.id, dataAll).then(() => {
              this.generalFormError = false;
              Message({
                message: this.CommonTxt.saveSuccess,
                type: 'success',
                duration: 1500,
              });
              return next();
            }).catch(err => {
              if (err.response.status === 422) {
                this.activeTab = 'general';
                this.generalFormError = true;
                this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
                this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
                setTimeout(() => {
                  this.$refs.generalComponent.$refs.formData.focusFieldError();
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
            });
          }
          if (!this.isError && typeof this.$route.params.id === 'undefined') {
            discountRequest.store(dataAll).then(() => {
              this.generalFormError = false;
              Message({
                message: this.CommonTxt.saveSuccess,
                type: 'success',
                duration: 1500,
              });
              return next();
            }).catch(err => {
              if (err.response.status === 422) {
                this.activeTab = 'general';
                this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
                this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
                setTimeout(() => {
                  this.$refs.generalComponent.$refs.formData.focusFieldError();
                  this.$refs.systemComponent.$refs.formData.focusFieldError();
                }, 0);
              }
            });
          }
        }).catch((action) => {
          if (action === 'cancel') {
            return next();
          }
          return next(false);
        });
      } else {
        return next();
      }
    } else {
      return next();
    }
  },
  data() {
    return {
      discount: {
        id: null,
        snz_name: '',
        snz_discountcd: null,
        snz_headdivision: null,
        snz_divisionnm: null,
        snz_area: null,
        snz_unit_code: null,
        _grades: [],
        snz_schoolyear: '',
        expired_date: '',
        status: 1,
      },
      generalFormError: false,
      dataOriginal: null,
      loading: true,
      dataLoaded: false,
      activeTab: 'general',
      isError: false,
      acting: false,
    };
  },
  async created(){
    this.dataLoaded = true;
    if (typeof this.$route.params.id !== 'undefined') {
      await this.getData();
    } else {
      this.dataOriginal = JSON.parse(JSON.stringify(this.discount));
    }
    this.dataLoaded = true;
    this.loading = false;
  },
  methods: {
    async getData() {
      this.discount = await discountRequest.get(this.$route.params.id);
      this.discount.created_at = calcTimeWithTimeZone(this.discount.created_at);
      this.discount.updated_at = calcTimeWithTimeZone(this.discount.updated_at);
      this.discount.expired_date = calcTimeWithTimeZone(this.discount.expired_date);
      this.dataOriginal = JSON.parse(JSON.stringify(this.discount));
    },
    async saveData() {
      this.acting = true;
      const dataGen = this.$refs.generalComponent.formData;
      const dataSys = this.$refs.systemComponent.formData;
      const dataAll = {
        ...dataGen,
        ...dataSys,
      };
      this.updateDataGeneral();
      if (!this.isError && typeof this.$route.params.id !== 'undefined') {
        if (dataAll.status === 0) {
          this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
            confirmButtonText: 'はい',
            cancelButtonText: 'キャンセル',
            type: 'warning',
          }).then(() => {
            this.update(dataAll);
          });
        } else {
          this.update(dataAll);
        }
        // CREATE
      } else if (!this.isError && typeof this.$route.params.id === 'undefined') {
        await discountRequest.store(dataAll).then((res) => {
          this.generalFormError = false;
          Message({
            message: this.CommonTxt.saveSuccess,
            type: 'success',
            duration: 1500,
          });
          this.dataOriginal = JSON.parse(JSON.stringify(this.discount));
          this.redirectPage({ name: 'editDiscount', params: { id: res.id, redirect: true }});
        }).catch(err => {
          if (err.response.status === 422) {
            this.activeTab = 'general';
            this.generalFormError = true;
            this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
            this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
            setTimeout(() => {
              this.$refs.generalComponent.$refs.formData.focusFieldError();
              this.$refs.systemComponent.$refs.formData.focusFieldError();
            }, 0);
          }
        });
      }
      this.acting = false;
    },
    updateDataGeneral() {
      this.$refs.generalComponent.$refs.formData.validate(valid => {
        if (!valid) {
          this.activeTab = 'general';
          this.isError = true;
          this.generalFormError = true;
          setTimeout(() => {
            this.$refs.generalComponent.$refs.formData.focusFieldError();
            this.$refs.systemComponent.$refs.formData.focusFieldError();
          }, 0);
        } else {
          this.isError = false;
          this.generalFormError = false;
        }
      });
    },
    deleteData(){
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(async() => {
        await discountRequest.destroy(this.$route.params.id).then(() => {
          Message({
            message: this.CommonTxt.deleteSuccess,
            type: 'success',
            duration: 1500,
          });
          const query = this.$route.params.query;
          this.redirectPage({ 'name': 'Discount', params: { redirect: true }, query: query });
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
        });
      }).catch(() => {
        return false;
      });
    },
    isEqualGrade(dataAll, grades) {
      let check = true;
      if (typeof grades !== 'undefined') {
        if (dataAll.grades.length === grades.length && dataAll.grades.length !== 0 && grades.length !== 0) {
          for (var i = 0; i < grades.length; i++) {
            if (dataAll.grades.includes(grades[i].id)) {
              check = check && true;
            } else {
              check = check && false;
            }
          }
        } else if (dataAll.grades.length === 0 && grades.length === 0){
          check = true;
        } else {
          check = false;
        }
        if (this.dataOriginal.snz_name === dataAll.snz_name &&
          this.dataOriginal.snz_discountcd === dataAll.snz_discountcd &&
          this.dataOriginal.snz_headdivision === dataAll.snz_headdivision &&
          this.dataOriginal.snz_divisionnm === dataAll.snz_divisionnm &&
          this.dataOriginal.snz_area === dataAll.snz_area &&
          this.dataOriginal.snz_unit_code === dataAll.snz_unit_code &&
          this.dataOriginal.snz_schoolyear === dataAll.snz_schoolyear &&
          this.dataOriginal.expired_date === dataAll.expired_date &&
          this.dataOriginal.status === dataAll.status &&
          check === true) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    async update(dataAll) {
      await discountRequest.update(this.$route.params.id, dataAll).then(res => {
        this.generalFormError = false;
        Message({
          message: this.CommonTxt.saveSuccess,
          type: 'success',
          duration: 1500,
        });
        this.acting = false;
        if (this.$refs.systemComponent.$data.formData.status !== 1) {
          this.dataOriginal = {};
          this.redirectPage({ 'name': 'Discount', params: { redirect: true }});
        } else {
          this.getData();
        }
      }).catch(err => {
        if (err.response.status === 422) {
          this.activeTab = 'general';
          this.generalFormError = true;
          this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
          this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
          setTimeout(() => {
            this.$refs.generalComponent.$refs.formData.focusFieldError();
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
      });
    },
  },
};
</script>
<style lang="scss" scoped>

.app-container::v-deep {
  .tab-custom {
    border: none;
    box-shadow: none;

    & > .el-tabs__header {
      background-color: #f0f0f0;
      border: none;

      .el-tabs__nav {
        width: 20%;
        display: flex;
        .el-tabs__item.is-top {
          width: 112px;
          background: #898989;
          color: #fff;
          height: 43px;
          line-height: 43px;
          text-align: center;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border: none;
          padding: 0;

          &:hover {
            background: #525252;
          }

          &:not(:last-child) {
            margin-right: 5px;
          }

          &.is-active {
            background: #ffffff;
            color: #1467b3;
            font-size: 15px;
            font-weight: 500 !important;
            font-family: Noto Sans JP;

            &:before {
              content: '';
              position: absolute;
              left: 50%;
              bottom: 0;
              transform: translateX(-50%);
              width: 60px;
              border-bottom: 4px solid #1367b3;
            }
          }
        }
      }
    }

    & > .el-tabs__content {
      padding: 0;
      height: calc(100vh - 210px);

      .el-tab-pane {
        height: 100%;

        .scroll-content {
          height: 100%;
          overflow: hidden;
        }
      }
    }
  }
}
.scroll-content::v-deep {
  .el-scrollbar__wrap {
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      .el-scrollbar__thumb {
        //height: 64.9362%;
        background: #888888;
        width: 8px;
        left: 0;
        top: 0;

        &:hover {
          background: #888888;
        }
      }
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>
