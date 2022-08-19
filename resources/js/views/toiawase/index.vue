<template>
  <div class="app-container">
    <div class="block-search">
      <el-form ref="searchForm" class="form-search" :model="searchForm">
        <el-row justify="space-around" class="top">
          <el-col :span="6">
            <el-form-item label-width="40px" label="校舎">
              <SearchSelectBox
                v-model="searchForm.businessunit"
                :search-function="searchBusiness"
                width="174px"
                key-name="name"
                placeholder=""
                class="filterable-select remove-mb-el-select"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="82px" label="ステータス">
              <el-select
                v-model="searchForm.approachStatus"
                clearable
                placeholder=""
                no-data-text="データはありません。"
                class="multiselect filterable-select"
                multiple
              >
                <el-option
                  v-for="item in approachOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="no-border">
            <div style="display: flex">
              <el-form-item label-width="70px" label="問合せ日">
                <el-date-picker
                  ref="dateStartPicker"
                  v-model="searchForm.inquirydateStart"
                  type="date"
                  placeholder="開始日"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  :editable="false"
                  prefix-icon="abc"
                  :default-value="searchForm.inquirydateStart"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
                </span>
              </el-form-item>
              <span class="between-date">〜</span>
              <el-form-item>
                <el-date-picker
                  ref="dateEndPicker"
                  v-model="searchForm.inquirydateEnd"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  placeholder="終了日"
                  :editable="false"
                  prefix-icon="abc"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
                </span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row justify="space-between" class="bot">
          <el-col :span="6">
            <el-form-item label-width="60px" label="生徒名">
              <el-input v-model="searchForm.studentName" placeholder="" maxlength="100" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="70px" label="電話番号">
              <input-number v-model="searchForm.snzTelephone" :maxlength="11" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="9" />
          <el-col :span="2">
            <el-form-item class="search-button">
              <ButtonSearch @search="submitSearch" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="card-body__content page-body">
      <el-table
        ref="mainTable"
        v-loading="listLoading"
        class="table-content"
        :data="tableForm.list"
        fit
        highlight-current-row
        header-cell-class-name="my-header"
        height="calc(100%)"
        empty-text="データはありません。"
      >
        <el-table-column align="left" label="氏名" fixed="left" width="120">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.lastname }} {{ scope.row.firstname }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="方法">
          <template slot-scope="scope">
            <span class="ellipsis">{{ inquiryName[scope.row.snz_inquirytype] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="学年">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade_name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="電話番号" width="120px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_telephone }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="left" label="問合せ日" prop="snz_inquirydate">
          <template slot="header">
            <div class="cell">問合せ日 <span v-sortable="sortChange" /></div>
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_inquirydate | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="left" label="資料送付日">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_documentsentdate | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="面談者">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.reviewer_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="120px" align="left" label="面談日">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_interviewdate | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" width="150px" label="ステータス">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row | approachWebText }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="アプローチ終了" width="160px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_approachend | approachend }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="校舎" width="140px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.businessunit_name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="詳細編集" fixed="right" width="100" row-class-name="action">
          <template slot-scope="scope">
            <router-link :to="{ name: 'toiawase-detail', params: { id: scope.row.id, query: paginateForm }}">
              <el-button class="btn-edit" size="mini">
                <svg-icon icon-class="_edit" />
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
        <el-col :span="10">
          <CustomPagination
            v-show="lastPage>1"
            :total="total"
            :page.sync="paginateForm.page"
            :limit.sync="query.limit"
            layout="prev, pager, next"
            class="position-center"
            prev-text="<"
            next-text=">"
            @pagination="func => getList(paginateForm)"
          />
        </el-col>
        <el-col :span="8">
          <div class="group-button">
            <button-export type="excel" :loading="exportLoading" @export="handleExport" />
            <el-button class="btn-create" icon="el-icon-circle-plus-outline" @click="redirectPage({'name': 'toiawase-create'})">
              <span>新規作成</span>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import ToiawaseResource from '@/api/toiawase';
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import { name as inquiryName, options as inquiryOptions } from '../../const/InquiryType';
import { options as approachOptions } from '../../const/ContactApproach';
import moment from 'moment';
import { approachWebText, approachend } from '../../filters/contact';
import { mapGetters } from 'vuex';
import sortable from '@/directive/el-table/sortable';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import BusinessUnitRequest from '../../api/BusinessUnitRequest';
import InputNumber from '@/components/Common/InputNumber';

const toiawaseResource = new ToiawaseResource();
const businessResource = new BusinessUnitRequest();

export default {
  name: 'ContactList',
  metaInfo: {
    title: '入会前の問合せ',
  },
  directives: { sortable },
  components: {
    CustomPagination,
    ButtonSearch,
    ButtonExport,
    SearchSelectBox,
    InputNumber,
  },
  filters: {
    approachWebText: approachWebText,
    approachend: approachend,
  },
  mixins: [],
  data() {
    return {
      inquiryName: inquiryName,
      inquiryOptions: inquiryOptions,
      approachOptions: approachOptions,
      tableForm: {
        list: [],
      },
      searchForm: {
        sort: null,
        studentName: null,
        businessunit: null,
        snzTelephone: null,
        inquiryType: null,
        approachStatus: [1, 2, 3, 4],
        inquirydateStart: null,
        inquirydateEnd: null,
        page: 1,
      },
      paginateForm: {
        page: 1,
      },
      total: 0,
      lastPage: 0,
      listLoading: true,
      exportLoading: false,
      query: {
        limit: 20,
      },
    };
  },
  computed: {
    ...mapGetters(['currentBusiness']),
  },
  created() {
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    if (typeof this.searchForm.approachStatus === 'number') {
      this.searchForm.approachStatus = [
        this.searchForm.approachStatus,
      ];
    } else if (Array.isArray(this.searchForm.approachStatus)) {
      this.searchForm.approachStatus = this.covertArrStringToInt(this.searchForm.approachStatus);
    }
    if (this.$_.isEmpty(this.$route.query)) {
      this.searchForm.inquirydateStart = moment().subtract(1, 'months').format('YYYY-MM-DD');
      this.searchForm.inquirydateEnd = moment().format('YYYY-MM-DD');
    }
    this.submitSearch(this.searchForm.page ?? 1);
  },
  methods: {
    async sortChange(sort) {
      this.searchForm.sort = sort;
      await this.getList();
      this.paginateForm = this.$_.clone(this.searchForm);
    },
    async submitSearch(page) {
      this.searchForm.page = page || 1;
      await this.getList();
      this.paginateForm = this.$_.clone(this.searchForm);
    },
    async getList(forceQuery = null) {
      this.listLoading = true;
      const query = this.buildQuery(forceQuery || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);

      const res = await toiawaseResource.list({ ...this.query, ...forceQuery || this.searchForm });
      this.tableForm.list = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.listLoading = false;
      this.scrollTopTable();
    },
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    async handleExport() {
      if (!this.searchForm.inquirydateStart || !this.searchForm.inquirydateEnd) {
        this.$message({
          message: '出力する時、開始日と終了日を入力してください。',
          type: 'error',
        });
        return;
      }
      this.exportLoading = true;
      await toiawaseResource.exportResource({ ...this.query, ...this.searchForm }, 'csv').then(data => {
        const nameScreen = '入会前の問合せ_';
        this.createDownloadXlsFile(nameScreen, data);
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
<style lang="scss" scoped>
#app {
  overflow-y: hidden;
}

</style>
<style scoped lang="scss">
@import "@/styles/common-form";
/deep/ .multiselect.el-select{
  width: 174px !important;
}
/deep/ .page-body {
  height: calc(100% - 243px);
}
.icon-input__calendar{
  position: absolute;
  top: 0;
  right: 11px;
  pointer-events: none;
}
/deep/ .table-content table td {
  padding: 0px 10px 0px 20px !important;
  height: 47px;
}
.table-content{
  /deep/ td {
    &:last-child {
      padding-right: 26px;
    }
  }
  /deep/ .el-table__fixed-right{
    right: -5px !important;
  }
}
.el-row::v-deep {
  &.top {
    .el-col:first-child {
      width: 214px;
    }

    .el-col:nth-child(2) {
      width: 256px;
      margin-left: 21px;
    }

    .el-col:nth-child(3) {
      width: 464px;
      margin-left: 26px;
    }

    .el-col:nth-child(4) {
      width: 264px;
      margin-left: 26px;
    };
    .no-border {
      .el-date-editor input.el-input__inner{
        background: #F0F0F0 0 0 no-repeat padding-box;
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
  }

  &.bot {
    padding-top: 20px;

    .el-col:first-child {
      width: 246px;
    }

    .el-col:nth-child(2) {
      width: 234px;
      margin-left: 16px;
    }

    .el-col:nth-child(3) {
      margin-left: 22px;
      width: 460px;
    }

    .el-col:nth-child(4) {
      float: right;

      &.el-form-item__content {
        text-align: right;
        width: 100%;
      }
    }
  }
}

.form-search::v-deep{
  .el-form-item__label {
    padding: 0 10px 0 0 !important;
  }
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
/deep/.el-table__fixed::before, .el-table__fixed-right::before{
  background-color: unset !important;
}
</style>
