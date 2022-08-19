<template>
  <div id="app-container" class="app-container">
    <el-card shadow="false" class="rounded search-container">
      <el-form ref="searchForm" class="search" :model="searchForm" label-position="left">
        <el-row class="top" justify="space-around">
          <!-- Business -->
          <el-col :span="6">
            <el-form-item label-width="41px" label="校舎">
              <SearchSelectBox
                v-model="searchForm.businessunit"
                :search-function="searchBusiness"
                width="174px"
                key-name="name"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="41px" label="学年">
              <el-select
                v-model="searchForm.grades"
                placeholder=""
                class="multiselect"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                multiple
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
          <el-col :span="6">
            <el-form-item label-width="113px" label="生徒ステータス">
              <el-select
                v-model="searchForm.studentStatus"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                value-key="value"
                multiple
                class="multiselect"
                placeholder=""
              >
                <el-option
                  v-for="item in studentStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="69px" label="生徒氏名">
              <el-input v-model="searchForm.fullname" maxlength="100" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="82px" label="生徒コード">
              <el-input v-model="searchForm.snz_studentcode" maxlength="100" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="bot" justify="space-between">
          <!-- Nam hoc -->
          <el-col :span="6">
            <el-form-item label-width="40px" label="年度">
              <el-select
                v-model="searchForm.year"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                value-key="value"
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
          <!-- SEMESTER -->
          <el-col :span="6">
            <el-form-item label-width="40px" label="学期">
              <el-select
                v-model="searchForm.semester"
                clearable
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder=""
              >
                <el-option
                  v-for="item in semesters"
                  :key="item.value"
                  class="medium-select__option"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" class="search-btn-col">
            <el-form-item label="">
              <ButtonSearch @search="submitSearch" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div id="page-body" ref="pageBody" class="container page-body">
      <el-table
        v-loading="listLoading"
        class="block-table"
        :data="list"
        fit
        height="100%"
        highlight-current-row
        :empty-text="CommonTxt.tableEmptyTxt"
      >
        <!-- Full name -->
        <el-table-column label="氏名" fixed width="134px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student ? scope.row.student.fullname : '' }}</span>
          </template>
        </el-table-column>
        <!-- sGRADE -->
        <el-table-column label="学年" width="102px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade ? scope.row.grade.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <!-- internal code -->
        <el-table-column label="内部コード" min-width="97px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_internalcode ? scope.row.snz_internalcode : '' }}</span>
          </template>
        </el-table-column>
        <!-- student code -->
        <el-table-column label="生徒コード" min-width="92px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_studentcode ? scope.row.snz_studentcode : '' }}</span>
          </template>
        </el-table-column>
        <!-- student status -->
        <el-table-column min-width="67px">
          <template slot="header">
            生徒<br>ステータス
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.snz_studentstatus | getStatusLabel }}</span>
          </template>
        </el-table-column>
        <!-- school name -->
        <el-table-column label="学校名" min-width="102px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.school ? scope.row.school.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <!-- year -->
        <el-table-column label="年度" min-width="66px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_year }}</span>
          </template>
        </el-table-column>
        <!-- semester -->
        <el-table-column label="学期" min-width="60px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_schoolscorename | getSemesterLabel }}</span>
          </template>
        </el-table-column>
        <!-- English -->
        <el-table-column label="英" min-width="42px">
          <template slot-scope="scope">
            {{ scope.row.school_score_results_limit | getScore(1) }}
          </template>
        </el-table-column>
        <!-- Toan hoc -->
        <el-table-column label="数" min-width="42px">
          <template slot-scope="scope">
            {{ scope.row.school_score_results_limit | getScore(2) }}
          </template>
        </el-table-column>
        <!-- ngu phap -->
        <el-table-column label="国" min-width="42px">
          <template slot-scope="scope">
            {{ scope.row.school_score_results_limit | getScore(3) }}
          </template>
        </el-table-column>
        <!-- ngu phap -->
        <el-table-column label="理" min-width="42px">
          <template slot-scope="scope">
            {{ scope.row.school_score_results_limit | getScore(4) }}
          </template>
        </el-table-column>
        <!-- ngu phap -->
        <el-table-column label="社" min-width="42px">
          <template slot-scope="scope">
            {{ scope.row.school_score_results_limit | getScore(5) }}
          </template>
        </el-table-column>
        <!-- ngu phap -->
        <el-table-column label="保" min-width="42px">
          <template slot-scope="scope">
            {{ scope.row.school_score_results_limit | getScore(6) }}
          </template>
        </el-table-column>
        <!-- my thuat -->
        <el-table-column label="美" min-width="42px">
          <template slot-scope="scope">
            {{ scope.row.school_score_results_limit | getScore(7) }}
          </template>
        </el-table-column>
        <!-- ky thuat -->
        <el-table-column label="技" min-width="42px">
          <template slot-scope="scope">
            {{ scope.row.school_score_results_limit | getScore(8) }}
          </template>
        </el-table-column>
        <!-- music -->
        <el-table-column label="音" min-width="37px">
          <template slot-scope="scope">
            {{ scope.row.school_score_results_limit | getScore(9) }}
          </template>
        </el-table-column>
        <!-- business unit name -->
        <el-table-column label="校舎" min-width="123px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.business ? scope.row.business.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="詳細" fixed="right" width="73px" class="text-center">
          <template slot-scope="scope">
            <router-link :to="{name: 'student_record_detail', params: {id: scope.row.id, query: paginateForm}}">
              確認
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="div-button">
      <el-row class="footer__group el-row">
        <el-col :span="6" />
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
</template>

