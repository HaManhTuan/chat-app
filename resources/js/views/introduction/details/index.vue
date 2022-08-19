<template>
  <div v-loading="loading">
    <div class="app-container">
      <div class="card-body border-box">
        <el-scrollbar class="scroll-content">
          <el-form
            ref="form"
            class="form-search"
            :model="form"
            :rules="searchRules"
          >
            <el-row
              type="flex"
              justify="space-between"
              class="form-search__row"
            >
              <el-col :span="8" class="box-left">
                <h3>情報</h3>
                <el-col :span="24">
                  <el-form-item
                    class="input-item"
                    prop="snz_lastname"
                    label="姓（紹介先）"
                    label-width="180px"
                  >
                    <el-input
                      v-model="form.snz_lastname"
                      :disabled="disableRole(['viewonly', 'callcenter'])"
                      clearable
                      placeholder=""
                      @change="handleChange('snz_lastname')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    class="input-item"
                    prop="snz_firstname"
                    label="名（紹介先）"
                    label-width="180px"
                  >
                    <el-input
                      v-model="form.snz_firstname"
                      :disabled="disableRole(['viewonly', 'callcenter'])"
                      clearable
                      placeholder=""
                      @change="handleChange('snz_firstname')"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <div style="width: 413px">
                    <div class="select-box">
                      <el-form-item
                        class="input-item"
                        label="現在の学年"
                        label-width="180px"
                      >
                        <el-select
                          v-model="form.snz_grade_id"
                          :disabled="disableRole(['viewonly', 'callcenter'])"
                          clearable
                          :no-data-text="CommonTxt.selectboxEmptyTxt"
                          placeholder=""
                          style="width: 233px;"
                        >
                          <el-option
                            v-for="item in grades"
                            :key="item.value"
                            :label="item.snz_name"
                            :value="item.id"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div style="width: 350px">
                    <div class="calendar">
                      <el-form-item
                        label="紹介日"
                        class="input-item date-picker-item"
                        label-width="180px"
                      >
                        <el-date-picker
                          v-model="form.snz_introductiondate"
                          format="yyyy/MM/dd"
                          value-format="yyyy-MM-dd"
                          prefix-icon="abc"
                          type="date"
                          :editable="false"
                          placeholder=""
                          :disabled="disableRole(['viewonly', 'callcenter'])"
                        />
                        <span class="icon-input__calendar calendar__able">
                          <svg-icon
                            v-if="disableRole(['viewonly', 'callcenter'])"
                            icon-class="_calendar_x"
                          />
                          <svg-icon
                            v-if="
                              disableRole([
                                'school',
                                'subject',
                                'organization',
                                'system',
                                'employee',
                                'parttime',
                              ])
                            "
                            icon-class="_calendar"
                          />
                        </span>
                      </el-form-item>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div style="width: 413px">
                    <div class="select-box">
                      <el-form-item
                        class="input-item"
                        label="紹介元生徒"
                        prop="snz_studentcode"
                        label-width="180px"
                      >
                        <SearchSelectBox
                          v-model="form.snz_studentcode"
                          :search-function="searchStudentMng"
                          key-name="fullname"
                          key-id="snz_studentcode"
                          no-data-text="データはありません。"
                          placeholder=""
                          :append-query="{
                            introductionId: $route.params.id,
                            snz_studentcode: $route.query.id,
                          }"
                          :popper-append-to-body="false"
                          :disabled="disableRole(['viewonly', 'callcenter'])"
                          @onChange="handleChange('snz_studentcode')"
                        />
                      </el-form-item>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div style="width: 413px">
                    <div class="select-box">
                      <el-form-item
                        class="input-item"
                        label="紹介元との関係"
                        label-width="180px"
                      >
                        <el-select
                          v-model="form.snz_relationship"
                          :disabled="disableRole(['viewonly', 'callcenter'])"
                          clearable
                          no-data-text="データはありません。"
                          placeholder=""
                          style="width: 233px;"
                        >
                          <el-option
                            v-for="item in relationShipOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div style="width: 413px">
                    <div class="select-box">
                      <el-form-item
                        class="input-item select-box"
                        label="紹介ステータス"
                        prop="snz_introductionstatus"
                        label-width="180px"
                      >
                        <el-select
                          v-model="form.snz_introductionstatus"
                          :disabled="disableRole(['viewonly', 'callcenter'])"
                          clearable
                          :no-data-text="CommonTxt.selectboxEmptyTxt"
                          placeholder=""
                          style="width: 233px;"
                          @change="handleChange('snz_introductionstatus')"
                        >
                          <el-option
                            v-for="item in introStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="calendar" style="margin-top: 2px;">
                    <el-form-item
                      label="図書券譲渡日"
                      class="input-item date-picker-item"
                      label-width="180px"
                    >
                      <el-date-picker
                        v-model="form.snz_bookcoupondate"
                        format="yyyy/MM/dd"
                        value-format="yyyy-MM-dd"
                        prefix-icon="abc"
                        type="date"
                        :editable="false"
                        placeholder=""
                        :disabled="disableRole(['viewonly', 'callcenter'])"
                      />
                      <span class="icon-input__calendar calendar__able">
                        <svg-icon
                          v-if="disableRole(['viewonly', 'callcenter'])"
                          icon-class="_calendar_x"
                        />
                        <svg-icon
                          v-if="
                            disableRole([
                              'school',
                              'subject',
                              'organization',
                              'system',
                              'employee',
                              'parttime',
                            ])
                          "
                          icon-class="_calendar"
                        />
                      </span>
                    </el-form-item>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    class="input-item"
                    prop="snz_remarks"
                    label="備考"
                    label-width="180px"
                  >
                    <el-input
                      v-model="form.snz_remarks"
                      :disabled="disableRole(['viewonly', 'callcenter'])"
                      clearable
                      placeholder=""
                      @change="handleChange('snz_remarks')"
                    />
                  </el-form-item>
                </el-col>
              </el-col>
              <div class="box-center" />
              <el-col v-role="['system']" :span="16" class="box-right">
                <h3>システム</h3>
                <el-col :span="11">
                  <el-form-item
                    label="作成日"
                    class="date-picker-item"
                    label-width="9em"
                  >
                    <el-date-picker
                      v-model="form.created_at"
                      prefix-icon="abc"
                      type="date"
                      format="yyyy/MM/dd"
                      value-format="yyyy-MM-dd"
                      placeholder=""
                      disabled
                    />
                    <span class="icon-input__calendar calendar__disable">
                      <svg-icon
                        icon-class="_calendar_x"
                        style="font-size: 17px; margin-left: 215px;"
                      />
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item
                    label="修正日"
                    prop="firstName"
                    class="date-picker-item"
                    label-width="8em"
                  >
                    <el-date-picker
                      v-model="form.updated_at"
                      format="yyyy/MM/dd"
                      value-format="yyyy/MM/dd"
                      prefix-icon="abc"
                      type="date"
                      disabled
                      placeholder=""
                    />
                    <span class="icon-input__calendar calendar__disable">
                      <svg-icon
                        icon-class="_calendar_x"
                        style="font-size: 17px; margin-left: 215px;"
                      />
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="作成者" label-width="9em">
                    <el-select
                      v-model="form.create_user.name"
                      placeholder=""
                      :no-data-text="CommonTxt.selectboxEmptyTxt"
                      clearable
                      filterable
                      popper-class="select-inside-table"
                      :popper-append-to-body="false"
                      disabled
                      style="height: 36px;"
                    >
                      <el-option
                        v-for="item in [
                          form.create_user ? form.create_user : {},
                        ]"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="修正者" label-width="8em">
                    <el-select
                      v-model="form.edit_user.name"
                      placeholder=""
                      :no-data-text="CommonTxt.selectboxEmptyTxt"
                      clearable
                      filterable
                      popper-class="select-inside-table"
                      :popper-append-to-body="false"
                      disabled
                      style="height: 36px;"
                    >
                      <el-option
                        v-for="item in [form.edit_user ? form.edit_user : {}]"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="11" style="margin-top: -15px;">
                  <div style="width: 288px;">
                    <el-form-item
                      class="input-item select-box"
                      label="ステータス"
                      label-width="125px"
                      prop="status"
                    >
                      <el-select
                        v-model="form.status"
                        :no-data-text="CommonTxt.selectboxEmptyTxt"
                        placeholder=""
                        @change="handleChange('status')"
                      >
                        <el-option
                          v-for="item in statuss"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                </el-col>
              </el-col>
            </el-row>
          </el-form>
        </el-scrollbar>
      </div>
      <div class="group-button">
        <button-delete
          v-role="['system']"
          :loading="deleting"
          :disabled="saveLoading"
          @delete="deleteIntroductions(false)"
        />
        <button-save
          :loading="saveLoading"
          :disabled="disableRole(['viewonly', 'callcenter']) || deleting"
          @click.native="submitForm('form')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import role from '@/directive/role';
