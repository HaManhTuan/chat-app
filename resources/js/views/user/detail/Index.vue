<template>
  <div v-loading="loading">
    <div class="app-container">
      <i
        v-show="generalFormError"
        class="el-icon-warning"
        style="position: absolute; top: 26px;left: 183px;z-index: 14; color: red;"
      />
      <el-tabs v-model="activeTab" type="border-card" class="tab-custom">
        <el-tab-pane :key="1" label="全般" name="general">
          <general
            v-if="dataLoaded"
            ref="generalComponent"
            :user="user"
            :role-options="roleOptions"
            :organization-options="organizationOptions"
          />
        </el-tab-pane>
        <el-tab-pane :key="2" label="システム" name="system">
          <system ref="systemComponent" :user="user" />
        </el-tab-pane>
      </el-tabs>
      <div class="group-button">
        <button-save :loading="acting" @save="saveData" />
      </div>
    </div>
  </div>
</template>

<script>
import General from './components/General';
import System from './components/System';
import ButtonSave from '../../../components/Common/Button/ButtonSave';
import { Message } from 'element-ui';
import { calcTimeWithTimeZone } from '@/helpers/mixins/CalcTimeZone';
import UserResource from '@/api/user';
import { isArrayEqual } from '@/helpers/mixins/Compare';

