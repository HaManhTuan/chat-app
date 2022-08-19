<template>
  <div>
    <div class="card-body">
      <el-row type="flex" justify="space-between">
        <h3>生徒情報</h3>
        <el-button
          v-role="[
            'system',
          ]"
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
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
        <el-row type="flex" justify="space-around" class="last-row">
          <el-col :span="10">
            <el-form-item label-width="146px" label="校舎" prop="snz_businessunit_id">
              <SearchSelectBox
                v-if="form.snz_businessunit_id"
                v-model="form.snz_businessunit_id"
                :search-function="searchBusiness"
                width="174px"
                key-name="name"
                placeholder=""
                :popper-append-to-body="false"
                :disabled="disableRole(['viewonly'])"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10" />
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
                  @change="updateApproachOptions"
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
                  placeholder=""
                  no-data-text="データはありません。"
                  :disabled="disableRole(['viewonly'])"
                  :popper-append-to-body="false"
                  :filterable="true"
                >
                  <el-option
                    v-for="item in inquiryOptions"
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
                  :popper-append-to-body="false"
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
      <div class="card-body">
        <h3 class="title">架電履歴</h3>
        <el-row>
          <el-table
            v-loading="listLoading"
            class="call-table editable-table"
            :data="callLog"
            fit
            height="360"
            highlight-current-row
            :cell-style="tableRowStyle"
            :header-cell-style="tableHeaderColor"
            empty-text="データはありません。"
          >
            <el-table-column label="担当者" width="102px">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.snz_userincharge"
                  v-loadmore="func => loadmoreTaiousyaUsers(scope.$index)"
                  :remote-method="data => searchTaiousyaUsers(data, scope.$index)"
                  :loading="loadingSearchTaiousya"
                  filterable
                  remote
                  clearable
                  class="pl-input-0 select-attendance remove-border"
                  placeholder="ー"
                  no-data-text="データはありません。"
                  :popper-append-to-body="false"
                  :disabled="disableRole(['viewonly'])"
                  @change="func = changeTaiousyaUsers(scope.$index)"
                  @focus="func = changeTaiousyaUsers(scope.$index)"
                >
                  <el-option
                    v-for="item in scope.row.taiausya_option"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="架電日時" width="190px">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.snz_call_datetime"
                  type="datetime"
                  placeholder="ー"
                  format="yyyy/MM/dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="remove-border"
                  :editable="false"
                  popper-class="select-inside-table"
                  :disabled="disableRole(['viewonly'])"
                />
                <span class="icon-calendar call-date">
                  <svg-icon icon-class="_calendar_white" style="font-size: 15px" />
                </span>
              </template>
            </el-table-column>
            <el-table-column label="架電状況" width="120px">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.snz_call_status"
                  class="select-attendance remove-border"
                  placeholder="ー"
                  no-data-text="データはありません。"
                  :popper-append-to-body="false"
                  :filterable="true"
                  :disabled="disableRole(['viewonly'])"
                >
                  <el-option
                    v-for="item in callLogOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="結果" width="120px">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.snz_call_result"
                  class="select-attendance remove-border"
                  placeholder="ー"
                  no-data-text="データはありません。"
                  :popper-append-to-body="false"
                  :filterable="true"
                  :disabled="disableRole(['viewonly'])"
                >
                  <el-option
                    v-for="item in callResultOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="対応者" width="100px">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.snz_taiousya_user_id"
                  class="select-attendance remove-border"
                  placeholder="ー"
                  no-data-text="データはありません。"
                  :popper-append-to-body="false"
                  :filterable="true"
                  :disabled="disableRole(['viewonly'])"
                >
                  <el-option
                    v-for="item in taiousyaOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="架電詳細">
              <template slot-scope="scope">
                <el-input v-model="scope.row.snz_call_detail" type="textarea" maxlength="200" class="remove-border custom-textarea-scroll" />
              </template>
            </el-table-column>
            <el-table-column align="center" width="60px" label="保存" row-class-name="action">
              <template slot-scope="scope">
                <el-button
                  class="btn-edit"
                  size="mini"
                  :disabled="callLogDisable || !scope.row.snz_call_result || !scope.row.snz_userincharge || !scope.row.snz_call_datetime || disableRole(['viewonly'])"
                  @click.prevent="updateCallLog(scope.$index,scope.row)"
                >
                  <svg-icon icon-class="_save" />
                </el-button>
              </template>
            </el-table-column>
            <el-table-column align="center" label="削除" width="67px">
              <template slot-scope="scope">
                <el-button
                  class="btn-delete"
                  :disabled="callLogDisable || disableRole(['viewonly'])"
                  @click.prevent="deleteCallLog(scope.$index, scope.row)"
                >
                  <svg-icon icon-class="_trash" />
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row type="flex">
          <el-button
            class="btn-create btn-check-create"
            icon="el-icon-circle-plus"
            :disabled="disableRole(['viewonly'])"
            @click="addCallLog"
          >
            <span>架電を追加</span>
          </el-button>
        </el-row>
        <el-row type="flex" style="margin-top: 20px;" />
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
                  :append-to-body="true"
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
                  ref="snz_interviewer"
                  v-model="form.snz_interviewer_id"
                  :search-function="searchUser"
                  placeholder=""
                  :popper-append-to-body="false"
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
              <el-form-item label-width="146px" prop="new_next_action">
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
      <div class="line" />
      <div class="card-body">
        <h3 class="title">コールセンター履歴エリア</h3>
        <button-copy
          class="btn-copy"
          :disabled="disableRole(['viewonly'])"
          @save="copy"
        />
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label-width="146px" label="対応状況">
              <el-select
                v-model="form.snz_supportstatus_copy"
                clearable
                placeholder="ー"
                no-data-text="データはありません。"
                :disabled="true"
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
                v-model="form.snz_customer_request_copy"
                clearable
                placeholder="ー"
                no-data-text="データはありません。"
                :disabled="true"
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
                v-model="form.snz_documentsent_copy"
                clearable
                placeholder="ー"
                no-data-text="データはありません。"
                :disabled="true"
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
                v-model="form.snz_documentsentdate_copy"
                prefix-icon="abc"
                value-format="yyyy-MM-dd"
                format="yyyy/MM/dd"
                type="date"
                placeholder=""
                :editable="false"
                :disabled="true"
                :append-to-body="true"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="20">
            <el-form-item label-width="146px" label="架電詳細">
              <el-input
                v-model="form.snz_calldetail_copy"
                class="custom-textarea-scroll no-border"
                type="textarea"
                :rows="6"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="10">
            <el-form-item label-width="146px" label="面談者">
              <el-input
                v-if="form.interviewer_copy"
                v-model="form.interviewer_copy.name"
                placeholder=""
                :disabled="true"
              />
              <el-input
                v-else
                v-model="form.interviewerc"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="146px" label="面談日時" prop="snz_interviewdate">
              <el-date-picker
                v-model="form.snz_interviewdate_copy"
                prefix-icon="abc"
                format="yyyy/MM/dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder=""
                :editable="false"
                :disabled="true"
                :append-to-body="false"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
        <el-row type="flex" justify="space-around">
          <el-col :span="20">
            <el-form-item label-width="146px" prop="new_next_action">
              <template slot="label">
                <span>面談詳細と<br>
                  次のアクション</span>
              </template>
              <el-input
                v-model="form.new_next_action_copy"
                class="custom-textarea-scroll"
                type="textarea"
                :rows="6"
                placeholder=""
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4" />
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>

