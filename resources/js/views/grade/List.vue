<template>
  <div id="app-container" class="app-container">
    <el-card shadow="false" class="rounded search-container">
      <el-form ref="searchForm" class="search form-search" :model="searchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label-width="38px" label="学年">
              <el-input v-model="searchForm.name" maxlength="5" style="margin-left: -3px;" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" label="学年コード">
              <half-size-number v-model="searchForm.gradeCode" :maxlength="3" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="66px" label="学校区分">
              <el-select
                v-model="searchForm.schoolType"
                clearable
                filterable
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                placeholder=""
              >
                <el-option
                  v-for="item in schoolTypeOptions"
                  :key="item.id"
                  :label="item.snz_name"
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
        <el-table-column width="180px" label="学年名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" label="学年コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_gradecode }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="190px" label="実学年">
          <template slot-scope="scope">
            <span>{{ actualGradeOptions[scope.row.snz_actualgrade] ? actualGradeOptions[scope.row.snz_actualgrade] : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="180px" label="学校区分">
          <template slot-scope="scope">
            <span>{{ scope.row.school_type ? scope.row.school_type.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="140px" label="作成日">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | parseTime('{y}/{m}/{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="130px" label="修正日">
          <template slot-scope="scope">
            <span>{{ scope.row.updated_at | parseTime('{y}/{m}/{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80px" align="center" label="詳細編集">
          <template slot-scope="scope">
            <router-link :to="{ name: 'editGrade', params: { id: scope.row.id, query: paginateForm }}">
              <el-button class="button-action-edit">
                <svg-icon icon-class="_edit_002" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column width="60px" label="削除">
          <template slot-scope="scope">
            <ButtonDeleteChild @delete="deleteGrade(scope.row.id)" />
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
        <el-col :span="6" class="group-button">
          <ButtonExport :loading="exportLoading" type="excel" @export="handleExport" />
          <ButtonCreate @create="GradeCreate" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import CommonSettings from '@/const/CommonSettings';
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import ButtonCreate from '../../components/Common/Button/ButtonCreate';
import HalfSizeNumber from '../../components/Common/InputNumber';
import ButtonDeleteChild from '../../components/Common/Button/ButtonDeleteChild';
import { parseTime } from '../../utils';
import GradeRequest from '@/api/gradeRequest';
const gradeRequest = new GradeRequest();
export default {
  components: {
    ButtonCreate,
    CustomPagination,
    ButtonExport,
    ButtonSearch,
    ButtonDeleteChild,
    HalfSizeNumber,
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
      schoolTypeOptions: [
      ],
      searchForm: {
        gradeCode: '',
        name: '',
        schoolType: '',
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      actualGradeOptions: [],
    };
  },
  async created() {
    this.schoolTypeOptions = await gradeRequest.fetchSchoolType();
    this.actualGradeOptions = await gradeRequest.fetchActualGrade();
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.search(this.searchForm.page ?? 1);
  },
  methods: {
    async getList(forceQuery = null){
      const query = this.buildQuery(forceQuery || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      this.listLoading = true;
      const res = await gradeRequest.listGrade({ ...this.query, ...forceQuery || this.searchForm });
      this.list = res.data;
      this.total = res.total;
      this.scrollTopTable();
      this.listLoading = false;
    },
    async search(page){
      this.listLoading = true;
      this.searchForm.page = page || 1;
      await this.getList();
      this.listLoading = false;
      this.paginateForm = this.$_.clone(this.searchForm);
    },
    deleteGrade(id) {
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        gradeRequest.destroy(id).then(response => {
          this.$message({
            type: 'success',
            message: '削除しました。',
          });
          this.search(this.paginateForm.page ?? 1);
        }).catch(err => {
          if (err.response.status === 410) {
            this.search(this.paginateForm.page ?? 1);
            this.$message({
              message: this.CommonTxt.deleteFail,
              type: 'error',
              duration: 1500,
            });
          }
          if (err.response.status === 424) {
            this.$message({
              type: 'error',
              message: err.response.data[0],
            });
          }
        });
      }).catch(() => {
        return false;
      });
    },
    GradeCreate() {
      this.$router.push({ name: 'GradeCreate' });
    },
    async handleExport(){
      if (!this.exportLoading) {
        this.exportLoading = true;
      } else {
        return;
      }
      await gradeRequest.exportResource(this.searchForm, 'xls').then(data => {
        this.createDownloadXlsFile('学年', data);
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
    margin-right: 0px;
    bottom: -10px;
  }
  .el-form-item{
    margin-bottom: 0px;
  }
  .search-btn {
    margin-bottom: 5px;
  }
}
/deep/.page-body {
  height: calc(100% - 171px);
  .block-table {
    table {
      th:first-child {
        padding-left: 10px;
      }
      td:first-child {
        padding-left: 10px !important;
      }
    }
  }
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
  .el-table thead th .cell {
    margin-top: -3.5px;
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
.footer::v-deep {
  margin-top: 22px;
  .el-col-12 {
    margin-top: -26px;
  }
}
</style>
