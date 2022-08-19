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
                v-if="searchForm.business_unit"
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
                  course_type: 20,
                  seasonal_training: 1,
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
        @setCurrentPageRecord="currentPageRecord = $event"
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
import CommonSettings from '../../const/CommonSettings';
import { mapGetters } from 'vuex';
import dateMethod from '@/mixins/date';
import StudentStatus from '@/const/StudentStatus';
import _ from 'lodash';

const businessUnitRequest = new BusinessUnitRequest();
const courseRequest = new CourseRequest();
const gradeRequest = new GradeRequest();

export default {
  name: 'List',
  metaInfo: {
    title: '季節講習',
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
      currentPageRecord: CommonSettings.DEFAULT_PAGE_RECORD,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
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
            label: '登録済',
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
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        business_unit: null,
        school_year: this.getCurrentSchoolYear(),
        course: null,
        grade: null,
        student_name: null,
        student_code: null,
        student_status: [StudentStatus.INTERNAL_RAW],
        register_status: 0,
      },
      formQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        business_unit: null,
        school_year: this.getCurrentSchoolYear(),
        course: null,
        grade: null,
        student_name: null,
        student_code: null,
        student_status: [StudentStatus.INTERNAL_RAW],
        register_status: 0,
      },
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  async created() {
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.formQuery = this.copyAttributes(this.$route.query, this.formQuery);
    await this.setDefaultSearch();
    if (this.searchForm.business_unit === null) {
      this.searchForm.business_unit = this.currentBusiness[0]
        ? this.currentBusiness[0]?.id
        : null;
    }
    await this.searchGrade();
    if (!_.some(this.selectBox.grade, { id: this.formQuery.grade })){
      this.formQuery.grade = null;
      this.searchForm.grade = null;
    }
    this.formQuery = JSON.parse(JSON.stringify(this.searchForm));
    await this.$refs.datatable.getList(this.formQuery);
  },
  methods: {
    async setDefaultSearch() {
      if (_.isEmpty(this.$route.query)) {
        this.searchForm.student_status = this.covertArrStringToInt(
          this.searchForm.student_status
        );
        this.formQuery.student_status = this.covertArrStringToInt(
          this.formQuery.student_status
        );
      } else if (_.has(this.$route.query, 'student_status')) {
        this.searchForm.student_status = this.covertArrStringToInt(
          this.$route.query.student_status
        );
        this.formQuery.student_status = this.covertArrStringToInt(
          this.$route.query.student_status
        );
      } else {
        this.searchForm.student_status = [];
        this.formQuery.student_status = [];
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
      return await courseRequest.searchName(query);
    },
    handleChangeBusiness() {
      this.searchForm.course = null;
      this.$nextTick(() => {
        this.$refs.searchCourse.init();
      });
    },
    async searchGrade() {
      this.selectBox.grade = await gradeRequest.gradeOptions();
    },
    handleSearch() {
      this.formQuery = JSON.parse(JSON.stringify(this.searchForm));
      this.$refs.datatable.getList(this.formQuery);
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles/common-form.scss';
@import '@/styles/trial/common.scss';
@import './../register-trial/styles/index.scss';
.multiselect{
  width: 174px !important;
  padding-right: 10px;
}
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
</style>
