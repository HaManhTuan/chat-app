<template>
  <div class="card-body">
    <div class="card-body__header">
      <h3>塾内テスト</h3>
    </div>
    <div class="card-body__content">
      <el-table
        v-loading="listLoading"
        class="table-content"
        :data="list"
        fit
        highlight-current-row
        header-cell-class-name="my-header"
        height="calc(100% - 94px)"
      >
        <el-table-column min-width="146px" label="生徒氏名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student ? scope.row.student.fullname : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="141px" label="学年">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade ? scope.row.grade.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="137px" label="生徒コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.contact ? scope.row.contact.snz_studentcode : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="245px" label="テスト名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_testmanagementname }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="95px" label="科目">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_subject_name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="95px" label="合計点">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_total }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="132px" label="校舎">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.business ? scope.row.business.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="詳細" align="center" width="95px">
          <template slot-scope="scope">
            <router-link :to="{name:'confirm-internal-test',params:{id:scope.row.id, query: paginate}}">
              確認
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        v-show="lastPage>1"
        :total="total"
        :page.sync="paginate.page"
        :limit.sync="paginate.limit"
        layout="prev, pager, next"
        class="text-center custom-pagination"
        prev-text="<"
        next-text=">"
        @pagination="getList"
      />
    </div>
  </div>
</template>
<script>
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import InternalTestSchool from '@/api/internalTestSchool';
import CommonSettings from '@/const/CommonSettings';

const internalTestSchool = new InternalTestSchool();

export default {
  components: {
    CustomPagination,
  },
  data() {
    return {
      list: [],
      id: null,
      listLoading: true,
      total: 0,
      lastPage: 1,
      paginate: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
    };
  },
  created() {
    this.paginate.page = this.$route.query.page ? parseInt(this.$route.query.page) : 1;
    this.id = this.$route.params.id;
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const res = await internalTestSchool.fetchInternalTestByStudentCode({
        ...this.paginate,
      }, this.id);
      this.list = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.listLoading = false;
      this.scrollTopTable();
      this.setBuildQuery();
    },
    setBuildQuery() {
      const query = this.buildQuery({ tab: 'tab8', page: this.paginate.page });
      window.history.replaceState(null, null, `?${query}`);
    },
  },
};
</script>
<style lang="scss" scoped>
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
        border-left: 1px solid #d6d6d6;
        border-right: 1px solid #d6d6d6;
        border-top: 1px solid #d6d6d6;
        @media screen and (max-width: 1366px) {
          // height: 311px;
        }

        .el-table__body {
          // height: 233px;
        }

        &:before {
          display: none;
        }

        .el-table__body-wrapper.is-scrolling-none {
          overflow-y: auto;
        }

        table {
          th {
            color: #ffffff;
            padding: 0 10px 0 20px;
            height: 30px;
            background: #535353;
            border-bottom: 1px solid #d6d6d6;
            font-size: 13px;
            font-weight: 400;
          }

          td {
            border-bottom: 1px solid #d6d6d6;
            padding: 0 10px 0 20px;
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

    .card-body__footer {
      // custom pagination
      .custom-pagination {
        margin-top: 10px;
        margin-bottom: 20px;

        &.last {
          margin-top: 10px;
          margin-bottom: 30px;
        }

        button.btn-prev,
        button.btn-next {
          background: none;
        }
      }
    }

    .btn-add-brother {
      top: 553px;
      left: 206px;
      width: 100%;
      height: 43px;
      background: #f8f8f8 0% 0% no-repeat padding-box;
      border: 1px solid #d6d6d6;
      border-radius: 25px;
      opacity: 1;
      margin-top: 15px;

      .el-icon-circle-plus {
        color: #1467b3;

        &:before {
          font-size: 20px;
        }
      }

      span {
        vertical-align: middle;
        font-weight: 500;
      }
    }
  }
}

td {
  padding: 0px !important;
  height: 47px;

  &:last-child {
    text-align: center;
    border-left: 1px solid #D6D6D6;

    a {
      color: #1467B3;
      padding: 5px 10px;
      background: #F4F8FD 0% 0% no-repeat padding-box;
      border-radius: 5px;
      font-size: 15px;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.card-body{
  height: 100%;
  .card-body__content{
    height:calc(100% - 40px) ;
  }
}
.pagination-container{
  margin-top: 10px;
}
</style>
