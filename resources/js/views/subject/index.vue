<template>
  <div class="app-container">
    <div class="block-search">
      <el-form ref="searchForm" class="form-search" :model="searchForm">
        <div class="div-left">
          <el-form-item label-width="82px" label="科目コード">
            <half-size-number v-model="searchForm.snz_subjectcd" :maxlength="8" />
          </el-form-item>
          <el-form-item label-width="75px" label="科目名">
            <el-input v-model="searchForm.snz_name" :maxlength="100" clearable />
          </el-form-item>
        </div>
        <div class="div-right">
          <button-search @search="submitSearch" />
        </div>
      </el-form>
    </div>
    <!--    height="calc(100% - 20px)"-->
    <div class="card-body__content">
      <el-table
        v-loading="listLoading"
        :empty-text="CommonTxt.tableEmptyTxt"
        class="table-content"
        :data="list"
        fit
        highlight-current-row
        header-cell-class-name="my-header"
        height="100%"
      >
        <el-table-column width="171px" label="科目コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_subjectcd }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="338px" label="科目名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="125px" label="開始年月">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_startmonth | parseTime('{y}/{m}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="122px" label="終了年月">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_endmonth | parseTime('{y}/{m}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="122px" label="作成日">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.created_at | parseTime() }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="60px" label="詳細編集" row-class-name="action">
          <template slot-scope="scope">
            <router-link :to="{name:'SubjectMasterEdit',params:{id:scope.row.id, query: formQuery}}">
              <el-button class="btn-edit" size="mini">
                <svg-icon icon-class="_edit" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="削除" width="67px">
          <template slot-scope="scope">
            <el-button class="btn-delete" @click.prevent="deleteData(scope.row)">
              <svg-icon icon-class="_trash" />
            </el-button>
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
          <custom-pagination
            v-show="lastPage>1"
            :total="total"
            :page.sync="formQuery.page"
            :limit.sync="formQuery.limit"
            layout="prev, pager, next"
            class="position-center"
            prev-text="<"
            next-text=">"
            @pagination="getList"
          />
        </el-col>
        <el-col :span="6">
          <div class="group-button">
            <button-export :loading="exportLoading" type="excel" @export="exportIntoCSV" />
            <router-link :to="{ name: 'SubjectMasterCreate'}">
              <button-create />
            </router-link>
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
import ContractSubjectMstResource from '@/api/contractSubjectMst';
import { Message } from 'element-ui';
import { parseTime } from '@/utils';
import CommonSettings from '../../const/CommonSettings';
import { calcTimeWithTimeZone } from '@/helpers/mixins/CalcTimeZone';
import HalfSizeNumber from '@/components/Common/HalfSizeNumber';

const contractSubjectMstResource = new ContractSubjectMstResource();
export default {
  name: 'Index',
  metaInfo: {
    title: '受講科目マスタ',
  },
  components: {
    HalfSizeNumber,
    CustomPagination,
    ButtonExport,
    ButtonSearch,
    ButtonCreate,
  },
  filters: {
    parseTime(time, cFormat) {
      time = calcTimeWithTimeZone(time);
      if (time) {
        time = new Date(time);
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
      lastPage: 1,
      listLoading: true,
      checkQuerySearch: false,
      searchForm: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        snz_subjectcd: '',
        snz_name: '',
      },
      formQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        snz_subjectcd: '',
        snz_name: '',
      },
      exportLoading: null,
      searching: false,
    };
  },
  created() {
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.formQuery = this.copyAttributes(this.$route.query, this.formQuery);
    this.getList();
  },
  methods: {
    async submitSearch() {
      if (this.searching) {
        return;
      }
      this.searching = true;
      this.searchForm.page = 1;
      Object.assign(this.formQuery, this.searchForm);
      await this.getList();
      this.searching = false;
    },
    async getList() {
      this.listLoading = true;
      const query = this.buildQuery(this.formQuery);
      window.history.replaceState(null, null, `?${query}`);
      const res = await contractSubjectMstResource.list({ ...this.formQuery });
      this.list = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.listLoading = false;
      this.scrollTopTable();
    },
    deleteData(data) {
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(async() => {
        this.listLoading = true;
        await contractSubjectMstResource.destroy(data.id).then(() => {
          this.updateArrayData(data.id);
          Message({
            message: this.CommonTxt.deleteSuccess,
            type: 'success',
            duration: 1500,
          });
        }).catch((err) => {
          if (err.response.status === 410) {
            this.getList();
            Message({
              message: this.CommonTxt.deleteFail,
              type: 'error',
              duration: 1500,
            });
          }
          if (err.response.status === 424) {
            Message({
              message: this.CommonTxt.deleteNotPermission,
              type: 'error',
              duration: 1500,
            });
          }
        });
        this.listLoading = false;
      }).catch(() => {
        return false;
      });
    },
    updateArrayData(id, item = null) {
      const index = this.list.findIndex(item => {
        return (id === item.id);
      });
      if (item) {
        this.list.splice(index, 1, item);
      } else {
        this.list.splice(index, 1);
      }
    },
    async exportIntoCSV() {
      this.exportLoading = true;
      await contractSubjectMstResource.exportCSV(this.formQuery).then(data => {
        this.createDownloadXlsFile('受講科目マスタ', data);
      }).catch(() => {
        this.$message({
          message: '選択しているデータは多すぎます。出力のデータをもっと絞り込んでください。',
          type: 'error',
        });
      }).finally(() => {
        this.exportLoading = false;
      });
    },
  },
};
</script>
<style lang="scss">
#app {
  overflow-y: hidden;
}

</style>
<style scoped lang="scss">
@import "./styles/index";
</style>
