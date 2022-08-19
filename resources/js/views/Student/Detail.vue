<template>
  <div class="app-container">
    <div class="header">
      <h1 class="header__name dotdotdot">{{ form.fullname }}</h1>
      <div class="info-status">
        <div class="info-status__item">
          <h4>生徒ステータス</h4>
          <p>{{ form.snz_studentstatus | studentStatus }}</p>
        </div>
        <div class="info-status__item">
          <h4>生徒コード</h4>
          <p class="number">{{ form.snz_studentcode }}</p>
        </div>
        <div class="info-status__item">
          <h4>内部コード</h4>
          <p class="number">{{ form.snz_internalcode }}</p>
        </div>
        <div class="info-status__item">
          <h4>校舎</h4>
          <p>{{ form.business_unit ? form.business_unit.name : '' }}</p>
        </div>
      </div>
    </div>
    <el-tabs type="border-card" class="tab-custom" :active-name="activeTab" @tab-click="tabClick">
      <!-- 1 -->
      <el-tab-pane name="tab1">
        <span slot="label"><i
          v-show="detailFormError"
          class="el-icon-warning"
          style="position: absolute; top: 5px;right: 5px;color: red;"
        /> 基本情報</span>
        <el-scrollbar class="scroll-content">
          <student-detail
            ref="studentDetail"
            :form.sync="form"
            @stopLoading="stopSaveLoading"
            @updateForm="updateForm"
          />
        </el-scrollbar>
      </el-tab-pane>
      <!-- 2 -->
      <el-tab-pane v-if="editing" label="受講情報" :lazy="true" name="tab2" :disabled="disableAllTab">
        <el-scrollbar class="scroll-content">
          <student-contract ref="studentContact" :form.sync="form" />
        </el-scrollbar>
      </el-tab-pane>
      <!-- 3 -->
      <el-tab-pane v-if="editing" label="対応履歴" :lazy="true" name="tab3">
        <el-scrollbar class="scroll-content">
          <student-letter :form="form" />
        </el-scrollbar>
      </el-tab-pane>
      <!-- 4 -->
      <el-tab-pane v-if="editing" label="入会関連" :lazy="true" name="tab4">
        <span slot="label"><i
          v-show="reciprocalFormError"
          class="el-icon-warning"
          style="position: absolute; top: 5px;right: 5px;color: red;"
        /> 入会関連</span>
        <el-scrollbar class="scroll-content">
          <reciprocal :id.sync="id" ref="studentReciprocal" @stopLoading="stopSaveLoading" />
        </el-scrollbar>
      </el-tab-pane>
      <!-- 5 -->
      <el-tab-pane v-if="editing" label="紹介" name="tab5" :lazy="true">
        <el-scrollbar class="scroll-content">
          <student-intro :form="form" />
        </el-scrollbar>
      </el-tab-pane>
      <!-- 6 -->
      <el-tab-pane v-if="editing" label="兄弟情報" :lazy="true" name="tab6">
        <el-scrollbar class="scroll-content">
          <student-brother :internalcode="form.snz_internalcode" />
        </el-scrollbar>
      </el-tab-pane>
      <!-- 7 -->
      <el-tab-pane v-if="editing" label="学校試験・内申" name="tab7" :lazy="true">
        <el-scrollbar class="scroll-content">
          <student-report :form="form" />
        </el-scrollbar>
      </el-tab-pane>
      <!-- 8 -->
      <el-tab-pane v-if="editing" label="塾内テスト" name="tab8" :lazy="true">
        <el-scrollbar class="scroll-content">
          <internal-test ref="internalTest" />
        </el-scrollbar>
      </el-tab-pane>
      <!-- 9 -->
      <el-tab-pane v-if="editing" :lazy="true" label="休塾・退塾" name="tab9">
        <el-scrollbar class="scroll-content">
          <student-register :id="form.snz_studencode" :form.sync="form" @showModal="dialogFormVisible = true" />
        </el-scrollbar>
      </el-tab-pane>
      <!-- 10 -->
      <el-tab-pane v-if="editing && ableRole(['system'])" :lazy="true" name="tab10">
        <span slot="label"><i
          v-show="systemFormError"
          class="el-icon-warning"
          style="position: absolute; top: 5px;right: 5px;color: red;"
        /> システム</span>
        <student-system
          ref="studentSystem"
          :form="form"
          @stopLoading="stopSaveLoading"
          @updateForm="updateForm"
        />
      </el-tab-pane>
    </el-tabs>
    <div class="group-button">
      <el-button
        v-if="editing"
        v-role="['system']"
        :disabled="!disableRole(['system'])"
        class="delete"
        :loading="deleteLoading"
        @click="deleteClick"
      >
        <svg-icon icon-class="_trash_w" />
        <span>削除</span>
      </el-button>
      <button-save
        :disabled="disableRole(['viewonly', 'callcenter'])"
        :loading="saveLoading"
        @save="saveClick"
      />
    </div>
    <!--    <modal-register-->
    <!--      :show-dialog="dialogFormVisible"-->
    <!--      @close="dialogFormVisible = false"-->
    <!--    />-->
  </div>
