<template>
  <div v-loading="loading">
    <div class="app-container">
      <i v-show="generalFormError" class="el-icon-warning" style="position: absolute; top: 26px;left: 127px;z-index: 14; color: red;" />
      <el-tabs v-model="activeTab" type="border-card" class="tab-custom">
        <el-tab-pane :key="1" label="全般" name="general">
          <el-scrollbar class="scroll-content">
            <general
              v-if="dataLoaded"
              ref="generalComponent"
              :grade="grade"
              :school-type-options="schoolTypeOptions"
              :grade-filter-options="gradeFilterOptions"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :key="2" label="システム" name="system">
          <el-scrollbar class="scroll-content">
            <system ref="systemComponent" :grade="grade" />
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
import General from './conponents/General';
import System from './conponents/System';
import { Message } from 'element-ui';
import { calcTimeWithTimeZone } from '@/helpers/mixins/CalcTimeZone';
import ButtonSave from '../../../components/Common/Button/ButtonSave';
import GradeRequest from '@/api/gradeRequest';
import ButtonDelete from '@/components/Common/Button/ButtonDelete';
const gradeRequest = new GradeRequest();
export default {
  components: {
    ButtonDelete,
    ButtonSave,
    General,
    System,
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
      if (!_.isEmpty(this.dataOriginal) && !this.isEqual(this.dataOriginal, dataAll)) {
        this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }).then(() => {
          this.updateDataGeneral();
          if (!this.isError && typeof this.$route.params.id !== 'undefined') {
            gradeRequest.update(this.$route.params.id, dataAll).then(() => {
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
            gradeRequest.store(dataAll).then(() => {
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
      grade: {
        id: null,
        snz_name: '',
        snz_actualgrade: '',
        snz_next_grade_id: null,
        snz_gradecode: '',
        priority_display: null,
        snz_school_type_id: null,
        status: 1,
      },
      dataOriginal: null,
      schoolTypeOptions: [],
      gradeFilterOptions: {},
      isError: false,
      acting: false,
      deleting: false,
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
      this.dataOriginal = JSON.parse(JSON.stringify(this.grade));
    }
    this.schoolTypeOptions = await gradeRequest.fetchSchoolType();
    this.gradeFilterOptions = await gradeRequest.fetchGradeFilter();
    this.dataLoaded = true;
    this.loading = false;
  },
  methods: {
    async getData() {
      this.grade = await gradeRequest.get(this.$route.params.id);
      this.grade.created_at = calcTimeWithTimeZone(this.grade.created_at);
      this.grade.updated_at = calcTimeWithTimeZone(this.grade.updated_at);
      this.dataOriginal = JSON.parse(JSON.stringify(this.grade));
    },
    async saveData() {
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
          }).then(async() => {
            this.acting = true;
            await this.update(dataAll);
          });
        } else {
          this.acting = true;
          await this.update(dataAll);
        }
        // CREATE
      } else if (!this.isError && typeof this.$route.params.id === 'undefined') {
        this.acting = true;
        await gradeRequest.store(dataAll).then((res) => {
          this.generalFormError = false;
          Message({
            message: this.CommonTxt.saveSuccess,
            type: 'success',
            duration: 1500,
          });
          this.dataOriginal = JSON.parse(JSON.stringify(this.grade));
          this.redirectPage({ name: 'editGrade', params: { id: res.id, redirect: true }});
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
        }).finally(() => {
          this.acting = false;
        });
      }
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
    deleteData() {
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        this.deleting = true;
        gradeRequest.destroy(this.$route.params.id).then(response => {
          Message({
            message: this.CommonTxt.deleteSuccess,
            type: 'success',
            duration: 1500,
          });
          const query = this.$route.params.query;
          this.redirectPage({ 'name': 'Grade', params: { redirect: true }, query: query });
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
          this.deleting = false;
        });
      }).catch(() => {
        return false;
      });
    },
    isEqual(dataOriginal, dataAll) {
      if (dataOriginal.snz_name === dataAll.snz_name &&
      dataOriginal.snz_actualgrade === dataAll.snz_actualgrade &&
      dataOriginal.snz_next_grade_id === dataAll.snz_next_grade_id &&
      dataOriginal.snz_gradecode === dataAll.snz_gradecode &&
      dataOriginal.priority_display === dataAll.priority_display &&
      dataOriginal.snz_school_type_id === dataAll.snz_school_type_id &&
      dataOriginal.end_birthday === dataAll.end_birthday &&
      dataOriginal.start_birthday === dataAll.start_birthday &&
      dataOriginal.status === dataAll.status) {
        return true;
      } else {
        return false;
      }
    },
    async update(dataAll) {
      await gradeRequest.update(this.$route.params.id, dataAll).then(res => {
        this.generalFormError = false;
        Message({
          message: this.CommonTxt.saveSuccess,
          type: 'success',
          duration: 1500,
        });
        if (this.$refs.systemComponent.$data.formData.status !== 1) {
          this.dataOriginal = {};
          this.redirectPage({ 'name': 'Grade', params: { redirect: true }});
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
      }).finally(() => {
        this.acting = false;
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
}
</style>
