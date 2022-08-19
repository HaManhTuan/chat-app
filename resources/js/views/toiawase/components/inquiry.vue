<template>
  <div v-if="!listLoading">
    <div class="card-body">
      <el-row type="flex" justify="space-between">
        <h3>生徒情報</h3>
        <el-button
          v-if="!disableRole(['viewonly', 'callcenter'])"
          class="btn-check"
          icon="el-icon-circle-plus"
          :loading="checkDuplicateLoading"
          @click="clickCheckDuplicate"
        >
          <span>体験登録</span>
        </el-button>
      </el-row>
    </div>
    <el-form ref="inquiryForm" :rules="rules" class="form-search" :model="form">
      <div class="card-body">
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label-width="146px" label="生徒名(姓)" prop="lastname">
              <el-input
                v-model="form.lastname"
                placeholder=""
                :disabled="disableRole(['viewonly'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="210px" label="生徒名(名)" prop="firstname">
              <el-input
                v-model="form.firstname"
                placeholder=""
                :disabled="disableRole(['viewonly'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label-width="146px" label="フリガナ(姓)" prop="snz_yomilastname">
              <el-input v-model="form.snz_yomilastname" :disabled="disableRole(['viewonly'])" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="210px" label="フリガナ(名)" prop="snz_yomifirstname">
              <el-input
                v-model="form.snz_yomifirstname"
                placeholder=""
                :disabled="disableRole(['viewonly'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label-width="146px" label="学年" prop="snz_grade_id">
              <el-select
                v-model="form.snz_grade_id"
                filterable
                clearable
                placeholder=""
                no-data-text="データはありません。"
                :disabled="disableRole(['viewonly'])"
                :popper-append-to-body="false"
                class="filterable-select"
              >
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="210px" label="電話番号" prop="snz_telephone">
              <el-input
                v-model="form.snz_telephone"
                placeholder=""
                :disabled="disableRole(['viewonly'])"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
        <el-row type="flex" justify="space-around" class="last-row">
          <el-col :span="10">
            <el-form-item label-width="146px" label="校舎" prop="snz_businessunit_id">
              <SearchSelectBox
                v-model="form.snz_businessunit_id"
                :search-function="searchBusiness"
                width="174px"
                key-name="name"
                placeholder=""
                :popper-append-to-body="false"
                :set-default-when-one-option="true"
                class="filterable-select"
                :disabled="disableRole(['viewonly'])"
                @onChange="changebusinessunit"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="210px" label="生徒メールアドレス" prop="student_emailaddress">
              <el-input
                v-model="form.student_emailaddress"
                placeholder=""
                :disabled="disableRole(['viewonly'])"
                @keydown.space.native="(event) => event.preventDefault()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
        <el-row type="flex" justify="space-around" class="last-row">
          <el-col :span="10" />
          <el-col :span="10">
            <el-form-item label-width="210px" label="保護者メールアドレス" prop="manager_emailaddress">
              <el-input
                v-model="form.manager_emailaddress"
                placeholder=""
                :disabled="disableRole(['viewonly'])"
                @keydown.space.native="(event) => event.preventDefault()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
      </div>
      <div class="line" />
      <div class="card-body">
        <h3>アプローチ</h3>
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label-width="146px" label="アプローチ終了">
              <el-select
                v-model="form.snz_approachend"
                :disabled="disableApproachend || disableRole(['viewonly'])"
                clearable
                placeholder="ー"
                no-data-text="データはありません。"
                :popper-append-to-body="false"
                class="filterable-select"
                :filterable="true"
              >
                <el-option
                  v-for="item in approachOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10" />
          <el-col :span="4" />
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="20">
            <el-form-item label-width="146px" label="終了理由" prop="snz_approachend_reason">
              <el-input
                v-model="form.snz_approachend_reason"
                class="custom-textarea-scroll"
                type="textarea"
                :rows="2"
                placeholder=""
                :disabled="disableRole(['viewonly'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
      </div>
      <div class="line" />
      <div class="card-body">
        <div class="contact-method">
          <h3 class="title">1.問合せ内容</h3>
          <el-row type="flex" justify="space-around">
            <el-col :span="10">
              <el-form-item label-width="146px" label="問合せ日" prop="snz_inquirydate">
                <el-date-picker
                  v-model="form.snz_inquirydate"
                  prefix-icon="abc"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  placeholder=""
                  :disabled="disableRole(['viewonly'])"
                  :editable="false"
                  :append-to-body="false"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar" style="font-size: 18px" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="210px" label="問合せ方法" prop="snz_inquirytype">
                <el-select
                  v-model="form.snz_inquirytype"
                  clearable
                  :placeholder="excludeInquiriesPlaceholder"
                  no-data-text="データはありません。"
                  :disabled="disableRole(['viewonly'])"
                  :popper-append-to-body="false"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in inquiriesOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="20">
              <el-form-item label-width="146px" label="問合せ内容" prop="snz_contact_content">
                <el-input
                  v-model="form.snz_contact_content"
                  class="custom-textarea-scroll"
                  type="textarea"
                  :rows="6"
                  placeholder=""
                  :disabled="disableRole(['viewonly'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="20">
              <el-form-item label-width="146px" label="認知媒体">
                <el-select
                  v-model="form.cognitive_medium"
                  multiple
                  clearable
                  placeholder=""
                  no-data-text="データはありません。"
                  :disabled="disableRole(['viewonly'])"
                  class="select-medium"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in cognitiveOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
        </div>
      </div>
      <i class="el-icon-caret-bottom down-icon" />
      <div class="card-body remove-padding">
        <div class="contact-method">
          <h3 class="title">2.架電</h3>
          <el-row type="flex" justify="space-around">
            <el-col :span="10">
              <el-form-item label-width="146px" label="対応状況">
                <el-select
                  v-model="form.snz_supportstatus"
                  clearable
                  placeholder=""
                  no-data-text="データはありません。"
                  :disabled="disableRole(['viewonly'])"
                  :popper-append-to-body="false"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in supportStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="146px" label="顧客の温度感">
                <el-select
                  v-model="form.snz_customer_request"
                  clearable
                  placeholder=""
                  no-data-text="データはありません。"
                  :disabled="disableRole(['viewonly'])"
                  :popper-append-to-body="false"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in customerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="10">
              <el-form-item label-width="146px" label="資料送付">
                <el-select
                  v-model="form.snz_documentsent"
                  clearable
                  placeholder=""
                  no-data-text="データはありません。"
                  :disabled="disableRole(['viewonly'])"
                  :popper-append-to-body="false"
                  :filterable="true"
                  @change="changeDocumentsent"
                >
                  <el-option
                    v-for="item in documentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="146px" label="資料送付日">
                <el-date-picker
                  v-model="form.snz_documentsentdate"
                  prefix-icon="abc"
                  value-format="yyyy-MM-dd"
                  format="yyyy/MM/dd"
                  type="date"
                  placeholder=""
                  :editable="false"
                  :disabled="disableRole(['viewonly'])"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar" style="font-size: 18px" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="20">
              <el-form-item label-width="146px" label="架電詳細" prop="snz_calldetail">
                <el-input
                  v-model="form.snz_calldetail"
                  class="custom-textarea-scroll"
                  type="textarea"
                  :rows="6"
                  placeholder=""
                  :disabled="disableRole(['viewonly'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
        </div>
      </div>
      <i class="el-icon-caret-bottom down-icon" />
      <div class="card-body remove-padding">
        <div class="contact-method">
          <h3 class="title">3.面談</h3>
          <el-row type="flex" justify="space-around">
            <el-col :span="10">
              <el-form-item label-width="146px" label="面談者">
                <SearchSelectBox
                  v-model="form.snz_interviewer_id"
                  :search-function="searchUser"
                  placeholder=""
                  :popper-append-to-body="false"
                  class="filterable-select"
                  :disabled="disableRole(['viewonly'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="146px" label="面談日時" prop="snz_interviewdate">
                <el-date-picker
                  v-model="form.snz_interviewdate"
                  prefix-icon="abc"
                  format="yyyy/MM/dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder=""
                  :editable="false"
                  :disabled="disableRole(['viewonly'])"
                  :append-to-body="false"
                  @change="updateApproachOptions"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar" style="font-size: 18px" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="20">
              <el-form-item
                label-width="146px"
                prop="new_next_action"
              >
                <template slot="label">
                  <span>面談詳細と<br>
                    次のアクション</span>
                </template>
                <el-input
                  v-model="form.new_next_action"
                  class="custom-textarea-scroll"
                  type="textarea"
                  :rows="6"
                  placeholder=""
                  :disabled="disableRole(['viewonly'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
        </div>
      </div>
      <i class="el-icon-caret-bottom down-icon" />
      <div class="card-body remove-padding margin-30">
        <div class="contact-method">
          <h3 class="title">4.受付</h3>
          <el-row type="flex" justify="space-around">
            <el-col :span="10">
              <el-form-item label-width="146px" label="対応日" prop="snz_actdate">
                <el-date-picker
                  v-model="form.snz_actdate"
                  prefix-icon="abc"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder=""
                  :editable="false"
                  :disabled="disableRole(['viewonly'])"
                  :append-to-body="false"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar" style="font-size: 18px" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="146px" label="対応者">
                <SearchSelectBox
                  v-model="form.snz_taiousya_user_id"
                  :search-function="searchUser"
                  placeholder=""
                  :popper-append-to-body="false"
                  class="filterable-select"
                  :disabled="disableRole(['viewonly'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="10">
              <el-form-item label-width="146px" label="入会意思(生徒)" prop="snz_enterstudent">
                <el-select
                  v-model="form.snz_enterstudent"
                  clearable
                  placeholder=""
                  no-data-text="データはありません。"
                  :disabled="disableRole(['viewonly'])"
                  :popper-append-to-body="false"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in enterstudentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label-width="146px" label="入会意思(保護者)">
                <el-select
                  v-model="form.snz_enterguardian"
                  clearable
                  placeholder=""
                  no-data-text="データはありません。"
                  :disabled="disableRole(['viewonly'])"
                  :popper-append-to-body="false"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in enterstudentOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="10">
              <el-form-item label-width="146px" label="体験予定月" prop="snz_experienceplanmonth_period_id">
                <SearchSelectBox
                  ref="experience_plan_month"
                  v-model="form.snz_experienceplanmonth_period_id"
                  :search-function="searchExperiencePlanMonth"
                  key-name="snz_name"
                  placeholder=""
                  :popper-append-to-body="false"
                  :append-query="{
                    pattern_id: current_calendar_pattern_id,
                    order_desc_start: true
                  }"
                  class="filterable-select"
                  :disabled="disableRole(['viewonly'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="14" />
          </el-row>
          <el-row type="flex" justify="space-around">
            <el-col :span="20">
              <el-form-item label-width="146px" label="対応内容" prop="snz_action">
                <el-input
                  v-model="form.snz_action"
                  class="custom-textarea-scroll"
                  type="textarea"
                  :rows="6"
                  placeholder=""
                  :disabled="disableRole(['viewonly'])"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4" />
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>

