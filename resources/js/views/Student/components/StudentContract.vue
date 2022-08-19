<template>
  <div v-loading="fullscreenLoading" class="student-detail">
    <el-form ref="form" label-width="100px" :model="form">
      <div class="card-body">
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="106px" prop="lastname">
              <template slot="label">
                <span class="break-label">直近の<br>体験開始月</span>
              </template>
              <SearchSelectBox
                v-model="form.snz_experienceplanmonth_period_id"
                :search-function="searchMonth"
                key-name="snz_name"
                :popper-append-to-body="false"
                disabled
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="80px" label="入会日" prop="birthdate">
              <el-date-picker
                v-model="form.snz_enterdate"
                prefix-icon="abc"
                type="date"
                placeholder=""
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                :append-to-body="false"
                disabled
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="80px" label="退塾年月" prop="snz_withdrawdate" class="no-border-date">
              <el-select
                v-if="form.withdrawdate"
                v-model="form.withdrawdate.snz_name"
                :append-to-body="false"
                disabled
                placeholder=""
              />
              <el-select
                v-else
                v-model="form.withdrawdate"
                :append-to-body="false"
                disabled
                placeholder=""
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" />
          <el-col :span="8" />
          <el-col :span="8" style="float: right;">
            <el-form-item label-width="80px" label="卒業日" prop="snz_graduatedate" class="no-border-date">
              <el-date-picker
                v-model="form.snz_graduatedate"
                type="date"
                placeholder=""
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                :editable="false"
                prefix-icon="abc"
                :append-to-body="false"
                disabled
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="line" />
      <div class="card-body">
        <div class="card-body__header">
          <h3>受講情報</h3>
          <div class="title">
          <!--            <el-button plain>-->
          <!--              <svg-icon icon-class="document" style="font-size: 17px" />-->
          <!--              変則教材購入・不要の申請-->
          <!--            </el-button>-->
          <!--            <el-button plain>-->
          <!--              <svg-icon icon-class="document" style="font-size: 17px" />-->
          <!--              登録誤り申請-->
          <!--            </el-button>-->
          </div>
        </div>
        <div class="card-body__content mt-25">
          <el-table
            ref="tableContact"
            v-loading="contractInfo.loading"
            class="table-content"
            :data="contractInfo.data"
            fit
            highlight-current-row
            header-cell-class-name="my-header"
            height="calc(100%)"
            :row-class-name="tableRowClassName"
          >
            <el-table-column label="受講区分" width="140px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.snz_contract_type | mapOptions(contractInfoStatus.SNZ_CONTRACT_TYPE) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="受講変更開始月" width="135px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.period_change ? scope.row.period_change.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="受講開始月" width="120px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.contract_start_month ? scope.row.contract_start_month.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="受講終了月" width="120px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.contract_end_month ? scope.row.contract_end_month.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年度" width="70px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.snz_schoolyear }}</span>
              </template>
            </el-table-column>
            <el-table-column label="コース">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.course ? scope.row.course.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="科目セット">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.subject_set ? scope.row.subject_set.snz_display_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="学年" width="116px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.grade ? scope.row.grade.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="校舎">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.business_unit ? scope.row.business_unit.name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="ableRole(['system', 'employee','parttime'])" label="確認" width="70px">
              <template slot-scope="scope">
                <el-button round class="confirm" @click="redirectContractInfo(scope.row)">確認</el-button>
              </template>
            </el-table-column>
            <el-table-column label="詳細編集" align="center" width="95px">
              <template slot-scope="scope">
                <el-button
                  class="btn-edit"
                  size="mini"
                  :disabled="(!ableRole(['system', 'employee','parttime']) && (scope.row.snz_cantractinfo_finish_target_period!==null)) || scope.row.snz_application_pending_flag || showDialogEdit || disableRole(['viewonly', 'callcenter'])"
                  @click="openEditContract(scope.row)"
                >
                  <svg-icon icon-class="_edit" />
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="card-body__footer mt-15">
          <custom-pagination
            v-show="contractInfo.total>0"
            :total="contractInfo.total"
            :page.sync="contractInfo.listQuery.page"
            :limit.sync="contractInfo.listQuery.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination mt-2"
            @pagination="studentContractInfo"
          />
        </div>
      </div>
      <div class="line mt-15" />
      <div class="card-body pb-2">
        <div class="card-body__header">
          <h3>受講履歴</h3>
        </div>
        <div class="card-body__content">
          <el-table
            ref="tableContactHistory"
            v-loading="contractInfoHistory.loading"
            class="table-content"
            :data="contractInfoHistory.data"
            fit
            highlight-current-row
            header-cell-class-name="my-header"
            height="calc(100%)"
            :row-class-name="tableRowClassName"
          >
            <el-table-column label="受講区分" width="140px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.snz_contract_type | mapOptions(contractInfoStatus.SNZ_CONTRACT_TYPE) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="受講変更開始月" width="135px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.period_change ? scope.row.period_change.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="受講開始月" width="130px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.contract_start_month ? scope.row.contract_start_month.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="受講終了月" width="120px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.contract_end_month ? scope.row.contract_end_month.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="年度" width="70px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.snz_schoolyear }}</span>
              </template>
            </el-table-column>
            <el-table-column label="コース">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.course ? scope.row.course.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="科目セット">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.subject_set ? scope.row.subject_set.snz_display_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="学年" width="116px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.grade ? scope.row.grade.snz_name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="作成日" width="110px">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.created_at | parseTime('{y}/{m}/{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="校舎">
              <template slot-scope="scope">
                <span class="ellipsis">{{ scope.row.business_unit ? scope.row.business_unit.name : '' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="確認" width="80px">
              <template slot-scope="scope">
                <el-button
                  round
                  class="confirm"
                  @click="redirectPage({ name:'cantractinfo-history', params:{ id: scope.row.id,query:query}})"
                >確認</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="card-body__footer">
          <custom-pagination
            v-show="contractInfoHistory.total>0"
            :total="contractInfoHistory.total"
            :page.sync="contractInfoHistory.listQuery.page"
            :limit.sync="contractInfoHistory.listQuery.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination mt-2"
            @pagination="studentContractInfoHistory"
          />
        </div>
      </div>
    </el-form>
    <EditContactInfo
      v-if="editContractRow"
      :show-dialog="showDialogEdit"
      :form.sync="editContractRow"
      :origin-form="originContractRow"
      :status-contact-type="cantractInfoType"
      @close="showDialogEdit = false"
      @init="init"
    />
  </div>
</template>
<script>
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import EditContactInfo from '../modal/EditContractInfo';
import TargetPeriodResource from '@/api/TargetPeriodRequest';
import ContractInfoResource from '@/api/contractInfo';
import ContractInfoHistoryResource from '@/api/contractInfoHistory';
import { mapOptions } from '@/filters/mapOptions';
import contractInfoStatus from '@/const/ContractInfo';

const targetPeriodResource = new TargetPeriodResource();
const contractInfoResource = new ContractInfoResource();
const contractInfoHistoryResource = new ContractInfoHistoryResource();

export default {
  components: {
    CustomPagination,
    SearchSelectBox,
    EditContactInfo,
  },
  filters: {
    mapOptions: mapOptions,
  },
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      contractInfoStatus: contractInfoStatus,
      fullscreenLoading: true,
      showDialogEdit: false,
      contractInfo: {
        total: 0,
        data: [],
        loading: true,
        listQuery: {
          page: 1,
          limit: 10,
        },
      },
      contractInfoHistory: {
        total: 0,
        data: [],
        loading: true,
        listQuery: {
          tab: 'tab2',
          page: 1,
          limit: 10,
          redirect: 'StudentDetail',
          id: this.$route.params.id,
        },
      },
      query: {
        tab: 'tab2',
        Ipage: 1,
        Hpage: 1,
        redirect: 'StudentDetail',
        id: this.$route.params.id,
      },
      editContractRow: null,
      originContractRow: null,
      cantractInfoType: undefined,
    };
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.contractInfo.listQuery.page = this.$route.query.Ipage ? parseInt(this.$route.query.Ipage) : 1;
      this.contractInfoHistory.listQuery.page = this.$route.query.Hpage ? parseInt(this.$route.query.Hpage) : 1;
      this.query.Ipage = this.contractInfo.listQuery.page;
      this.query.Hpage = this.contractInfoHistory.listQuery.page;
      await this.studentContractInfo();
      await this.studentContractInfoHistory();
      this.fullscreenLoading = false;
    },
    async searchMonth(query) {
      return await targetPeriodResource.searchName(query);
    },
    async studentContractInfo() {
      this.contractInfo.loading = true;
      const res = await contractInfoResource.studentContractInfo(this.form.snz_studentcode, this.contractInfo.listQuery);
      this.contractInfo.data = res.data;
      this.contractInfo.total = res.total;
      this.contractInfo.loading = false;
      if (this.$refs.tableContact) {
        this.$refs.tableContact.bodyWrapper.scrollTop = 0;
      }
      this.setBuildQuery();
    },
    async studentContractInfoHistory() {
      this.contractInfoHistory.loading = true;
      const res = await contractInfoHistoryResource.studentContractInfoHistory(this.form.snz_studentcode, this.contractInfoHistory.listQuery);
      this.contractInfoHistory.data = res.data;
      this.contractInfoHistory.total = res.total;
      this.contractInfoHistory.loading = false;
      if (this.$refs.tableContactHistory) {
        this.$refs.tableContactHistory.bodyWrapper.scrollTop = 0;
      }
      this.setBuildQuery();
    },
    async openEditContract(row) {
      this.fullscreenLoading = true;
      this.editContractRow = await contractInfoResource.detailOneContract(row.id);
      this.cantractInfoType = this.editContractRow?.change_cantractinfo_type || null;
      this.originContractRow = _.clone(row);
      this.fullscreenLoading = false;
      this.$nextTick(() => {
        this.showDialogEdit = true;
      });
    },
    setBuildQuery() {
      this.query.Ipage = this.contractInfo.listQuery.page;
      this.query.Hpage = this.contractInfoHistory.listQuery.page;
      const query = this.buildQuery({ tab: 'tab2', Ipage: this.contractInfo.listQuery.page, Hpage: this.contractInfoHistory.listQuery.page });
      window.history.replaceState(null, null, `?${query}`);
    },
    redirectContractInfo(row){
      return this.redirectPage({ name: 'cantractinfo-detail', params: { id: row.id, fromPage: 31 }});
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.snz_application_pending_flag === 1){
        return 'disabled-row';
      } else {
        return '';
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-input__calendar {
  position: absolute;
  top: 1px;
  right: 11px;
  pointer-events: none !important;
  svg{
    font-size: 20px !important;
  }
}
.student-detail::v-deep {
  .card-body {
    .el-col-8 {
      .el-form-item {
        margin-bottom: 13px;
      }

      .el-form-item__content {
        width: 213px;
      }
    }
  }
  .card-body__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: -7px;

    h3 {
      margin: 0;
    }

    .title {
      button {
        padding: 8px 20px;
        border-radius: 100px;
        background: #f8f8f8;
        color: #1A1714;
        font-family: Noto Sans JP, serif;
        font-size: 15px;
        font-weight: 500;

        .tx-green {
          color: #1467B3;
          vertical-align: revert;
        }

        &:hover {
          opacity: 0.8;
        }

        i {
          vertical-align: middle;
          font-size: 22px;
          color: #1467B3;
        }

        span {
          vertical-align: middle;
        }
      }

      .el-button + .el-button {
        margin-left: 15px;
      }
    }
  }
  .card-body__content {
    margin-top: 15px;
    height: 300px;
    // custom table
    .el-table {
      .cell {
        padding-right: 0;
        padding-left: 0;
      }
    }

    .table-content {
      border-left: 1px solid #d6d6d6;
      border-right: 1px solid #d6d6d6;
      border-top: 1px solid #d6d6d6;
      border-bottom: 1px solid #d6d6d6;

      &:before {
        display: none;
      }
      table {
        th {
          color: #FFFFFF;
          padding: 0 20px;
          height: 30px;
          background: #535353;
          border-bottom: 1px solid #d6d6d6;
          font-size: 13px;
          font-family: Noto Sans JP;
          font-weight: 400;
        }

        td {
          height: 46px;
          border-bottom: 1px solid #d6d6d6;
          padding: 8px 0px 7px 20px;
          font-size: 14px;
        }

        button.btn-edit {
          background: #f4f8fd;
          width: 30px;
          height: 30px;
          border-radius: 5px;
          padding: 0;
          border: none;
          margin-right: 10px;
          color: #1467b3;
          vertical-align: middle;

          svg {
            width: 30px;
            height: 30px;
          }

          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
.break-label{
  position: absolute;
  left: 22px;
  line-height: 1.2;
}
.confirm {
  width: 51px;
  height: 25px;
  background: #f4f8fd;
  border-radius: 5px;
  opacity: 1;
  color: #1467b3;
  font-size: 15px;
  font-family: Noto Sans JP,serif;
  padding: 0;
  border: 0;
  margin-left: -10px;
}
.mt-25{
  margin-top: 25px !important;
}
.mt-15{
  margin-top: 15px !important;
}
/deep/ .el-table .disabled-row{
  background-color: #f0f0f0 !important;
  &:hover > td{
    background-color: #f0f0f0 !important;
  }
}
</style>
