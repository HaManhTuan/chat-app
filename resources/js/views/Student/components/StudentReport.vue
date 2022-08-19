<template>
  <div>
    <div class="card-body">
      <div class="card-body__content">
        <!-- bảng 1 -->
        <h3>学校試験</h3>
        <el-table v-loading="listLoading1" class="block-table table-1" :data="tableData1" fit highlight-current-row :empty-text="CommonTxt.tableEmptyTxt">
          <!-- 1.1 -->
          <el-table-column min-width="100px" label="氏名">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.student.fullname }}</span>
            </template>
          </el-table-column>
          <!-- 1.2 -->
          <el-table-column min-width="100px" label="学年">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.grade.snz_name }}</span>
            </template>
          </el-table-column>
          <!-- 1.3 -->
          <el-table-column min-width="100px" label="内部コード">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_internalcode }}</span>
            </template>
          </el-table-column>
          <!-- 1.4 -->
          <!-- <el-table-column min-width="90px" label="生徒コード">
            <span class="ellipsis">{{ form.snz_studentcode }}</span>
          </el-table-column> -->
          <!-- 1.5 -->
          <el-table-column min-width="90px">
            <template slot="header">
              生徒<br>ステータス
            </template>
            <span class="ellipsis">{{ form.snz_studentstatus | filterStudentStatus }}</span>
          </el-table-column>
          <!-- 1.6 -->
          <el-table-column min-width="130px" label="学校名">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.school.snz_name }}</span>
            </template>
          </el-table-column>
          <!-- 1.7 -->
          <el-table-column min-width="60px" label="年度">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_year }}</span>
            </template>
          </el-table-column>
          <!-- 1.8 -->
          <el-table-column min-width="70px" label="学期">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_schooltestname | filterStudentTestName }}</span>
            </template>
          </el-table-column>
          <!-- 1.9 -->
          <el-table-column min-width="70px">
            <template slot="header">
              試験<br>種類
            </template>
            <template slot-scope="scope">
              <!-- <span class="ellipsis">{{ schoolTestTypes[scope.row.snz_schooltesttype] }}</span> -->
              <span class="ellipsis">{{ scope.row.snz_schooltesttype | filterStudentTestType }}</span>
            </template>
          </el-table-column>
          <!-- 1.10 -->
          <el-table-column min-width="37px" label="英">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 1) }}</span>
            </template>
          </el-table-column>
          <!-- 1.11 -->
          <el-table-column min-width="37px" label="数">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 2) }}</span>
            </template>
          </el-table-column>
          <!-- 1.12 -->
          <el-table-column min-width="37px" label="国">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 3) }}</span>
            </template>
          </el-table-column>
          <!-- 1.13 -->
          <el-table-column min-width="37px" label="理">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 4) }}</span>
            </template>
          </el-table-column>
          <!-- 1.14 -->
          <el-table-column min-width="37px" label="社">
            <template slot-scope="scope">
              <span class="ellipsis">{{ getSubjectScore(scope.row.school_test_result, 5) }}</span>
            </template>
          </el-table-column>
          <!-- 1.15 -->
          <el-table-column min-width="110px" label="校舎">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.business.name }}</span>
            </template>
          </el-table-column>
          <!-- 1.16 -->
          <el-table-column min-width="80px" label="詳細">
            <template slot-scope="scope">
              <router-link class="list-detail-link" :to="{name:'confirm-school-test', params: { id: scope.row.id, redirect: true }}">確認</router-link>
            </template>
          </el-table-column>
        </el-table>
        <custom-pagination
          v-show="paginate1.last_page > 1"
          :total="paginate1.total"
          :page.sync="paginate1.page"
          :limit.sync="paginate1.limit"
          layout="prev, pager, next"
          prev-text="<"
          next-text=">"
          class="text-center custom-pagination"
          @pagination="getExamsList"
        />
      </div>
    </div>
    <hr class="line">
    <div class="card-body">
      <div class="card-body__content">
        <!-- bảng 2 -->
        <h3>学校内申</h3>
        <el-table v-loading="listLoading2" class="block-table table-2" :data="tableData2" fit height="100%" highlight-current-row :empty-text="CommonTxt.tableEmptyTxt">
          <!-- Full name -->
          <el-table-column label="氏名" fixed min-width="100px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.student.fullname }}</span>
            </template>
          </el-table-column>
          <!-- sGRADE -->
          <el-table-column label="学年" min-width="100px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.grade.snz_name }}</span>
            </template>
          </el-table-column>
          <!-- internal code -->
          <el-table-column label="内部コード" min-width="100px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_internalcode }}</span>
            </template>
          </el-table-column>
          <!-- student code -->
          <!-- <el-table-column label="生徒コード" min-width="100px">
            <span class="ellipsis">{{ form.snz_studentcode }}</span>
          </el-table-column> -->
          <!-- student status -->
          <el-table-column min-width="100px">
            <template slot="header">
              生徒<br>ステータス
            </template>
            <span class="ellipsis">{{ form.snz_studentstatus | getStatusLabel }}</span>
          </el-table-column>
          <!-- school name -->
          <el-table-column label="学校名" min-width="130px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.school.snz_name }}</span>
            </template>
          </el-table-column>
          <!-- year -->
          <el-table-column label="年度" min-width="76px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_year }}</span>
            </template>
          </el-table-column>
          <!-- semester -->
          <el-table-column label="学期" min-width="70px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_schoolscorename | getSemesterLabel }}</span>
            </template>
          </el-table-column>
          <!-- English -->
          <el-table-column label="英" min-width="42px">
            <template slot-scope="scope">
              {{ scope.row.school_score_results | filterScore(1) }}
            </template>
          </el-table-column>
          <!-- Toan hoc -->
          <el-table-column label="数" min-width="42px">
            <template slot-scope="scope">
              {{ scope.row.school_score_results | filterScore(2) }}
            </template>
          </el-table-column>
          <!-- ngu phap -->
          <el-table-column label="国" min-width="42px">
            <template slot-scope="scope">
              {{ scope.row.school_score_results | filterScore(3) }}
            </template>
          </el-table-column>
          <!-- ngu phap -->
          <el-table-column label="理" min-width="42px">
            <template slot-scope="scope">
              {{ scope.row.school_score_results | filterScore(4) }}
            </template>
          </el-table-column>
          <!-- ngu phap -->
          <el-table-column label="社" min-width="42px">
            <template slot-scope="scope">
              {{ scope.row.school_score_results | filterScore(5) }}
            </template>
          </el-table-column>
          <!-- ngu phap -->
          <el-table-column label="保" min-width="42px">
            <template slot-scope="scope">
              {{ scope.row.school_score_results | filterScore(6) }}
            </template>
          </el-table-column>
          <!-- my thuat -->
          <el-table-column label="美" min-width="42px">
            <template slot-scope="scope">
              {{ scope.row.school_score_results | filterScore(7) }}
            </template>
          </el-table-column>
          <!-- ky thuat -->
          <el-table-column label="技" min-width="42px">
            <template slot-scope="scope">
              {{ scope.row.school_score_results | filterScore(8) }}
            </template>
          </el-table-column>
          <!-- music -->
          <el-table-column label="音" min-width="42px">
            <template slot-scope="scope">
              {{ scope.row.school_score_results | filterScore(9) }}
            </template>
          </el-table-column>
          <!-- business unit name -->
          <el-table-column label="校舎" min-width="120px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.business.name }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="詳細" fixed="right" width="73px" class="text-center">確認</el-table-column> -->
          <el-table-column fixed="right" min-width="80px" label="詳細">
            <template slot-scope="scope">
              <router-link class="list-detail-link" :to="{name: 'student_record_detail', params: {id: scope.row.id, redirect: true}}">
                確認
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <custom-pagination
          v-show="paginate2.last_page > 1"
          :total="paginate2.total"
          :page.sync="paginate2.page"
          :limit.sync="paginate2.limit"
          layout="prev, pager, next"
          prev-text="<"
          next-text=">"
          class="text-center custom-pagination"
          @pagination="getReportsList"
        />
      </div>
    </div>
  </div>
