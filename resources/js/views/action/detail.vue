<template>
  <div class="app-container">
    <div class="card-body__content content">
      <el-scrollbar v-loading="isLoading" class="scroll-content">
        <div class="actions-detail">
          <el-form
            id="actionForm"
            ref="actionForm"
            label-width="147px"
            :rules="rules"
            :model="form"
          >
            <div class="card-body">
              <h3>
                全般
              </h3>
              <el-row class="form-general">
                <el-col :span="8">
                  <el-form-item label="対応生徒氏名" prop="snz_studentcode">
                    <el-select v-model="form.snz_studentcode" disabled>
                      <el-option
                        :key="form.snz_studentcode"
                        :label="form.student.fullname"
                        :value="form.snz_studentcode"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    class="actor"
                    label="対応者"
                    prop="snz_actionby_user_id"
                  >
                    <el-select
                      v-model="form.snz_actionby_user_id"
                      v-loadmore="() => loadMoreUser('action_user_option')"
                      class="filterable-select"
                      :remote-method="
                        data =>
                          searchUser(
                            'action_user_option',
                            data,
                            form.snz_actionby_user_id
                          )
                      "
                      filterable
                      remote
                      clearable
                      :no-data-text="commonText.selectboxSearchEmptyTxt"
                      :no-match-text="commonText.selectboxEmptyTxt"
                      :disabled="disableRole(['callcenter', 'viewonly'])"
                      placeholder=""
                      @change="
                        () => changeActionUserSearch('action_user_option')
                      "
                      @focus="
                        () => changeActionUserSearch('action_user_option')
                      "
                    >
                      <el-option
                        v-for="item in userOption.action_user_option"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="line" />
            <div class="card-body">
              <h3>
                対応関連
              </h3>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="対応日" prop="snz_actiondate">
                    <el-date-picker
                      v-model="form.snz_actiondate"
                      format="yyyy/MM/dd"
                      prefix-icon="_calendar"
                      :disabled="disableRole(['callcenter', 'viewonly'])"
                      :editable="false"
                      type="date"
                      placeholder=""
                    />
                    <span class="icon-input__calendar">
                      <svg-icon
                        icon-class="_calendar"
                        style="font-size: 17px"
                      />
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="対応ステータス" prop="snz_actionstatus">
                    <el-select
                      v-model="form.snz_actionstatus"
                      :disabled="disableRole(['callcenter', 'viewonly'])"
                      clearable
                      placeholder=""
                    >
                      <el-option
                        v-for="item in actionStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="22">
                  <el-form-item label="対応内容" prop="snz_actioncontents">
                    <el-input
                      v-model="form.snz_actioncontents"
                      :disabled="disableRole(['callcenter', 'viewonly'])"
                      type="textarea"
                      :rows="4"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="line" />
            <div v-if="ableRole(['system'])" class="card-body system">
              <h3>
                システム
              </h3>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="作成日">
                    <el-date-picker
                      v-model="form.created_at"
                      format="yyyy/MM/dd"
                      value-format="yyyy/MM/dd"
                      prefix-icon="_calendar"
                      type="date"
                      disabled
                      placeholder=""
                    />
                    <span class="icon-input__calendar">
                      <svg-icon
                        icon-class="_calendar_x"
                        style="font-size: 17px"
                      />
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="修正日" prop="firstName">
                    <el-date-picker
                      v-model="form.updated_at"
                      format="yyyy/MM/dd"
                      value-format="yyyy/MM/dd"
                      prefix-icon="_calendar"
                      type="date"
                      disabled
                      placeholder=""
                    />
                    <span class="icon-input__calendar">
                      <svg-icon
                        icon-class="_calendar_x"
                        style="font-size: 17px"
                      />
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="ステータス" prop="status">
                    <el-select
                      v-model="form.status"
                      :disabled="
                        !disableRole(['system']) || path === 'actions-add'
                      "
                      placeholder=""
                    >
                      <el-option
                        v-for="item in statuss"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- END FIRST ROW -->
              <!-- SECOND ROW -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label="作成者">
                    <el-select
                      v-model="form.created_by_user_id"
                      :remote-method="
                        data =>
                          searchUser(
                            'create_user_option',
                            data,
                            form.created_by_user_id
                          )
                      "
                      :loading="optionLoading.create_user_option"
                      filterable
                      remote
                      clearable
                      disabled
                      placeholder=""
                    >
                      <el-option
                        v-for="item in userOption.create_user_option"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="修正者">
                    <el-select
                      v-model="form.modified_by_user_id"
                      :remote-method="
                        data =>
                          searchUser(
                            'edit_user_option',
                            data,
                            form.modified_by_user_id
                          )
                      "
                      :loading="optionLoading.edit_user_option"
                      filterable
                      remote
                      clearable
                      disabled
                      placeholder=""
                    >
                      <el-option
                        v-for="item in userOption.edit_user_option"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" />
              </el-row>
            </div>
          </el-form>
        </div>
      </el-scrollbar>
      <div class="group-button">
        <el-button
          v-if="editMode"
          v-role="['system']"
          class="delete"
          @click="deleteActions"
        >
          <svg-icon icon-class="_trash_w" />
          <span>削除</span>
        </el-button>
        <button-save
          :loading="saveLoading"
          :disabled="disableRole(['viewonly', 'callcenter']) || disableSave"
          @save="saveAction"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ActionResource from '@/api/action';
