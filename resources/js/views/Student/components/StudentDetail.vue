<template>
  <div v-loading="screenLoading" class="student-detail">
    <el-form
      v-if="Object.keys(form).length !== 0"
      ref="form"
      label-width="100px"
      :rules="rules"
      :model="form"
      @validate="validate"
    >
      <div class="card-body">
        <h3>
          氏名・学校名
        </h3>
        <!-- FIRST ROW -->
        <el-row>
          <!-- col1 -->
          <el-col :span="8">
            <el-col :span="24">
              <el-form-item label-width="106px" label="姓" prop="lastname">
                <el-input
                  v-model="form.lastname"
                  clearable
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label-width="106px" label="名" prop="firstname">
                <el-input
                  v-model="form.firstname"
                  clearable
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label-width="106px"
                label="フリガナ (姓)"
                prop="yomilastname"
              >
                <el-input
                  v-model="form.yomilastname"
                  clearable
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label-width="106px"
                label="フリガナ (名)"
                prop="yomifirstname"
              >
                <el-input
                  v-model="form.yomifirstname"
                  clearable
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                />
              </el-form-item>
            </el-col>
          </el-col>
          <!-- col2 -->
          <el-col :span="8">
            <el-col :span="24">
              <el-form-item label-width="78px" label="学年" prop="snz_grade_id">
                <el-select
                  v-model="form.snz_grade_id"
                  filterable
                  clearable
                  placeholder=""
                  no-data-text="データはありません。"
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                  :popper-append-to-body="false"
                  class="remove-mb-el-select"
                  @change="changeGrade"
                >
                  <el-option
                    v-for="item in gradeOption"
                    :key="item.id"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label-width="80px" label="生年月日" prop="birthdate">
                <el-date-picker
                  v-model="form.birthdate"
                  prefix-icon="abc"
                  type="date"
                  placeholder=""
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  :picker-options="datePickerOptions"
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                  @change="checkWaringBirth"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar" style="font-size: 18px" />
                </span>
              </el-form-item>
              <p v-if="showWaringBirthday" class="show-waring-birthday">{{ gradeSelected.start_birthday }} ~ {{ gradeSelected.end_birthday }}の範囲で入力してください</p>
            </el-col>
            <el-col :span="24">
              <el-form-item label-width="78px" label="性別" prop="gendercode">
                <el-select
                  v-model="form.gendercode"
                  clearable
                  placeholder=""
                  no-data-text="データはありません。"
                  :popper-append-to-body="false"
                  class="remove-mb-el-select"
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                >
                  <el-option
                    v-for="item in genderOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <div />
            </el-col>
          </el-col>
          <el-col :span="8">
            <el-col :span="24">
              <el-form-item
                ref="snz_school_id"
                label-width="88px"
                label="学校名"
                prop="snz_school_id"
              >
                <el-select
                  v-model="form.snz_school_id"
                  :popper-append-to-body="false"
                  placeholder=""
                  disabled
                >
                  <el-option
                    v-for="item in schoolOptions"
                    :key="item.id"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                ref="snz_primary_school_id"
                label-width="88px"
                label="小学校名"
                prop="snz_primary_school_id"
                :rules="[
                  {
                    required: schoolType === schoolStatus.PRIMARY_SCHOOL_TYPE,
                    message: '小学校名を選択してください',
                    trigger: 'change',
                  },
                ]"
              >
                <SearchSelectBox
                  v-model="form.snz_primary_school_id"
                  :search-function="searchSchoolName"
                  key-name="snz_name"
                  :append-query="{
                    school_type_id: schoolStatus.PRIMARY_SCHOOL_TYPE,
                  }"
                  :disabled="schoolType !== schoolStatus.PRIMARY_SCHOOL_TYPE || disableRole(['viewonly', 'callcenter'])"
                  :popper-append-to-body="false"
                  class="remove-mb-el-select"
                  placeholder=""
                  @onChange="updateSchool"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                ref="snz_junior_highschool_id"
                label-width="88px"
                label="中学校名"
                prop="snz_junior_highschool_id"
                :rules="[
                  {
                    required: schoolType === schoolStatus.JUNIOR_SCHOOL_TYPE,
                    message: '中学校名を選択してください',
                    trigger: 'change',
                  },
                ]"
                class="remove-mb-el-select"
              >
                <SearchSelectBox
                  v-model="form.snz_junior_highschool_id"
                  :search-function="searchSchoolName"
                  key-name="snz_name"
                  :disabled="schoolType !== schoolStatus.JUNIOR_SCHOOL_TYPE || disableRole(['viewonly', 'callcenter'])"
                  :append-query="{
                    school_type_id: schoolStatus.JUNIOR_SCHOOL_TYPE,
                  }"
                  :popper-append-to-body="false"
                  placeholder=""
                  @onChange="updateSchool"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                ref="snz_highschool_id"
                label-width="88px"
                label="高校名"
                prop="snz_highschool_id"
                :rules="[
                  {
                    required: schoolType === schoolStatus.HIGH_SCHOOL_TYPE,
                    message: '高校名を選択してください',
                    trigger: 'change',
                  },
                ]"
              >
                <SearchSelectBox
                  v-model="form.snz_highschool_id"
                  :search-function="searchSchoolName"
                  key-name="snz_name"
                  :disabled="schoolType !== schoolStatus.HIGH_SCHOOL_TYPE || disableRole(['viewonly', 'callcenter'])"
                  :append-query="{
                    school_type_id: schoolStatus.HIGH_SCHOOL_TYPE,
                  }"
                  :popper-append-to-body="false"
                  class="remove-mb-el-select"
                  placeholder=""
                  @onChange="updateSchool"
                />
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <!-- SECOND ROW -->
        <!-- END FOURTH ROW -->
      </div>
      <div class="line" />
      <div class="card-body">
        <h3>
          住所
        </h3>
        <!-- FIRST ROW -->
        <el-row>
          <el-col :span="10">
            <el-form-item
              label-width="146px"
              label="郵便番号"
              prop="address1_postalcode"
            >
              <el-input
                v-model="form.address1_postalcode"
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
                @keydown.space.native="(event) => event.preventDefault()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label-width="210px"
              label="番地"
              prop="address1_line1"
            >
              <el-input
                v-model="form.address1_line1"
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <!-- SECOND ROW -->
        <el-row class="last-row">
          <el-col :span="10">
            <el-form-item
              label-width="150px"
              label="都道府県・市区町村"
              prop="address1_city"
            >
              <el-input
                v-model="form.address1_city"
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label-width="210px"
              label="建物名"
              prop="address1_line2"
            >
              <el-input
                v-model="form.address1_line2"
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END SECOND ROW -->
      </div>
      <div class="line" />
      <div class="card-body">
        <h3>
          連絡先
        </h3>
        <!-- FIRST ROW -->
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item
              label-width="146px"
              label="電話番号1"
              prop="telephone1"
            >
              <el-input
                v-model="form.telephone1"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
                @keydown.space.native="(event) => event.preventDefault()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label-width="210px"
              label="緊急連絡先名称"
              prop="snz_emergency"
            >
              <el-input
                v-model="form.snz_emergency"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <!-- SECOND ROW -->
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item
              label-width="146px"
              label="電話番号2"
              prop="telephone2"
            >
              <el-input
                v-model="form.telephone2"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
                @keydown.space.native="(event) => event.preventDefault()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label-width="210px"
              label="緊急連絡先電話番号"
              prop="snz_emergencytelephone"
            >
              <el-input
                v-model="form.snz_emergencytelephone"
                placeholder=""
                :disabled="disableRole(['viewonly', 'callcenter'])"
                clearable
                @keydown.space.native="(event) => event.preventDefault()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END SECOND ROW -->
        <!-- THIRT ROW -->
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label-width="146px" label="FAX番号" prop="fax">
              <el-input
                v-model="form.fax"
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
                @keydown.space.native="(event) => event.preventDefault()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label-width="210px"
              label="生徒メールアドレス"
              prop="emailaddress1"
            >
              <el-input
                v-model="form.emailaddress1"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
                @keydown.space.native="(event) => event.preventDefault()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END THIRT ROW -->
        <!-- FOURTH ROW -->
        <el-row type="flex" justify="space-around" class="last-row">
          <el-col :span="10">
            <el-form-item
              label-width="146px"
              label="連絡可能時間帯"
              prop="snz_contactable"
            >
              <el-input
                v-model="form.snz_contactable"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label-width="210px"
              label="保護者メールアドレス"
              prop="emailaddress2"
            >
              <el-input
                v-model="form.emailaddress2"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
                @keydown.space.native="(event) => event.preventDefault()"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FOURTH ROW -->
      </div>
      <div class="line" />
      <div class="card-body">
        <h3>
          保護者情報
        </h3>
        <!-- FIRST ROW -->
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item
              label-width="146px"
              label="姓(保護者)"
              prop="snz_managerlastname"
            >
              <el-input
                v-model="form.snz_managerlastname"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label-width="210px"
              label="フリガナ(保護者(姓))"
              prop="snz_yomimanagerlastname"
            >
              <el-input
                v-model="form.snz_yomimanagerlastname"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <!-- SECOND ROW -->
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item
              label-width="146px"
              label="名(保護者)"
              prop="snz_managerfirstname"
            >
              <el-input
                v-model="form.snz_managerfirstname"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item
              label-width="210px"
              label="フリガナ(保護者(名))"
              prop="snz_yomimanagerfirstname"
            >
              <el-input
                v-model="form.snz_yomimanagerfirstname"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END SECOND ROW -->
        <!-- THIRT ROW -->
        <el-row type="flex" justify="space-around" class="last-row">
          <el-col :span="10">
            <el-form-item
              label-width="146px"
              label="続柄"
              prop="snz_relationship"
            >
              <el-select
                v-model="form.snz_relationship"
                clearable
                placeholder=""
                no-data-text="データはありません。"
                :disabled="disableRole(['viewonly', 'callcenter'])"
              >
                <el-option
                  v-for="item in relationshipOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <div />
          </el-col>
        </el-row>
        <!-- END THIRT ROW -->
      </div>
      <div class="line" />
      <div class="card-body">
        <h3>
          配慮項目
        </h3>
        <!-- FIRST ROW -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="座席配慮" prop="snz_seatconsideration">
              <el-select
                v-model="form.snz_seatconsideration"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                placeholder=""
              >
                <el-option :value="0" label="ー" />
                <el-option :value="1" label="✓">
                  <span class="el-checkbox__inner" />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label-width="78px"
              label="DM不許可"
              prop="snz_dmrejection"
            >
              <el-select
                v-model="form.snz_dmrejection"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                placeholder=""
              >
                <el-option :value="0" label="ー" />
                <el-option :value="1" label="✓">
                  <span class="el-checkbox__inner" />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              label-width="88px"
              label="要望・通信"
              prop="snz_requestscommunication"
              class="communication"
            >
              <el-input
                v-model="form.snz_requestscommunication"
                type="textarea"
                placeholder=""
                rows="3"
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
                class="my-textarea custom-textarea-scroll"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <!-- SECOND ROW -->
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="座席配慮備考"
              prop="snz_seatconsiderationremarks"
            >
              <el-input
                v-model="form.snz_seatconsiderationremarks"
                placeholder=""
                clearable
                :disabled="disableRole(['viewonly', 'callcenter'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="78px" label="DM非出力">
              <el-select
                v-model="form.snz_dmsendflg"
                placeholder=""
                :disabled="disableRole(['viewonly', 'callcenter'])"
              >
                <el-option :value="0" label="ー" />
                <el-option :value="1" label="✓">
                  <span class="el-checkbox__inner" />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END SECOND ROW -->
      </div>
    </el-form>
    <BrotherInfo
      v-if="visibleBrother && form.snz_internalcode"
      :show.sync="visibleBrother"
      :internal-code="form.snz_internalcode"
      :toiawase-id="toiawaseId"
      @close="closeBrotherInfo"
    />
  </div>