import ToiawaseResource from '@/api/toiawase';
import UserResource from '@/api/user';
import GradeResource from '@/api/gradeRequest';
import CallLogResource from '@/api/callLog';
import { name as inquiryName, options as inquiryOptions } from '@/const/InquiryType';
import { approachWebText } from '@/filters/contact';
import { mapGetters } from 'vuex';
import { StudentDetail } from '../assets/validate';
import toiawaseStatus from '@/const/ToiawaseStatus';
import callLogStatus from '@/const/CallLogStatus';
import _ from 'lodash';
import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';
import { Message } from 'element-ui';
import loadmore from '@/directive/selection';
import CommonSettings from '@/const/CommonSettings';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import BusinessUnitRequest from '@/api/BusinessUnitRequest';
import ButtonCopy from '@/components/Common/Button/ButtonCopy';

const toiawaseResource = new ToiawaseResource();
const userResource = new UserResource();
const gradeResource = new GradeResource();
const callLogResource = new CallLogResource();
const businessResource = new BusinessUnitRequest();

export default {
  name: 'CallCenter',
  metaInfo: {
    title: '入会前の問合せ詳細',
  },
  directives: { permission, role, loadmore },
  components: { SearchSelectBox, ButtonCopy },
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
      commonText: CommonSettings.COMMON_TXT,
      inquiryName: inquiryName,
      inquiryOptions: inquiryOptions,
      cognitiveOptions: toiawaseStatus.OPTION_COGNITIVE_MEDIUM,
      supportStatusOptions: toiawaseStatus.OPTION_SNZ_SUPPORTSTATUS,
      customerOptions: toiawaseStatus.OPTION_SNZ_CUSTOMER_REQUEST,
      documentOptions: toiawaseStatus.OPTION_SNZ_DOCUMENTSENT,
      callLogOptions: callLogStatus.OPTION_SNZ_CALL_STATUS,
      callResultOptions: callLogStatus.OPTION_SNZ_CALL_RESULT,
      taiousyaOptions: callLogStatus.OPTION_SNZ_TAIOUSYA,
      originForm: null,
      gradeOptions: [],
      taiousyaUsers: [],
      loadingSearchTaiousya: false,
      listLoading: false,
      loadingInterviewerUsers: false,
      loadingExperiencePlanMonth: false,
      callLog: [],
      checkDuplicateLoading: false,
      defaultUsers: [],
      callLogDisable: false,
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
    isCreating(){
      return this.$route.name === 'toiawase-create';
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // await this.getGrade();
      await this.getCallLog();
    },
    async clickCheckDuplicate() {
      this.checkDuplicateLoading = true;
      this.$emit('checkDuplicate');
    },
    async searchUser(params) {
      if (!_.isEmpty(params)) {
        return await userResource.searchName(params);
      }
      return [];
    },
    async loadmoreTaiousyaUsers(index) {
      if (this.callLog[index].page !== 0) {
        this.callLog[index].page = this.callLog[index].page + 1;
        const res = await this.searchUser({ name: this.callLog[index].query, not_id: this.callLog[index].snz_userincharge, page: this.callLog[index].page });
        this.callLog[index].taiausya_option = this.callLog[index].taiausya_option.concat(res.data);
        if (res.current_page >= res.last_page) {
          this.callLog[index].page = 0;
        }
      }
    },
    async searchTaiousyaUsers(query = null, index) {
      this.callLog[index].query = query;
      this.callLog[index].page = 1;
      const res = await this.searchUser({ name: query });
      if (res.current_page >= res.last_page) {
        this.callLog[index].page = 0;
      }
      this.callLog[index].taiausya_option = res.data;
    },
    changeTaiousyaUsers(index) {
      if (!this.callLog[index].snz_userincharge) {
        this.callLog[index].taiausya_option = this.defaultUsers;
        this.callLog[index].page = 1;
        this.callLog[index].query = null;
      }
    },
    async getGrade() {
      this.gradeOptions = await gradeResource.gradeOptions({
        select_add_id: [this.form.snz_grade_id],
      });
    },
    updateApproachOptions() {
      if (!this.disableApproachend) {
        if (this.form.snz_inquirydate) {
          this.approachOptions[0].disabled = true;
          this.approachOptions[1].disabled = false;
          this.approachOptions[2].disabled = false;
        } else {
          this.approachOptions[0].disabled = false;
          this.approachOptions[1].disabled = true;
          this.approachOptions[2].disabled = true;
        }
      }
    },
    tableHeaderColor() {
      return 'background-color: #535353;color:#fff;padding-left:10px';
    },
    tableRowStyle() {
      return 'padding-left:10px';
    },
    async getCallLog() {
      if (this.id) {
        const logs = await toiawaseResource.getCallLog(this.id);
        for (const log of logs) {
          const res = await this.searchUser({ id: log.snz_userincharge, page: 1 });
          log.taiausya_option = res.data;
        }
        this.callLog = logs;
      }
    },
    async deleteCallLog(index, row) {
      this.callLogDisable = true;
      if (this.callLog[index].id) {
        this.$confirm(this.commonText.deleteConfirmTxt, '警告', {
          confirmButtonText: 'はい',
          cancelButtonText: 'キャンセル',
          type: 'warning',
        }).then(async() => {
          if (this.callLog[index].id) {
            await callLogResource.destroy(this.callLog[index].id);
          }
          this.callLog.splice(index, 1);
        }).catch();
      } else {
        this.callLog.splice(index, 1);
      }
      this.callLogDisable = false;
    },
    async updateCallLog(index, row) {
      this.callLogDisable = true;
      if (this.form.id) {
        const res = await callLogResource.update({
          id: row.id,
          snz_call_datetime: row.snz_call_datetime,
          snz_call_detail: row.snz_call_detail,
          snz_call_result: row.snz_call_result,
          snz_call_status: row.snz_call_status,
          snz_taiousya_user_id: row.snz_taiousya_user_id,
          snz_userincharge: row.snz_userincharge,
          snz_toiawase_id: row.snz_toiawase_id,
        });
        this.callLog[index].id = res.original.model.id;
        Message({
          message: res.original.message,
          type: 'success',
          duration: 1500,
        });
      } else {
        Message({
          message: '架電履歴を保存する前に、問合内容を保存してください。',
          type: 'error',
          duration: 1500,
        });
      }
      this.callLogDisable = false;
    },
    addCallLog() {
      this.listLoading = true;
      this.callLog.push({
        snz_call_datetime: null,
        snz_call_detail: null,
        snz_call_result: null,
        snz_call_status: null,
        snz_taiousya_user_id: null,
        snz_userincharge: null,
        snz_toiawase_id: this.id,
        taiausya_option: this.defaultUsers,
        page: 1,
        query: null,
      });
      this.listLoading = false;
    },
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    changeDocumentsent(){
      this.$emit('changeDocumentsent');
    },
    copy() {
      this.$emit('copy');
    },
  },
};
</script>
<style lang="scss" scoped>
.btn-check-create::v-deep {
  background: #F8F8F8 0 0 no-repeat padding-box;
  border: 1px solid #D6D6D6;
  border-radius: 100px;
  opacity: 1;
  height: 43px;

  span {
    font-size: 15px;
    font-weight: 500 !important;
    font-family: Noto Sans JP, serif;
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
.btn-check::v-deep {
  background: #F8F8F8 0 0 no-repeat padding-box;
  border: 1px solid #D6D6D6;
  border-radius: 100px;
  opacity: 1;
  font-weight: 500!important;
  span {
    font-size: 15px;
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

.call-table {

  border-left: 1px solid #F0F0F0;
  border-right: 1px solid #F0F0F0;
  border-top: 1px solid #F0F0F0;
  border-bottom: 1px solid #F0F0F0;
  /deep/.el-table__body tr.current-row > td {
    background-color: #FFFFFF;
  }
  .el-input__inner{
    font-size: 12px;
  }
  .el-table__fixed-body-wrapper{
    z-index: -5;
  }
  span.icon-calendar {
    margin-left: 5px;
  }

  /deep/ .el-checkbox__input {
    &.is-checked {
      .el-checkbox__inner {
        background: none;

        &:after {
          border-color: red;
        }
      }
    }

    .el-checkbox__inner {
      border: 1px solid #1A1714;
      border-radius: 2px;
      opacity: 1;
    }
  }

  /deep/ td {
    &:nth-child(2) {
      padding-left: 0 !important;
    }
    &:nth-child(6) {
      padding-left: 20px !important;
      padding-top: 3px !important;
      padding-bottom: 3px !important;
    }
  }

  /deep/.el-select {
    .el-input__suffix {
      right: 0;
      top: 4px;
      background: #769FC6;
      border-radius: 3px;
      height: 84%;
      i.el-input__icon {
        color: #FFFFFF;
        width: 18px;
        height: 32px;
        line-height: 32px;

        &:before {
          color: #FFFFFF;
        }
      }
    }
  }
  /deep/.el-textarea{
    height: 51px;
    textarea {
      height: 52px;
      font-size: 12px;
      letter-spacing: 0.19px;
      line-height: 1.2;
    }
  }

  /deep/ .custom-pagination {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    height: 60px;
    background-color: #f0f0f0;

    button.btn-prev, button.btn-next {
      background: #FFFFFF;
    }
  }

  /deep/ thead {
    th {
      padding: 0;
      height: 32px;
      background: #535353;
      border-bottom: 1px solid #d6d6d6;
      font-size: 13px;
      font-family: Noto Sans JP, sans-serif;
      font-weight: 400;
    }
    th:nth-child(2) {
      padding-left: 30px !important;
    }
    th:nth-child(3) {
      padding-left: 26px !important;
    }
    th:nth-child(4) {
      padding-left: 26px !important;
    }
    th:nth-child(5) {
      padding-left: 26px !important;
    }
    th:nth-child(6) {
      padding-left: 26px !important;
    }
    th:nth-child(7) {
      padding-left: 0 !important;
    }
    th:nth-child(8) {
      padding-left: 0 !important;
    }

    .cell {
      font-size: 13px;
      line-height: 29px;
      font-family: Noto Sans JP;
    }
  }

  button.btn-edit, button.btn-delete {
    width: 32px;
    height: 32px;
    border-radius: 5px;
    padding: 0;
    border: none;
    margin-right: 10px;
    color: #1467b3;
    vertical-align: middle;

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  button.btn-delete {
    background: #f4f8fd;
  }

  button.btn-edit {
    background: #FAECEC;
  }

  /deep/ .remove-border {
    input {
      border: 0 !important;
      background: inherit;
    }

    textarea {
      border: 1px solid #9BB3CC !important;
      border-radius: 6px !important;
      opacity: 1;
      resize: none !important;
    }
  }
  /deep/ .el-input__inner {
      //padding-left: 20px !important;
      font-size: 13px;
  }
  /deep/.pl-input-0 {
    input{
      padding-left: 0;
    }
  }
}

.btn-create {
  border-radius: 25px;
  width: 100%;
  margin-top: 10px;
}

/deep/.el-icon-date{
  display: none !important;
}

.call-date{
  position: absolute;
  right: 8px;
  top: 14px;
  background-color: #769FC6;
}
.form-search{
  max-width: 1309px;
  margin: auto;
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
.el-table__row{
  tr{
    height: 80px;
  }
}
/deep/.filterable-select .el-input.is-focus input {
  background: #FFFFFF !important;
}
/deep/.el-textarea.is-disabled .el-textarea__inner{
  background-color: #f0f0f0 !important;
  border: #f0f0f0 !important;
}
.btn-copy{
  background: #C70000;
  position: relative;
  left: 670px;
  top: -24px;
}
</style>