import ButtonSave from '@/components/Common/Button/ButtonSave';
import UserResource from '@/api/user';
import {
  name as actionStatusName,
  options as actionStatusOptions,
} from '@/const/ActionStatus';
import permission from '@/directive/permission';
import role from '@/directive/role';
import { ActionDetail } from './assets/validate';
import loadmore from '@/directive/selection';
import CommonSettings from '@/const/CommonSettings';
import { isEquivalent } from '@/mixins/object';
import StudentSystem from '@/api/studentSystem';
import _ from 'lodash';

const userResource = new UserResource();
const actionResource = new ActionResource();
const studentSystem = new StudentSystem();
export default {
  name: 'ActionsDetail',
  components: { ButtonSave },
  directives: { permission, role, loadmore },
  metaInfo: {
    title: '対応履歴詳細',
  },
  mixins: [ActionDetail],
  props: {},
  data() {
    return {
      roles: [],
      isLoading: false,
      studentOptions: null,
      actionStatusName: actionStatusName,
      actionStatusOptions: actionStatusOptions,
      deletedUser: {
        id: null,
        name: null,
      },
      isActive: true,
      form: {
        id: null,
        student: {
          fullname: null,
        },
        action_by_user: {
          id: null,
          name: null,
        },
        actionStatus: null,
        created_at: '',
        updated_at: '',
        creator: null,
        corrector: null,
        creator_proxy: null,
        corrector_proxy: null,
        status: null,
      },
      names: [],
      schoolTestNames: [],
      schoolTestTypes: [],
      statuss: [
        {
          id: 0,
          name: '非アクティブ',
        },
        {
          id: 1,
          name: 'アクティブ',
        },
      ],
      loadMore: {
        action_user_option: { query: null, page: 1 },
        create_user_option: { query: null, page: 1 },
        edit_user_option: { query: null, page: 1 },
        create_on_be_haft_user_option: { query: null, page: 1 },
        edit_on_be_haft_user_option: { query: null, page: 1 },
      },
      userOption: {
        action_user_option: null,
        create_user_option: null,
        edit_user_option: null,
        create_on_be_haft_user_option: null,
        edit_on_be_haft_user_option: null,
      },
      optionLoading: {
        action_user_option: false,
        create_user_option: false,
        edit_user_option: false,
        create_on_be_haft_user_option: false,
        edit_on_be_haft_user_option: false,
      },
      loadingSearchStudent: false,
      saveLoading: false,
      commonText: CommonSettings.COMMON_TXT,
      disableSave: false,
      originalForm: null,
      saveResult: false,
      defaultActionUserOptions: null,
      defaultStatus: 1,
      studentCodeList: null,
      editMode: false,
    };
  },
  async created() {
    this.isLoading = true;
    this.roles = this.$store.getters.roles;
    this.path = this.$route.name;
    if (this.path !== 'actions-add') {
      this.getData();
      this.editMode = true;
    } else {
      this.editMode = false;
      this.form.status = this.defaultStatus;
      this.form.snz_studentcode = this.$route.query.studentCode;
      this.form.student.fullname = this.$route.query.fullName;
      // await this.getStudentCodeListAll();
      await this.setDefaultOption();
      this.originalForm = Object.assign({}, this.form);
    }
    this.isLoading = false;
  },
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404' || to.name === 'err_403') {
      return next();
    }
    if (isEquivalent(this.form, this.originalForm)) {
      return next();
    } else {
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
        .then(() => {
          this.$refs.actionForm
            .validate()
            .then(valid => {
              if (valid) {
                if (this.form.status === 0) {
                  this.destroy();
                } else {
                  this.updateAction();
                  next();
                }
              }
            })
            .catch(() => {})
            .finally(() => {});
        })
        .catch(action => {
          if (action === 'cancel') {
            next();
          } else {
            next(false);
          }
        });
    }
  },
  methods: {
    async getStudentCodeListAll() {
      const resStudentCodeListAll = await studentSystem.getStudentCodeListAll();
      this.studentCodeListAll = resStudentCodeListAll.original.data.data;
    },
    async getData() {
      this.isLoading = true;
      const res = await actionResource.get(this.$route.params.id);
      this.form = res;
      this.originalForm = Object.assign({}, this.form);
      if (!res.snz_actiondate || res.snz_actiondate === 'Invalid date') {
        this.form.snz_actiondate = null;
        this.originalForm.snz_actiondate = null;
      } else {
        this.form.snz_actiondate = moment(res.snz_actiondate).format(
          'YYYY/MM/DD'
        );
        this.originalForm.snz_actiondate = moment(res.snz_actiondate).format(
          'YYYY/MM/DD'
        );
      }
      await this.searchUser(
        'action_user_option',
        null,
        this.form.snz_actionby_user_id
      );
      await this.searchUser(
        'create_user_option',
        null,
        this.form.created_by_user_id
      );
      await this.searchUser(
        'edit_user_option',
        null,
        this.form.modified_by_user_id
      );
      await this.setDefaultOption();
      this.isLoading = false;
    },
    async deleteActions() {
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      })
        .then(() => {
          this.destroy();
        })
        .catch()
        .finally();
    },
    async destroy() {
      await actionResource
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
            name: 'actions',
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
    async createAction() {
      if (
        !this.form.snz_actiondate ||
        this.form.snz_actiondate === 'Invalid date'
      ) {
        this.form.snz_actiondate = null;
      } else {
        this.form.snz_actiondate = moment(this.form.snz_actiondate).format(
          'YYYY/MM/DD'
        );
      }
      await actionResource
        .store(this.form)
        .then(res => {
          this.$message({
            type: 'success',
            message: '変更しました。',
          });
          this.$router.push({
            name: 'actions-detail',
            params: { id: res.original.result.id, redirect: true },
          });
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '更新に失敗しました。',
          });
        })
        .finally(() => {});
    },
    async updateAction() {
      if (
        !this.form.snz_actiondate ||
        this.form.snz_actiondate === 'Invalid date'
      ) {
        this.form.snz_actiondate = null;
      } else {
        this.form.snz_actiondate = moment(this.form.snz_actiondate).format(
          'YYYY/MM/DD'
        );
      }
      await actionResource
        .update(this.$route.params.id, this.form)
        .then(response => {
          this.form = response;
          this.originalForm = Object.assign({}, this.form);
          this.$message({
            type: 'success',
            message: '変更しました。',
          });
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '更新に失敗しました。',
          });
        })
        .finally(() => {
          this.getData();
        });
    },
    async saveAction() {
      this.saveLoading = true;
      this.disableSave = true;
      if (this.form.status) {
        await this.$refs.actionForm
          .validate()
          .then(valid => {
            if (valid) {
              if (this.path !== 'actions-add') {
                this.updateAction();
              } else {
                this.createAction();
              }
            }
          })
          .catch(() => {})
          .finally(() => {
            this.saveLoading = false;
            this.disableSave = false;
          });
      } else {
        this.destroy();
      }
    },
    async setDefaultOption() {
      const res = await userResource.searchName();
      this.defaultActionUserOptions = res.data;
    },
    async searchUser(att, name = null, id = null) {
      this.optionLoading[att] = true;
      if (name || id) {
        this.loadMore[att].query = name;
        this.loadMore[att].page = 1;
        const res = await userResource.searchName({ name: name, id: id });
        this.userOption[att] = res.data;
        if (res.current_page >= res.last_page) {
          this.loadMore[att].page = 0;
        }
      }
      this.optionLoading[att] = false;
    },
    changeActionUserSearch(att) {
      if (!this.form.snz_actionby_user_id) {
        this.userOption[att] = this.defaultActionUserOptions;
        this.loadMore[att].page = 1;
        this.loadMore[att].query = null;
      }
    },
    async loadMoreUser(att) {
      if (this.loadMore[att].query && this.loadMore[att].page) {
        const res = await userResource.searchName({
          name: this.loadMore[att].query,
          page: this.loadMore[att].page,
        });
        this.userOption[att] = this.userOption[att].concat(res.data);
        if (res.current_page >= res.last_page) {
          this.loadMore[att].page = 0;
        }
      }
    },
    isDisabled() {
      if (this.roles.find(e => e === 'system')) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
#app {
  overflow: hidden;

  .sidebar-container {
    overflow: hidden;
  }
}