import { validate } from '../assets/validate';
import ButtonSave from '../../../components/Common/Button/ButtonSave';
import ButtonDelete from '../../../components/Common/Button/ButtonDelete';
import IntroductionResource from '../../../api/introduction';
import CommonSettings from '../../../const/CommonSettings';
import GradeRequest from '../../../api/gradeRequest';
import { options } from '../../../const/IntroductionStatus';
import { options as optionss } from '../../../const/RelationshipIntroduction';
import StudentRequest from '../../../api/student';
import loadmore from '@/directive/selection';
import UserResource from '../../../api/user';
import SearchSelectBox from '@/components/Common/SearchSelectBox';

const introductionResource = new IntroductionResource();
const gradeRequest = new GradeRequest();
const studentOptions = new StudentRequest();
const userResource = new UserResource();

export default {
  metaInfo: {
    title: '紹介詳細',
  },
  directives: { loadmore, role },
  components: {
    ButtonSave,
    ButtonDelete,
    SearchSelectBox,
  },
  filters: {
    getIntroStatusOption(brand) {
      const x = options.filter(obj => {
        return brand === obj.value;
      });
      return x[0] ? x[0].label : '';
    },
    getRelationShipOption(brand) {
      const x = optionss.filter(obj => {
        return brand === obj.value;
      });
      return x[0] ? x[0].label : '';
    },
  },
  mixins: [validate],
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    if (to.params.redirect || to.name === 'err_403') {
      return next();
    }
    this.inputFormOrigin = JSON.stringify(_.clone(this.dataInit));
    this.inputFormCompare = JSON.stringify(_.clone(this.form));
    console.log(this.inputFormOrigin, this.inputFormCompare);
    if (this.inputFormOrigin !== this.inputFormCompare) {
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
          this.$refs.form
            .validate()
            .then(() => {
              this.update()
                .then(() => {
                  next();
                })
                .catch(err => {
                  this.form.injectFormValidates(err.response);
                  next(false);
                });
            })
            .catch(() => {
              this.catchValidate();
            });
        })
        .catch(action => {
          if (action === 'cancel') {
            next();
          } else {
            next(false);
          }
        });
    } else {
      return next();
    }
  },
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      form: {
        id: '',
        snz_lastname: '',
        snz_firstname: '',
        snz_grade_id: '',
        snz_introductiondate: '',
        snz_studentcode: '',
        snz_relationship: '',
        snz_introductionstatus: '',
        snz_bookcoupondate: '',
        snz_remarks: '',
        status: '',
        created_at: '',
        updated_at: '',
        created_by_user_id: '',
        modified_by_user_id: '',
        create_user: {
          name: '',
        },
        edit_user: {
          name: '',
        },
      },
      origin: {},
      grades: [],
      introStatusOptions: options,
      relationShipOptions: optionss,
      studentMng: [],
      statuss: [
        {
          id: 1,
          name: 'アクティブ',
        },
        {
          id: 0,
          name: '非アクティブ',
        },
      ],
      defaultStatus: 1,
      dataInit: {
        id: '',
        snz_lastname: '',
        snz_firstname: '',
        snz_grade_id: '',
        snz_introductiondate: '',
        snz_studentcode: '',
        snz_relationship: '',
        snz_introductionstatus: '',
        snz_bookcoupondate: '',
        snz_remarks: '',
        status: '',
        created_at: '',
        updated_at: '',
        created_by_user_id: '',
        modified_by_user_id: '',
        create_user: {
          name: '',
        },
        edit_user: {
          name: '',
        },
      },
      saveLoading: false,
      deleting: false,
      loading: false,
    };
  },
  async created() {
    this.loading = true;
    this.roles = this.$store.getters.roles;
    this.snz_studentcodeFrom = this.$route.query.id;
    this.snz_studentcodeMng = this.$route.query.snz_studentcode;
    this.pathName = this.$route.name;
    if (this.pathName !== 'introductions-detail-add') {
      this.id = this.$route.params.id;
      await this.getData();
      this.setOrigin();
    } else {
      this.form.snz_studentcode = this.$route.query.id;
      this.dataInit.snz_studentcode = this.$route.query.id;
      this.form.status = this.defaultStatus;
      this.dataInit.status = this.defaultStatus;
    }
    await this.getOptionGrade();
    this.loading = false;
  },
  methods: {
    async getData() {
      const response = await introductionResource.get(this.id);
      this.setData(response);
      this.setDataInit(response);
    },
    async searchUser(params) {
      if (!_.isEmpty(params)) {
        return await userResource.searchName(params);
      }
    },
    async getOptionGrade() {
      this.grades = await gradeRequest.gradeOptions({
        select_add_id: [this.form.snz_grade_id],
      });
    },
    async searchStudentMng(query) {
      return await studentOptions.searchStudentIntroductionScreen(query);
    },
    setData(Introduction) {
      this.form.id = Introduction.id;
      this.form.snz_lastname = Introduction.snz_lastname;
      this.form.snz_firstname = Introduction.snz_firstname;
      this.form.snz_grade_id = Introduction.snz_grade_id;
      this.form.snz_introductiondate = Introduction.snz_introductiondate;
      this.form.snz_studentcode = Introduction.snz_studentcode;
      this.form.snz_relationship = Introduction.snz_relationship;
      this.form.snz_introductionstatus = Introduction.snz_introductionstatus;
      this.form.snz_bookcoupondate = Introduction.snz_bookcoupondate;
      this.form.snz_graduation_grade = Introduction.snz_graduation_grade;
      this.form.snz_remarks = Introduction.snz_remarks;
      this.form.created_by_user_id = Introduction.created_by_user_id;
      this.form.modified_by_user_id = Introduction.modified_by_user_id;
      this.form.created_at = Introduction.created_at;
      this.form.updated_at = Introduction.updated_at;
      this.form.status = Introduction.status;
      this.form.create_user.name = Introduction.create_user.name;
      this.form.edit_user.name = Introduction.edit_user
        ? Introduction.edit_user.name
        : '';
    },
    setDataInit(Introduction) {
      this.dataInit.id = Introduction.id;
      this.dataInit.snz_lastname = Introduction.snz_lastname;
      this.dataInit.snz_firstname = Introduction.snz_firstname;
      this.dataInit.snz_grade_id = Introduction.snz_grade_id;
      this.dataInit.snz_introductiondate = Introduction.snz_introductiondate;
      this.dataInit.snz_studentcode = Introduction.snz_studentcode;
      this.dataInit.snz_relationship = Introduction.snz_relationship;
      this.dataInit.snz_introductionstatus =
        Introduction.snz_introductionstatus;
      this.dataInit.snz_bookcoupondate = Introduction.snz_bookcoupondate;
      this.dataInit.snz_graduation_grade = Introduction.snz_graduation_grade;
      this.dataInit.snz_remarks = Introduction.snz_remarks;
      this.dataInit.created_by_user_id = Introduction.created_by_user_id;
      this.dataInit.modified_by_user_id = Introduction.modified_by_user_id;
      this.dataInit.created_at = Introduction.created_at;
      this.dataInit.updated_at = Introduction.updated_at;
      this.dataInit.status = Introduction.status;
      this.dataInit.create_user.name = Introduction.create_user.name;
      this.dataInit.edit_user.name = Introduction.edit_user
        ? Introduction.edit_user.name
        : '';
    },
    submitForm(formName) {
      if (this.form.status === 0) {
        // DELETE
        this.deleteIntroductions(true);
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.pathName !== 'introductions-detail-add') {
            this.update();
          } else {
            this.add();
          }
        }
      });
    },
    async add() {
      this.saveLoading = true;
      this.form.snz_studentcode = this.snz_studentcodeFrom;
      const res = await introductionResource.store(this.form).finally(() => {
        this.saveLoading = false;
      });
      if (res) {
        this.$message({
          type: 'success',
          message: '変更しました。',
        });
        this.$router.push({
          name: 'introductions-detail',
          params: { id: res.original.result.id, redirect: true },
        });
      }
    },
    async update() {
      this.saveLoading = true;
      const res = await introductionResource
        .update(this.form.id, this.form)
        .finally(() => {
          this.saveLoading = false;
        });
      if (res) {
        this.$message({
          type: 'success',
          message: '変更しました。',
        });
        await this.getData();
      }
    },
    deleteIntroductions(saveDelete = false) {
      this.$confirm(this.commonText.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      })
        .then(() => {
          if (saveDelete) {
            this.saveLoading = true;
          } else {
            this.deleting = true;
          }
          introductionResource
            .destroy(this.id)
            .then(response => {
              this.$message({
                type: 'success',
                message: '削除しました。',
              });
              const query = this.$route.params.query;
              this.redirectPage({
                name: 'introductions',
                params: { redirect: true },
                query: query,
              });
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: 'この操作は実行できません。',
              });
              const query = this.$route.params.query;
              this.redirectPage({
                name: 'introductions-detail',
                params: { redirect: true },
                query: query,
              });
            })
            .finally(() => {
              this.acting = false;
              this.deleting = false;
            });
        })
        .catch();
    },
    setOrigin() {
      this.origin = _.cloneDeep(this.form);
    },
    handleChange(prop) {
      console.log(prop);
      this.$refs.form.clearValidate(prop);
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .app-container .card-body {
  overflow: unset !important;
}
/deep/ .scroll-content {
  height: 100%;
  .el-scrollbar__view {
    height: 100%;
  }
  .scroll-content {
    height: 100%;
  }
  .form-search {
    height: 100%;
    .form-search__row {
      height: 100%;
    }
  }
}
.icon-input__calendar {
  pointer-events: none;
}
/deep/ .icon-input__calendar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0 !important;
  pointer-events: none;
}
.el-form-item {
  margin-bottom: 13px !important;
}
.box-right {
  .el-select::v-deep .el-input {
    display: block;
    position: absolute;
    width: 213px !important;
    left: 0;
  }
  .el-form-item__content {
    .el-input::v-deep {
      position: absolute;
      width: 213px !important;
      left: 0;
    }
  }
}
.el-form-item::v-deep label.el-form-item__label {
  line-height: 36px !important;
  padding-left: 0 !important;
}
.select-box::v-deep {
  margin-bottom: 13px !important;
  margin-top: -23px;
  label {
    margin-top: 23px;
  }
}
.el-select {
  min-width: 213px !important;
}
.input-item::v-deep {
  position: relative;
  margin-bottom: 13px;
  .el-input {
    position: absolute;
    right: 155px;
  }
  .el-form-item {
    &__label {
      position: relative;
    }
    &__content {
      .icon-input__calendar {
        left: 232px;
      }
    }
  }
}
.box-left {
  position: relative;
}
.box-center {
  position: absolute;
  width: 1px;
  background-color: #d6d6d6;
  height: 100%;
  left: 32em;
}
.box-right {
  position: absolute;
  margin-left: 80px;
  left: 26em;
}
.app-container .card-body {
  overflow-y: scroll;
}
.card-body {
  height: calc(100% - 60px);
  z-index: -999;
  background-color: #fff;
  h3 {
    font-size: 18px;
    margin-left: 36px;
  }
}
.el-form {
  .el-input {
    position: absolute;
    width: 233px !important;
    left: 0;
  }
}
.el-select::v-deep {
  .el-input {
    display: block;
    position: absolute;
    width: 233px !important;
    left: 0;
  }
}

.group-button::v-deep {
  text-align: right;
  background-color: #f0f0f0;
}

.el-select-dropdown__list {
  list-style: none;
  padding: 11px 0 !important;
  margin: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