</template>
<script>
// import moment from 'moment';
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
import StudentReport from '@/api/studentReport';
import role from '@/directive/role';
import studentStatus from '@/const/StudentStatus';
import filterOption from '@/filters/parseData';

// import filterOption from '@/filters/parseData';

const studentReport = new StudentReport();

export default {
  components: {
    CustomPagination,
  },
  filters: {
    filterStudentStatus: value => {
      return filterOption(value, studentStatus.OPTION_SNZ_STUDENTSTATUS);
    },
    filterStudentTestName: value => {
      return filterOption(value, studentStatus.OPTION_SNZ_SCHOOLTESTNAME);
    },
    filterStudentTestType: value => {
      return filterOption(value, studentStatus.OPTION_SNZ_SCHOOLTESTTYPE);
    },
    getStatusLabel(status) {
      const stt = _.filter(studentStatus.OPTION_SNZ_STUDENTSTATUS, function(item) {
        return item.value === status;
      });
      return stt[0].label;
    },
    getSemesterLabel(semester) {
      const stt = _.filter(studentStatus.OPTION_SEMESTER, function(item) {
        return item.value === semester;
      });
      return typeof stt[0] !== 'undefined' ? stt[0].label : '';
    },
    filterScore: (value, order) => {
      if (value.length > 0) {
        const t = _.find(value, (item) => {
          return item.order === order;
        });
        if (typeof t === 'object') {
          return t.snz_subjectscore;
        }
        return '―';
      }
      return '―';
    },
  },
  directives: { role },
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      id: null,
      listLoading1: false,
      listLoading2: false,
      roles: null,
      tableData1: null,
      paginate1: {
        total: 0,
        page: 1,
        limit: 7,
        last_page: null,
      },
      tableData2: null,
      paginate2: {
        total: 0,
        page: 1,
        limit: 7,
        last_page: null,
      },
    };
  },
  created() {
    this.id = this.$route.params.id;
    console.log(this.form);
    this.getExamsList();
    this.getReportsList();
    this.fullscreenLoading = false;
    this.roles = this.$store.getters.roles;
  },
  methods: {
    async getExamsList() {
      this.listLoading1 = true;
      this.paginate1.internalCode = this.form.snz_internalcode;
      this.paginate1.tableName = 'exam';
      console.log(this.paginate1);
      const resExam = await studentReport.getList(this.paginate1);
      this.tableData1 = resExam.original.data.data;
      this.paginate1.total = resExam.original.data.total;
      this.paginate1.page = resExam.original.data.current_page;
      this.paginate1.limit = Number(resExam.original.data.per_page);
      this.paginate1.last_page = resExam.original.data.last_page;
      this.listLoading1 = false;
      this.scrollTopTable();
    },
    async getReportsList() {
      this.listLoading2 = true;
      this.paginate2.internalCode = this.form.snz_internalcode;
      this.paginate2.tableName = 'report';
      console.log(this.paginate2);
      const resReport = await studentReport.getList(this.paginate2);
      this.tableData2 = resReport.original.data.data;
      this.paginate2.total = resReport.original.data.total;
      this.paginate2.page = resReport.original.data.current_page;
      this.paginate2.limit = Number(resReport.original.data.per_page);
      this.paginate2.last_page = resReport.original.data.last_page;
      this.listLoading2 = false;
      this.scrollTopTable();
    },
    getSubjectScore(schoolTestResuls, order) {
      if (schoolTestResuls.find(x => x.order === order)) {
        return schoolTestResuls.find(x => x.order === order).snz_subjectscore;
      } else {
        return '―';
      }
    },
    checkRole(btnRoles, type) {
      const myRoles = this.roles;
      const diff = myRoles.filter(x => btnRoles.includes(x));
      if (diff.length > 0) {
        if (type === 'can') {
          return false;
        } else {
          return true;
        }
      } else {
        if (type === 'can') {
          return true;
        } else {
          return false;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.main-container {
  background: #F0F0F0 !important;
}
.edit-input {
  padding-right: 100px;
}

.line{
  margin: 0px;
}

/deep/ .el-card__body {
  padding-bottom: 0 !important;
}
.app-container{
  height: calc(100vh - 40px) !important;
}

.card-body{
  padding: 20px 30px 18px !important;
}

.card-body__content::v-deep {
  height: calc(100% - 235px);

  h3 {
    padding-bottom: 18px !important;
  }

  .block-table {
    table {
      width:100%;
      th:nth-child(4) .cell {
        font-size: 9px;
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

      .cell {
        font: normal normal normal 13px Noto Sans JP;
        color: #1A1714;
        padding-right: 0px;
      }

      th:nth-child(1) {
        padding-left: 10px;
      }

      td:nth-child(1) {
        padding-left: 10px;
      }

      tr {
        border-bottom: 1px solid #e5e5e5 !important;
      }
    }
  }
  .table-1{
    height: 264px !important;
    margin-bottom: 9px;
    .el-table__header-wrapper{
      th:nth-child(8){
        .cell{
          font-size: 9px;
        }
      }
      th:nth-child(15){
        .cell{
          text-align: center;
          padding: 0px;
        }
      }
    }
    .el-table__body-wrapper{
      height: 246px;
      overflow: auto;
      td:nth-child(15){
        .cell{
          text-align: center;
          padding-right: 20px;
        }
      }
    }
  }
  .table-2{
    height: 280px !important;
    margin-bottom: 9px;
    .el-table__fixed-right{
      .cell{
        text-align: center;
        padding-left: 0px !important;
      }
    }
  }
}

.group-button{
  padding-top: 0;
}
.footer__group{
  margin-top: 15px !important;
}
/deep/ .paging {
  margin-top: 14px;
}
</style>
