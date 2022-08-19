<template>
  <div v-loading="fullscreenLoading" class="app-container popper-container">
    <p class="approach"><span class="text-approach">ステータス </span><span>{{ model|approachWebText }}</span></p>
    <i v-show="inquiryFormError" v-if="ableRole(['system', 'viewonly', 'callcenter'])" class="el-icon-warning" style="position: absolute; top: 26px;left: 127px;z-index: 14; color: red;" />
    <i v-show="callCenterFormError" v-if="ableRole(['system'])" class="el-icon-warning" style="position: absolute; top: 26px;left: 249px;z-index: 14; color: red;" />
    <!--    <i class="el-icon-warning" style="position: relative; top: 16px;left: 303px;z-index: 14; color: red;"></i>-->
    <div class="card-body__content content popper">
      <el-tabs ref="scroll_tab" v-model="activeTab" type="border-card" class="tab-custom" @tab-click="tabClick">
        <el-tab-pane label="問合せ内容" name="inquiry">
          <el-scrollbar class="scroll-content">
            <inquiry
              :id="id"
              ref="inquiry"
              :form.sync="model"
              @setModel="setModel"
              @checkDuplicate="clickCheckDuplicate"
              @changeDocumentsent="changeDocumentsent"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane v-if="ableRole(['system', 'viewonly', 'callcenter'])" label="コールセンター" name="callCenter">
          <el-scrollbar class="scroll-content">
            <call-center
              :id="id"
              ref="callCenter"
              :form.sync="model"
              @setModel="setModel"
              @checkDuplicate="clickCheckDuplicate"
              @changeDocumentsent="changeDocumentsent"
              @copy="copyHandle"
            />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane v-if="ableRole(['system'])" label="システム" :lazy="true" name="system">
          <el-scrollbar class="scroll-content">
            <system :id="id" ref="system" @closeLoading="closeLoading" />
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
      <div class="group-button">
        <el-button
          v-if="model.id"
          v-role="[
            'system',
          ]"
          class="delete"
          :loading="deleteLoading"
          :disabled="saveLoading"
          @click="deleteClick"
        >
          <svg-icon icon-class="_trash_w" />
          <span>削除</span>
        </el-button>
        <button-save
          style="background: #C70000"
          :loading="saveLoading"
          :disabled="deleteLoading || disableRole(['viewonly'])"
          @save="saveClick"
        />
      </div>
    </div>
    <el-dialog id="duplicateDialog" :show-close="false" width="fit-content" :visible.sync="duplicateVisible" @close="closeLoading" @closed="closeDupticateDialog">
      <div slot="title">
        <div class="header-div">
          <h3 class="title-header">重複レコードが見つかりました</h3>
          <div style="margin-right: 25px;">
            <i class="el-icon-close" @click="duplicateVisible = false" />
            <p style="font-size: 12px;">閉じる</p>
          </div>
        </div>
      </div>
      <div class="card-body__content">
        <el-table
          ref="duplicateTable"
          class="table-duplicate"
          :data="duplicateStudents"
          height="350px"
          width="100%"
          highlight-current-row
          fit
          center
          header-cell-class-name="my-header"
          empty-text="データはありません。"
          @select="handleRowClick"
        >
          <el-table-column
            width="50"
            type="selection"
            :selectable="()=>{ return !disableRole(['callcenter'])}"
          />
          <el-table-column property="yomilastname" label="姓カナ" width="110">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.yomilastname }}</span>
            </template>
          </el-table-column>
          <el-table-column property="yomifirstname" label="名カナ" width="110">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.yomifirstname }}</span>
            </template>
          </el-table-column>
          <el-table-column property="unit_name" label="校舎" width="120">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.unit_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生徒ステータス" width="140">
            <template slot-scope="scope">{{ scope.row.snz_studentstatus | studentStatus }}</template>
          </el-table-column>
          <el-table-column property="grade_name" label="学年" width="100">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.grade_name }}</span>
            </template>
          </el-table-column>
          <el-table-column property="snz_internalcode" label="内部コード" width="140">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_internalcode }}</span>
            </template>
          </el-table-column>
          <el-table-column property="telephone1" label="電話番号1" width="120" />
          <el-table-column property="telephone2" label="電話番号2" width="120" />
          <el-table-column property="managerphone" label="保護者電話番号" width="140" />
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="close-button" @click="cancelDuplicateDialog">
          <i class="el-icon-circle-close" />
          <span class="text-btn">キャンセル</span>
        </el-button>
        <el-button
          v-show="showRegisterOtherStudent"
          type="primary"
          :loading="loadingRegisterOther"
          :disabled="disableRole(['viewonly', 'callcenter'])"
          class="register-other"
          @click="registerOtherStudent"
        > <svg-icon icon-class="_user" class="top-icon" /> <span class="text-btn"> 別人登録 </span></el-button>
        <el-button
          v-show="duplicateStudents.length > 0"
          type="primary"
          :loading="loadingRegisterSame"
          :disabled="duplicateStudents.length === 0 || disableRole(['viewonly', 'callcenter'])"
          class="register-same"
          @click="func => registerSameStudent(showRegisterOtherStudent)"
        ><svg-icon icon-class="_user" class="top-icon" /><span class="text-btn"> 同一人物登録 </span></el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Inquiry from './components/inquiry';