import ToiawaseResource from '@/api/toiawase';
import UserResource from '@/api/user';
import GradeResource from '@/api/gradeRequest';
import TargetPeriodResource from '@/api/TargetPeriodRequest';
import { name as inquiryName, options as inquiryOptions } from '@/const/InquiryType';
import { approachWebText } from '@/filters/contact';
import { mapGetters } from 'vuex';
import { StudentDetail } from '../assets/validate';
import toiawaseStatus from '@/const/ToiawaseStatus';
import _ from 'lodash';
import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';
import loadmore from '@/directive/selection';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import BusinessUnitRequest from '@/api/BusinessUnitRequest';
import checkRole from '@/utils/role'; // Role checking
const toiawaseResource = new ToiawaseResource();
const userResource = new UserResource();
const gradeResource = new GradeResource();
const targetPeriodResource = new TargetPeriodResource();
const businessResource = new BusinessUnitRequest();

export default {
  name: 'Inquiry',
  metaInfo: {
    title: '入会前の問合せ詳細',
  },
  directives: { permission, role, loadmore },
  components: { SearchSelectBox },
  filters: {
    approachWebText: approachWebText,
  },
  mixins: [StudentDetail],
  props: {
    id: {
      type: String,
      required: false,
      default: null,
    },
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      excludeInquiriesPlaceholder: '',
      excludeInquiriesType: [3, 4, 6],
      inquiryName: inquiryName,
      inquiryOptions: inquiryOptions,
      approachOptions: toiawaseStatus.OPTION_SNZ_APPROACHEND,
      cognitiveOptions: toiawaseStatus.OPTION_COGNITIVE_MEDIUM,
      supportStatusOptions: toiawaseStatus.OPTION_SNZ_SUPPORTSTATUS,
      customerOptions: toiawaseStatus.OPTION_SNZ_CUSTOMER_REQUEST,
      documentOptions: toiawaseStatus.OPTION_SNZ_DOCUMENTSENT,
      enterstudentOptions: toiawaseStatus.OPTION_SNZ_ENTERSTUDENT,
      originForm: null,
      gradeOptions: [],
      disableApproachend: false,
      checkDuplicateLoading: false,
      listLoading: true,
      current_calendar_pattern_id: null,
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
    isCreating(){
      return this.$route.name === 'toiawase-create';
    },
    isEditing(){
      return this.$route.name !== 'toiawase-create';
    },
    inquiriesOptions(){
      if (this.checkRole(['school'])) {
        const rs = _.filter(this.inquiryOptions, item => {
          return item.label !== 'Web問合せ(HP)' && item.label !== 'Web問合せ(塾ナビ)' && item.label !== 'Web問合せ(塾シル)';
        });
        if (_.includes(this.excludeInquiriesType, this.form.snz_inquirytype)) {
          rs.push({ value: this.form.snz_inquirytype, label: this.inquiryName[this.form.snz_inquirytype] });
        }
        return rs;
      } else {
        return this.inquiryOptions;
      }
    },
  },
  created() {
    this.init();
  },
  methods: {
    checkRole,
    async init() {
      this.listLoading = true;
      await this.detailModel();
      await this.getGrade();
      this.listLoading = false;
      this.setCalendarPatternId(this.form.business_unit ? this.form.business_unit.snz_calendar_pattern_id : true);
    },
    async clickCheckDuplicate() {
      this.checkDuplicateLoading = true;
      this.$emit('checkDuplicate');
    },
    updateToiawase() {
      return toiawaseResource.update(this.form.id, this.form);
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
      }
    },
    async searchExperiencePlanMonth(query = null) {
      return await targetPeriodResource.searchName(query);
    },
    async searchUser(params) {
      if (!_.isEmpty(params)) {
        return await userResource.searchName(params);
      }
    },
    async getGrade() {
      this.gradeOptions = await gradeResource.gradeOptions({
        select_add_id: [this.form.snz_grade_id],
      });
    },
    updateApproachOptions(snz_interviewdate = null) {
      if (!this.disableApproachend) {
        if (this.form.snz_interviewdate || snz_interviewdate) {
          this.approachOptions[0].disabled = false;
          this.approachOptions[1].disabled = true;
          this.approachOptions[2].disabled = false;
          this.approachOptions[3].disabled = false;
          if (this.form.snz_approachend === 1) {
            this.form.snz_approachend = null;
          }
        } else {
          this.approachOptions[0].disabled = false;
          this.approachOptions[1].disabled = false;
          this.approachOptions[2].disabled = true;
          this.approachOptions[3].disabled = true;
          if (this.form.snz_approachend === 2 || this.form.snz_approachend === 3) {
            this.form.snz_approachend = null;
          }
        }
      }
    },
    async detailModel() {
      if (this.isEditing) {
        const form = await toiawaseResource.inquiryDetail(this.id);
        const rs = form.original.data;
        this.updateApproachOptions(rs.snz_interviewdate);
        this.$emit('setModel', rs);
      } else {
        this.updateApproachOptions(null);
        this.$emit('setModel', {
          snz_documentsentdate: null,
          snz_experienceplanmonth_period_id: null,
          cognitive_medium: [],
          // lastname: '',
          firstname: '',
          // snz_yomilastname: '',
          snz_yomifirstname: '',
          // snz_grade_id: null,
          snz_supportstatus_copy: null,
          snz_customer_request_copy: null,
          snz_documentsent_copy: null,
          snz_documentsentdate_copy: null,
          snz_calldetail_copy: null,
          snz_interviewdate_copy: null,
          new_next_action_copy: null,
          snz_interviewer_id_copy: null,
          interviewer_copy: null,
        });
      }
    },
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    changebusinessunit(value, object){
      this.form.snz_experienceplanmonth_period_id = null;
      this.setCalendarPatternId(object ? object.snz_calendar_pattern_id : true);
      this.$nextTick(() => {
        if (this.$refs.experience_plan_month) {
          this.$refs.experience_plan_month.init();
        } else {
          this.$nextTick(() => {
            this.changebusinessunit(value, object);
          });
        }
      });
    },
    setCalendarPatternId(pattern_id) {
      this.current_calendar_pattern_id = pattern_id;
    },
    changeDocumentsent(){
      this.$emit('changeDocumentsent');
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-check::v-deep {
  background: #F8F8F8 0 0 no-repeat padding-box;
  border: 1px solid #D6D6D6;
  border-radius: 100px;
  opacity: 1;

  span {
    font-size: 15px;
    font-weight: 500 !important;
    font-family: Noto Sans JP, sans-serif;
    padding-left: 1px;
    color: black;
  }

  i {
    font-size: 22px !important;
    vertical-align: -3px;
    border-radius: 100%;
    color: #1467B3 !important;
    background-color: white !important;
  }
}

.contact-method {
  background: #F4F8FC 0 0 no-repeat padding-box !important;
  border-radius: 10px;
  opacity: 1;

  .title {
    padding-top: 20px;
    padding-left: 20px;
    font-size: 18px;
    color: #1467B3 !important;
  }
}

.icon-input__calendar {
  position: absolute;
  top: 8px;
  right: 11px;
  pointer-events: none;
}

.down-icon {
  color: #C2D3E2 !important;
  font-size: 37px;
  padding: 0;
  border: 0 !important;
  display: flex;
  justify-content: center;
  margin-top: -14px;
}

.remove-padding {
  padding-top: 0 !important;
  margin-top: -10px;
}
.form-search{
  max-width: 1309px;
  margin: auto;
}
.margin-30{
  margin-bottom: 30px!important;
}
/deep/.select-medium{
  .el-select__tags{
    .el-select__input{
      border: 0 !important;
    }
  }
  .el-select-dropdown__item{
    max-width: unset !important;
  }
}
/deep/.filterable-select .el-input.is-focus input {
  background: #FFFFFF !important;
}
</style>
