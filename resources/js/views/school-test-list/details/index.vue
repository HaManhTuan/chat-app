<template>
  <div v-if="!loading" v-loading="loading" class="app-container">
    <div class="schooltest-detail">
      <el-scrollbar class="scroll-content">
        <el-form ref="form" :model="form" :rules="searchRules">
          <div class="card-body form-search">
            <h3>
              全般
            </h3>
            <el-row>
              <el-col :span="10" style="margin-right: -40px;">
                <div class="input-item">
                  <el-form-item label="校舎名" prop="name" label-width="128px">
                    <el-input
                      v-model="form.name"
                      clearable
                      placeholder=""
                      :disabled="disableRole(['viewonly'])"
                      @change="handleChange('name')"
                    />
                  </el-form-item>
                  <el-form-item label="上位の部署" prop="parentbusinessunitid" label-width="128px">
                    <SearchSelectBox
                      v-model="form.parentbusinessunitid"
                      :search-function="searchAreaName"
                      key-name="snz_area"
                      key-id="snz_area_code"
                      placeholder=""
                      :popper-append-to-body="false"
                      popper-class="select-inside-table"
                      class="custom-select__caret"
                      @onChange="getHeaddivision"
                    />
                  </el-form-item>
                  <el-form-item label="事業本部" prop="snz_headdivision" label-width="128px">
                    <SearchSelectBox
                      ref="selectHeaddivision"
                      v-model="form.snz_headdivision"
                      :search-function="searchHeadDivision"
                      :disabled="headdivisionDisable && typeof $route.params.id === 'undefined'"
                      key-name="snz_headdivision"
                      key-id="snz_headdivision_code"
                      placeholder=""
                      popper-class="select-inside-table"
                      :popper-append-to-body="false"
                      class="custom-select__caret"
                      @onChange="getDivision"
                    />
                  </el-form-item>
                  <el-form-item label="事業部" prop="snz_divisionnm" label-width="128px">
                    <SearchSelectBox
                      ref="selectDivision"
                      v-model="form.snz_divisionnm"
                      :search-function="searchDivision"
                      :disabled="divisionDisable && typeof $route.params.id === 'undefined'"
                      key-name="snz_division"
                      key-id="snz_division_code"
                      placeholder=""
                      :popper-append-to-body="false"
                      :remove-focus="focusDivision"
                      popper-class="select-inside-table"
                      class="custom-select__caret"
                      @onChange="getArea"
                    />
                  </el-form-item>
                  <el-form-item label="エリア" :inline-message="true" prop="snz_area" label-width="128px">
                    <SearchSelectBox
                      ref="selectArea"
                      v-model="form.snz_area"
                      :search-function="searchArea"
                      :disabled="areaDisable && typeof $route.params.id === 'undefined'"
                      key-name="snz_area"
                      key-id="snz_area_code"
                      placeholder=""
                      class="custom-select__caret"
                      :remove-focus="true"
                      :popper-append-to-body="false"
                      popper-class="select-inside-table"
                      @onChange="getOrg"
                    />
                  </el-form-item>
                  <el-form-item label="組織名" :inline-message="true" prop="organization_id" label-width="128px">
                    <SearchSelectBox
                      ref="selectOrg"
                      v-model="form.organization_id"
                      :search-function="searchOrgName"
                      :disabled="orgDisable && typeof $route.params.id === 'undefined'"
                      key-name="name"
                      placeholder=""
                      class="custom-select__caret"
                      :remove-focus="true"
                      :popper-append-to-body="false"
                      popper-class="select-inside-table"
                      @onChange="handleChange('organization_id')"
                    />
                  </el-form-item>
                  <el-form-item label="卒業学年" prop="snz_graduation_grade" label-width="128px">
                    <el-select
                      v-model="form.snz_graduation_grade"
                      placeholder=""
                      :no-data-text="CommonTxt.selectboxEmptyTxt"
                      clearable
                      filterable
                      popper-class="select-inside-table"
                      :popper-append-to-body="false"
                      class="custom-select__caret"
                      @change="handleChange('snz_graduation_grade')"
                    >
                      <el-option
                        v-for="item in optionGrades"
                        :key="item.id"
                        :label="item.snz_name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="input-item">
                  <el-form-item label="カレンダーパターン" prop="snz_calendar_pattern_id" label-width="190px">
                    <search-select-box
                      v-model="form.snz_calendar_pattern_id"
                      :search-function="searchCalendarPattern"
                      placeholder=""
                      key-name="snz_name"
                      key-id="id"
                      clearable
                      class="custom-select__caret"
                      :popper-append-to-body="false"
                      popper-class="select-inside-table"
                      @onChange="getCalendar"
                    />
                  </el-form-item>
                  <el-form-item label="ブランド区分" prop="snz_brand" label-width="190px">
                    <el-select
                      v-model="form.snz_brand"
                      clearable
                      placeholder=""
                      label-width="190px"
                      :popper-append-to-body="false"
                      popper-class="select-inside-table"
                    >
                      <el-option
                        v-for="item in optionBrand"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="締め月" prop="snz_closing_month_period_id" label-width="190px">
                    <SearchSelectBox
                      ref="selectCloseMonth"
                      v-model="form.snz_closing_month_period_id"
                      :search-function="searchNameTargetPeriod"
                      :append-query="{pattern_id:form.snz_calendar_pattern_id}"
                      key-name="snz_name"
                      key-id="id"
                      placeholder=""
                      :popper-append-to-body="false"
                      popper-class="select-inside-table"
                      class="custom-select__caret"
                      @onChange="handleChange('snz_closing_month_period_id')"
                    />
                  </el-form-item>
                  <el-form-item label="教室長" prop="snz_schoolmanager_user_id" label-width="190px">
                    <SearchSelectBox
                      v-model="form.snz_schoolmanager_user_id"
                      :search-function="searchNameSystemUser"
                      key-name="name"
                      placeholder=""
                      :popper-append-to-body="false"
                      popper-class="select-inside-table"
                      class="custom-select__caret"
                      @onChange="handleChange('snz_schoolmanager_user_id')"
                    />
                  </el-form-item>
                  <el-form-item label="教室コード" :inline-message="true" prop="snz_code" label-width="190px">
                    <input-number
                      v-model="form.snz_code"
                      clearable
                      :disabled="typeof $route.params.id !== 'undefined' || disableRole(['viewonly'])"
                      placeholder=""
                      :maxlength="3"
                      @change="handleChange('snz_code')"
                    />
                  </el-form-item>
                  <el-form-item label="連携用校舎コード" label-width="190px" prop="snz_cooperationschoolcd">
                    <el-input
                      v-model="form.snz_cooperationschoolcd"
                      placeholder=""
                      clearable
                      :disabled="disableRole(['viewonly'])"
                      @change="handleChange('snz_cooperationschoolcd')"
                    />
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <!-- END FIRST ROW -->
          </div>
          <div v-role="['system']" class="line" />
          <div v-role="['system']" class="card-body box-bottom">
            <h3>
              システム
            </h3>
            <el-row>
              <el-col :span="8">
                <el-form-item label="作成日" class="date-picker-item w-225" label-width="125px">
                  <el-date-picker
                    v-model="form.create_date"
                    format="yyyy/MM/dd"
                    value-format="yyyy/MM/dd"
                    prefix-icon="none"
                    type="date"
                    disabled
                    placeholder=""
                  />
                  <span class="icon-input__calendar calendar__disable">
                    <svg-icon icon-class="_calendar_x" />
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="修正日" prop="firstName" class="date-picker-item w-225" label-width="93px">
                  <el-date-picker
                    v-model="form.update_date"
                    format="yyyy/MM/dd"
                    value-format="yyyy/MM/dd"
                    prefix-icon="none"
                    type="date"
                    disabled
                    placeholder=""
                  />
                  <span class="icon-input__calendar calendar__disable">
                    <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div class="box_status">
                  <el-form-item label="ステータス" prop="status" class="w-225" label-width="95px">
                    <el-select
                      v-model="form.status"
                      placeholder=""
                      :popper-append-to-body="false"
                      popper-class="select-inside-table"
                      @change="handleChange('status')"
                    >
                      <el-option v-for="item in getStatus" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            <!-- END FIRST ROW -->
            <!-- SECOND ROW -->
            <el-row>
              <el-col :span="8">
                <el-form-item label="作成者" class="w-225" label-width="125px">
                  <el-select
                    v-model="form.created_by_user_id"
                    placeholder=""
                    :no-data-text="CommonTxt.selectboxEmptyTxt"
                    clearable
                    filterable
                    popper-class="select-inside-table"
                    :popper-append-to-body="false"
                    disabled
                  >
                    <el-option
                      v-for="item in [form.create_user?form.create_user:{}]"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="修正者" class="w-225" label-width="93px">
                  <el-select
                    v-model="form.modified_by_user_id"
                    placeholder=""
                    :no-data-text="CommonTxt.selectboxEmptyTxt"
                    clearable
                    filterable
                    popper-class="select-inside-table"
                    :popper-append-to-body="false"
                    disabled
                  >
                    <el-option
                      v-for="item in [form.edit_user?form.edit_user:{}]"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" />
            </el-row>
            <el-row class="bot">
              <el-col :span="8" />
              <el-col :span="8" />
              <el-col :span="8" />
            </el-row>
          </div>
        </el-form>
      </el-scrollbar>
    </div>
    <div class="footer">
      <button-delete
        v-if="typeof $route.params.id !=='undefined' "
        :loading="deleting"
        :disabled="saveLoading"
        @delete="handleDelete"
      />
      <button-save
        v-show="!isEditing"
        :loading="saveLoading"
        :disabled="deleting"
        @save="submitForm('form')"
      />
      <button-save
        v-show="isEditing"
        :disabled="deleting"
        :loading="saveLoading"
        @save="submitForm('form')"
      />
    </div>
  </div>
