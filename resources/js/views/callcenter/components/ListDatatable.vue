<template>
  <div class="list-table">
    <el-form ref="tableForm">
      <el-table
        ref="table"
        v-loading="listLoading"
        class="list-table"
        :data="list"
        fit
        height="100%"
        highlight-current-row
        style="width: 100%"
        :default-sort="{prop: searchForm.sort_by, order: searchForm.sortDirection}"
        :empty-text="CommonTxt.tableEmptyTxt"
        @sort-change="sortChange"
      >
        <el-table-column label="作成日" fixed min-width="115px" prop="created_at" sortable>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.created_at | parseTime('{y}/{m}/{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="問合せ方法" width="120px" prop="snz_inquirytype" sortable>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_inquirytype | filterInquiryType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="事業部" min-width="91px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.business_unit.division ? scope.row.business_unit.division.snz_division : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="105px" label="校舎">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.business_unit ? scope.row.business_unit.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学年" prop="grade_name" sortable min-width="90px">
          <template slot="header">
            <div class="cell">学年 </div>
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生徒氏名" prop="firstname" sortable min-width="120px">
          <template slot="header">
            <div class="cell">生徒氏名 </div>
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.lastname + ' ' + scope.row.firstname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="フリガナ" prop="snz_yomifirstname" sortable>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_yomilastname + ' ' + scope.row.snz_yomifirstname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="電話番号">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_telephone }}</span>
          </template>
        </el-table-column>

        <el-table-column label="担当者" prop="userincharge" sortable>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.userincharge }}</span>
          </template>
        </el-table-column>
        <el-table-column label="架電状況" prop="snz_call_status" sortable>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_call_status | filterCallstatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="結果" prop="snz_call_result" sortable>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_call_result | filterCallresult }}</span>
          </template>
        </el-table-column>
        <el-table-column label="架電日時" prop="snz_call_datetime" sortable min-width="120px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_call_datetime | parseTime('{y}/{m}/{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="詳細編集" fixed="right" width="90" row-class-name="action">
          <template slot-scope="scope">
            <router-link :to="{ name: 'toiawase-detail', params: { id: scope.row.id }}">
              <el-button class="btn-edit" size="mini">
                <svg-icon icon-class="_edit" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="footer">
      <el-row class="footer__group">
        <el-col :span="6" />
        <el-col :span="12">
          <CustomPagination
            v-show="last_page > 1"
            :total="total"
            :page.sync="searchForm.page"
            :limit.sync="searchForm.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination"
            @pagination="getList(searchForm)"
          />
        </el-col>
        <el-col :span="6">
          <div class="group-button">
            <ButtonExport
              :loading="exportLoading"
              type="excel"
              @export="handleExport"
            />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
import ButtonExport from '../../../components/Common/Button/ButtonExport';
import CallLogResource from '@/api/callLog';
import { studentStatusLabel } from '@/filters/studentStatus';
import CommonSettings from '@/const/CommonSettings';
import filterOption from '@/filters/parseData';
import toiawaseStatus from '@/const/ToiawaseStatus';
import callLogStatus from '@/const/CallLogStatus';
const calllogResource = new CallLogResource();
export default {
  name: 'ListDatatable',
  components: { CustomPagination, ButtonExport },
  filters: {
    studentStatus: studentStatusLabel,
    filterInquiryType: value => {
      return filterOption(value, toiawaseStatus.OPTION_SNZ_INQUIRYTYPE);
    },
    filterCallresult: value => {
      return filterOption(value, callLogStatus.OPTION_SNZ_CALL_RESULT);
    },
    filterCallstatus: value => {
      return filterOption(value, callLogStatus.OPTION_SNZ_CALL_STATUS);
    },
  },
  props: {
    registerStatusProp: { type: Number, default: 0 },
  },
  data() {
    return {
      callLogOptions: callLogStatus.OPTION_SNZ_CALL_STATUS,
      callResultOptions: callLogStatus.OPTION_SNZ_CALL_RESULT,
      commonText: CommonSettings.COMMON_TXT,
      listLoading: true,
      saveLoading: false,
      exportLoading: false,
      last_page: 1,
      list: [],
      total: 0,
      searchForm: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        sortBy: null,
        sortDirection: null,
      },
    };
  },

  created() {

  },
  methods: {
    async handleExport() {
      this.exportLoading = true;
      await calllogResource
        .exportResource(this.searchForm)
        .then(data => {
          this.createDownloadXlsFile('コールセンター_', data);
        })
        .finally(() => {
          this.exportLoading = false;
        });
    },
    async sortChange(sort) {
      const { prop, order } = sort;
      this.searchForm.sortBy = prop;
      this.searchForm.sortDirection = order;
      await this.getList(this.searchForm);
    },
    async getList(params) {
      this.listLoading = true;
      const query = this.buildQuery(params);
      window.history.replaceState(null, null, `?${query}`);
      this.searchForm = params;
      this.errors = [];
      this.listLoading = true;

      const data = await calllogResource.list({
        ...this.listQuery,
        ...params,
      });
      this.list = data.data;
      this.total = data.total;
      this.last_page = data.last_page;
      this.$emit('setCurrentPageRecord', (data.to - data.from + 1));
      if (this.$refs.table) {
        this.$refs.table.$refs.bodyWrapper.scrollTop = 0;
      }
      this.listLoading = false;
    },
    async saveData() {
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/list-table.scss';
@import '../styles/listDatabase';
/deep/ .group-button {
  float: right;
  padding-top: 8px;
}
/deep/ .el-table .disabled-row{
  background-color: #f0f0f0 !important;
  &:hover > td{
    background-color: #f0f0f0 !important;
  }
}
</style>
