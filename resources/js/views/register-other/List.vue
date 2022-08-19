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
            <el-form-item label-width="37px" label="校舎">
              <SearchSelectBox
                v-model="searchForm.business_unit"
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
            <el-form-item label-width="37px" label="年度">
              <el-select
                v-model="searchForm.school_year"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                :clearable="false"
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
            <el-form-item label-width="50px" label="コース">
              <SearchSelectBox
                ref="searchCourse"
                v-model="searchForm.course"
                class="filterable-select"
                :search-function="searchCourse"
                key-name="snz_name"
                placeholder=""
                :append-query="{
                  business_id: searchForm.business_unit,
                  others_display_flag: 1,
                }"
                clearable
                @onDefault="changeCourse"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="37px" label="学年">
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
          <!-- STUDENT NAME -->
          <el-col :span="4">
            <el-form-item label-width="51px" label="生徒名">
              <el-input
                v-model="searchForm.student_name"
                maxlength="200"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="80px" label="生徒コード">
              <input-number
                v-model="searchForm.student_code"
                :maxlength="100"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="107px" label="生徒ステータス">
              <el-select
                v-model="searchForm.student_status"
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
            <el-form-item label-width="65px" label="受講登録">
              <el-select
                id="search_register_status"
                v-model="searchForm.register_status"
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
          <el-col :span="4" class="search-btn-col">
            <el-form-item label="">
              <span @click="handleSearch">
                <ButtonSearch />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div id="page-body" ref="pageBody" class="container page-body">
      <ListDatatable
        ref="datatable"
        :register-status-prop="searchForm.register_status"
        @setPage="searchForm.page = $event"
      />
    </div>
  </div>
</template>

<script>
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ListDatatable from './components/ListDatatable';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import BusinessUnitRequest from '@/api/BusinessUnitRequest';
import CourseRequest from '@/api/course';
import GradeRequest from '@/api/gradeRequest';
import InputNumber from '../../components/Common/InputNumber';
import { mapGetters } from 'vuex';
import dateMethod from '@/mixins/date';
import _ from 'lodash';
import CommonSettings from '@/const/CommonSettings';

const businessUnitRequest = new BusinessUnitRequest();
const courseRequest = new CourseRequest();
const gradeRequest = new GradeRequest();

export default {
  name: 'List',
  metaInfo: {
    title: 'その他',
  },
  components: { ListDatatable, ButtonSearch, SearchSelectBox, InputNumber },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      };
      return statusMap[status];
    },
  },
  mixins: [dateMethod],
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    this.$refs.datatable.beforeRouteLeave(to, from, next);
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      selectBox: {
        businessUnit: [],
        schoolYear: this.getSchoolYearOption(),
        course: [],
        grade: [],
        registerStatus: [
          {
            value: 0,
            label: '未登録',
          },
          {
            value: 1,
            label: '当日登録分',
          },
        ],
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
            value: 125950006,
            label: '休塾生',
          },
          {
            value: 125950005,
            label: '入会予定生',
          },
        ],
      },
      searchForm: {
        business_unit: null,
        school_year: this.getCurrentSchoolYear(),
        course: null,
        grade: null,
        student_name: null,
        student_code: null,
        student_status: [125950002],
        register_status: 0,
        page: 1,
      },
      formQuery: {
        business_unit: null,
        school_year: this.getCurrentSchoolYear(),
        course: null,
        grade: null,
        student_name: null,
        student_code: null,
        student_status: [125950002],
        register_status: 0,
        page: 1,
      },

      optionGrades: [],
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  async created() {
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.formQuery = this.copyAttributes(this.$route.query, this.formQuery);
    await this.getOptionGrade();
    this.searchForm.business_unit = this.currentBusiness[0]
      ? this.currentBusiness[0]?.id
      : null;
    await this.parseParamUrl();
    this.handleSearch();
  },
  methods: {
    parseParamUrl() {
      const grade = parseInt(this.$route.query.grade);
      if (!_.some(this.optionGrades, { id: grade })){
        delete this.searchForm.grade;
      }
      const query = this.buildQuery(this.$route.query || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
      if (_.isArray(this.searchForm.studentStatus)) {
        this.searchForm.student_status.map((item, index) => {
          this.searchForm.student_status[index] = parseInt(item);
        });
      } else {
        const temp = _.clone(this.searchForm.student_status);
        this.searchForm.student_status = [];
        this.searchForm.student_status.push(parseInt(temp));
      }
    },
    searchBusiness(query) {
      return businessUnitRequest.searchName(query);
    },
    changeCourse(value) {
      this.searchForm.course = value;
      this.handleSearch();
    },
    async searchCourse(query) {
      return courseRequest.searchName(query);
    },
    handleChangeBusiness() {
      this.searchForm.course = null;
      this.$nextTick(() => {
        this.$refs.searchCourse.init();
      });
    },
    handleSearch() {
      this.formQuery = JSON.parse(JSON.stringify(this.searchForm));
      this.formQuery.page = 1;
      this.$refs.datatable.getList(this.formQuery, true);
    },
    handleChangeRegisterStatus() {
      if (this.searchForm.register_status === 1) {
        this.searchForm.student_status = null;
        this.selectBox.studentStatus = [];
      } else {
        this.selectBox.studentStatus = [
          {
            value: 125950001,
            label: '体験生',
          },
          {
            value: 125950002,
            label: '内部生',
          },
          {
            value: 125950006,
            label: '休塾生',
          },
          {
            value: 125950005,
            label: '入会予定生',
          },
        ];
      }
      this.$refs.datatable.getList(this.searchForm);
    },
    async getOptionGrade() {
      this.optionGrades = await gradeRequest.gradeOptions();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/common-form.scss';
@import '@/styles/trial/common.scss';
@import './../register-trial/styles/index.scss';
#page-body {
  height: calc(100% - 278px);
}
.edit-input {
  padding-right: 100px;
}
/deep/ .el-card__body {
  padding-bottom: 0 !important;
}
/deep/ .search-container {
  //
}

.container {
  /deep/ div.statistics {
    span {
      font-size: 13px;
      padding-right: 25px;
      font-weight: 400;
    }
  }
}

/deep/ .paging {
  margin-top: 14px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.el-select {
  width: 174px;
  &.multiselect {
    width: unset !important;
    .el-input {
      width: auto;
    }
  }
}
</style>
