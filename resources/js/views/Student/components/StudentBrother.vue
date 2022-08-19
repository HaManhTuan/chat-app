<template>
  <div>
    <div class="card-body">
      <div class="card-body__header">
        <h3>兄弟情報</h3>
      </div>
      <div class="card-body__content">
        <el-table v-loading="listLoading" class="table-content" :data="tableData" fit highlight-current-row header-cell-class-name="my-header">
          <el-table-column label="氏名">
            <template slot-scope="scope">
              <span class="ellipsis">
                {{ scope.row.snz_lastname }} {{ scope.row.snz_firstname }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="学年" prop="grade.snz_name">
            <template slot-scope="scope">
              <span class="ellipsis">
                {{ scope.row.grade != null ? scope.row.grade.snz_name : 'ー' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="続柄">
            <template slot-scope="scope">
              <span class="ellipsis">
                {{ scope.row.snz_relationship | filterRelationship }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="作成日">
            <template slot-scope="scope">
              <span class="ellipsis">
                {{ scope.row.created_at | filterDateTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="詳細編集" align="center" width="95px">
            <template slot-scope="scope">
              <el-button class="btn-edit" :disabled="checkRole(['none'],'cant')" size="mini" @click="edit(scope.row.id)">
                <svg-icon icon-class="_edit" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="btn-add-brother" :disabled="checkRole(['callcenter','viewonly'],'cant')" plain icon="el-icon-circle-plus" @click="add()">
          兄弟を追加
        </el-button>
        <custom-pagination
          v-show="paginate.last_page > 1"
          :total="paginate.total"
          :page.sync="paginate.page"
          :limit.sync="paginate.limit"
          layout="prev, pager, next"
          prev-text="<"
          next-text=">"
          class="text-center custom-pagination"
          @pagination="getList(id, paginate)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
import BrotherInfo from '@/api/brother';
import role from '@/directive/role';
import { options } from '@/const/RelationshipBro';

const brotherInfo = new BrotherInfo();

export default {
  components: {
    CustomPagination,
  },
  filters: {
    filterDateTime: value => {
      return moment(value).format('YYYY/MM/DD');
    },
    filterRelationship: data => {
      let result = data;
      options.forEach(element => {
        if (element.value === data) {
          result = element.label;
        }
      });
      return result;
    },
  },
  directives: { role },
  props: {
    internalcode: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      id: null,
      listLoading: true,
      roles: null,
      paginate: {
        total: 0,
        page: 1,
        limit: 10,
        last_page: null,
      },
      tabPosition: 'top',
      tableData: null,
      tableData1: null,
      internalCodeData: null,
      BrotherInfoRecode: null,
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getList();
    this.fullscreenLoading = false;
    this.roles = this.$store.getters.roles;
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const resBrotherList = await brotherInfo.getBrotherList(
        this.id,
        this.paginate
      );
      this.tableData = resBrotherList.original.data.data;
      this.internalCodeData = this.internalCode;
      this.paginate.total = resBrotherList.original.data.total;
      this.paginate.limit = Number(resBrotherList.original.data.per_page);
      this.paginate.page = resBrotherList.original.data.current_page;
      this.paginate.last_page = resBrotherList.original.data.last_page;
      this.listLoading = false;
      this.scrollTopTable();
    },
    add() {
      this.$router.push({
        name: 'BrotherInformationAdd',
        params: { id: this.internalcode, redirect: true },
        query: { studentCode: this.id },
      });
    },
    async edit(broInfoId) {
      this.$router.push({
        name: 'BrotherInformationEdit',
        params: { id: broInfoId, redirect: true },
        query: { studentCode: this.id },
      });
    },
    checkRole(btnRoles, type) {
      const myRoles = this.roles;
      const diff = myRoles.filter(x => btnRoles.includes(x));
      if (diff.length > 0) {
        if (type === 'can') {
          return false;
        } else {
          return true;
        }
      } else {
        if (type === 'can') {
          return true;
        } else {
          return false;
        }
      }
    },
  },
};
</script>
<style lang="scss"></style>
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
        height: 222px;
        @media screen and (max-width: 1366px) {
        }

        .cell{
          height: 32px;
        }

        &:before {
          display: none;
        }

        .el-table__body-wrapper.is-scrolling-none {
          overflow-y: auto;
        }

        table {
          tr{
            th {
              color: #ffffff;
              padding: 0 20px;
              height: 30px;
              background: #535353;
              border-bottom: 1px solid #d6d6d6;
              font-size: 13px;
              font-family: Noto Sans JP;
              font-weight: 400;
            }

            td {
              border-bottom: 1px solid #d6d6d6;
              padding: 7px 10px 7px 17px;
              font-size: 14px;

            }

            td:last-child{
              display: flex;
              justify-content: center;
            }

            .cell{
              display: flex;
              align-items: center;
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

        .el-table__body-wrapper{
          height: 188px;
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

    .el-button:hover{
      opacity: 0.8;
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
      margin-top: 13px;
      margin-bottom: 10px;
      .el-icon-circle-plus{
        color: #1467b3;
        &:before{
          font-size: 22px !important;
        }
      }
      span {
        vertical-align: 3px;
        font-size: 15px;
        font-family: Noto Sans JP, serif;
        color: black;
      }
    }
  }
}
</style>
