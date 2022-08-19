<template>
  <div class="app-container popper-container">
    <el-card shadow="false" class="rounded search-container popper">
      <el-form
        ref="searchForm"
        class="search"
        :model="searchForm"
        label-position="left"
      >
        <el-row class="top" justify="space-around">
          <el-col :span="6">
            <el-form-item label-width="39px" label="校舎">
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
          <el-col :span="6">
            <el-form-item label-width="39px" label="年度">
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
          <el-col :span="6">
            <el-form-item label-width="52px" label="コース">
              <SearchSelectBox
                ref="searchCourse"
                v-model="searchForm.course"
                class="filterable-select"
                :search-function="searchCourse"
                key-name="snz_name"
                placeholder=""
                :append-query="{
                  display_screen: 'register-school',
                  business_id: searchForm.businessUnit,
                  course_type: 10,
                  direct_display_flag: 1,
                  with_calendar: 1,
                }"
                clearable
                @onDefault="changeCourse"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="39px" label="学年">
              <el-select
                v-model="searchForm.grade"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                width="174px"
                class="filterable-select"
              >
                <el-option
                  v-for="item in optionGrades"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="bot" justify="space-between">
          <el-col :span="4">
            <el-form-item label-width="52px" label="生徒名">
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
          <el-col :span="4">
            <el-form-item label-width="66px" label="入会登録">
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
          <el-col :span="4">
            <el-form-item class="search-button">
              <ButtonSearch @search="doSearch" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <RegistrationDatatable
      ref="listDatatableElement"
      :register-status-prop="searchForm.registerStatus"
      :params-search="buildParamRequest()"
      :export-loading="exportLoading"
      @setPage="searchForm.page = $event"
      @handleExport="handleExport"
    />
  </div>
</template>

<script>
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import BusinessUnitRequest from '@/api/BusinessUnitRequest';
import CourseRequest from '@/api/CourseRequest';
import GradeRequest from '@/api/gradeRequest';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import { mapGetters } from 'vuex';
import RegistrationDatatable from './components/RegistrationDatatable';
import { filterOptions } from '@/helpers/mixins/FilterSelect';
import { ExportMixin } from './mixins/Export';
import InputNumber from '@/components/Common/InputNumber';
import dateMethod from '@/mixins/date';
import _ from 'lodash';

const businessUnitRequest = new BusinessUnitRequest();
const courseRequest = new CourseRequest();
const gradeRequest = new GradeRequest();

export default {
  name: 'Registration',
  metaInfo: {
    title: '直入会',
  },
  components: {
    ButtonSearch,
    SearchSelectBox,
    RegistrationDatatable,
    InputNumber,
  },
  filters: {},
  mixins: [ExportMixin, dateMethod],
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    this.$refs.listDatatableElement.beforeRouteLeave(to, from, next);
  },
  data() {
    return {
      exportLoading: false,
      selectBox: {
        schoolYear: this.getSchoolYearOption(),
        course: [],
        grade: [],
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
        studentStatus: [
          {
            value: 125950000,
            label: '問合せ',
          },
          {
            value: 125950003,
            label: 'メイト生',
          },
          {
            value: 125950004,
            label: '完了',
          },
          {
            value: 125950007,
            label: '退塾生',
          },
        ],
      },
      searchForm: {
        businessUnit: null,
        schoolYear: this.getCurrentSchoolYear(),
        course: null,
        grade: null,
        studentName: null,
        studentCode: null,
        registerStatus: 0,
        studentStatus: [125950003],
        page: 1,
      },
      optionGrades: [],
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  async created() {
    await this.getOptionGrade();
    this.searchForm.businessUnit = this.currentBusiness[0]
      ? this.currentBusiness[0]?.id
      : null;
    await this.parseParamUrl();
    this.$nextTick(() => {
      this.$refs.searchCourse.init();
    });
    await this.handleSearch();
  },
  methods: {
    parseParamUrl() {
      const queryCamelCase = _.mapKeys(this.$route.query, (value, key) =>
        _.camelCase(key)
      );
      const grade = parseInt(queryCamelCase.grade);
      if (!_.some(this.optionGrades, { id: grade })) {
        queryCamelCase.grade = null;
      }
      if (queryCamelCase.page) {
        queryCamelCase.page = this.searchForm.page;
      }
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
      if (this.searchForm.registerStatus !== 0) {
        this.searchForm.studentStatus = [];
        this.selectBox.studentStatus = [];
      }
    },
    filterOptions,
    // async searchGrade(query) {
    //   return await gradeRequest.gradeSearchName(query);
    // },
    async searchCourse(query) {
      return await courseRequest.searchName(query);
    },
    async handleChangeBusiness() {
      this.searchForm.course = null;
      this.$nextTick(() => {
        this.$refs.searchCourse.init();
      });
    },
    changeCourse(value) {
      this.searchForm.course = value;
      this.handleSearch();
    },
    async searchBusiness(query) {
      return businessUnitRequest.searchName(query);
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
    handleChangeRegisterStatus() {
      if (this.searchForm.registerStatus === 0) {
        this.selectBox.studentStatus = [
          {
            value: 125950000,
            label: '問合せ',
          },
          {
            value: 125950003,
            label: 'メイト生',
          },
          {
            value: 125950004,
            label: '完了',
          },
          {
            value: 125950007,
            label: '退塾生',
          },
        ];
      } else {
        this.searchForm.studentStatus = [];
        this.selectBox.studentStatus = [];
      }
      this.handleSearch();
    },
    async handleSearch() {
      await this.$refs.listDatatableElement.getList(
        _.assign(
          {
            page: 1,
          },
          this.buildParamRequest()
        )
      );
    },
    async doSearch() {
      this.searchForm.page = 1;
      await this.$refs.listDatatableElement.getList(this.buildParamRequest());
    },
    async getOptionGrade() {
      this.optionGrades = await gradeRequest.gradeOptions();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/common-form.scss';
@import './styles/index.scss';
.search-button {
  margin-top: -8px;
  position: absolute;
  right: 20px;
}
/deep/ .el-card__body {
  padding-bottom: 20px !important;
}
/deep/.page-body {
  form {
    height: calc(100% - 100px) !important;
  }
}
.multiselect {
  width: 174px !important;
}
</style>
