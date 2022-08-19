<template>
  <el-scrollbar class="scroll-content">
    <div class="app-container">
      <el-card shadow="false" class="rounded search-container">
        <el-form ref="searchForm" class="search" :model="searchForm" label-position="left">
          <el-row class="top" justify="space-around">
            <el-col :span="6">
              <el-form-item label-width="42px" label="校舎">
                <el-select
                  v-model="searchForm.businessUnit"
                  v-loadmore="loadmoreStudent"
                  class="filterable-select"
                  :search-function="searchBusiness"
                  filterable
                  remote
                  clearable
                  :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  placeholder=""
                >
                  <el-option
                    v-for="(item, index) in businessUnits"
                    :key="index"
                    class="medium-select__option"
                    :label="item"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="42px" label="学年">
                <el-select
                  v-model="searchForm.grade"
                  multiple
                  class="multiselect"
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                  placeholder=""
                >
                  <el-option
                    v-for="item in grades"
                    :key="item.id"
                    style="width: 237px;"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="112px" label="生徒ステータス">
                <el-select
                  v-model="searchForm.studentStatus"
                  multiple
                  class="multiselect"
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                  placeholder=""
                >
                  <el-option
                    v-for="(item, index) in studentStatuss"
                    :key="index"
                    :label="item"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="70px" label="生徒氏名">
                <el-input v-model="searchForm.fullname" maxlength="100" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="85px" label="生徒コード">
                <el-input v-model="searchForm.snz_studentcode" maxlength="100" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="bot" justify="space-between">
            <el-col :span="6">
              <el-form-item label-width="42px" label="年度">
                <el-select
                  v-model="searchForm.year"
                  clearable
                  :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  placeholder=""
                >
                  <el-option
                    v-for="item in years"
                    :key="item.value"
                    class="medium-select__option"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="42px" label="学期">
                <el-select
                  v-model="searchForm.schoolTestName"
                  clearable
                  :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  placeholder=""
                >
                  <el-option
                    v-for="(item, index) in schoolTestNames"
                    :key="index"
                    class="medium-select__option"
                    :label="item"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="70px" label="試験種類">
                <el-select
                  v-model="searchForm.schoolTestType"
                  clearable
                  :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  placeholder=""
                >
                  <el-option
                    v-for="(item, index) in schoolTestTypes"
                    :key="index"
                    class="medium-select__option"
                    :label="item"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="">
                <ButtonSearch @search="search" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div class="card-body__content">
        <el-table
          v-loading="listLoading"
          class="block-table"
          :data="list"
          fit
          highlight-current-row
          height="100%"
          :empty-text="CommonTxt.tableEmptyTxt"
        >
          <el-table-column fixed width="120px" label="氏名">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.student ? scope.row.student.fullname : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column width="90px" label="学年">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.grade ? scope.row.grade.snz_name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="87px" label="内部コード">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_internalcode }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="87px" label="生徒コード">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_studentcode }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="80px">
            <template slot="header">
              生徒<br>ステータス
            </template>
            <template slot-scope="scope">
              <span class="ellipsis">{{
                scope.row.snz_studentstatus ? studentStatuss[scope.row.snz_studentstatus] : ''
              }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="98px" label="学校名">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.school ? scope.row.school.snz_name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="50px" label="年度">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_year }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="60px" label="学期">
            <template slot-scope="scope">
              <span class="ellipsis">{{ schoolTestNames[scope.row.snz_schooltestname] }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="60px">
            <template slot="header">
              試験<br>種類
            </template>
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_schooltesttype | filterStudentTestType }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="37px" label="英">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 1) }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="37px" label="数">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 2) }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="37px" label="国">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 3) }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="37px" label="理">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 4) }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="37px" label="社">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 5) }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="130px" label="校舎">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.business ? scope.row.business.name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column width="80px" label="詳細">
            <template slot-scope="scope">
              <router-link
                class="list-detail-link"
                :to="{name:'confirm-school-test', params: { id: scope.row.id, query: paginateForm }}"
              >
                確認
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="div-button">
        <el-row class="footer__group">
          <el-col :span="6">
            <div />
          </el-col>
          <el-col :span="12">
            <CustomPagination
              v-show="total > searchForm.limit"
              :total="total"
              :page.sync="paginateForm.page"
              :limit.sync="paginateForm.limit"
              layout="prev, pager, next"
              prev-text="<"
              next-text=">"
              class="text-center custom-pagination"
              @pagination="func => getList(paginateForm)"
            />
          </el-col>
          <el-col :span="6">
            <div class="group-button">
              <ButtonExport :loading="exportLoading" type="excel" @export="handleExport" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import CustomPagination from '../../components/Common/Pagination/CustomPagination';