const userResource = new UserResource();
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
      if (!_.isEmpty(this.dataOriginal) && !this.isEqual(dataAll, this.filteredAffiliatedOrg(this.user.roles))) {
        this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }).then(() => {
          this.updateDataGeneral();
          if (!this.isError && typeof this.$route.params.id !== 'undefined') {
            userResource.update(this.$route.params.id, dataAll).then(() => {
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
                  this.$refs.generalComponent.$refs.formData.focusFieldErrorBlockEnd();
                  this.$refs.systemComponent.$refs.formData.focusFieldErrorBlockEnd();
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
            userResource.store(dataAll).then(() => {
              this.generalFormError = false;
              Message({
                message: this.CommonTxt.saveSuccess,
                type: 'success',
                duration: 1500,
              });
              return next();
            }).catch(err => {
              if (err.response.status === 422) {
                if (err.response.data.errors.names) {
                  Message({
                    message: err.response.data.errors.names[0],
                    type: 'error',
                    duration: 1500,
                  });
                }
                this.activeTab = 'general';
                this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
                this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
                setTimeout(() => {
                  this.$refs.generalComponent.$refs.formData.focusFieldErrorBlockEnd();
                  this.$refs.systemComponent.$refs.formData.focusFieldErrorBlockEnd();
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
      user: {
        id: null,
        name: '',
        email: '',
        is_locked: 0,
        roles: [],
        status: 1,
        can_change_after_closing_flag: 0,
        names: [{
          organization_id: null,
          role_id: null,
        }],
      },
      dataOriginal: null,
      inquiryFormError: false,
      roleOptions: [],
      organizationOptions: [],
      errorStatus: false,
      isError: false,
      acting: false,
      generalFormError: false,
      loading: true,
      dataLoaded: false,
      activeTab: 'general',
    };
  },
  async created() {
    if (typeof this.$route.params.id !== 'undefined') {
      await this.getData();
    } else {
      this.dataOriginal = JSON.parse(JSON.stringify(this.user));
    }
    this.roleOptions = await userResource.fetchRole();
    this.organizationOptions = await userResource.fetchOrg();
    this.dataLoaded = true;
    this.loading = false;
  },
  methods: {
    async getData() {
      this.user = await await userResource.get(this.$route.params.id);
      this.user.created_at = calcTimeWithTimeZone(this.user.created_at);
      this.user.updated_at = calcTimeWithTimeZone(this.user.updated_at);
      this.user.last_login_date = calcTimeWithTimeZone(this.user.last_login_date);
      this.dataOriginal = JSON.parse(JSON.stringify(this.user));
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
        await userResource.update(this.$route.params.id, dataAll).then(res => {
          this.generalFormError = false;
          Message({
            message: this.CommonTxt.saveSuccess,
            type: 'success',
            duration: 1500,
          });
          this.acting = false;
          this.$refs.generalComponent.$data.formData.names = [];
          if (this.$refs.generalComponent.$data.formData.affiliatedOrg.length === 0) {
            const query = this.$route.params.query;
            this.redirectPage({ 'name': 'User', params: { redirect: true }, query: query });
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
              this.$refs.generalComponent.$refs.formData.focusFieldErrorBlockEnd();
              this.$refs.systemComponent.$refs.formData.focusFieldErrorBlockEnd();
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
        // CREATE
      } else if (!this.isError && typeof this.$route.params.id === 'undefined') {
        await userResource.store(dataAll).then((res) => {
          this.generalFormError = false;
          Message({
            message: this.CommonTxt.saveSuccess,
            type: 'success',
            duration: 1500,
          });
          this.dataOriginal = JSON.parse(JSON.stringify(this.user));
          this.redirectPage({ name: 'editUser', params: { id: res.id, redirect: true }});
        }).catch(err => {
          if (err.response.status === 422) {
            if (err.response.data.errors.names) {
              Message({
                message: err.response.data.errors.names[0],
                type: 'error',
                duration: 1500,
              });
            }
            this.activeTab = 'general';
            this.generalFormError = true;
            this.$refs.generalComponent.$refs.formData.injectFormValidates(err.response);
            this.$refs.systemComponent.$refs.formData.injectFormValidates(err.response);
            setTimeout(() => {
              this.$refs.generalComponent.$refs.formData.focusFieldErrorBlockEnd();
              this.$refs.systemComponent.$refs.formData.focusFieldErrorBlockEnd();
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
            this.$refs.generalComponent.$refs.formData.focusFieldErrorBlockEnd();
            this.$refs.systemComponent.$refs.formData.focusFieldErrorBlockEnd();
          }, 0);
        } else {
          this.isError = false;
          this.generalFormError = false;
        }
      });
    },
    isEqual(dataAll, roles) {
      let check = true;
      for (var i = 0; i < dataAll.affiliatedOrg.length; i++) {
        if ((dataAll.affiliatedOrg[i].role_id === roles[i].pivot.role_id && dataAll.affiliatedOrg[i].organization_id === roles[i].pivot.organization_id) === false) {
          check = false;
          break;
        }
      }
      if (dataAll.name === this.user.name &&
        dataAll.email === this.user.email &&
        dataAll.is_locked === this.user.is_locked &&
        dataAll.can_change_after_closing_flag === this.user.can_change_after_closing_flag &&
        isArrayEqual(dataAll.names, this.dataOriginal.names) && check === true) {
        return true;
      } else {
        return false;
      }
    },
    filteredAffiliatedOrg(roles) {
      return roles.filter(element => {
        return this.organizationOptions.some(el => el.id === element.pivot.organization_id);
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
        width: 350px;
        display: flex;
        justify-content: space-between;

        .el-tabs__item.is-top {
          width: 100%;
          background: #898989;
          color: #fff;
          height: 45px;
          line-height: 45px;
          text-align: center;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border: none;

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
      height: calc(100vh - 210px) !important;

      .el-tab-pane {
        height: 100%;

        .scroll-content {
          overflow: hidden;
        }
      }
    }

    group-button {
      display: flex;
      justify-content: flex-end;
      background: #f0f0f0;
      margin: 0;
      padding: 17px 0 0 0;

      button {
        border-radius: 100px;
        color: #fff;
        height: 45px;
        min-width: 105px;
        border: none;

        span {
          font-size: 15px;
          font-family: Noto Sans JP, sans-serif;
          padding-left: 4px;
          font-weight: 500;
        }

        &.delete {
          background: #343434;
          margin-right: 10px;
        }

        svg {
          font-size: 18px;
        }

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