import CallCenter from './components/call-center';
import System from './components/system';
import ButtonSave from '@/components/Common/Button/ButtonSave';
import ToiawaseResource from '@/api/toiawase';
import UserResource from '@/api/user';
import { Message } from 'element-ui';
import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';
import { approachWebText } from '@/filters/contact';
import { isEquivalent } from '@/mixins/object';
import { studentStatusLabel } from '@/filters/studentStatus';
import CommonSettings from '@/const/CommonSettings';
const toiawaseResource = new ToiawaseResource();
import toiawaseStatus from '@/const/ToiawaseStatus';

const userResource = new UserResource();

export default {
  name: 'ToiwaseDetail',
  metaInfo: {
    title: '入会前の問合せ詳細',
  },
  components: { Inquiry, CallCenter, System, ButtonSave },
  directives: { permission, role },
  filters: {
    approachWebText: approachWebText,
    studentStatus: studentStatusLabel,
  },
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      id: null,
      saveLoading: false,
      deleteLoading: false,
      model: {},
      originModel: {},
      tabIndex: 0,
      duplicateVisible: false,
      checkDuplicateLoading: false,
      loadingRegisterOther: false,
      loadingRegisterSame: false,
      duplicateStudents: [],
      selectedStudent: [],
      selectedInternalcode: 0,
      inquiryFormError: false,
      callCenterFormError: false,
      fullscreenLoading: true,
      showRegisterOtherStudent: true,
      activeTab: 'inquiry',
    };
  },
  computed: {
    isCreating(){
      return this.$route.name === 'toiawase-create';
    },
    isEditing(){
      return this.$route.name !== 'toiawase-create';
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    if ((this.tabIndex === 0 || this.tabIndex === 1) && isEquivalent(this.model, this.originModel) || (Object.keys(this.model).length === 1 && this.model.cognitive_medium.length === 0)) {
      return next();
    }
    if (this.tabIndex === 2 && this.model.status === this.$refs.system.$data.form.status && isEquivalent(this.model, this.originModel)) {
      return next();
    }
    if ((this.tabIndex === 0 || this.tabIndex === 1) && _.isEqual(this.model, this.originModel)) {
      return next();
    }
    this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
      confirmButtonText: '保存して続行',
      cancelButtonText: '変更の破棄',
      type: 'warning',
      distinguishCancelAndClose: true,
    }).then(() => {
      if (this.tabIndex === 2) {
        this.model.status = this.$refs.system.$data.form.status;
      }
      this.clickCheckDuplicate();
    }).catch((action) => {
      if (action === 'cancel') {
        next();
      } else {
        next(false);
      }
    });
  },
  async created() {
    if (this.isEditing) {
      this.id = this.$route.params.id.toString();
    }
    await this.setDefaultUser();
  },
  methods: {
    async saveClick() {
      this.showRegisterOtherStudent = false;
      if (this.tabIndex === 2 && this.$refs.system && this.isEditing) {
        this.model.status = this.$refs.system.$data.form.status;
        if (!this.model.status) {
          this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
            confirmButtonText: 'はい',
            cancelButtonText: 'キャンセル',
            type: 'warning',
          }).then(async() => {
            this.saveLoading = true;
            await this.$refs.system.updateToiawase();
            const query = this.$route.params.query;
            this.saveLoading = false;
            return this.redirectPage({ 'name': 'toiawase-index', params: { redirect: true }, query: query });
          }).catch(() => {
            return false;
          });
        } else {
          this.saveLoading = true;
          await this.checkDuplicate();
        }
      } else {
        this.saveLoading = true;
        await this.checkDuplicate();
      }
    },
    async clickCheckDuplicate() {
      this.$confirm(this.CommonTxt.changeExperienceTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'いいえ',
        type: 'warning',
      }).then(async() => {
        this.showRegisterOtherStudent = true;
        await this.checkDuplicate();
      }).catch(() => {
        this.closeLoading();
        return false;
      });
    },
    async deleteClick() {
      this.$confirm(this.commonText.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(async() => {
        this.deleteLoading = true;
        await toiawaseResource.destroy(this.model.id).then(() => {
          const query = this.$route.params.query;
          this.redirectPage({ 'name': 'toiawase-index', params: { redirect: true }, query: query });
        }).catch((err) => {
          Message({
            message: `${err.response.data.message}`,
            type: 'error',
            duration: 1500,
          });
        }).finally(() => {
          this.deleteLoading = false;
        });
      }).catch(() => {
        return false;
      });
    },
    async checkDuplicate(checkDuplicate = true) {
      await this.$refs.inquiry.$refs.inquiryForm.validate().then(async() => {
        this.inquiryFormError = false;
        this.callCenterFormError = false;
        await this.afterCheckValidate(checkDuplicate);
      }).catch(() => {
        this.activeTab = 'inquiry';
        this.$nextTick(() => {
          this.$refs.inquiry.$refs.inquiryForm.focusFieldError();
        });
        this.inquiryFormError = true;
        this.catchValidate();
        if (this.$refs.callCenter) {
          this.$refs.callCenter.$refs.inquiryForm.validate().then(() => {
            this.callCenterFormError = false;
          }).catch(() => {
            this.callCenterFormError = true;
            if (!this.inquiryFormError) {
              this.activeTab = 'callCenter';
              this.$nextTick(() => {
                this.$refs.callCenter.$refs.inquiryForm.focusFieldError();
              });
            }
          });
        }
      });
    },
    async checkDuplicateProgress() {
      this.duplicateStudents = await toiawaseResource.checkDuplicate(this.model.snz_telephone);
      this.closeLoading();
      this.setModel(this.model);
      this.$refs.inquiry.updateApproachOptions();
      if (!this.duplicateStudents.length) {
        if (!this.showRegisterOtherStudent) {
          if (this.isCreating) {
            this.redirectPage({ name: 'toiawase-detail', params: { id: this.model.id, redirect: true }});
          }
          return true;
        } else {
          this.duplicateVisible = true;
        }
      } else {
        this.duplicateVisible = true;
      }
    },
    catchValidate() {
      this.closeLoading();
    },
    async afterCheckValidate(checkDuplicate = true) {
      if (this.isCreating && !this.model.id) {
        await this.createToiawase().then(async(res) => {
          this.model = res.original.data;
          this.updateViewCenter();
          window.history.replaceState(null, null, '/toiawase/detail/' + this.model.id);
          this.$message({
            message: this.commonText.saveSuccess,
            type: 'success',
          });
          if (checkDuplicate) {
            await this.checkDuplicateProgress();
          }
        }).catch(err => {
          if (err.response.status === 422) {
            this.$refs.inquiry.$refs.inquiryForm.injectFormValidates(err.response);
            this.$refs.callCenter.$refs.inquiryForm.injectFormValidates(err.response);
            this.scrollTop();
            this.activeTab = 'inquiry';
            this.$refs.inquiry.$refs.inquiryForm.focusFieldError();
          }
        }).finally(() => {
          this.closeLoading();
        });
      } else {
        await this.updateToiawase().then(async() => {
          if (this.model.snz_internalcode) {
            if (this.showRegisterOtherStudent) {
              return this.redirectPage({
                name: 'StudentCreate', params: {
                  form: this.convertModelToStudent(this.model),
                  registerSame: true,
                  snz_studentcode: this.model.student.snz_studentcode,
                  snz_internalcode: this.model.snz_internalcode, redirect: true,
                },
              });
            } else {
              this.closeLoading();
              this.$message({
                message: this.commonText.saveSuccess,
                type: 'success',
              });
            }
            return true;
          }
          this.$message({
            message: this.commonText.saveSuccess,
            type: 'success',
          });
          if (checkDuplicate) {
            await this.checkDuplicateProgress();
          }
        }).catch(err => {
          if (err.response.status === 422) {
            this.$refs.inquiry.$refs.inquiryForm.injectFormValidates(err.response);
            this.$refs.callCenter.$refs.inquiryForm.injectFormValidates(err.response);
            this.scrollTop();
            this.activeTab = 'inquiry';
          }
        }).finally(() => {
          this.closeLoading();
        });
      }
    },
    updateViewCenter() {
      this.$nextTick(() => {
        if (this.$refs.callCenter) {
          this.$refs.callCenter.getGrade();
        }
      });
    },
    async updateToiawase() {
      await toiawaseResource.update(this.model.id, this.model).then((res) => {
        this.setModel(res.original.data);
        this.getSystemUpdate();
      }).then(() => {
        this.updateViewCenter();
      });
    },
    createToiawase(){
      return toiawaseResource.store(this.model);
    },
    getSystemUpdate(){
      if (this.$refs.system){
        this.$refs.system.detailModel();
      }
    },
    async handleRowClick(row, selection) {
      const snz_internalcode = selection.snz_internalcode;
      if (snz_internalcode !== this.selectedInternalcode) {
        this.selectedInternalcode = snz_internalcode;
        this.selectedStudent = row;
        this.$refs.duplicateTable.clearSelection();
        this.duplicateStudents.forEach(row => {
          if (row.snz_internalcode === snz_internalcode) {
            this.$refs.duplicateTable.toggleRowSelection(row);
          }
        });
      } else {
        const contactId = selection.contact_id;
        this.duplicateStudents.forEach(row => {
          if (row.snz_internalcode === snz_internalcode && contactId !== row.contact_id) {
            this.$refs.duplicateTable.toggleRowSelection(row);
          }
        });
        this.clearSelectedUser();
      }
    },
    clearSelectedUser() {
      this.selectedInternalcode = null;
      this.selectedStudent = [];
    },
    convertModelToStudent(model) {
      model.yomilastname = model.snz_yomilastname;
      model.yomifirstname = model.snz_yomifirstname;
      model.telephone1 = model.snz_telephone;
      model.emailaddress1 = model.student_emailaddress;
      model.emailaddress2 = model.manager_emailaddress;
      model.snz_dmrejection = 0;
      model.snz_dmsendflg = 0;
      model.snz_seatconsideration = 0;
      model.toiawaseId = this.id;
      model.address1_postalcode = null;
      model.address1_city = null;
      model.business_unit = {
        id: model.snz_businessunit_id,
        name: '',
      };
      return model;
    },
    async registerOtherStudent() {
      this.loadingRegisterOther = true;
      return this.redirectPage({
        name: 'StudentCreate',
        params: {
          form: this.convertModelToStudent(this.model),
          registerOther: true, redirect: true,
        },
      });
    },
    async registerSameStudent(redirect = true) {
      if (!this.selectedStudent.length) {
        this.$message({
          message: '生徒情報を選択してください。',
          type: 'error',
        });
      } else {
        const snz_internalcode = this.selectedStudent[0].snz_internalcode;
        const snz_studentcode = this.selectedStudent[0].snz_studentcode;
        this.loadingRegisterSame = true;
        if (this.showRegisterOtherStudent) {
          return this.redirectPage({ name: 'StudentCreate', params: {
            form: this.convertModelToStudent(this.model),
            registerSame: true,
            snz_studentcode: snz_studentcode,
            snz_internalcode: snz_internalcode, redirect: true }});
        } else {
          return toiawaseResource.updateInfo(this.model.id, { snz_internalcode: snz_internalcode }).then((res) => {
            this.setModel(res.original.data);
            this.duplicateVisible = false;
            this.$message({
              message: this.commonText.saveSuccess,
              type: 'success',
            });
          }).finally(() => {
            this.loadingRegisterSame = false;
          });
        }
      }
    },
    closeDupticateDialog() {
      this.clearSelectedUser();
    },
    closeLoading() {
      this.saveLoading = false;
      if (this.$refs.inquiry) {
        this.$refs.inquiry.$data.checkDuplicateLoading = false;
      }
      if (this.$refs.callCenter) {
        this.$refs.callCenter.$data.checkDuplicateLoading = false;
      }
    },
    setModel(model) {
      this.model = model;
      this.fullscreenLoading = false;
      if ([toiawaseStatus.CANCEL_INTERVIEW, toiawaseStatus.END_INTERVIEW].includes(model.snz_approachend)) {
        this.$refs.inquiry.$data.disableApproachend = true;
        this.$refs.inquiry.updateApproachOptions(true);
      }
      this.originModel = JSON.parse(JSON.stringify(model));
      this.updateViewCenter();
    },
    async setDefaultUser() {
      const res = await userResource.searchName();
      if (this.$refs.callCenter) {
        this.$refs.callCenter.$data.defaultUsers = res.data;
        if (this.isEditing) {
          await this.$refs.callCenter.getCallLog();
        }
        this.$refs.callCenter.$data.gradeOptions = this.$refs.inquiry.$data.gradeOptions;
      }
    },
    tabClick(tab) {
      this.tabIndex = parseInt(tab.index);
    },
    cancelDuplicateDialog() {
      this.duplicateVisible = false;
      if (this.isCreating) {
        this.redirectPage({ name: 'toiawase-detail', params: { id: this.model.id, redirect: true }});
      }
    },
    changeDocumentsent(){
      if (this.model.snz_documentsent === 1 && !this.model.snz_documentsentdate){
        this.model.snz_documentsentdate = moment().format('YYYY-MM-DD HH:mm');
      } else if (this.model.snz_documentsent === 0) {
        this.model.snz_documentsentdate = null;
      }
    },
    async copyHandle() {
      this.model.snz_supportstatus_copy = this.model.snz_supportstatus;
      this.model.snz_customer_request_copy = this.model.snz_customer_request;
      this.model.snz_documentsent_copy = this.model.snz_documentsent;
      this.model.snz_documentsentdate_copy = this.model.snz_documentsentdate;
      this.model.snz_calldetail_copy = this.model.snz_calldetail;
      this.model.snz_interviewdate_copy = this.model.snz_interviewdate;
      this.model.new_next_action_copy = this.model.new_next_action;
      this.model.snz_interviewer_id_copy = this.model.snz_interviewer_id;
      const userid = this.model.snz_interviewer_id;
      this.model.interviewer_copy = _.find(this.$refs.callCenter.$refs.snz_interviewer.options, item => {
        return item.id === userid;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import './styles/detail';
@import "@/styles/toiawase/index";
</style>
