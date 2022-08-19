<template>
  <div class="app-container">
    <el-card shadow="false" class="rounded search-container">
      <el-form ref="searchForm" class="search" :model="searchForm" label-position="left">
        <el-row class="top" justify="space-around">
          <el-col :span="6">
            <el-form-item label-width="42px" label="校舎">
              <el-select
                v-model="searchForm.businessId"
                v-loadmore="loadmoreBusiness"
                class="filterable-select"
                :remote-method="name => searchBusiness(name)"
                filterable
                remote
                clearable
                placeholder=""
                :no-data-text="CommonTxt.selectboxSearchEmptyTxt"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                @change="changeBusinessSearch"
              >
                <el-option
                  v-for="item in businessOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <span class="select-option">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="42px" label="学年">
              <el-select
                v-model="searchForm.grade"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                class="filterable-select"
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
          <!-- STUDENT STATUS -->
          <el-col :span="6">
            <el-form-item label-width="120px" label="生徒ステータス">
              <el-select
                v-model="searchForm.studentStatus"
                multiple
                class="multiselect"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                placeholder=""
              >
                <el-option
                  v-for="item in studentStatuss"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END STUDENT STATUS -->
          <el-col :span="6">
            <el-form-item label-width="56px" label="生徒名">
              <el-select
                v-model="searchForm.studentName"
                v-loadmore="loadmoreStudent"
                class="filterable-select"
                :remote-method="name => searchStudents(name)"
                filterable
                remote
                clearable
                placeholder=""
                :no-data-text="commonText.selectboxSearchEmptyTxt"
                :no-match-text="commonText.selectboxEmptyTxt"
                @change="changeStudentSearch"
              >
                <el-option
                  v-for="item in studentOptions"
                  :key="item.snz_internalcode"
                  :label="item.fullname"
                  :value="item.snz_internalcode"
                >
                  <span class="select-option">{{ item.fullname }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="84px" label="生徒コード">
              <input-number v-model="searchForm.studentCode" :maxlength="100" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="6" />
        </el-row>
        <el-row class="bot" justify="space-between">
          <el-col :span="6">
            <el-form-item label-width="70px" label="テスト名">
              <el-input v-model="searchForm.testName" clearable maxlength="100" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="42px" label="科目">
              <el-input v-model="searchForm.subjectName" clearable maxlength="100" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="">
              <ButtonSearch @search="submitSearch" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div id="page-body" ref="pageBody" class="page-body">
      <el-table
        v-loading="listLoading"
        class="block-table"
        :data="list"
        fit
        highlight-current-row
        :header-cell-style="tableHeaderColor"
        height="100%"
        :empty-text="CommonTxt.tableEmptyTxt"
      >
        <el-table-column min-width="190px" label="生徒氏名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student.fullname }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="142px" label="学年">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade.snz_name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="147px" label="生徒コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.contact.snz_studentcode }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="157px" label="生徒ステータス">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.contact.snz_studentstatus | getStatusLabel }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="267px" label="テスト名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_testmanagementname }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" label="科目">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_subject_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" label="合計点">
          <template slot-scope="scope">
            <span>{{ scope.row.snz_total !== null ? scope.row.snz_total : 'ー' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="140px" label="校舎">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.business.name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80px" label="詳細">
          <template slot-scope="scope">
            <router-link :to="{name:'confirm-internal-test', params: { id: scope.row.id }}">
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
            :page.sync="searchForm.page"
            :limit.sync="searchForm.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination"
            @pagination="getList"
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
import CustomPagination from '../../components/Common/Pagination/CustomPagination';
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import CommonSettings from '@/const/CommonSettings';
import InternalTestSchool from '@/api/internalTestSchool';
import StudentResource from '@/api/student';
import StudentStatus from '../../const/StudentStatus';
import loadmore from '@/directive/selection';
import _ from 'lodash';
import permission from '@/directive/permission';
import role from '@/directive/role';
import GradeRequest from '../../api/gradeRequest';
import BusinessUnitRequest from '../../api/BusinessUnitRequest';
import InputNumber from '../../components/Common/InputNumber';

const internalTestResource = new InternalTestSchool();
const studentResource = new StudentResource();
const businessResource = new BusinessUnitRequest();
const gradeRequest = new GradeRequest();
export default {
  name: 'List',
  metaInfo: {
    title: '塾内テスト',
  },
  directives: { permission, role, loadmore },
  components: { InputNumber, ButtonExport, ButtonSearch, CustomPagination },
  filters: {
    getStatusLabel(status) {
      const stt = _.filter(StudentStatus.OPTION_SNZ_STUDENTSTATUS, function(item) {
        return item.value === status;
      });
      return stt[0] ? stt[0].label : '';
    },
  },
  data() {
    return {
      list: [],
      total: 0,
      studentOptions: null,
      loadingSearchStudent: false,
      listLoading: true,
      exportLoading: false,
      commonText: CommonSettings.COMMON_TXT,
      business: { },
      students: [],
      studentCodes: [],
      grades: [],
      testNames: [],
      subjectNames: [],
      studentStatuss: [],
      searchForm: {
        studentStatus: null,
        businessId: null,
        grade: null,
        studentName: null,
        studentCode: null,
        testName: null,
        subjectName: null,
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      searchSubmitForm: {
        businessId: null,
        grade: null,
        studentName: null,
        studentCode: null,
        testName: null,
        subjectName: null,
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      defaultStudentOptions: [],
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
  async created(){
    this.searchForm = await this.copyAttributes(this.$route.query, this.searchForm);
    await this.getOptionGrade();
    if (!_.some(this.gradeOptions, { id: this.searchForm.grade })){
      delete this.searchForm.grade;
    }
    const query = this.buildQuery(this.searchForm);
    window.history.replaceState(null, null, `?${query}`);
    await this.fetchBusiness();
    await this.fetchStudents();
    await this.setQuery();
    this.studentStatuss = StudentStatus.OPTION_SNZ_STUDENTSTATUS;
    await this.fetchData();
  },
  methods: {
    tableHeaderColor() {
      return 'background-color: #535353;color:#fff;padding-left:15px;height:29px;line-height:29px;padding:0px';
    },
    async fetchBusiness() {
      await this.searchBusiness();
      this.defaultBusinessOptions = this.businessOptions;
    },
    async setQuery() {
      this.searchForm.studentName = this.searchForm.studentName ? this.searchForm.studentName.toString() : '';
      this.searchForm.studentCode = this.searchForm.studentCode ? this.searchForm.studentCode.toString() : '';
      this.searchSubmitForm = Object.assign({}, this.searchForm);
    },
    async fetchStudents() {
      await this.searchStudents();
      this.defaultStudentOptions = this.studentOptions;
    },
    async fetchData() {
      this.listLoading = true;
      const res = await internalTestResource.list(this.searchSubmitForm);
      this.setData(res);
      this.scrollTopTable();
      this.listLoading = false;
    },
    async getList() {
      await this.submitQuery('page');
      await this.fetchData();
    },
    submitQuery(action) {
      var query = [];
      if (action === 'search') {
        this.searchForm.page = 1;
        query = this.buildQuery(this.searchForm);
      } else {
        this.searchSubmitForm.page = this.searchForm.page ? this.searchForm.page : 1;
        this.searchSubmitForm.sort = this.searchForm.sort ? this.searchForm.sort : null;
        query = this.buildQuery(this.searchSubmitForm);
      }
      window.history.replaceState(null, null, `?${query}`);
    },
    setData(data){
      this.list = data.data;
      this.total = data.total;
    },
    setCommon(data) {
      this.students = data.students;
      this.business = data.business;
      this.testNames = data.testNames;
      this.studentStatuss = data.studentStatus;
      this.subjectNames = data.subjectNames;
      this.studentCodes = data.studentCodes;
    },
    async submitSearch() {
      await this.submitQuery('search');
      this.searchSubmitForm = Object.assign({}, this.searchForm);
      this.fetchData();
    },
    deleteSchool(id){

    },
    changeStudentSearch() {
      if (!this.searchForm.studentCode) {
        this.studentOptions = this.defaultStudentOptions;
        this.pageStudent = 1;
        this.queryStudent = null;
      }
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
      const res = await this.searchNameStudent({ snz_internalcode: this.searchForm.studentName, fullname: query });
      this.studentOptions = res.data;
      if (res.current_page >= res.last_page) {
        this.pageStudent = 0;
      }
    },
    async searchNameStudent(params) {
      if (!_.isEmpty(params)) {
        return await studentResource.searchName(params);
      }
    },
    async handleExport() {
      this.exportLoading = true;
      await internalTestResource.exportResource(this.searchForm, 'xls').then(data => {
        this.createDownloadXlsFile('塾内テスト', data);
        this.exportLoading = false;
      });
    },
    async getOptionGrade() {
      this.gradeOptions = await gradeRequest.gradeOptions();
    },
    async searchNameBusiness(params) {
      if (!_.isEmpty(params)) {
        return await businessResource.searchName(params);
      }
    },
    changeBusinessSearch() {
      if (!this.searchForm.businessId) {
        this.businessOptions = this.defaultBusinessOptions;
        this.pageBusiness = 1;
        this.queryBusiness = null;
      }
    },
    async loadmoreBusiness() {
      if (this.pageBusiness) {
        this.pageBusiness++;
        const res = await this.searchNameBusiness({ name: this.queryBusiness, page: this.pageBusiness });
        this.businessOptions = this.businessOptions.concat(res.data);
        if (res.current_page >= res.last_page) {
          this.pageBusiness = 0;
        }
      }
    },
    async searchBusiness(query = null) {
      this.queryBusiness = query;
      this.pageBusiness = 1;
      const res = await this.searchNameBusiness({ id: this.searchForm.businessId, name: query });
      this.businessOptions = res.data;
      if (res.current_page >= res.last_page) {
        this.pageBusiness = 0;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  overflow-y: hidden;
}

/deep/ .search-container.el-card .el-col {
  width: auto;
  margin-right: 21px;
}
/deep/ .search-container.el-card .el-col .el-form-item .el-input {
  width: 135px !important;
}
/deep/ .multiselect.el-select {
  width: 134px !important;
}
/deep/ .el-table--medium td {
  padding: 0 !important;
  padding-right: 10px !important;
  height: 47px;
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
/deep/ .custom-pagination {
  text-align: center;
  margin: 0;
  background-color: #f0f0f0;

  button.btn-prev, button.btn-next {
    background: #FFFFFF;
  }
}
/deep/ .search{
  .top {
    .el-form-item {
      margin-bottom: 17px;
    }
  }
  .bot {
    .el-form-item{
      margin-bottom: 0px;
    }
    .el-col:last-child {
      margin-right: 0px;
      position: absolute;
      bottom: 0px;
      right: 0px;
      float: right;
      .el-form-item__content{
        text-align: right;
        width: 100%;
      }
    }
    .m-right{
      text-align: right;
    }
  }
}
.edit-input {
  padding-right: 100px;
}
.page-body {
  height: calc(100% - 220px);
  /deep/ thead {
    th:first-child{
      padding-left: 20px!important;
    }
    th:nth-child(9) {
      padding-left: 0px!important;
      text-align: center!important;
    }
    .cell{
      font-size: 13px;
      height: 29px;
      line-height: 29px;
    }
    th:nth-child(4) {
      .cell{
      }
    }
  }
  /deep/ tr{
    .cell{
      padding: 0;
    }
    td:first-child {
      padding-left: 20px!important;
      height: 47px !important;
    }
  }
  /deep/ td{
    &:last-child{
      text-align: center;
      padding-right: 0 !important;
      a{
        color: #1467B3;
        padding: 5px 10px;
        background: #F4F8FD 0% 0% no-repeat padding-box;
        border-radius: 5px;
        font-size: 15px;
        &:hover{
          opacity: 0.8;
        }
      }
    }
  }
}
.div-button::v-deep {
  .footer__group {
    margin-top: 0px;
  }
}
.group-button::v-deep {
  float: right;

  button {
    border-radius: 100px;
    color: #fff;
    height: 45px;
    border:none;
    vertical-align: middle;
    line-height: 20px;
    span{
      font-size: 15px;
      font-family: Noto Sans JP;
      vertical-align: middle;
    }

    i, svg {
      font-weight: bold;
      margin-right: 2px;
      vertical-align: -4px;
    }
    i{
      font-size: 20px;
    }
    svg{
      width: 24px;
      height: 17px;
    }

    span {
      vertical-align: middle;
    }

    &:hover {
      opacity: 0.8;
    }
  }
  .el-icon-loading{
      font-size: 15px;
      margin: 0px;
      vertical-align: middle;
    }
}
.position-center::v-deep {
  text-align: center;
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  button.btn-prev, button.btn-next {
    background: #FFFFFF;
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
@media only screen and (min-height: 0px) and (max-height: 768px) {
  .scroll-content::v-deep {
    .el-scrollbar__wrap{
      overflow-y: scroll;
      overflow-x: hidden;
      max-height: 666px;
    }
  }
}
@media only screen and (min-height: 769px) and (max-height: 1200px) {
  .scroll-content::v-deep{
     .el-scrollbar__wrap{
        overflow-y: scroll;
        overflow-x: hidden;
        max-height: 1098px;
      }
    }
}
</style>
