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
            <el-form-item label-width="37px" label="校舎">
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
          <!-- YEAR -->
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
          <!-- END YEAR -->
          <!-- COURSE -->
          <el-col :span="6">
            <el-form-item label-width="50px" label="コース">
              <el-select
                v-model="searchForm.course"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
              >
                <el-option
                  v-for="(item, index) in selectBox.course"
                  :key="index"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END COURSE -->
          <!-- GRADE -->
          <el-col :span="6">
            <el-form-item label-width="37px" label="学年">
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
          <el-col :span="4">
            <el-form-item label-width="51px" label="生徒名">
              <el-input
                v-model="searchForm.studentName"
                maxlength="200"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80px" label="生徒コード">
              <input-number
                v-model="searchForm.studentCode"
                :maxlength="100"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <!-- END STUDENT NAME -->
          <!-- STUDENT STATUS -->
          <el-col :span="4">
            <el-form-item label-width="107px" label="生徒ステータス">
              <el-select
                v-model="searchForm.studentStatus"
                multiple
                class="multiselect"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
              >
                <el-option
                  v-for="(item, index) in selectBox.studentStatus"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END STUDENT STATUS -->
          <!-- REGISTER STATUS -->
          <el-col :span="4">
            <el-form-item label-width="65px" label="入会登録">
              <el-select
                id="search_register_status"
                v-model="searchForm.registerStatus"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                @change="handleChangeRegisterStatus"
              >
                <el-option
                  v-for="(item, index) in selectBox.registerStatus"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END REGISTER STATUS -->
          <el-col :span="4" class="search-btn-col">
            <el-form-item label="">
              <span @click="doSearch">
                <ButtonSearch />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <ListDatatable
      ref="listDatatableElement"
      :register-status-prop="searchForm.registerStatus"
      :params-search="buildParamRequest()"
      :export-loading="exportLoading"
      @setPage="searchForm.page = $event"
      @handleExport="handleExport"
      @setCurrentPageRecord="currentPageRecord = $event"
    />
  </div>
</template>

<script>
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ListDatatable from './components/ListDatatable';

import StudentStatus from '@/const/StudentStatus';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import { mapGetters } from 'vuex';

import { FetchMixin } from './mixins/index/Fetch';
import { HandleChangeMixin } from './mixins/index/HandleChange';
import { SearchMixin } from './mixins/index/Search';
import { ExportMixin } from './mixins/index/Export';
import InputNumber from '../../components/Common/InputNumber';
import CommonSettings from '@/const/CommonSettings';
import DateMethod from '@/mixins/date';

export default {
  name: 'List',
  metaInfo: {
    title: '体験登録',
  },
  components: { InputNumber, ListDatatable, ButtonSearch, SearchSelectBox },
  filters: {
    getStatusLabel(status) {
      const stt = _.filter(
        StudentStatus.OPTION_SNZ_STUDENTSTATUS,
        item => item.value === status
      );
      return stt[0].label;
    },
  },
  mixins: [FetchMixin, HandleChangeMixin, SearchMixin, ExportMixin, DateMethod],
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    this.$refs.listDatatableElement.beforeRouteLeave(to, from, next);
  },
  data() {
    return {
      exportLoading: false,
      currentPageRecord: CommonSettings.DEFAULT_PAGE_RECORD,
      selectBox: {
        businessUnit: [],
        schoolYear: this.getSchoolYearOption(),
        experience_course: [],
        course: [],
        grade: [],
        studentStatus: [
          {
            value: 125950000,
            label: '問合せ', // contact
          },
          {
            value: 125950001,
            label: '体験生', // học thử
          },
          {
            value: 125950003,
            label: 'メイト生', // mate
          },
          {
            value: 125950004,
            label: '完了', // hoàn thành
          },
          {
            value: 125950007,
            label: '退塾生', // thôi học
          },
        ],
        registerStatus: [
          {
            value: 0,
            label: '未登録', // Chưa đăng ký
          },
          {
            value: 1,
            label: '当日登録分', // Đăng ký trong ngày
          },
        ],
      },
      //
      searchForm: {
        businessUnit: null,
        schoolYear: this.getCurrentSchoolYear(),
        course: null,
        grade: null,
        studentName: null,
        studentCode: null,
        studentStatus: [125950000],
        registerStatus: 0,
        page: 1,
      },
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  created() {
    this.fetchCourse();
  },
  mounted() {
    this.searchForm.businessUnit = this.currentBusiness[0]
      ? this.currentBusiness[0]?.id
      : null;
    this.parseParamUrl();
    this.fetchCourseByBusinessUnit(this.searchForm.businessUnit);
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
      if (_.isArray(this.searchForm.studentStatus)) {
        this.searchForm.studentStatus.map((item, index) => {
          this.searchForm.studentStatus[index] = parseInt(item);
        });
      } else {
        const temp = _.clone(this.searchForm.studentStatus);
        this.searchForm.studentStatus = [];
        this.searchForm.studentStatus.push(parseInt(temp));
      }
      this.fetchGrade();
    },
    buildParamRequest() {
      return {
        business_unit: this.searchForm.businessUnit,
        school_year: this.searchForm.schoolYear,
        course: this.searchForm.course,
        grade: this.searchForm.grade,
        student_name: this.searchForm.studentName,
        student_code: this.searchForm.studentCode,
        student_status: this.searchForm.studentStatus,
        register_status: this.searchForm.registerStatus,
        page: this.searchForm.page,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/common-form.scss';
@import './styles/index.scss';
.multiselect {
  width: 100% !important;
}
</style>
