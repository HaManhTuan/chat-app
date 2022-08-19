<template>
  <div id="app-container" class="app-container">
    <el-card shadow="false" class="rounded search-container">
      <el-form ref="searchForm" class="search form-search" :model="searchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label-width="40px" label="名前">
              <el-input v-model="searchForm.name" maxlength="100" style="margin-left: -3px; width: 186px;" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="117px" label="メールアドレス">
              <el-input v-model="searchForm.email" maxlength="100" style="width: 186px;" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="59px" label="ロール">
              <el-select v-model="searchForm.roleId" clearable no-data-text="データはありません。" placeholder="">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  style="padding-left:20px;"
                  :label="item.name_jp"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <ButtonSearch @search="search" />
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
        highlight-current-row
        :empty-text="CommonTxt.tableEmptyTxt"
        height="100%"
      >
        <el-table-column width="159px" label="名前">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="258px" label="メールアドレス">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column width="250px" label="所属(ロール)">
          <template slot-scope="scope">
            <span class="ellipsis" v-html="scope.row.roles ? getRoleName(scope.row.roles) : ''" />
          </template>
        </el-table-column>
        <el-table-column width="162px" label="最終ログイン日時">
          <template slot-scope="scope">
            <span>{{ scope.row.last_login_date | parseTime('{y}/{m}/{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="140px" label="作成日">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | parseTime('{y}/{m}/{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="90px" label="ロック状態" row-class-name="action">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_locked"
              :active-value="1"
              :inactive-value="0"
              @change="changeLock(scope.row.id, scope.row.is_locked)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="詳細編集" width="80px">
          <template slot-scope="scope">
            <router-link :to="{ name: 'editUser', params: { id: scope.row.id, query: paginateForm }}">
              <el-button class="button-action-edit">
                <svg-icon icon-class="_edit_002" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-row class="footer__group">
        <el-col :span="6">
          <div />
        </el-col>
        <el-col :span="12">
          <CustomPagination
            v-show="total > searchForm.limit"
            :total="total"
            :page.sync="paginateForm.page"
            :limit.sync="searchForm.limit"
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
            <ButtonCreate @create="UserCreate" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ButtonCreate from '../../components/Common/Button/ButtonCreate';
import CommonSettings from '@/const/CommonSettings';
import { parseTime } from '../../utils';
import UserResource from '@/api/user';
const userResource = new UserResource();

export default {
  name: 'User',
  metaInfo: {
    title: 'ユーザー一覧',
  },
  components: {
    CustomPagination,
    ButtonExport,
    ButtonSearch,
    ButtonCreate,
  },
  filters: {
    parseTime(time, cFormat) {
      if (time) {
        const format = cFormat || '{y}/{m}/{d}';
        return parseTime(time, format);
      }
      return '';
    },
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      deleteLoading: false,
      exportLoading: false,
      roleOptions: [],
      paginateForm: {
        page: 1,
      },
      organizationOptions: [],
      searchForm: {
        name: '',
        email: '',
        roleId: '',
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
    };
  },
  async created() {
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.paginateForm = this.copyAttributes(this.$route.query, this.paginateForm);
    this.roleOptions = await userResource.fetchRole();
    this.organizationOptions = await userResource.fetchOrg();
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.search(this.searchForm.page ?? 1);
  },
  methods: {
    async getList(forceQuery = null) {
      const query = this.buildQuery(forceQuery || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      this.listLoading = true;
      const res = await userResource.list({ ...this.query, ...forceQuery || this.searchForm });
      this.setData(res);
      this.scrollTopTable();
      this.listLoading = false;
    },
    setData(data) {
      this.list = data.data;
      this.total = data.total;
    },
    async search(page){
      this.listLoading = true;
      this.searchForm.page = page || 1;
      await this.getList();
      this.listLoading = false;
      this.paginateForm = this.$_.clone(this.searchForm);
    },
    UserCreate(){
      this.$router.push({ name: 'UserCreate' });
    },
    changeLock(id, is_locked) {
      userResource.updateLock(id, is_locked).then(response => {
      }).catch(() => {
        this.$router.go();
      });
    },
    async handleExport() {
      if (!this.exportLoading) {
        this.exportLoading = true;
      } else {
        return;
      }
      await userResource.exportResource(this.searchForm, 'xls').then(data => {
        this.createDownloadXlsFile('ユーザー一覧', data);
        this.exportLoading = false;
      });
    },
    getRoleName(roles) {
      let roleName = '';
      roles.forEach((role, key) => {
        if (key === 0){
          roleName += this.getOrganizationName(role.pivot.organization_id) + ' (' + role.name_jp + ')';
        } else {
          roleName = roleName + '</br>' + this.getOrganizationName(role.pivot.organization_id) + ' (' + role.name_jp + ')';
        }
      });
      return roleName;
    },
    getOrganizationName(id) {
      if (this.organizationOptions.find(x => x.id === id)) {
        return this.organizationOptions.find(x => x.id === id).name;
      } else {
        return '―';
      }
    },
  },
};
</script>
<style scoped lang="scss">
/deep/ .el-table--medium td {
  padding: 0px !important;
  height: 47px;
}
/deep/ .search-container{
  .el-col:last-child{
    position: absolute;
    right: 0;
    margin-right: 0px;
    bottom: -5px;
  }
  .el-select{
    .el-input__inner {
      width: 174px;
    }
  }
  .el-form-item{
    margin-bottom: 0px;
    .el-form-item__label, .el-input__inner {
      font-weight: 400;
    }
  }
}
// custom table
.page-body::v-deep {
  height: calc(100% - 166px);
  margin-top: 20px;
  .button-action{
    border: none;
    padding: 7px;
    background: #F4F8FD;
    svg{
      width: 15px;
      height: 15px;
    }
  }
  .button-action-edit{
    border: none;
    background: #F4F8FD;
    padding: 0;
    svg{
     font-size: 28px;
    }
  }
  .block-table {
    table {
      th:nth-child(7) .cell {
        font-size: 9px;
      }
      th:first-child {
        padding-left: 10px;
      }
      td:first-child {
        padding-left: 10px !important;
      }
    }
  }
  .el-table thead th .cell {
    margin-top: -4px;
  }
}
.group-button::v-deep {
  padding-top: 0px;
  .button-create,
  .button-export {
    svg {
      margin-right: 2px;
    }
  }
}
</style>
