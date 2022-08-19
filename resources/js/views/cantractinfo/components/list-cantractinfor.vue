<template>
  <div class="card-body">
    <div class="card-header">
      <span>受講変更履歴</span>
    </div>
    <div class="card-body__content">
      <el-table
        v-loading="listLoading"
        class="table-content"
        :data="list"
        fit
        highlight-current-row
        height="calc(100% - 53px)"
        :empty-text="CommonTxt.tableEmptyTxt"
        header-cell-class-name="my-header"
      >
        <el-table-column min-width="121px" label="生徒氏名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student ? scope.row.student.fullname : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="95px" label="作成日">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.created_at | dateFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px" label="学年">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade ? scope.row.grade.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="50px" class-name="header-col__4">
          <template slot="header">
            申込<br>区分
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.snz_application_type ? scope.row.snz_application_type : '' | getApplicationType
            }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="136px" label="コース">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.course ? scope.row.course.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="85px" label="科目01">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.cantract_info_history_details[0] ? ( scope.row.cantract_info_history_details[0].subject ? scope.row.cantract_info_history_details[0].subject.snz_name : '' ) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="63px">
          <template slot="header">
            開始月<br>01
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.cantract_info_history_details[0] ? ( scope.row.cantract_info_history_details[0].start_target_period ? scope.row.cantract_info_history_details[0].start_target_period.snz_name : '' ) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px">
          <template slot="header">
            終了月<br>01
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.cantract_info_history_details[0] ? ( scope.row.cantract_info_history_details[0].end_target_period ? scope.row.cantract_info_history_details[0].end_target_period.snz_name : '' ) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="83px" label="科目02">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.cantract_info_history_details[1] ? ( scope.row.cantract_info_history_details[1].subject ? scope.row.cantract_info_history_details[1].subject.snz_name : '' ) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="63px">
          <template slot="header">
            開始月<br>02
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.cantract_info_history_details[1] ? ( scope.row.cantract_info_history_details[1].start_target_period ? scope.row.cantract_info_history_details[1].start_target_period.snz_name : '' ) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px">
          <template slot="header">
            終了月<br>02
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.cantract_info_history_details[1] ? ( scope.row.cantract_info_history_details[1].end_target_period ? scope.row.cantract_info_history_details[1].end_target_period.snz_name : '' ) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="107px" label="校舎">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.business_unit?scope.row.business_unit.name:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" align="center" label="詳細編集">
          <template slot-scope="scope">
            <router-link
              :to="{ name: 'cantractinfo-history', params: { id: scope.row.id, query: searchForm, redirect: true }}"
            >
              <el-button class="btn-edit" size="mini">
                <svg-icon icon-class="_edit" />
              </el-button>
            </router-link>
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
            :page.sync="searchForm.page"
            :limit.sync="searchForm.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination"
            @pagination="func => getList()"
          />
        </el-col>
        <el-col :span="6" class="group-button">
          <div />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { applicationOptions } from '@/const/CantractInfo';
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import ContractInfoResource from '../../../api/contractInfoHistory';
import CommonSettings from '@/const/CommonSettings';

const contractInfoResource = new ContractInfoResource();

export default {
  name: 'ListCantracinfo',
  metaInfo: {
    title: '受講情報詳細',
  },
  components: { CustomPagination },
  filters: {
    getApplicationType(app) {
      const x = applicationOptions.filter(obj => {
        return app === obj.value;
      });
      return x[0] ? x[0].label : '';
    },
  },
  data() {
    return {
      list: [],
      paginateForm: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        last_page: 1,
      },
      fullname: '',
      snz_grade_id: '',
      snz_school_id: '',
      snz_application_type: '',
      snz_course_id: '',
      snz_subject_id: '',
      snz_startmonth_period_id: '',
      snz_endmonth_period_id: '',
      total: 0,
      check: 0,
      listLoading: true,
      searchForm: {
        tab: 'history',
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        redirect: 'cantractinfo-detail',
        id: this.$route.params.id,
      },
      delete_row: [],
    };
  },
  async created() {
    this.searchForm.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
    await this.getList();
  },
  methods: {
    async getList(forceQuery = null) {
      this.listLoading = true;
      const res = await contractInfoResource.cantractInfoHistoryList(this.$route.params.id, this.searchForm);
      this.setData(res);
      this.scrollTopTable();
      this.listLoading = false;
      this.setBuildQuery();
    },
    setBuildQuery() {
      const query = this.buildQuery({ tab: 'history', page: this.searchForm.page, limit: this.searchForm.limit });
      window.history.replaceState(null, null, `?${query}`);
    },
    setData(data){
      this.list = data.data;
      this.total = data.total;
      this.searchForm.page = data.current_page;
    },
  },
};
</script>
<style lang="scss" scoped>
.card-header {
  margin-bottom: 20px;

  span {
    font-size: 18px;
    color: #1a1714;
    font-family: Noto Sans JP, sans-serif;
  }
}
/deep/ .el-table--scrollable-x .el-table__body-wrapper {
  overflow-x: hidden;
}
/deep/ .my-header{
  &:nth-child(4),&:nth-child(7),&:nth-child(8),&:nth-child(10),&:nth-child(11) {
    .cell {
      font-size: 9px;
    }
  }
  &:nth-child(13){
    padding: 0 0 0 15px !important;
  }
}
.tab-custom {
  .card-body ::v-deep {
    padding: 25px 35px 35px;

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
          padding: 5px 20px;
          border-radius: 100px;
          background: #f8f8f8;
          color: #1a1714;
          font-family: Noto Sans JP, serif;
          font-size: 15px;

          .tx-green {
            color: #1467b3;
            vertical-align: revert;
          }

          &:hover {
            opacity: 0.8;
          }

          i {
            vertical-align: middle;
            font-size: 22px;
            color: #1467b3;
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
      // custom table
      .el-table {
        overflow: auto;

        .cell {
          padding-right: 0;
          padding-left: 0;
        }
      }

      .table-content {
        border: 1px solid #d6d6d6;

        &:before {
          display: none;
        }

        .el-table__body-wrapper.is-scrolling-none {
          overflow-y: auto;
        }

        table {
          th {
            color: #ffffff;
            padding: 0 0 0 20px;
            height: 30px;
            background: #535353;
            border-bottom: 1px solid #d6d6d6;
            font-size: 13px;
            font-weight: 400;
          }

          td {
            border-bottom: 1px solid #d6d6d6;
            padding: 0 0 0 20px;
            height: 47px;
            font-size: 14px;
          }

          button.btn-edit {
            background: #f4f8fd;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            padding: 0;
            border: none;
            margin-right: 4px;
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
}
.footer__group{
  margin-top: -50px;
}
.card-body {
  height: 100%;

  .card-body__content {
    height: calc(100% - 41px);
  }
}

.pagination-container {
  margin-top: 10px;
}
</style>