.app-main {
  background: #f0f0f0;
  color: #1a1714;
  overflow-y: auto;
}
.app-container::v-deep {
  .actions-detail {
    background-color: #ffffff;
    min-height: calc(100vh - 170px);
    overflow-y: auto;
    h3 {
      margin: 0px;
      font-size: 18px;
      color: #1a1714;
      padding-left: 30px;
      padding-top: 15px;
      font-family: Noto Sans JP, sans-serif;
    }
    .line {
      background-color: #f0f0f0;
      height: 1px;
    }
    .card-body {
      textarea {
        max-height: 96px;
        resize: none;
      }
      .form-general {
        margin-bottom: 5px !important;
        .actor {
          .el-form-item__content {
            line-height: normal !important;
          }
        }
      }
      .el-col-8 {
        .el-form-item {
          margin-bottom: 13px;
        }
        .el-form-item__content {
          width: 223px;
        }
      }
      .el-col-10,
      .el-col-14 {
        .el-form-item {
          margin-bottom: 13px;
        }
        .el-form-item__content {
          width: 313px;
        }
      }
      .last-row {
        .el-form-item {
          margin-bottom: 20px;
        }
      }
      &:last-child {
        margin-bottom: 30px;
      }
    }
    .card-body.system {
      .el-form-item__content {
        width: 213px !important;
      }
    }
    .el-row {
      &.top {
        .el-col:nth-child(2) {
          margin-left: -38px;
        }
        .el-col:nth-child(3) {
          margin-left: -5px;
        }
      }
    }
  }
  .icon-input__calendar {
    position: absolute;
    top: 0;
    right: 11px;
    pointer-events: none;
  }
  .group-button {
    display: flex;
    justify-content: flex-end;
    background: #f0f0f0;
    margin: 0;
    width: 100%;
    padding-top: 15px;
    button {
      border-radius: 100px;
      color: #fff;
      height: 45px;
      border: none;

      span {
        font-size: 15px;
        font-family: Noto Sans JP, sans-serif;
        padding-left: 4px;
      }

      &.delete {
        background: #343434;
        margin-right: 10px;
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
  /deep/ .group-button {
    float: right;
  }
}
// custom scroll
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