<script>
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import CustomPagination from '../../components/Common/Pagination/CustomPagination';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import StudentRecordRequest from '@/api/studentRecordRequest';
import CommonSettings from '@/const/CommonSettings';
import StudentStatus from '@/const/StudentStatus';
import GradeRequest from '../../api/gradeRequest';
import BusinessUnitRequest from '../../api/BusinessUnitRequest';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import loadmore from '@/directive/selection';

import { mapGetters } from 'vuex';
import _ from 'lodash';
import dateMethod from '@/mixins/date';

const studentRecord = new StudentRecordRequest();
const businessResource = new BusinessUnitRequest();
const gradeRequest = new GradeRequest();
export default {
  name: 'Index',
  metaInfo: {
    title: '学校内申',
  },
  directives: { loadmore },
  components: { ButtonExport, CustomPagination, ButtonSearch, SearchSelectBox },
  filters: {
    getStatusLabel(status) {
      const stt = _.filter(StudentStatus.OPTION_SNZ_STUDENTSTATUS, function(item) {
        return item.value === status;
      });
      return stt[0].label;
    },
    getScore(row, index) {
      if (row.length > 0) {
        const t = _.find(row, (item) => {
          return item.order === index;
        });
        if (typeof t === 'object') {
          return t.snz_subjectscore;
        }
        return '―';
      }
      return '―';
    },
    getSemesterLabel(semester) {
      const stt = _.filter(StudentStatus.OPTION_SEMESTER, function(item) {
        return item.value === semester;
      });
      return typeof stt[0] !== 'undefined' ? stt[0].label : '';
    },
  },
  mixins: [dateMethod],
  data() {
    return {
      defaultData: {
        grades: [121, 122, 123],
        studentStatus: [125950005, 125950001, 125950002],
      },
      exportLoading: null,
      listLoading: true,
      searchForm: {
        fullname: '',
        snz_studentcode: '',
        businessId: '',
        year: this.getCurrentSchoolYear(),
        semester: '',
        studentStatus: [],
        grades: [],
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      paginateForm: {
        businessId: '',
        year: this.getCurrentSchoolYear(),
        semester: '',
        studentStatus: [],
        grades: [],
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      semesters: [],
      studentStatus: [],
      list: [],
      years: this.getSchoolYearOption(),
      total: 0,
      businessOptions: [],
      defaultBusinessOptions: [],
      queryBusiness: null,
      pageBusiness: 1,
      gradeOptions: [],
      defaultGradeOptions: [],
      queryGrade: null,
      pageGrade: 1,
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  async created() {
    this.roles = this.$store.getters.roles;
    this.paginateForm = this.copyAttributes(this.$route.query, this.paginateForm);
    this.semesters = StudentStatus.OPTION_SEMESTER;
    this.studentStatus = StudentStatus.OPTION_SNZ_STUDENTSTATUS;
    await this.getOptionGrade();
    await this.fetchBusiness();
    if (_.isEmpty(this.$route.query)) {
      await this.setDefaultSearch();
    } else {
      await this.setQuery();
    }
    this.getList();
  },
  methods: {
    async fetchBusiness() {
      await this.searchBusiness();
      this.defaultBusinessOptions = this.businessOptions;
    },
    async setQuery() {
      let queryForm = _.clone(this.searchForm);
      queryForm = await this.copyAttributes(this.$route.query, queryForm);
      queryForm.year = queryForm.year ? queryForm.year : '';
      queryForm.grades = await this.covertArrStringToInt(queryForm.grades);
      const grades = queryForm.grades;
      queryForm.grades = _.map(_.filter(this.gradeOptions, function(item) {
        return grades.includes(parseInt(item.id));
      }), 'id');
      queryForm.studentStatus = await this.covertArrStringToInt(queryForm.studentStatus);
      this.searchForm = queryForm;
      this.paginateForm = _.clone(this.searchForm);
    },
    async setDefaultSearch() {
      const defaultGrades = this.defaultData.grades;
      this.searchForm.grades = _.map(_.filter(this.gradeOptions, function(item) {
        return defaultGrades.includes(parseInt(item.id));
      }), 'id');
      this.searchForm.studentStatus = this.defaultData.studentStatus;
    },

    goDetailPage(row) {
      this.$router.push({ name: 'student_record_detail', params: { id: row.id, query: this.searchForm }});
    },
    async fetchData(forceQuery = null) {
      this.listLoading = true;
      const org_id = this.$store.getters.defaultOrg ? this.$store.getters.defaultOrg.id : '';
      const res = await studentRecord.list({ org_id, ...this.query, ...forceQuery || this.searchForm });
      this.list = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.listLoading = false;
    },
    async getList(forceQuery = null) {
      const query = this.buildQuery(forceQuery || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      await this.fetchData(forceQuery);
    },
    async submitSearch() {
      this.searchForm.page = 1;
      await this.getList();
      this.paginateForm = this.$_.clone(this.searchForm);
    },
    async handleExport() {
      this.exportLoading = true;
      await studentRecord.exportResource(this.paginateForm, 'xls').then(data => {
        this.createDownloadXlsFile('学校内申', data);
        this.exportLoading = false;
      });
    },
    async getOptionGrade() {
      this.gradeOptions = await gradeRequest.gradeOptions();
    },
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .search-container.el-card .el-col .el-form-item .el-select {
  width: 132px !important;
}
/deep/ .search-container.el-card .el-col .el-form-item .el-input {
  width: 132px;
}
.edit-input {
  padding-right: 100px;
}
.group-button{
  padding-top: 0 !important;
}

/deep/ .el-card__body {
}

/deep/ .search-container {
}

/deep/ .select-option {
  float: left;
  max-width: 154px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: -10px;
  margin-right: -10px;
}

/deep/ .search {
  .el-row {
    flex-wrap: wrap;

    .el-form-item__content {
      line-height: 0 !important;

      .el-select__input {
        border: none !important;
      }
    }

    input.el-input__inner {
      &::placeholder {
        color: #1A1714;
      }
    }

    &.bot {
      .el-col:nth-child(2) {
        width: 281px;
      }

      .el-col:nth-child(3) {
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
      margin-bottom: 0px;
    }
  }
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

.action-group {

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

<style lang="scss" scoped>
/deep/ .page-body {
  height: calc(100% - 220px);

  .el-table__fixed-right-patch {
    background: #535353;
    height: 32px !important;
  }

  span.icon-calendar {
    margin-left: 5px;
  }

  .el-checkbox__input {
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

  td {
    padding: 0px !important;
    height: 47px;
    &:last-child {
      text-align: center;
      border-left: 1px solid #D6D6D6;

      a {
        color: #1467B3;
        padding: 5px 10px;
        background: #F4F8FD 0% 0% no-repeat padding-box;
        border-radius: 5px;
        font-size: 15px;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }

  .el-select {

    &.el-select--medium {
      input.el-input__inner {
        border: none !important;
        height: 32px;
        line-height: 32px;
        padding-left: 0px;
        background: none !important;
      }

      i.el-select__caret.el-input__icon {
        color: #FFFFFF !important;
        width: 18px;
        line-height: 32px;

        &:before {
          color: #fff;
        }
      }

      .el-input__suffix {
        width: 18px;
        height: 32px;
        background: #769FC6;
        border-radius: 3px;
      }

      span.el-input__suffix-inner {
        opacity: 1;
      }
    }
  }

  .custom-pagination {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    height: 60px;
    background-color: #f0f0f0;

    button.btn-prev, button.btn-next {
      background: #FFFFFF;
    }
  }

  tr {
    td:first-child{
      .cell{
        padding-right: 10px;
      }
    }
    th:nth-child(2), td:nth-child(2) {
      padding-left: 15px !important;
    }

    th:nth-child(5) {
      .cell {
        font-size: 9px;
        line-height: 12px;
        padding-top: 3px;
        padding-right: 22px;
      }
    }
  }

  thead {
    th:last-child {
      border-left: 1px solid #D6D6D6;
    }

    th:first-child {
      border-right: 1px solid #D6D6D6;
      padding-left: 20px !important;
    }

    th:last-child {
      padding-left: 0px !important;
      text-align: center;
    }

    .cell {
      font-size: 13px;
      height: 29px;
      line-height: 29px;
    }

    th:nth-child(4) {
      .cell {
      }
    }
  }

  tr {
    .cell {
      padding: 0;
    }

    td:first-child {
      border-right: 1px solid #D6D6D6;
      padding-left: 20px !important;
    }
  }
}
</style>
