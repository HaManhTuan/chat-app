<template>
  <div>
    <div class="card-body">
      <div class="card-body__header">
        <h3>紹介</h3>
      </div>
      <div class="card-body__content">
        <el-table v-loading="listLoading" class="table-content" :data="tableData" fit highlight-current-row header-cell-class-name="my-header">
          <!-- 1 -->
          <el-table-column label="氏名(紹介先)">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_lastname }} {{ scope.row.snz_firstname }}</span>
            </template>
          </el-table-column>
          <!-- 2 -->
          <!-- <el-table-column label="予定校舎">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.business_unit != null ? scope.row.business_unit.name : 'ー' }} </span>
            </template>
          </el-table-column> -->
          <!-- 3 -->
          <el-table-column label="現在の学年">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.grade != null ? scope.row.grade.snz_name : '' }} </span>
            </template>
          </el-table-column>
          <!-- 4 -->
          <el-table-column label="紹介日">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_introductiondate | filterDateTime }} </span>
            </template>
          </el-table-column>
          <!-- 5 -->
          <el-table-column label="紹介元生徒氏名">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.student != null ? scope.row.student.fullname : 'ー' }} </span>
            </template>
          </el-table-column>
          <!-- 6 -->
          <el-table-column label="紹介者続柄">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_relationship | filterRelationshipBro }}</span>
            </template>
          </el-table-column>
          <!-- 7 -->
          <el-table-column label="紹介ステータス">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_introductionstatus | filterIntroductionStatus }}</span>
            </template>
          </el-table-column>
          <!-- 8 -->
          <el-table-column label="詳細編集" align="center" width="95px">
            <template slot-scope="scope">
              <el-button class="btn-edit" :disabled="checkRole(['none'],'cant')" size="mini" @click="edit(scope.row.id)">
                <svg-icon icon-class="_edit" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="btn-add-intro title" :disabled="checkRole(['callcenter','viewonly'],'cant')" plain icon="el-icon-circle-plus" @click="add()">
          紹介を追加
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
import IntroStudent from '@/api/introStudent';
import role from '@/directive/role';
import filterOption from '@/filters/parseData';
import { options as RelationshipIntroductionOptions } from '@/const/RelationshipIntroduction';
import { options as IntroductionStatusOptions } from '@/const/IntroductionStatus';

const introStudent = new IntroStudent();

export default {
  components: {
    CustomPagination,
  },
  filters: {
    filterDateTime: value => {
      if (!value) {
        return null;
      }
      return moment(value).format('YYYY/MM/DD');
    },
    filterRelationshipBro: value => {
      return filterOption(value, RelationshipIntroductionOptions);
    },
    filterIntroductionStatus: value => {
      return filterOption(value, IntroductionStatusOptions);
    },
  },
  directives: { role },
  props: {
    form: {
      type: Object,
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
      this.paginate.studentCode = this.id;
      const resList = await introStudent.getList(this.paginate);
      this.tableData = resList.original.data.data;
      this.paginate.total = resList.original.data.total;
      this.paginate.limit = Number(resList.original.data.per_page);
      this.paginate.page = resList.original.data.current_page;
      this.paginate.last_page = resList.original.data.last_page;
      this.listLoading = false;
      this.scrollTopTable();
    },
    add() {
      this.$router.push({
        name: 'introductions-detail-add',
        query: {
          id: this.id,
          redirect: true,
        },
      });
    },
    async edit(id) {
      this.$router.push({
        name: 'introductions-detail',
        params: { id: id, redirect: true },
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
        // overflow: auto;
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
        height: 313px;

        &:before {
          display: none;
        }

        .el-table__body-wrapper {
          height: 282px;
          overflow-y: auto;
        }

        table {
          th {
            color: #ffffff;
            padding: 0 20px;
            height: 30px !important;
            background: #535353;
            border-bottom: 1px solid #d6d6d6;
            font-size: 13px;
            font-family: Noto Sans JP;
            font-weight: 400;
            .cell{
              display: flex;
              align-items: center;
              height: 100%;
            }
          }

          td {
            border-bottom: 1px solid #d6d6d6;
            padding: 7px 10px 7px 17px;
            font-size: 14px;
            height: 30px;
            .cell{
              height: 32px;
              align-items: center;
              display: flex;
            }
          }

          td:nth-child(8){
            .cell{
              justify-content: center;
            }
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
      .custom-pagination {
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

    .btn-add-intro {
      top: 553px;
      left: 206px;
      width: 100%;
      height: 43px;
      background: #f8f8f8 0% 0% no-repeat padding-box;
      border: 1px solid #d6d6d6;
      border-radius: 25px;
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
