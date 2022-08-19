<template>
  <div v-loading="loading">
    <div class="app-container">
      <i
        v-show="generalFormError"
        class="el-icon-warning"
        style="position: absolute;top: 27px;left: 120px;z-index: 14;color: red;"
      />
      <el-tabs v-model="activeTab" type="border-card" class="tab-custom">
        <el-tab-pane :key="1" label="全般" name="general">
          <el-scrollbar class="scroll-content">
            <general-component v-if="dataLoaded" ref="generalComponent" :school="item" :semesters="semesters" :school-options="schoolOptions" />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :key="2" label="システム" name="system">
          <el-scrollbar class="scroll-content">
            <system-component ref="systemComponent" :school="item" />
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
import SystemComponent from './components/SystemComponent';
import { Message } from 'element-ui';
import { calcTimeWithTimeZone } from '@/helpers/mixins/CalcTimeZone';
import SemesterOptions from '../../const/Semester';
import SchoolResource from '../../api/school';
import ButtonDelete from '@/components/Common/Button/ButtonDelete';

const schoolResource = new SchoolResource();

export default {
  components: {
    ButtonDelete,
    ButtonSave,
    GeneralComponent,
    SystemComponent,
  },
  metaInfo: {
    title: '学校詳細',
  },
  data() {
    return {
      school: {},
      schoolOptions: [],
      semesters: SemesterOptions.OPTION_SNZ_SEMESTER,
      item: {
        id: null,
        snz_name: '',
        school_type: null,
        snz_semester: null,
        snz_schoolcode: '',
        status: 1,
      },
      activeTab: 'general',
      isError: false,
      acting: false,
      deleting: false,
      dataOriginal: {},
      generalFormError: false,
      loading: true,
      dataLoaded: false,
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect) {
      return next();
    }
    if (this.dataLoaded) {
      const dataGen = this.$refs.generalComponent.formData;
      const dataSys = this.$refs.systemComponent.formData;
      const dataAll = {
        ...dataGen,
        ...dataSys,
      };
      if (!_.isEmpty(this.dataOriginal) && !_.isEqual(this.dataOriginal, dataAll)) {
        this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }).then(() => {
          this.updateDataGeneral();
          if (!this.isError && typeof this.$route.params.id !== 'undefined') {
            schoolResource.update(this.$route.params.id, dataAll).then(() => {
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
            schoolResource.store(dataAll).then(() => {
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
  async created() {
    if (typeof this.$route.params.id !== 'undefined') {
      await this.getData();
    } else {
      this.dataOriginal = JSON.parse(JSON.stringify(this.item));
    }
    const res = await schoolResource.fetchCommon();
    this.schoolOptions = res.original.schooTypes;
    this.dataLoaded = true;
    this.loading = false;
  },
  methods: {
    async getData() {
      this.item = await schoolResource.get(this.$route.params.id);
      this.item.created_at = calcTimeWithTimeZone(this.item.created_at);
      this.item.updated_at = calcTimeWithTimeZone(this.item.updated_at);
      this.dataOriginal = JSON.parse(JSON.stringify(this.item));
    },
    async saveData() {
      const dataGen = this.$refs.generalComponent.formData;
      const dataSys = this.$refs.systemComponent.formData;
      const dataAll = {
        ...dataGen,
        ...dataSys,
      };
      if (dataSys.status === 0){
        // Delete
        this.deleteData(true);
        return;
      }
      this.acting = true;
      this.updateDataGeneral();
      if (!this.isError && typeof this.$route.params.id !== 'undefined') {
        await schoolResource.update(this.$route.params.id, dataAll).then(res => {
          this.generalFormError = false;
          Message({
            message: this.CommonTxt.saveSuccess,
            type: 'success',
            duration: 1500,
          });
          this.acting = false;
          if (this.$refs.systemComponent.$data.formData.status !== 1) {
            this.dataOriginal = {};
            this.redirectPage({ 'name': 'Schooledit', params: { redirect: true }});
          } else {
            this.item = res;
            this.dataOriginal = JSON.parse(JSON.stringify(this.item));
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
        // CREATE
      } else if (!this.isError && typeof this.$route.params.id === 'undefined') {
        await schoolResource.store(dataAll).then((res) => {
          this.generalFormError = false;
          Message({
            message: this.CommonTxt.saveSuccess,
            type: 'success',
            duration: 1500,
          });
          this.dataOriginal = JSON.parse(JSON.stringify(this.item));
          this.redirectPage({ name: 'SchoolEdit', params: { id: res.id }});
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
    deleteData(saveDelete = false) {
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(async() => {
        if (saveDelete){
          this.acting = true;
        } else {
          this.deleting = true;
        }
        await schoolResource.destroy(this.$route.params.id).then(() => {
          Message({
            message: this.CommonTxt.deleteSuccess,
            type: 'success',
            duration: 1500,
          });
          const query = this.$route.params.query;
          this.redirectPage({ 'name': 'School', params: { redirect: true }, query: query });
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
  },
};
</script>
<style lang="scss" scoped>
@import "./styles/edit";
</style>
