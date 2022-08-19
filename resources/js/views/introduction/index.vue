<template>
  <div v-loading="loading">
    <div id="app-container" class="app-container">
      <el-card shadow="false" class="rounded search-container">
        <el-form ref="searchForm" class="form-search" :model="searchForm">
          <el-row justify="space-between" class="bot">
            <div class="search-left">
              <el-col :span="6">
                <el-form-item label-width="108px" label="氏名(紹介先)">
                  <el-input v-model="searchForm.name" placeholder="" maxlength="201" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="108px" label="紹介元生徒氏名">
                  <el-select
                    v-model="searchForm.internalCode"
                    v-loadmore="loadmoreStudent"
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
                <el-form-item label-width="109px" label="紹介ステータス">
                  <el-select v-model="searchForm.introductionStatus" placeholder="" clearable>
                    <el-option
                      v-for="item in introductionStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
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
          :header-cell-style="tableHeaderColor"
          :empty-text="commonText.tableEmptyTxt"
        >
          <el-table-column min-width="202px" label="氏名(紹介先)">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_lastname +' '+ scope.row.snz_firstname }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="170px" label="紹介ステータス">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_introductionstatus | mapOptions(introductionStatusOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="145px" label="現在の学年">
            <template slot-scope="scope">
              <span class="ellipsis">{{ !(scope.row.grade == null)? scope.row.grade.snz_name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="211px" label="紹介元生徒氏名">
            <template slot-scope="scope">
              <span class="ellipsis">{{ !(scope.row.student == null)? scope.row.student.fullname : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="138px" label="紹介者続柄">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_relationship | mapOptions(relationshipIntroductionOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="160px" label="紹介日">
            <template slot="header">
              <div class="cell">紹介日 <span v-sortable="sortChange" /></div>
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.snz_introductiondate | dateFormat }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="72px" label="詳細編集" row-class-name="action">
            <template slot-scope="scope">
              <router-link :to="{ name: 'introductions-detail', params: { id: scope.row.id }}">
                <el-button class="btn-edit" size="mini">
                  <svg-icon icon-class="_edit" />
                </el-button>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column v-if="ableRole(['system'])" width="46px" label="削除" row-class-name="action">
            <template slot-scope="scope">
              <el-button class="btn-delete" size="mini" @click="deleteIntroductions(scope.row.id)">
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
  </div>
</template>
<script>
import CustomPagination from '../../components/Common/Pagination/CustomPagination';
import IntroductionResource from '@/api/introduction';
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import { mapGetters } from 'vuex';
import StudentResource from '@/api/student';
import role from '@/directive/role';
import permission from '@/directive/permission';
import _ from 'lodash';
import CommonSettings from '@/const/CommonSettings';
import { mapOptions } from '@/filters/mapOptions';
import { name as introductionStatusName, options as introductionStatusOptions } from '@/const/IntroductionStatus';
import { options as relationshipIntroductionOptions } from '@/const/RelationshipIntroduction';
import sortable from '@/directive/el-table/sortable';
import loadmore from '@/directive/selection';

const introductionResource = new IntroductionResource();
const studentResource = new StudentResource();
export default {
  name: 'IntroductionList',
  metaInfo: {
    title: '紹介',
  },
  components: {
    CustomPagination,
    ButtonSearch,
    ButtonExport,
  },
  directives: { permission, role, sortable, loadmore },
  filters: {
    mapOptions: mapOptions,
  },
  mixins: [],
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      studentOptions: null,
      IntroductionUserOptions: null,
      introductionStatusName: introductionStatusName,
      introductionStatusOptions: introductionStatusOptions,
      relationshipIntroductionOptions: relationshipIntroductionOptions,
      tableForm: {
        list: [],
      },
      searchForm: {
        sort: null,
        name: null,
        internalCode: null,
        introductionStatus: null,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      searchSubmitForm: {
        sort: null,
        name: null,
        internalCode: null,
        introductionStatus: null,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      total: 0,
      listLoading: true,
      exportLoading: false,
      query: {
        page: 1,
        limit: 20,
      },
      queryStudent: null,
      defaultStudentOptions: [],
      loading: false,
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  created() {
    this.loading = true;
    this.roles = this.$store.getters.roles;
    this.init();
    this.loading = false;
  },
  methods: {
    async init() {
      this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
      this.searchForm.studentCode = this.searchForm.studentCode ? this.searchForm.studentCode.toString() : null;
      this.searchSubmitForm = Object.assign({}, this.searchForm);
      await this.searchStudents();
      await this.fetchData();
      this.defaultStudentOptions = this.studentOptions;
    },
    tableHeaderColor() {
      return 'background-color: #535353;color:#fff;padding-left:15px';
    },
    async sortChange(sort) {
      this.searchForm.sort = sort;
      await this.getList();
    },
    async setDefaultSearch() {
      this.searchSubmitForm = this.setDefaultForm();
      this.searchForm = this.setDefaultForm();
      await this.fetchData();
    },
    setDefaultForm() {
      return {
        sort: null,
        name: null,
        page: null,
        internalCode: null,
        introductionStatus: null,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      };
    },
    async submitSearch() {
      await this.submitQuery('search');
      this.searchSubmitForm = Object.assign({}, this.searchForm);
      this.fetchData();
    },
    async fetchData() {
      this.listLoading = true;
      const res = await introductionResource.list({ ...this.query, ...this.searchSubmitForm });
      this.tableForm.list = res.data;
      this.total = res.total;
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
    async handleExport() {
      this.exportLoading = true;
      await introductionResource.exportResource(this.searchForm, 'xls').then(data => {
        this.createDownloadXlsFile('紹介', data);
      }).catch(() => {
        this.$message({
          message: '選択しているデータは多すぎます。出力のデータをもっと絞り込んでください。',
          type: 'error',
        });
      }).finally(() => {
        this.exportLoading = false;
      });
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
        const res = await studentResource.searchName(params);
        return res;
      }
    },
    deleteIntroductions(id){
      this.$confirm(this.commonText.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        introductionResource.destroy(id).then(response => {
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
     margin-bottom: 0px !important;
   }
  .el-col {
    margin-right: 0pt;
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
      width: 282px !important;
    }
    .el-col:nth-child(2) {
      width: 282px !important;
      margin-left: 21px;
    }
    .el-col:nth-child(3) {
      width: 273px !important;
      margin-left: 21px;
    }
    .el-col:nth-child(4) {
      float: right;

      .el-form-item__content {
        text-align: right;
        width: 100%;
      }
    }
    .m-right{
      text-align: right;
    }
  }
}
.top{
  .el-form-item{
    margin-bottom: 17px;
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
  padding-right: 10px;
  padding-top: 10px;
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
      padding: 7px 10px 7px 0px;
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
