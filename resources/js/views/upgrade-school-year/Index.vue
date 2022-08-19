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
          <el-col :span="5">
            <el-form-item label-width="38px" label="校舎">
              <SearchSelectBox
                v-model="searchForm.businessUnit"
                :search-function="searchBusiness"
                width="174px"
                key-name="name"
                placeholder=""
                class="filterable-select"
                :clearable="true"
                @onChange="handleChangeBusiness"
              />
            </el-form-item>
          </el-col>
          <!-- END BUSINESS UNIT -->
          <!-- GRADE -->
          <el-col :span="5">
            <el-form-item label-width="38px" label="学年">
              <el-select
                v-model="searchForm.grade"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
              >
                <el-option
                  v-for="item in selectBox.grade"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- GRADE -->
          <!-- SCHOOL YEAR -->
          <el-col :span="5">
            <el-form-item label-width="37px" label="年度">
              <el-select
                v-model="searchForm.schoolYear"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
              >
                <el-option
                  v-for="item in selectBox.schoolYear"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END SCHOOL YEAR -->
          <!-- COURSE -->
          <el-col :span="5">
            <el-form-item label-width="47px" label="コース">
              <SearchSelectBox
                ref="searchCourse"
                v-model="searchForm.course"
                class="filterable-select"
                :search-function="searchCourse"
                key-name="snz_name"
                placeholder=""
                :append-query="{
                  display_screen: 'upgrade-school_year',
                  business_id: searchForm.businessUnit,
                  direct_display_flag: 1,
                  with_calendar: 1,
                }"
                clearable
                @onDefault="changeCourse"
              />
            </el-form-item>
          </el-col>
          <!-- END COURSE -->
          <!-- UPDATE STATUS -->
          <el-col :span="4">
            <el-form-item label-width="97px" label="年次更新状況">
              <el-select
                v-model="searchForm.updateStatus"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
              >
                <el-option
                  v-for="item in selectBox.updateStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END UPDATE STATUS -->
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
          <!-- STUDENT STATUS -->
          <el-col :span="6">
            <el-form-item label-width="110px" label="生徒ステータス">
              <el-select
                v-model="searchForm.studentStatus"
                placeholder=""
                multiple
                class="multiselect"
                value-key="value"
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
              >
                <el-option
                  v-for="item in selectBox.studentStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END STUDENT STATUS -->
          <!-- BUTTON SEARCH -->
          <el-col :span="6" class="search-btn-col">
            <el-form-item label="">
              <span @click="handleSearch">
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
        :school-year-prop="searchForm.schoolYear"
        :export-loading="exportLoading"
        :params-search="buildParamRequest()"
        @handleExport="handleExport"
        @setCurrentPageRecord="currentPageRecord = $event"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ListDatatable from './components/ListDatatable';
import InputNumber from '../../components/Common/InputNumber';
import SearchSelectBox from '@/components/Common/SearchSelectBox';

import Contact from '@/const/Contact';

import { FetchMixin } from './mixins/index/Fetch';
import { HandleChangeMixin } from './mixins/index/HandleChange';
import { SearchMixin } from './mixins/index/Search';
import { ExportMixin } from './mixins/index/Export';
import CommonSettings from '../../const/CommonSettings';
import DateMethod from '@/mixins/date';
import moment from 'moment';

export default {
  name: 'List',
  metaInfo: {
    title: '更新有無',
  },
  components: {
    InputNumber,
    ListDatatable,
    ButtonSearch,
    SearchSelectBox,
  },
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
      currentPageRecord: CommonSettings.POPPER_MAX_RECORD,
      selectBox: {
        businessUnit: [],
        grade: [],
        updateStatus: Contact.OPTION_UPDATE_STATUS,
        schoolYear: this.getSchoolYearOption(),
        course: [],
        studentStatus: [
          {
            value: 125950001,
            label: '体験生',
          },
          {
            value: 125950002,
            label: '内部生',
          },
          {
            value: 125950005,
            label: '入会予定生',
          },
          {
            value: 125950006,
            label: '休塾生',
          },
        ],
      },
      searchForm: {
        businessUnit: null,
        grade: null,
        updateStatus: null,
        // schoolYear: this.getCurrentSchoolYear(),
        schoolYear: parseInt(moment().format('YYYY')),
        course: null,
        studentName: null,
        studentCode: null,
        studentStatus: [125950002], // Default là nội bộ
      },
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  created() {
    //
  },
  mounted() {
    // this.searchForm.businessUnit = this.currentBusiness[0]
    //   ? this.currentBusiness[0]?.id
    //   : null;
    this.parseParamUrl();
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
      if (_.isArray(this.searchForm.studentStatus)) {
        this.searchForm.studentStatus.map((item, index) => {
          this.searchForm.studentStatus[index] = parseInt(item);
        });
      } else {
        const temp = _.clone(this.searchForm.studentStatus);
        this.searchForm.studentStatus = [];
        this.searchForm.studentStatus.push(parseInt(temp));
      }
    },
    buildParamRequest() {
      const paramReq = {
        business_unit: this.searchForm.businessUnit,
        grade: this.searchForm.grade,
        course: this.searchForm.course,
        update_status: this.searchForm.updateStatus,
        school_year: this.searchForm.schoolYear,
        student_name: this.searchForm.studentName,
        student_code: this.searchForm.studentCode,
        student_status: this.searchForm.studentStatus,
      };
      return paramReq;
    },
    getSchoolYearOption() {
      const year = this.getCurrentSchoolYear();
      return [
        {
          label: `${year} 年度`,
          value: year,
        },
        {
          label: `${year + 1} 年度`,
          value: year + 1,
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/common-form.scss';
@import './styles/index.scss';
</style>