</template>
<script>
import { validate } from '../assets/validate';
import ButtonSave from '../../../components/Common/Button/ButtonSave';
import ButtonDelete from '../../../components/Common/Button/ButtonDelete';
import role from '@/directive/role';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import BusinessUnitRequest from '../../../api/BusinessUnitRequest';
import SchoolTestList from '../../../api/SchoolTestList';
import CalendarPatternRequest from '../../../api/CalendarPatternRequest';
import { options } from '../../../const/BrandOption';
import TargetPeriodRequest from '../../../api/TargetPeriodRequest';
import SystemUser from '../../../api/SystemUser';
import { Message } from 'element-ui';
import UserResource from '../../../api/user';
import loadmore from '@/directive/selection';
import InputNumber from '@/components/Common/InputNumber';
import GradeRequest from '../../../api/gradeRequest';
const schoolTestList = new SchoolTestList();
const businessResource = new BusinessUnitRequest();
const calendarPatternRequest = new CalendarPatternRequest();
const targetPeriodRequest = new TargetPeriodRequest();
const systemUserRequest = new SystemUser();
const userResource = new UserResource();
const gradeRequest = new GradeRequest();
export default {
  metaInfo: {
    title: '校舎詳細',
  },
  directives: { role, loadmore },
  components: {
    InputNumber,
    SearchSelectBox,
    ButtonSave,
    ButtonDelete,
  },
  mixins: [validate],
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    const formUpdate = this.form;
    if (formUpdate.name === this.origin.name &&
        formUpdate.snz_code === this.origin.snz_code &&
        formUpdate.snz_schoolmanager_user_id === this.origin.snz_schoolmanager_user_id &&
        formUpdate.snz_divisionnm === this.origin.snz_divisionnm &&
        formUpdate.snz_headdivision === this.origin.snz_headdivision &&
        formUpdate.parentbusinessunitid === this.origin.parentbusinessunitid &&
        formUpdate.snz_graduation_grade === this.origin.snz_graduation_grade &&
        formUpdate.snz_calendar_pattern_id === this.origin.snz_calendar_pattern_id &&
        formUpdate.snz_closing_month_period_id === this.origin.snz_closing_month_period_id &&
        formUpdate.snz_cooperationschoolcd === this.origin.snz_cooperationschoolcd &&
        formUpdate.snz_crammanageschoolname === this.origin.snz_crammanageschoolname &&
        formUpdate.snz_targetperiod === this.origin.snz_targetperiod &&
        formUpdate.snz_brand === this.origin.snz_brand &&
        formUpdate.organization_id === this.origin.organization_id &&
        formUpdate.status === this.origin.status) {
      return next();
    } else {
      if (this.isEditing) {
        this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }).then(() => {
          this.$refs.form.validate().then(() => {
            this.update().then(() => {
              if (!this.isError) {
                next();
              }
            }).catch((err) => {
              if (err.response.status === 422) {
                this.$refs.form.injectFormValidates(err.response);
                if (err.response.data.errors.id && !err.response.data.errors.snz_code){
                  this.$message({
                    message: err.response.data.errors.id[0],
                    type: 'error',
                  });
                }
              }
              next(false);
            });
          }).catch(() => {
            this.catchValidate();
          });
        }).catch((action) => {
          if (action === 'cancel') {
            next();
          } else {
            next(false);
          }
        });
      } else {
        this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }).then(() => {
          this.$refs.form.validate().then(() => {
            this.create().then(() => {
              if (!this.isError) {
                next();
              }
            }).catch((err) => {
              if (err.response.status === 422) {
                this.$refs.form.injectFormValidates(err.response);
                if (err.response.data.errors.id && !err.response.data.errors.snz_code){
                  this.$message({
                    message: err.response.data.errors.id[0],
                    type: 'error',
                  });
                }
              }
              next(false);
            });
          });
        }).catch((action) => {
          if (action === 'cancel') {
            next();
          } else {
            next(false);
          }
        });
      }
    }
  },
  data() {
    return {
      roles: [],
      isActive: true,
      id: null,
      targetPeriodOptions: [],
      origin: {},
      form: {
        id: '',
        name: '',
        snz_code: '',
        snz_schoolmanager_user_id: '',
        snz_org_name: '',
        organization_id: '',
        snz_area: '',
        snz_divisionnm: '',
        snz_headdivision: '',
        parentbusinessunitid: '',
        snz_graduation_grade: '',
        snz_calendar_pattern_id: '',
        snz_closing_month_period_id: '',
        snz_cooperationschoolcd: '',
        snz_crammanageschoolname: '',
        snz_targetperiod: '',
        snz_brand: '',
        create_date: '',
        update_date: '',
        created_by_user_id: '',
        creator: null,
        corrector: null,
        creator_proxy: null,
        corrector_proxy: null,
        status: 1,
        calendar_pattern: '',
        modified_by_user_id: '',
        create_user: null,
        edit_user: null,
      },
      optionBrand: options,
      optionGraduationGrade: '',
      statuss: [
        {
          value: 1,
          label: 'アクティブ',
        },
        {
          value: 0,
          label: '非アクティブ',
        },
      ],
      loadMore: {
        create_user_option: { query: null, page: 1 },
        edit_user_option: { query: null, page: 1 },
        create_on_be_haft_user_option: { query: null, page: 1 },
        edit_on_be_haft_user_option: { query: null, page: 1 },
      },
      saveLoading: false,
      loading: true,
      isError: false,
      areaLoading: true,
      orgLoading: true,
      unitLoading: true,
      divisionDisable: true,
      headdivisionDisable: true,
      areaDisable: true,
      orgDisable: true,
      unitDisable: true,
      focusDivision: false,
      deleting: false,
      optionGrades: [],
    };
  },
  computed: {
    isEditing: function(){
      return !!this.$route.params.id;
    },
    getStatus() {
      return this.statuss.filter(item => {
        if (typeof this.$route.params.id === 'undefined') {
          return item.value === 1;
        } else {
          return item;
        }
      });
    },
  },
  async created(){
    this.roles = this.$store.getters.roles;
    this.isDisabled();
    this.id = this.$route.params.id;
    if (this.id !== undefined) {
      await this.getData();
    }
    this.setOrigin();
    await this.getOptionGrade();
    this.loading = false;
  },
  methods: {
    async getCalendar() {
      this.handleChange('snz_calendar_pattern_id');
      this.form.snz_closing_month_period_id = '';
      this.$nextTick(() => {
        this.$refs.selectCloseMonth.init();
      });
    },
    getHeaddivision(){
      this.handleChange('parentbusinessunitid');
      this.setNullOrg();
      if (!this.form.parentbusinessunitid) {
        this.headdivisionDisable = true;
        this.divisionDisable = true;
        this.areaDisable = true;
        this.orgDisable = true;
      } else {
        this.$refs.selectHeaddivision.init();
        this.headdivisionDisable = false;
        this.divisionDisable = true;
        this.areaDisable = true;
        this.orgDisable = true;
      }
    },
    getDivision(){
      this.handleChange('snz_headdivision');
      this.form.snz_divisionnm = null;
      this.form.snz_area = null;
      this.form.organization_id = null;
      if (!this.form.snz_headdivision) {
        this.divisionDisable = true;
        this.areaDisable = true;
        this.orgDisable = true;
      } else {
        this.$refs.selectDivision.init();
        this.divisionDisable = false;
        this.areaDisable = true;
        this.orgDisable = true;
      }
    },
    async getArea(){
      this.handleChange('snz_divisionnm');
      this.areaLoading = true;
      this.unitDisable = true;
      this.form.snz_area = null;
      this.form.organization_id = null;
      if (!this.form.snz_divisionnm) {
        this.orgDisable = true;
        this.areaDisable = true;
      } else {
        await this.$refs.selectArea.init();
        this.areaLoading = false;
        this.areaDisable = false;
        this.orgDisable = true;
      }
    },
    async getOrg(){
      this.handleChange('snz_area');
      this.form.organization_id = null;
      if (!this.form.snz_area) {
        this.orgDisable = true;
      } else {
        await this.$refs.selectOrg.init();
        this.orgDisable = false;
      }
    },
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    async searchHeadDivision(query){
      const data = {
        snz_area_code: this.form.parentbusinessunitid,
        ...query,
      };
      return await businessResource.searchHeadDivisionName(data);
    },
    async searchDivision(query){
      const data = {
        snz_area_code: this.form.parentbusinessunitid,
        snz_headdivision_code: this.form.snz_headdivision,
        ...query,
      };
      return await businessResource.searchDivisionName(data);
    },
    async searchAreaName(query){
      return await businessResource.searchAreaName(query);
    },
    async searchArea(query){
      const data = {
        snz_area_code: this.form.parentbusinessunitid,
        snz_headdivision_code: this.form.snz_headdivision,
        snz_division_code: this.form.snz_divisionnm,
        ...query,
      };
      return await businessResource.searchAreaName(data);
    },
    async searchOrgName(query){
      const data = {
        snz_headdivision_code: this.form.snz_headdivision,
        snz_division_code: this.form.snz_divisionnm,
        snz_area_code: this.form.snz_area,
        ...query,
      };
      return await businessResource.searchOrgName(data);
    },
    async searchUnit(query){
      return await businessResource.searchUnitName(query);
    },
    async searchGraduationGrade(query){
      return await businessResource.searchGraduationGradeCode(query);
    },
    async searchCalendarPattern(query){
      return await calendarPatternRequest.searchName(query);
    },
    async searchNameTargetPeriod(query) {
      return await targetPeriodRequest.searchName(query);
    },
    async searchNameSystemUser(query){
      return systemUserRequest.searchName(query);
    },
    async getData() {
      const response = await schoolTestList.get(this.id);
      this.setData(response);
    },
    async getOptionGrade() {
      this.optionGrades = await gradeRequest.gradeOptions({
        select_add_id: [this.form.snz_graduation_grade],
      });
    },
    async searchUser(name, id, att) {
      if (name) {
        this.loadMore[att].query = name;
        this.loadMore[att].page = 1;
        const res = await userResource.searchName({ name: name, id: id });
        this.form[att] = res.data;
      }
    },
    async loadMoreUser(att) {
      if (this.loadMore[att].query && this.loadMore[att].page) {
        const res = await userResource.searchName({ name: this.loadMore[att].query, page: this.loadMore[att].page });
        this.form[att] = this.form[att].concat(res.data);
        if (res.current_page >= res.last_page) {
          this.loadMore[att].page = 0;
        }
      }
    },
    setData(schoolTestList){
      this.form.id = schoolTestList.id;
      this.form.name = schoolTestList.name;
      this.form.snz_code = schoolTestList.snz_code;
      this.form.snz_schoolmanager_user_id = schoolTestList.snz_schoolmanager_user_id;
      this.form.snz_headdivision = schoolTestList.snz_headdivision ? schoolTestList.snz_headdivision : '';
      this.form.snz_divisionnm = schoolTestList.snz_divisionnm ? schoolTestList.snz_divisionnm : '';
      this.form.snz_area = schoolTestList.snz_area ? schoolTestList.snz_area : '';
      this.form.parentbusinessunitid = schoolTestList.parentbusinessunitid;
      this.form.snz_brand = schoolTestList.snz_brand;
      this.form.snz_graduation_grade = schoolTestList.snz_graduation_grade;
      this.form.snz_unit = schoolTestList.organization ? schoolTestList.organization.snz_unit : '';
      this.form.snz_closing_month_period_id = schoolTestList.snz_closing_month_period_id;
      this.form.snz_calendar_pattern_id = schoolTestList.snz_calendar_pattern_id;
      this.form.snz_crammanageschoolname = schoolTestList.snz_crammanageschoolname;
      this.form.snz_cooperationschoolcd = schoolTestList.snz_cooperationschoolcd;
      this.form.created_by_user_id = schoolTestList.created_by_user_id;
      this.form.modified_by_user_id = schoolTestList.modified_by_user_id;
      this.form.organization_id = schoolTestList.organization_id;
      this.form.create_date = schoolTestList.created_at;
      this.form.update_date = schoolTestList.updated_at;
      this.form.creator = schoolTestList.creator;
      this.form.corrector = schoolTestList.corrector;
      this.form.creator_proxy = schoolTestList.creator_proxy;
      this.form.corrector_proxy = schoolTestList.corrector_proxy;
      this.form.status = schoolTestList.status;
      this.form.calendar_pattern = schoolTestList.calendar_pattern;
      this.form.create_user = schoolTestList.create_user;
      this.form.edit_user = schoolTestList.edit_user;
    },
    submitForm(formName){
      if (this.form.status === 0){
        this.handleDelete(true);
        return;
      }
      this.$refs.form.validate().then(async() => {
        this.saveLoading = true;
        if (this.isEditing){
          await this.update();
        } else {
          await this.create();
        }
        this.saveLoading = false;
      });
    },
    async create(){
      await schoolTestList.store(this.form)
        .then((res) => {
          if (res){
            this.isError = true;
            this.$message({
              type: 'success',
              message: '変更しました。',
            });
          }
          this.setOrigin();
          this.redirectPage({ name: 'EditBusiness', params: { id: res.id }});
        })
        .catch((err) => {
          if (err.response.status === 422) {
            this.isError = true;
            this.$refs.form.injectFormValidates(err.response);
            if (err.response.data.errors.id && !err.response.data.errors.snz_code){
              this.$message({
                message: err.response.data.errors.id[0],
                type: 'error',
              });
            }
          }
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    async update(){
      try {
        if (this.form.status === 0){
          // Delete
          this.handleDelete(true);
          return;
        }
        this.saveLoading = true;
        const res = await schoolTestList.update(this.form.id, this.form)
          .finally(() => {
            this.saveLoading = false;
          });
        if (res){
          this.isError = false;
          this.$message({
            type: 'success',
            message: '変更しました。',
          });
          await this.getData();
          this.setOrigin();
        }
      } catch (res) {
        if (res.response.status === 410) {
          this.isError = true;
          Message({
            message: this.CommonTxt.deleteNotPermission,
            type: 'error',
            duration: 1500,
          });
        }
        if (res.response.status === 422) {
          this.isError = true;
          this.$refs.form.injectFormValidates(res.response);
          if (res.response.data.errors.id && !res.response.data.errors.snz_code){
            this.$message({
              message: res.response.data.errors.id[0],
              type: 'error',
            });
          }
        }
      }
    },
    handleDelete(saveDelete = false){
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        if (saveDelete){
          this.saveLoading = true;
        } else {
          this.deleting = true;
        }
        schoolTestList.destroy(this.id).then(response => {
          Message({
            message: this.CommonTxt.deleteSuccess,
            type: 'success',
            duration: 1500,
          });
          const query = this.$route.params.query;
          this.redirectPage({ 'name': 'Business', params: { redirect: true }, query: query });
        }).catch(() => {
          Message({
            message: this.CommonTxt.deleteNotPermission,
            type: 'error',
            duration: 1500,
          });
        }).finally(() => {
          this.saveLoading = false;
          this.deleting = false;
        });
      });
    },
    isDisabled(){
      if (this.roles.find(e => e === 'system')) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
    },
    setOrigin(){
      this.origin = _.cloneDeep(this.form);
    },
    handleChange(prop) {
      this.$refs.form.clearValidate(prop);
    },
    setNullOrg() {
      this.form.snz_headdivision = null;
      this.form.snz_divisionnm = null;
      this.form.snz_area = null;
      this.form.organization_id = null;
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-popper{
  top: 30px !important;
}
/deep/ .el-scrollbar__view {
  height: 100%;
}
/deep/ .scroll-content{
  height: 100%;
}
/deep/ .el-tabs__content {
  height: calc(100% - 41px);

  .el-tab-pane {
    height: 100%;

    .scroll-content {
      height: 100%;
    }
  }
}
/deep/ .select-inside-table {
  width: 100%;

  .el-scrollbar__wrap {
    overflow: scroll !important;
  }
}

.app-container::v-deep{
  .header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;
    h2{
      font-size: 26px;
      font-weight: normal;
      color: #1A1714;
    }
    h4{
      font-size: 14px;
      font-weight: normal;
      color: #1A1714;
    }
  }
  .schooltest-detail {
    height: calc(100% - 75px);
    background-color: #ffffff;
    margin-top: 17px;
    h3{
      margin: 0px;
      font-size: 18px;
      font-weight: 500 !important;
      color: #1A1714;
      padding-bottom: 15px;
      padding-left: 30px;
      padding-top: 15px;
    }
    .line{
      background-color: #f0f0f0;
      height: 1px;
    }
    .card-body{
      .el-row{
        .el-form-item{
          margin-bottom: 13px;
        }
        &.bot{
          .el-form-item{
            margin-bottom: 20px !important;
          }
        }
      }
      .w-225{
        .el-form-item__content{
          width: 225px !important;
        }
      }
      .el-form-item__label{
        float: left;
        padding: 0 10px 0 0;
      }
      .el-form-item__content{
        margin-left: 0px !important;
        float: left;
      }
      .el-form-item{
        margin-bottom: 13px;
      }
      .el-form-item__content{
        width: 285px;
      }
      .el-form-item__error--inline {
        position: relative;
        top: auto;
        left: auto;
        display: table-cell;
        margin-left: 10px;
        line-height: 11px;
      }

    }
  }
  .footer{
    text-align: right;
    padding-top: 17px;
    background-color: #f0f0f0;
  }
}
</style>