</template>

<script>
import ButtonSave from '../../components/Common/Button/ButtonSave';
import StudentRegister from './components/StudentRegister';
import StudentSystem from './components/StudentSystem';
import StudentReport from './components/StudentReport';
import StudentContract from './components/StudentContract';
import Reciprocal from './components/Reciprocal';
import StudentDetail from './components/StudentDetail';
import StudentBrother from './components/StudentBrother';
import StudentLetter from './components/StudentLetter';
import StudentIntro from './components/StudentIntro';
import StudentResource from '@/api/student';
import ToiawaseResource from '@/api/toiawase';
import BussinessResourse from '@/api/BusinessUnitRequest';
import { studentStatusLabel } from '@/filters/studentStatus';
import CommonSettings from '@/const/CommonSettings';
import role from '@/directive/role';
import InternalTest from '@/views/Student/components/InternalTest';
import { Message } from 'element-ui';

const studentResource = new StudentResource();
const toiawaseResource = new ToiawaseResource();
const bussinessResourse = new BussinessResourse();

export default {
  components: {
    InternalTest,
    StudentRegister,
    Reciprocal,
    ButtonSave,
    StudentDetail,
    StudentBrother,
    StudentContract,
    StudentLetter,
    StudentIntro,
    StudentSystem,
    StudentReport,
  },
  metaInfo: {
    title: '生徒情報詳細',
  },
  directives: { role },
  filters: {
    studentStatus: studentStatusLabel,
  },
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    if (to.params.redirect || to.name === 'err_403') {
      return next();
    }
    if (this.tabIndex === 0 && this.$refs.studentDetail) {
      const originForm = this.$refs.studentDetail.originForm;
      if (_.isEqual(this.form, originForm)) {
        return next();
      }
    }

    if (this.tabIndex === 1 || this.tabIndex === 7 || this.tabIndex === 4 || this.tabIndex === 2 || this.tabIndex === 10 || this.activeTab === 'tab9') {
      return next();
    }
    if (this.activeTab === 'tab10' && this.$refs.studentSystem) {
      if (_.isEqual(this.$refs.studentSystem.modelForm, this.$refs.studentSystem.originForm)) {
        return next();
      }
    }
    if (this.tabIndex === 3 && this.$refs.studentReciprocal) {
      if (_.isEqual(this.$refs.studentReciprocal.formReciprocal, this.$refs.studentReciprocal.formOrigin)) {
        return next();
      }
    }

    if (this.tabIndex === 5) {
      return next();
    }

    if (this.tabIndex === 6) {
      return next();
    }

    this.$confirm(
      'このページを終了する前に、変更を保存しますか？',
      '保存されていない変更',
      {
        confirmButtonText: '保存して続行',
        cancelButtonText: '変更の破棄',
        type: 'warning',
        distinguishCancelAndClose: true,
      }
    )
      .then(async() => {
        await this.saveClick();
      })
      .then(() => {
        if (!this.anyFormError) {
          next();
        } else {
          next(false);
        }
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
      id: null,
      activeTab: 'tab1',
      commonText: CommonSettings.COMMON_TXT,
      dialogFormVisible: false,
      fullscreenLoading: true,
      form: {},
      deleteLoading: false,
      saveLoading: false,
      tabIndex: 0,
      detailFormError: false,
      reciprocalFormError: false,
      systemFormError: false,
      disableAllTab: true,
    };
  },
  computed: {
    anyFormError: function(){
      return this.detailFormError || this.reciprocalFormError || this.systemFormError;
    },
    editing: function(){
      return !this.$route.params.form;
    },
    creating: function(){
      return !!this.$route.params.form;
    },
  },
  async created() {
    await this.loadForm();
    this.activeTab = this.getParameterByName('tab');
    this.tabIndex = parseInt(this.activeTab.substr(this.activeTab.length - 1)) - 1;
    this.fullscreenLoading = false;
  },
  methods: {
    async init() {
    },
    async loadForm() {
      if (this.editing) {
        this.id = this.$route.params.id;
        const res = await studentResource.getBasicInfo(this.id);
        this.setForm(res.original.data);
      } else {
        if (this.$route.params.registerSame && this.$route.params.snz_studentcode) {
          const res = await studentResource.getBasicInfo(this.$route.params.snz_studentcode, { copy_info: true });
          const studentmng = await studentResource.get(this.$route.params.snz_internalcode);
          const form = this.$route.params.form;
          let data = res.original.data;
          data = _.merge(data, form);
          for (const property in studentmng) {
            if (!data[property]) {
              data[property] = studentmng[property];
            }
          }
          data = _.merge(data, studentmng);
          data.snz_studentcode = null;
          data.snz_studentstatus = null;
          this.setForm(_.clone(data));
        } else {
          this.setForm(_.clone(this.$route.params.form));
        }
        if (this.form.business_unit && !this.form.business_unit.name && this.form.business_unit.id) {
          await bussinessResourse.getOne(this.form.business_unit.id).then(res => {
            this.form.business_unit = res;
          });
        }
      }
      this.setForm(_.clone(this.form));
    },
    setForm(form) {
      this.form = form;
      if (this.$refs.studentDetail) {
        this.$refs.studentDetail.originForm = _.clone(this.form);
        this.$refs.studentDetail.init(this.form);
        this.disableAllTab = false;
      } else {
        this.$nextTick(() => {
          this.setForm(form);
        });
      }
    },
    async saveClick() {
      this.saveLoading = true;
      if (this.editing) {
        await this.updateStudent();
        this.switchTabError();
      }
      if (this.creating) {
        await this.$refs.studentDetail.$refs.form.validate().then(async() => {
          await this.registerStudent();
        }).catch((e) => {
          this.$nextTick(() => {
            this.$refs.studentDetail.$refs.form.focusFieldError();
          });
          this.stopSaveLoading();
          throw e;
        });
      }
      this.saveLoading = false;
    },
    async validateForm() {
      await this.$refs.studentDetail.$refs.form.validate((valid) => {
        this.detailFormError = !valid;
      });
      if (this.$refs.studentSystem) {
        await this.$refs.studentSystem.$refs['form'].validate((valid) => {
          this.systemFormError = !valid;
        });
        this.$refs.studentDetail.updateSubmit = true;
      }
      if (this.$refs.studentReciprocal) {
        await this.$refs.studentReciprocal.$refs['form'].validate((valid) => {
          this.reciprocalFormError = !valid;
        });
      }
    },
    async updateStudent() {
      let statusContact = 1;
      if (this.$refs.studentSystem) {
        statusContact = await this.$refs.studentSystem.checkStatus();
      }
      if (statusContact === 0) {
        await this.$refs.studentSystem.delete();
      } else if (statusContact === 1) {
        await this.validateForm();
        if (!this.anyFormError) {
          if (this.$refs.studentSystem) {
            try {
              await this.$refs.studentSystem.updateStudentSystem();
            } catch (e) {
              this.detailFormError = true;
            }
          }
          try {
            await this.$refs.studentDetail.updateStudent();
          } catch (e) {
            this.detailFormError = true;
            throw e;
          }
          if (this.$refs.studentReciprocal) {
            try {
              await this.$refs.studentReciprocal.updateReciprocalStudent();
            } catch (e) {
              this.detailFormError = true;
              throw e;
            }
          }
        }
        this.$nextTick(() => {
          const isError = document.getElementsByClassName('is-error');
          if (!isError.length) {
            this.$message({
              message: this.commonText.saveSuccess,
              type: 'success',
            });
          }
        });
      }
    },
    switchTabError() {
      if (this.detailFormError) {
        this.activeTab = 'tab1';
        this.$nextTick(() => {
          this.$refs.studentDetail.$refs.form.focusFieldError();
        });
        return true;
      }
      if (this.reciprocalFormError){
        this.activeTab = 'tab4';
        this.$nextTick(() => {
          this.$refs.studentReciprocal.$refs.form.focusFieldError();
        });
        return true;
      }
      if (this.systemFormError) {
        this.activeTab = 'tab10';
        this.$nextTick(() => {
          this.$refs.studentDetail.$refs.form.focusFieldError();
        });
        return true;
      }
      return this.stopSaveLoading();
    },
    stopSaveLoading() {
      this.saveLoading = false;
    },
    async deleteClick() {
      this.$confirm(this.commonText.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      })
        .then(async() => {
          this.deleteLoading = true;
          await studentResource
            .destroy(this.id)
            .then(() => {
              const query = this.$route.params.query;
              this.$message({
                type: 'success',
                message: '削除しました。',
              });
              this.redirectPage({
                name: 'StudentList',
                params: { redirect: true },
                query: query,
              });
            })
            .catch(err => {
              if (err.response.status === 424) {
                this.$message({
                  type: 'error',
                  message: err.response.data.original.message,
                });
              }
            });
        })
        .catch(() => {
          return false;
        })
        .finally(() => {
          this.deleteLoading = false;
        });
    },
    tabClick(tab) {
      console.log('tabclick');
      this.tabIndex = parseInt(tab.index);
      this.activeTab = tab._props.name;
      const url = new URL(window.location);
      url.searchParams.set('tab', tab._props.name);
      window.history.pushState({}, '', url);
    },
    updateForm(form) {
      this.form = form;
      this.$refs.studentDetail.originForm = _.clone(this.form);
    },
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
    async registerStudent() {
      if (this.$route.params.registerOther) {
        await this.registerOtherStudent();
      }
      if (this.$route.params.registerSame) {
        await this.registerSameStudent();
      }
    },
    async registerOtherStudent() {
      await toiawaseResource.registerOtherStudent(this.form.id, this.form).then((res) => {
        this.$message({
          message: this.commonText.saveSuccess,
          type: 'success',
        });
        this.setForm(res.original.basic_info.data);
        this.$refs.studentDetail.showBrother(res.original.contact);
      }).catch((err) => {
        if (err.response.status === 410){
          Message.error(this.commonText.createContactError);
        }
      }).finally(() => {
        this.saveLoading = false;
      });
    },
    async registerSameStudent() {
      await toiawaseResource.registerSameStudent(this.form.id, {
        'snz_internalcode': this.$route.params.snz_internalcode,
        'snz_grade_id': this.form.snz_grade_id,
      }).then((res) => {
        if (res.original.status === 422) {
          this.$message({
            message: res.original.message,
            type: 'error',
          });
        } else {
          this.$message({
            message: this.commonText.saveSuccess,
            type: 'success',
          });
          this.setForm(res.original.basic_info.data);
          this.$refs.studentDetail.showBrother(res.original.contact);
        }
      }).catch((err) => {
        if (err.response.status === 410){
          Message.error(this.commonText.createContactError);
        }
      }).finally(() => {
        this.saveLoading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import 'styles/detail';

</style>
