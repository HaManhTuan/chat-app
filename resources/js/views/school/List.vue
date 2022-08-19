<template>
  <div id="app-container" class="app-container">
    <el-card shadow="false" class="rounded search-container">
      <el-form ref="searchForm" class="search form-search" :model="searchForm" :rules="rules">
        <el-row>
          <el-col :span="6">
            <el-form-item label-width="52px" label="学校名">
              <el-input v-model="searchForm.schoolName" style="margin-left: -3px;" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="学校コード" prop="schoolCode">
              <el-input v-model="searchForm.schoolCode" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="66px" label="学校種別">
              <el-select v-model="searchForm.schoolType" clearable no-data-text="データはありません。" placeholder="">
                <el-option
                  v-for="item in schoolOptions"
                  :key="item.id"
                  :label="item.name"
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
        height="100%"
        empty-text="データはありません。"
      >
        <el-table-column width="230px" label="学校名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="230px" label="学校コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_schoolcode }}</span>
          </template>
        </el-table-column>
        <el-table-column width="190px" label="学期区分">
          <template slot-scope="scope">
            <span>{{ getNameSemester(scope.row.snz_semester) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="190px" label="学校種別">
          <template slot-scope="scope">
            <span>{{ getNameSchoolType(scope.row.snz_school_type_id) !== undefined ? getNameSchoolType(scope.row.snz_school_type_id).name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="130px" label="作成日">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | parseTime('{y}/{m}/{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" align="center" label="詳細編集">
          <template slot-scope="scope">
            <router-link :to="{ name: 'SchoolEdit', params: { id: scope.row.id, query: paginateForm }}">
              <el-button class="button-action-edit">
                <svg-icon icon-class="_edit_002" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column width="70px" label="削除">
          <template slot-scope="scope">
            <ButtonDeleteChild :loading="delete_row['scope.row.id']" @delete="deleteSchool(scope.row.id)" />
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
            :limit.sync="searchForm.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination"
            @pagination="func => getList(paginateForm)"
          />
        </el-col>
        <el-col :span="6" class="group-button">
          <ButtonExport :loading="exportLoading" type="excel" @export="handleExport" />
          <ButtonCreate @create="SchoolCreate" />
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
import ButtonDeleteChild from '../../components/Common/Button/ButtonDeleteChild';
import { validate } from './assets/validate';
import { parseTime } from '../../utils';
import SchoolResource from '@/api/school';
import { Message } from 'element-ui';
const schoolResource = new SchoolResource();

export default {
  name: 'School',
  metaInfo: {
    title: '学校',
  },
  components: {
    ButtonCreate,
    CustomPagination,
    ButtonExport,
    ButtonSearch,
    ButtonDeleteChild,
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
  mixins: [validate],
  data(){
    return {
      list: [
      ],
      paginateForm: {
        page: 1,
      },
      total: 0,
      check: 0,
      listLoading: true,
      deleteLoading: false,
      exportLoading: false,
      schoolOptions: '',
      schoolType: null,
      snz_school_type_id: '',
      semesters: '',
      searchForm: {
        schoolName: '',
        schoolCode: '',
        schoolType: '',
        page: 1,
        limit: 20,
      },
      delete_row: [],
    };
  },
  async created(){
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    const res = await schoolResource.fetchCommon();
    this.setCommon(res.original);
    this.search(this.searchForm.page ?? 1);
  },
  methods: {
    async getList(forceQuery = null){
      const query = this.buildQuery(forceQuery || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      this.listLoading = true;
      const res = await schoolResource.list({ ...this.query, ...forceQuery || this.searchForm });
      this.setData(res);
      this.scrollTopTable();
      this.listLoading = false;
    },
    setData(data){
      this.list = data.data;
      this.total = data.total;
    },
    setCommon(data) {
      this.semesters = data.semesters;
      this.schoolOptions = data.schooTypes;
    },
    getNameSchoolType(id){
      const newId = id - 1;
      return this.schoolOptions[newId];
    },
    getNameSemester(id){
      return this.semesters[id];
    },
    async search(page){
      this.listLoading = true;
      this.searchForm.page = page || 1;
      await this.getList();
      this.listLoading = false;
      this.paginateForm = this.$_.clone(this.searchForm);
    },
    SchoolCreate(){
      this.$router.push({ name: 'SchoolCreate' });
    },
    deleteSchool(id){
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        this.delete_row[id] = true;
        schoolResource.destroy(id).then(response => {
          this.$message({
            type: 'success',
            message: '削除しました。',
          });
          this.list = this.list.filter((i) => i.id !== id);
          this.total -= 1;
          this.delete_row[id] = false;
        }).catch((err) => {
          if (err.response.status === 424) {
            Message({
              message: this.CommonTxt.deleteNotPermission,
              type: 'error',
              duration: 1500,
            });
          }
          if (err.response.status === 410) {
            this.redirectPage({ 'name': 'err_404', params: { redirect: true }});
          }
        });
      });
    },
    async handleExport() {
      if (!this.exportLoading) {
        this.exportLoading = true;
      } else {
        return;
      }
      await schoolResource.exportResource(this.searchForm, 'xls').then(data => {
        this.createDownloadXlsFile('学校', data);
        this.exportLoading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .search-container{
  .el-col:last-child{
    position: absolute;
    right: 0;
    bottom: -4.5px;
    margin-right: 0px;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
}
/deep/ .el-table--medium td {
  padding: 0 !important;
  height: 47px;
}
.page-body::v-deep {
  height: calc(100% - 169px);
  .button-action{
    border: none;
    padding: 7px;
    background: #F4F8FD;
    margin-left: 0px;
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
      th:first-child {
        padding-left: 10px;
      }
      td:first-child {
        padding-left: 10px !important;
      }
      thead th .cell {
        margin-top: -3px;
      }
    }
  }
}
/deep/ .footer__group {
  .el-col-12 {
    margin-top: -10px;
  }
  margin-top: 4px;
}
.group-button::v-deep {
  .button-create,
  .button-export {
    svg {
      margin-right: 2px;
    }
  }
}
</style>
