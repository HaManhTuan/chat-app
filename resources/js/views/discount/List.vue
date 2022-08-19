<template>
  <div id="app-container" class="app-container">
    <el-card shadow="false" class="rounded search-container">
      <el-form ref="searchForm" class="search form-search" :model="searchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label-width="52px" prop="discountName" label="割引名">
              <el-input v-model="searchForm.discountName" maxlength="100" style="margin-left: -3px;" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="80px" prop="discountCode" label="割引コード">
              <half-size-input v-model="searchForm.discountCode" :maxlength="20" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6" />
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
        <el-table-column width="110px" label="割引コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_discountcd }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="120px" label="割引名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="110px" label="事業本部">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.headdivision ? scope.row.headdivision.snz_headdivision : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="110px" label="事業部">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.division ? scope.row.division.snz_division : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="110px" label="エリア">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.area ? scope.row.area.snz_area : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80px" label="ユニット">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.unit ? scope.row.unit.snz_unit : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="115px" label="学年">
          <template slot-scope="scope">
            <span class="ellipsis" v-html="scope.row._grades ? getGradeName(scope.row._grades) : ''" />
          </template>
        </el-table-column>
        <el-table-column width="60px" label="年度">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_schoolyear }}</span>
          </template>
        </el-table-column>
        <el-table-column width="95px" label="有効期限">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.expired_date | parseTime('{y}/{m}/{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" label="作成日">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.created_at | parseTime('{y}/{m}/{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80px" align="center" label="詳細編集">
          <template slot-scope="scope">
            <router-link :to="{ name: 'editDiscount', params: { id: scope.row.id, query: paginateForm }}">
              <el-button class="button-action-edit">
                <svg-icon icon-class="_edit_002" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column width="60px" label="削除">
          <template slot-scope="scope">
            <ButtonDeleteChild @delete="deleteDiscount(scope.row.id)" />
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
          <ButtonCreate @create="DiscountCreate" />
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
import HalfSizeInput from '@/components/Common/HalfSizeNumber';
import CommonSettings from '@/const/CommonSettings';
import DiscountRequest from '@/api/DiscountRequest';
const discountRequest = new DiscountRequest();
export default {
  name: 'Discount',
  metaInfo: {
    title: '割引管理',
  },
  components: {
    ButtonCreate,
    CustomPagination,
    ButtonExport,
    ButtonSearch,
    ButtonDeleteChild,
    HalfSizeInput,
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
      searchForm: {
        discountCode: null,
        discountName: '',
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
    };
  },
  async mounted(){
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.search(this.searchForm.page ?? 1);
  },
  methods: {
    async getList(forceQuery = null){
      const query = this.buildQuery(forceQuery || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      this.listLoading = true;
      const res = await discountRequest.listDiscount({ ...this.query, ...forceQuery || this.searchForm });
      this.setData(res);
      this.scrollTopTable();
      this.listLoading = false;
    },
    setData(data) {
      this.list = data.data;
      this.total = data.total;
    },
    async search(page){
      this.$refs.searchForm.validate(async(valid) => {
        if (valid) {
          this.listLoading = true;
          this.searchForm.page = page || 1;
          await this.getList();
          this.listLoading = false;
          this.paginateForm = this.$_.clone(this.searchForm);
        }
      });
    },
    getGradeName(grades) {
      let gradeName = '';
      grades.forEach((grade, key) => {
        if (key === 0){
          gradeName += grade.snz_name;
        } else {
          gradeName = gradeName + ',</br>' + grade.snz_name;
        }
      });
      return gradeName;
    },
    DiscountCreate(){
      this.$router.push({ name: 'DiscountCreate' });
    },
    deleteDiscount(id){
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        discountRequest.destroy(id).then(response => {
          this.$message({
            type: 'success',
            message: '削除しました。',
          });
          this.getList();
        }).catch((err) => {
          if (err.response.status === 410) {
            this.getList();
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
              duration: 1500,
            });
          }
        });
      }).catch(() => {
        return false;
      });
    },
    async handleExport() {
      if (!this.exportLoading) {
        this.exportLoading = true;
      } else {
        return;
      }
      await discountRequest.exportResource(this.searchForm, 'xls').then(data => {
        this.createDownloadXlsFile('割引管理', data);
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
  height: calc(100% - 176px);
  .block-table {
    table {
      .cell {
        font: normal normal normal 13px Noto Sans JP;
        color: #1A1714;
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
