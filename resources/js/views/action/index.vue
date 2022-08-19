<template>
  <div id="app-container" class="app-container">
    <el-card shadow="false" class="rounded search-container">
      <el-form ref="searchForm" class="form-search" :model="searchForm">
        <el-row justify="space-between" class="bot">
          <div class="search-left">
            <el-col :span="6">
              <el-form-item label-width="97px" label="対応生徒氏名">
                <el-select
                  v-model="searchForm.studentCode"
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
              <el-form-item label-width="54px" label="対応者">
                <el-select
                  v-model="searchForm.actionUser"
                  v-loadmore="loadmoreActionUsers"
                  class="filterable-select"
                  :remote-method="name => searchActionUsers(name)"
                  filterable
                  remote
                  clearable
                  placeholder=""
                  :no-data-text="commonText.selectboxSearchEmptyTxt"
                  :no-match-text="commonText.selectboxEmptyTxt"
                  @change="changeActionUserSearch"
                >
                  <el-option
                    v-for="item in actionUserOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                    <span class="select-option">{{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9" class="no-border">
              <div class="d-flex">
                <el-form-item label-width="54px" label="対応日">
                  <el-date-picker
                    v-model="searchForm.actionStartDate"
                    prefix-icon="_calendar"
                    type="date"
                    placeholder="開始日"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                  />
                  <span class="icon-input__calendar">
                    <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
                  </span>
                </el-form-item>
                <el-form-item class="between-date" label-width="22px" label="〜">
                  <el-date-picker
                    v-model="searchForm.actionEndDate"
                    prefix-icon="_calendar"
                    type="date"
                    placeholder="終了日"
                    format="yyyy/MM/dd"
                    value-format="yyyy-MM-dd"
                  />
                  <span class="icon-input__calendar">
                    <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
                  </span>
                </el-form-item>
              </div>
              <!--              <p-->
              <!--                v-if="searchForm.actionEndDate && searchForm.actionStartDate && searchForm.actionEndDate < searchForm.actionStartDate"-->
              <!--                class="el-form-item__error"-->
              <!--                style="position: initial;"-->
              <!--              >対応日の開始日を終了日のより前の日で、選択してください。 </p>-->
            </el-col>
          </div>
          <div class="search-right">
            <ButtonSearch @search="submitSearch" />
          </div>
        </el-row>
      </el-form>
    </el-card>
    <div id="page-body" ref="pageBody" class="container page-body card-body__content">
      <el-table
        v-loading="listLoading"
        class="table-content"
        :data="tableForm.list"
        fit
        height="calc(100% - 77px)"
        highlight-current-row
        style="width: 100%"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :empty-text="commonText.tableEmptyTxt"
      >
        <el-table-column min-width="346px" label="対応生徒氏名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ !(scope.row.student == null) ? scope.row.student.fullname : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="256px" label="対応者">
          <template slot-scope="scope">
            <span class="ellipsis">{{ !(scope.row.action_by_user == null) ? scope.row.action_by_user.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="182px" label="対応日" prop="snz_actiondate">
          <template slot="header">
            <div class="cell">対応日 <span v-sortable="sortChange" /></div>
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_actiondate | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="240px" label="対応内容">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_actioncontents }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="ableRole(['system', 'school'])" min-width="70px" label="詳細編集" row-class-name="action">
          <template slot-scope="scope">
            <router-link :to="{ name: 'actions-detail', params: { id: scope.row.id, query: searchForm }}">
              <el-button class="btn-edit" size="mini">
                <svg-icon icon-class="_edit" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column v-if="ableRole(['system', 'school'])" width="46px" label="削除" row-class-name="delete">
          <template slot-scope="scope">
            <el-button class="btn-delete" size="mini" @click="deleteActions(scope.row.id)">
              <svg-icon icon-class="_delete" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-row class="footer__group">
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
              <ButtonExport :disabled="exportLoading" :loading="exportLoading" type="excel" @export="handleExport" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import CustomPagination from '../../components/Common/Pagination/CustomPagination';
import ActionResource from '@/api/action';
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import { mapGetters } from 'vuex';
import UserResource from '@/api/user';
import StudentResource from '@/api/student';
import role from '@/directive/role';
import permission from '@/directive/permission';
import _ from 'lodash';
import CommonSettings from '@/const/CommonSettings';
import loadmore from '@/directive/selection';
import sortable from '@/directive/el-table/sortable';

const actionResource = new ActionResource();
const userResource = new UserResource();
const studentResource = new StudentResource();
export default {
  name: 'ActionList',
  metaInfo: {
    title: '対応履歴',
  },
  components: {
    CustomPagination,
    ButtonSearch,
    ButtonExport,
  },
  directives: { permission, role, loadmore, sortable },
  filters: {
  },
  mixins: [],
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      studentOptions: null,
      actionUserOptions: null,
      tableForm: {
        list: [],
      },
      searchForm: {
        sort: null,
        studentCode: null,
        actionUser: null,
        actionStartDate: null,
        actionEndDate: null,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        page: null,
      },
      searchSubmitForm: {
        sort: null,
        studentCode: null,
        actionUser: null,
        actionStartDate: null,
        actionEndDate: null,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        page: null,
      },
      total: 0,
      listLoading: true,
      exportLoading: false,
      query: {
        page: 1,
        limit: 20,
      },
      queryStudent: null,
      pageStudent: 1,
      queryActionUser: null,
      pageActionUser: 1,
      defaultStudentOptions: [],
      defaultActionUserOptions: [],
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  created() {
    this.roles = this.$store.getters.roles;
    this.init();
  },
  methods: {
    async init() {
      this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
      this.searchForm.studentCode = this.searchForm.studentCode ? this.searchForm.studentCode.toString() : null;
      await this.searchStudents();
      this.defaultStudentOptions = this.studentOptions;
      await this.searchActionUsers();
      this.defaultActionUserOptions = this.actionUserOptions;
      this.searchSubmitForm = Object.assign({}, this.searchForm);
      await this.fetchData();
    },
    tableHeaderColor() {
      return 'background-color: #535353;color:#fff;padding-left:15px';
    },
    tableRowStyle() {
      return 'padding-left:15px';
    },
    async sortChange(sort) {
      this.searchForm.sort = sort;
      await this.getList();
    },
    async fetchData() {
      this.listLoading = true;
      const res = await actionResource.list({ ...this.query, ...this.searchSubmitForm });
      this.tableForm.list = res.data;
      this.total = res.total;
      this.listLoading = false;
    },
    async submitSearch() {
      await this.submitQuery('search');
      this.searchSubmitForm = Object.assign({}, this.searchForm);
      this.fetchData();
    },
    async getList() {
      await this.submitQuery('page');
      await this.fetchData();
      this.scrollTopTable();
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
    async handleExport() {
      this.exportLoading = true;
      await actionResource.exportResource(this.searchForm, 'xls').then(data => {
        this.createDownloadXlsFile('対応履歴', data);
      }).catch(() => {
        this.$message({
          message: '選択しているデータは多すぎます。出力のデータをもっと絞り込んでください。',
          type: 'error',
        });
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    changeActionUserSearch() {
      if (!this.searchForm.actionUser) {
        this.actionUserOptions = this.defaultActionUserOptions;
        this.pageActionUser = 1;
        this.queryActionUser = null;
      }
    },
    async loadmoreActionUsers() {
      if (this.pageActionUser) {
        this.pageActionUser++;
        const res = await this.searchUser({ name: this.queryActionUser, page: this.pageActionUser });
        this.actionUserOptions = this.actionUserOptions.concat(res.data);
        if (res.current_page >= res.last_page) {
          this.pageActionUser = 0;
        }
      }
    },
    async searchActionUsers(query = null) {
      this.queryActionUser = query;
      this.pageActionUser = 1;
      const res = await this.searchUser({ id: this.searchForm.actionUser, name: query });
      this.actionUserOptions = res.data;
      if (res.current_page >= res.last_page) {
        this.pageActionUser = 0;
      }
    },
    async searchUser(params) {
      if (!_.isEmpty(params)) {
        return await userResource.searchName(params);
      }
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
      const res = await this.searchNameStudent({ snz_internalcode: this.searchForm.studentCode, fullname: query });
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
    deleteActions(id){
      this.$confirm(this.commonText.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        actionResource.destroy(id).then(response => {
          this.$message({
            type: 'success',
            message: '削除しました。',
          });
          this.$router.go();
        }).catch(() => {
          this.$message({
            type: 'error',
            message: 'この操作は実行できません。',
          });
          this.$router.go();
        });
      }).catch();
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/common-form';
/deep/ .el-card__body {
  padding: 15px 20px;
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

/deep/ .page-body {
  height: calc(100% - 110px);

  span.icon-calendar {
    margin-left: 5px;
  }

  /deep/ .custom-pagination {
    text-align: center;
    margin: 0;
    padding-top: 20px;
    height: 60px;
    background-color: #f0f0f0;

    button.btn-prev, button.btn-next {
      background: #FFFFFF;
    }
  }
}
/deep/ .search-container{
  .el-col .el-form-item .el-form-item__label {
    padding-right: 10px;
    padding-left: 0 !important;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-col {
    margin-right: 0pt;
  }
  .icon-input__calendar {
    position: absolute;
    top: 10px;
    right: 11px;
    pointer-events: none;
  }
}

/deep/ .el-row {
  flex-wrap: wrap;
  .el-form-item__content{
    width: 174px;
    .el-select__input{
      border: none !important;
    }
  }
  .el-select {
    ::placeholder{
      letter-spacing: 0.24px;
      color: #1A1714;
      opacity: 1;
    }
  }
  .no-border {
    .el-date-editor input.el-input__inner{
      background: #F0F0F0 0% 0% no-repeat padding-box;
      border-radius: 6px !important;
      border: none !important;
    }
    ::placeholder {
      text-align: left;
      font: normal normal normal 15px/45px Noto Sans JP;
      letter-spacing: 0.24px;
      color: #7B7B7B !important;
      opacity: 1;
    }
  }
  &.bot {
    .el-col:first-child{
      width: 271px !important;
    }
    .el-col:nth-child(2) {
      width: 228px !important;
      margin-left: 21px;
    }
    .el-col:nth-child(3) {
      width: 426px !important;
      margin-left: 21px;
    }
    .el-col:nth-child(5) {
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
.bot{
  display: flex;
  align-items: center;
  .search-right {
    margin-left: auto;
  }
}
.d-flex {
  display: flex;
  margin-right: auto;
}
.between-date {
  padding-left: 10px;
}

.search-button {
  margin-top: -8px;
  float: right
}
/deep/  table {
  thead {
    tr {
      th {
        padding: 0!important;
      }
      th:first-child {
        padding-left: 20px !important;
      }
      th:nth-child(6) {
        padding-right: 20px !important;
      }
    }
  }
  tbody {
    tr {
      td:first-child {
        padding-left: 20px !important;
      }
      td:nth-child(2),
      td:nth-child(3),
      td:nth-child(4),
      td:nth-child(5),
      td:nth-child(6){
        padding-left: 0px !important;
      }
    }
  }
}

/deep/ .card-body__content {
  .table-content table {
    td {
      border-bottom: 1px solid #d6d6d6;
      padding: 7px 0px;
      font-size: 14px;
    }
    button.btn-delete svg {
      width: 30px;
      height: 30px;
    }
    button.btn-delete {
      margin-right: 0 ;
    }
    button.btn-edit {
      margin-left: 10px;
    }
  }
}
</style>