import role from '@/directive/role';
import CommonSettings from '@/const/CommonSettings';
import SchoolTestResultResource from '@/api/schoolTestResult';
import loadmore from '@/directive/selection';
import _ from 'lodash';
import GradeRequest from '@/api/gradeRequest';
import dateMethod from '@/mixins/date';
import studentStatus from '@/const/StudentStatus';
import filterOption from '@/filters/parseData';

const schoolResource = new SchoolTestResultResource();
const gradeRequest = new GradeRequest();
export default {
  name: 'List',
  directives: { loadmore },
  metaInfo: {
    title: '学校試験',
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { ButtonExport, ButtonSearch, CustomPagination, role },
  filters: {
    filterStudentTestType: value => {
      return filterOption(value, studentStatus.OPTION_SNZ_SCHOOLTESTTYPE);
    },
  },
  mixins: [dateMethod],
  data() {
    return {
      roles: [],
      list: [],
      total: 0,
      check: 0,
      height: '',
      listLoading: true,
      exportLoading: false,
      emptyText: 'データはありません。',
      defaultData: {
        studentStatus: ['125950006', '125950002'],
        grade: [11, 12, 13],
      },
      schoolTestNames: {},
      studentStatuss: {},
      schoolTestTypes: {},
      businessUnits: {},
      years: this.getSchoolYearOption(),
      grades: [],
      searchForm: {
        schoolTestName: '',
        studentStatus: [],
        schoolTestType: '',
        businessUnit: '',
        year: this.getCurrentSchoolYear(),
        grade: [],
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      paginateForm: {
        schoolTestName: '',
        studentStatus: [],
        schoolTestType: '',
        businessUnit: '',
        year: this.getCurrentSchoolYear(),
        grade: [],
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
    };
  },
  async created() {
    this.roles = this.$store.getters.roles;
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.paginateForm = this.copyAttributes(this.$route.query, this.paginateForm);
    const res = await schoolResource.fetchSchoolTestCommon();
    await this.setCommon(res.original);
    if (_.isEmpty(this.$route.query)) {
      await this.setDefaultSearch();
    } else {
      await this.setQuery();
    }
    this.getList();
  },
  methods: {
    async setQuery() {
      let queryForm = _.clone(this.searchForm);
      queryForm = this.copyAttributes(this.$route.query, queryForm);
      queryForm.year = queryForm.year ? queryForm.year : '';
      queryForm.grade = await this.covertArrStringToInt(queryForm.grade);
      queryForm.studentStatus = await this.covertArrIntToString(queryForm.studentStatus);
      const grade = queryForm.grade;
      queryForm.grade = _.map(_.filter(this.grades, function(item) {
        return grade.includes(parseInt(item.id));
      }), 'id');
      this.searchForm = queryForm;
      this.paginateForm = _.clone(this.searchForm);
    },
    async searchBusiness(query) {
      let businessResource;
      return await businessResource.searchName(query);
    },
    async setDefaultSearch() {
      const defaultGrades = this.defaultData.grade;
      this.searchForm.grade = _.map(_.filter(this.grades, function(item) {
        return defaultGrades.includes(parseInt(item.id));
      }), 'id');
      this.searchForm.studentStatus = this.defaultData.studentStatus;
    },
    async getList(forceQuery = null) {
      this.listLoading = true;
      const org_id = this.$store.getters.defaultOrg ? this.$store.getters.defaultOrg.id : '';
      const query = this.buildQuery(forceQuery || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      const res = await schoolResource.list({ org_id, ...this.query, ...forceQuery || this.searchForm });
      this.setData(res);
      this.scrollTopTable();
      this.listLoading = false;
    },
    setData(data) {
      this.list = data.data;
      this.total = data.total;
    },
    async setCommon(data) {
      this.schoolTestTypes = data.schoolTestType;
      this.schoolTestNames = data.schoolTestName;
      this.studentStatuss = data.studentStatus;
      this.businessUnits = data.businessUnits;
      this.grades = await gradeRequest.gradeOptions();
    },
    async search() {
      this.searchForm.page = 1;
      await this.getList();
      this.paginateForm = _.clone(this.searchForm);
    },
    getSubjectScore(schoolTestResuls, order) {
      if (schoolTestResuls.find(x => x.order === order)) {
        return schoolTestResuls.find(x => x.order === order).snz_subjectscore;
      } else {
        return '―';
      }
    },
    async handleExport() {
      this.exportLoading = true;
      await schoolResource.exportResource(this.paginateForm, 'xls').then(data => {
        this.createDownloadXlsFile('学校試験', data);
        this.exportLoading = false;
      });
    },
    async loadmoreStudent() {
      if (this.pageStudent) {
        this.pageStudent++;
        const res = await this.searchNameStudent({ fullname: this.queryStudent, page: this.pageStudent });
        this.studentOptions = this.studentOptions.concat(res.data);
        if (res.current_page >= res.last_page) {
          this.pageStudent = 0;
        }
      }
    },
    async searchStudents(query = null) {
      this.queryStudent = query;
      this.pageStudent = 1;
      const res = await this.searchNameStudent({ snz_internalcode: this.searchForm.studentCode, fullname: query });
      this.studentOptions = res.data;
      if (res.current_page >= res.last_page) {
        this.pageStudent = 0;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.main-container {
  background: #F0F0F0 !important;
}

/deep/ .search-container.el-card .el-col .el-form-item .el-input {
  width: 133px !important;
}

.edit-input {
  padding-right: 100px;
}

.multiselect.el-select {
  width: 128px !important;
}

/deep/ .el-card__body {
  padding-bottom: 0 !important;
}

.app-container {
  height: calc(100vh - 40px) !important;
}

/deep/ .search {
  .el-row {
    flex-wrap: wrap;

    label.el-form-item__label {
      padding-left: 0 !important;
      padding-right: 13px !important;
    }

    input.el-input__inner {
      &::placeholder {
        color: #1A1714;
      }
    }

    &.bot {
      .el-col-6:last-child {
        margin-right: 0px;
      }

      .multiselect {
        .el-tag {
          font-size: 15px;
          color: #1A1714;
        }

        .el-select__tags {
          flex-wrap: nowrap !important;
          overflow: hidden !important;
        }
      }

      .el-col:first-child {
        .multiselectstatus {
          color: #1A1714;

          .el-tag {
            font-size: 15px;
            color: #1A1714;
          }

          .el-select__tags {
            flex-wrap: nowrap !important;
            overflow: hidden !important;
          }
        }
      }

      .el-col:nth-child(4) {
        float: right;

        .el-form-item__content {
          text-align: right;
          width: 100%;
        }

        position: absolute;
        bottom: 0px;
        right: 0px;
      }

      .m-right {
        text-align: right;
      }
    }
  }

  .top {
    .el-form-item {
      margin-bottom: 17px;
    }
  }

  .bot {
    .el-form-item {
      margin-bottom: 20px;
    }
  }
}

.card-body__content::v-deep {
  margin-top: 26px;
  height: calc(100% - 235px);

  .block-table {
    table {
      th:nth-child(5) .cell {
        font-size: 9px;
      }

      th:nth-child(16) {
        text-align: center;
      }

      td:nth-child(16) {
        text-align: center;
      }

      thead {
        th {
          line-height: 0 !important;
        }
      }

      td {
        padding: 0px;
        margin: 0px;
        border-bottom: 1px solid #e5e5e5;
        height: 46.4px;
      }

      th:nth-child(9) .cell {
        font-size: 9px;
        margin-top: -3px;
        margin-left: 5px;
      }

      .cell {
        font: normal normal normal 14px Noto Sans JP;
        color: #1A1714;
        padding-right: 0px;
      }

      th:nth-child(1) {
        padding-left: 10px;
      }

      td:nth-child(1) {
        padding-left: 10px;
      }
    }
  }
}

.group-button {
  padding-top: 0;
}

.footer__group {
  margin-top: 15px !important;
}

/deep/ .paging {
  margin-top: 14px;
}
</style>