</template>
<script>
import { StudentDetail } from '../assets/validate';
import GradeResource from '@/api/gradeRequest';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import BrotherInfo from '../modal/BrotherInfo';
import SchoolResource from '@/api/school';
import StudentResource from '@/api/student';
import studentStatus from '@/const/StudentStatus';
import schoolStatus from '@/const/SchoolStatus';
import CommonSettings from '@/const/CommonSettings';
const gradeResource = new GradeResource();
const schoolResource = new SchoolResource();
const studentResource = new StudentResource();
export default {
  components: { SearchSelectBox, BrotherInfo },
  mixins: [StudentDetail],
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      schoolStatus: schoolStatus,
      genderOption: studentStatus.OPTION_GENDERCODE,
      relationshipOptions: studentStatus.OPTION_SNZ_RELATIONSHIP,
      gradeOption: [],
      schoolType: null,
      updateSubmit: false,
      originForm: null,
      schoolOptions: [],
      toiawaseId: null,
      datePickerOptions: {
        disabledDate(date) {
          return date > new Date();
        },
      },
      screenLoading: false,
      visibleBrother: false,
      showWaringBirthday: false,
      gradeSelected: null,
    };
  },
  watch: {
    schoolType: function(newVal, oldVal) {
      if (this.schoolType === this.schoolStatus.PRIMARY_SCHOOL_TYPE) {
        this.form.snz_primary_school_id = this.originForm.snz_primary_school_id;
      }
      if (this.schoolType === this.schoolStatus.JUNIOR_SCHOOL_TYPE) {
        this.form.snz_junior_highschool_id = this.originForm.snz_junior_highschool_id;
      }
      if (this.schoolType === this.schoolStatus.HIGH_SCHOOL_TYPE) {
        this.form.snz_highschool_id = this.originForm.snz_highschool_id;
      }
      this.form.snz_school_id = this.originForm.snz_school_id;
      this.setSchoolOption(this.form);
    },
  },
  methods: {
    async init(form) {
      this.screenLoading = true;
      this.$nextTick(async() => {
        await this.getGrade();
        this.updateSchoolType(form);
        await this.setSchoolOption(form);
        this.checkWaringBirth();
      });
      this.screenLoading = false;
    },
    validate(attribute, valid, callback) {
      if (
        attribute === 'address1_postalcode' &&
        valid === true &&
        !callback &&
        this.updateSubmit === false &&
        this.dataZipCode
      ) {
        this.form.address1_city = this.dataZipCode.data.fullAddress;
      }
    },
    async getGrade() {
      this.gradeOption = await gradeResource.gradeOptions({
        select_add_id: [this.form.snz_grade_id],
      });
    },
    changeGrade() {
      this.updateSchoolType(this.form);
      this.$refs.form.clearValidate('snz_primary_school_id');
      this.$refs.form.clearValidate('snz_junior_highschool_id');
      this.$refs.form.clearValidate('snz_highschool_id');
      if (this.schoolType === this.schoolStatus.PRIMARY_SCHOOL_TYPE) {
        this.$refs.snz_junior_highschool_id.resetField('snz_junior_highschool_id');
        this.form.snz_junior_highschool_id = null;
        this.$refs.snz_highschool_id.resetField('snz_highschool_id');
        this.form.snz_highschool_id = null;
      }
      if (this.schoolType === this.schoolStatus.JUNIOR_SCHOOL_TYPE) {
        this.$refs.snz_primary_school_id.resetField('snz_primary_school_id');
        this.form.snz_primary_school_id = null;
        this.$refs.snz_highschool_id.resetField('snz_highschool_id');
        this.form.snz_highschool_id = null;
      }
      if (this.schoolType === this.schoolStatus.HIGH_SCHOOL_TYPE) {
        this.$refs.snz_primary_school_id.resetField('snz_primary_school_id');
        this.form.snz_primary_school_id = null;
        this.$refs.snz_junior_highschool_id.resetField('snz_junior_highschool_id');
        this.form.snz_junior_highschool_id = null;
      }
      this.checkWaringBirth();
      // if (this.$refs.snz_primary_school_id) {
      //   this.$refs.snz_primary_school_id.resetField('snz_primary_school_id');
      //   this.form.snz_primary_school_id = null;
      // }
      // if (this.$refs.snz_junior_highschool_id) {
      //   this.$refs.snz_junior_highschool_id.resetField(
      //     'snz_junior_highschool_id'
      //   );
      // this.form.snz_junior_highschool_id = null;
      // }
      // if (this.$refs.snz_highschool_id) {
      //   this.$refs.snz_highschool_id.resetField('snz_highschool_id');
      // this.form.snz_primary_school_id = null;
      // }
      // if (this.$refs.snz_school_id) {
      //   this.$refs.snz_school_id.resetField('snz_school_id');
      // }
      // this.form.snz_school_id = null;
    },
    updateSchoolType(form) {
      const grade = this.gradeOption.find(o => o.id === form.snz_grade_id);
      if (grade) {
        this.schoolType = grade.snz_school_type_id;
      } else {
        this.schoolType = null;
      }
    },
    checkWaringBirth: function() {
      if (this.form.birthdate) {
        const grade = this.gradeOption.find(o => o.id === this.form.snz_grade_id);
        if (grade && grade.start_birthday && grade.end_birthday) {
          this.gradeSelected = grade;
          const currentDate = new Date(this.form.birthdate);
          const minDate = new Date(grade.start_birthday);
          const maxDate = new Date(grade.end_birthday);
          if (currentDate > minDate && currentDate < maxDate){
            this.showWaringBirthday = false;
            return;
          } else {
            this.showWaringBirthday = true;
            return;
          }
        }
      }
      this.showWaringBirthday = false;
    },
    async setSchoolOption(form) {
      if (form.snz_school_id) {
        const res = await this.searchSchoolName({ id: form.snz_school_id });
        this.schoolOptions = res.data;
      }
    },
    async searchSchoolName(query) {
      return await schoolResource.searchName(query);
    },
    async updateStudent() {
      await studentResource
        .update(this.form.snz_studentcode, this.form)
        .then((res) => {
          this.$emit('updateForm', res.original.data);
        })
        .catch(err => {
          if (err.response.status === 422) {
            this.$refs.form.injectFormValidates(err.response);
          }
        })
        .finally(() => {
          this.updateSubmit = false;
          this.$emit('stopLoading');
        });
    },
    updateSchool(value, object) {
      if (value) {
        this.schoolOptions = [object];
        this.form.snz_school_id = value;
      } else {
        this.schoolOptions = [];
        this.form.snz_school_id = null;
      }
    },
    showBrother(contact){
      this.visibleBrother = true;
      window.history.replaceState(null, null, '/student/form/' + contact.snz_studentcode);
    },
    closeBrotherInfo(){
      this.visibleBrother = false;
      this.redirectPage({ name: 'RegisterTrial', params: { redirect: true }});
      // this.redirectPage({ name: 'StudentDetail', params: { id: this.form.snz_studentcode, redirect: true }});
    },
  },
};
</script>
<style lang="scss" scoped>
.el-checkbox__inner {
  background: none !important;
  border: none !important;

  &:after {
    border-color: #1a1714 !important;
    border-width: 4px !important;
    top: 0 !important;
    width: 8px !important;
    height: 15px !important;
    left: 0;
    transform: rotate(45deg) scaleY(1);
    box-sizing: content-box;
    content: '';
  }
}
.icon-input__calendar {
  position: absolute;
  top: 0;
  right: 11px;
  pointer-events: none !important;
}

.student-detail::v-deep {
  .card-body {
    .el-col-8 {
      .el-form-item {
        margin-bottom: 13px;
      }

      .el-form-item__content {
        width: 213px;
      }
      .communication {
        .el-form-item__content {
          min-width: 282px;
          position: absolute;
          height: 94px;
        }
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
      margin-bottom: 10px;
    }
  }
}
/deep/.my-textarea{
  textarea {
    width: 245px;
    height: 90px;
    resize: none;
  }
}
/deep/.el-form-item__error{
  min-width: 500px;
}
.show-waring-birthday{
  color: #c70000;
  position: absolute;
  margin: -12px 0 0 82px;
  font-size: 10px;
}
</style>
