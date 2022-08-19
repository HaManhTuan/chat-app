<template>
  <div
    :class="{
      'app-container': true,
      'popper-container': currentPageRecord > popperMaxRecord,
    }"
  >
    <el-card
      shadow="false"
      :class="{
        rounded: true,
        'search-container': true,
        popper: currentPageRecord > popperMaxRecord,
      }"
    >
      <el-form
        ref="searchForm"
        class="search"
        :model="searchForm"
        label-position="left"
      >
        <el-row class="top" justify="space-around">
          <!-- BUSINESS UNIT -->
          <el-col :span="6">
            <el-form-item label-width="38px" label="校舎">
              <SearchSelectBox
                v-if="searchForm.businessUnit"
                v-model="searchForm.businessUnit"
                :search-function="searchBusiness"
                width="174px"
                key-name="name"
                placeholder=""
                class="filterable-select"
                :clearable="false"
                @onChange="handleChangeBusiness"
              />
            </el-form-item>
          </el-col>
          <!-- END BUSINESS UNIT -->
          <!-- SCHOOL YEAR -->
          <el-col :span="6">
            <el-form-item label-width="37px" label="年度">
              <el-select
                v-model="searchForm.schoolYear"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
              >
                <el-option
                  v-for="(item, index) in selectBox.schoolYear"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END SCHOOL YEAR -->
          <!-- EXPERIENCE COUSE -->
          <el-col :span="6">
            <el-form-item label-width="108px" label="入会時のコース">
              <el-select
                v-model="searchForm.experienceCourseId"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
              >
                <el-option
                  v-for="(item, index) in selectBox.experience_course"
                  :key="index"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END EXPERIENCE COUSE -->
          <!-- GRDADE -->
          <el-col :span="6">
            <el-form-item label-width="38px" label="学年">
              <el-select
                v-model="searchForm.grade"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                filterable
                clearable
              >
                <el-option
                  v-for="(item, index) in selectBox.grade"
                  :key="index"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END GRADE -->
        </el-row>
        <el-row class="bot" justify="space-between">
          <!-- STUDENT NAME -->
          <el-col :span="6">
            <el-form-item label-width="52px" label="生徒名">
              <el-input
                v-model="searchForm.studentName"
                maxlength="200"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <!-- END STUDENT NAME -->
          <!-- STUDENT CODE -->
          <el-col :span="6">
            <el-form-item label-width="81px" label="生徒コード">
              <input-number
                v-model="searchForm.studentCode"
                :maxlength="100"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <!-- END STUDENT CODE -->
          <!-- REGISTER STATUS -->
          <el-col :span="6">
            <el-form-item label-width="67px" label="入会登録">
              <el-select
                v-model="searchForm.registerStatus"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                @change="handleChangeRegisterStatus"
              >
                <el-option
                  v-for="(item, index) in selectBox.register_status"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END REGISTER STATUS -->
          <!-- EXPERIENCE START MONTH -->
          <el-col :span="6">
            <el-form-item label-width="81px" label="体験開始月">
              <el-select
                v-model="searchForm.experienceStartMonth"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                filterable
                clearable
              >
                <el-option
                  v-for="item in selectBox.experience_start_month"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END EXPERIENCE START MONTH -->
          <!-- BUTTON SEARCH -->
          <el-col :span="6" class="search-btn-col">
            <el-form-item label="">
              <span @click="doSearch">
                <ButtonSearch />
              </span>
            </el-form-item>
          </el-col>
          <!-- END BUTTON SEARCH -->
        </el-row>
      </el-form>
    </el-card>

    <div class="container">
      <ListDatatable
        ref="listDatatableElement"
        :register-status-prop="searchForm.registerStatus"
        :school-year-prop="searchForm.schoolYear"
        :export-loading="exportLoading"
        :params-search="buildParamRequest()"
        :course-search-id="searchForm.experienceCourseId"
        :course-search-select-box="selectBox.experience_course"
        @setPage="searchForm.page = $event"
        @handleExport="handleExport"
        @setCurrentPageRecord="currentPageRecord = $event"
      />
    </div>
  </div>
</template>

<script>
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ListDatatable from './components/ListDatatable';

import SearchSelectBox from '@/components/Common/SearchSelectBox';
import { mapGetters } from 'vuex';

import { FetchMixin } from './mixins/index/Fetch';
import { HandleChangeMixin } from './mixins/index/HandleChange';
import { SearchMixin } from './mixins/index/Search';
import { ExportMixin } from './mixins/index/Export';
import InputNumber from '../../components/Common/InputNumber';
import CommonSettings from '../../const/CommonSettings';
import DateMethod from '@/mixins/date';

export default {
  name: 'List',
  metaInfo: {
    title: '体験結果更新',
  },
  components: { InputNumber, ListDatatable, ButtonSearch, SearchSelectBox },
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    this.$refs.listDatatableElement.beforeRouteLeave(to, from, next);
  },
  mixins: [FetchMixin, HandleChangeMixin, SearchMixin, ExportMixin, DateMethod],
  data() {
    return {
      exportLoading: false,
      currentPageRecord: CommonSettings.DEFAULT_PAGE_RECORD,
      selectBox: {
        currentPageRecord: CommonSettings.DEFAULT_PAGE_RECORD,
        businessUnit: [],
        schoolYear: this.getSchoolYearOption(),
        experience_course: [],
        grade: [],
        register_status: [
          {
            value: 0,
            label: '未登録', // Chưa đăng ký
          },
          {
            value: 1,
            label: '当日登録分', // Đăng ký trong ngày
          },
        ],
        experience_start_month: [],
        student_status: [
          {
            value: 125950001,
            label: '体験生',
          },
        ],
      },
      //
      searchForm: {
        businessUnit: null,
        year: this.getCurrentSchoolYear(),
        schoolYear: this.getCurrentSchoolYear(),
        experienceCourseId: null,
        grade: null,
        studentName: null,
        studentCode: null,
        registerStatus: 0, // Đăng ký nhập học
        experienceStartMonth: null,
        studentStatus: 125950001,
        page: 1,
      },
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  created() {
    this.fetchCourseAnnualAndShortTerm();
    this.fetchTargetPeriodByListOwnerBusinessUnit();
  },
  mounted() {
    this.searchForm.businessUnit = this.currentBusiness[0]
      ? this.currentBusiness[0]?.id
      : null;
    this.parseParamUrl();
    this.fetchCourseAnnualAndShortTermByBusinessId(
      this.searchForm.businessUnit
    );
    this.fetchTargetPeriodByBusinessId(this.searchForm.businessUnit);
    this.handleSearch();
  },
  methods: {
    parseParamUrl() {
      const queryCamelCase = _.mapKeys(this.$route.query, (value, key) =>
        _.camelCase(key)
      );
      const query = this.buildQuery(queryCamelCase || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      this.searchForm = this.copyAttributes(queryCamelCase, this.searchForm);
      this.fetchGrade();
    },
    buildParamRequest() {
      const paramReq = {
        business_unit: this.searchForm.businessUnit,
        school_year: this.searchForm.schoolYear,
        experience_course_id: this.searchForm.experienceCourseId,
        grade: this.searchForm.grade,
        student_name: this.searchForm.studentName,
        student_code: this.searchForm.studentCode,
        register_status: this.searchForm.registerStatus,
        experience_start_month: this.searchForm.experienceStartMonth,
        page: this.searchForm.page,
        // student_status: this.searchForm.studentStatus,
      };
      return paramReq;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/common-form.scss';
@import './styles/index.scss';
</style>
