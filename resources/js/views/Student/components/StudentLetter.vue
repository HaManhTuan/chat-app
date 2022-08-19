<template>
  <div>
    <div class="card-body">
      <div class="card-body__content">
        <!-- bảng 1 -->
        <h3>入会前の問合せ</h3>
        <el-table v-loading="listLoading1" class="table-content table-1" :data="tableData1" fit highlight-current-row header-cell-class-name="my-header">
          <!-- 1 -->
          <el-table-column label="学年">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.grade != null ? scope.row.grade.snz_name : '' }}</span>
            </template>
          </el-table-column>
          <!-- 2 -->
          <el-table-column label="対応日" min-width="102px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_actdate | filterDateTime }}</span>
            </template>
          </el-table-column>
          <!-- 3 -->
          <el-table-column label="問合せ日" min-width="102px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_inquirydate | filterDateTime }}</span>
            </template>
          </el-table-column>
          <!-- 4 -->
          <el-table-column label="面談日" min-width="102px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_interviewdate | filterDateTime }}</span>
            </template>
          </el-table-column>
          <!-- 5 -->
          <el-table-column label="対応内容" min-width="92px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_action }}</span>
            </template>
          </el-table-column>
          <!-- 6 -->
          <el-table-column label="資料送付" min-width="92px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_documentsent | filterDocumentSent }}</span>
            </template>
          </el-table-column>
          <!-- 7 -->
          <el-table-column label="資料送付日" min-width="102px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_documentsentdate | filterDateTime }}</span>
            </template>
          </el-table-column>
          <!-- 8 -->
          <el-table-column label="対応者">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.taiousya_user ? scope.row.taiousya_user.name : '' }}</span>
            </template>
          </el-table-column>
          <!-- 9 -->
          <el-table-column label="アプローチ 終了" width="93px">
            <template slot-scope="scope" class="">
              <span class="ellipsis">{{ scope.row.snz_approachend | filterApproachend }}</span>
            </template>
          </el-table-column>
          <!-- 10 -->
          <el-table-column label="問合せ方法" min-width="105px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_inquirytype | filterInquiryType }}</span>
            </template>
          </el-table-column>
          <!-- 11 -->
          <el-table-column v-if="checkRole(['system', 'school'],'can')" label="詳細編集" width="95px">
            <template slot-scope="scope">
              <el-button class="btn-edit" :disabled="checkRole(['system', 'school'],'can')" size="mini" @click="editToiawase(scope.row.id)">
                <svg-icon icon-class="_edit" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <custom-pagination
          v-show="paginate1.last_page > 1"
          :total="paginate1.total"
          :page.sync="paginate1.page"
          :limit.sync="paginate1.limit"
          layout="prev, pager, next"
          prev-text="<"
          next-text=">"
          class="text-center custom-pagination"
          @pagination="getRequestList(id, paginate1)"
        />
      </div>
    </div>
    <hr class="line">
    <div class="card-body">
      <div class="card-body__content">
        <!-- bảng 2 -->
        <h3>対応履歴</h3>
        <el-table v-loading="listLoading2" class="table-content table-2" :data="tableData2" fit highlight-current-row header-cell-class-name="my-header">
          <!-- 1 -->
          <el-table-column label="対応生徒氏名">
            <template slot-scope="scope">
              <span class="ellipsis">
                {{ scope.row.student != null ? scope.row.student.fullname : '' }}
              </span>
            </template>
          </el-table-column>
          <!-- 2 -->
          <el-table-column label="対応日" width="220px">
            <template slot-scope="scope">
              <span class="ellipsis">
                {{ scope.row.snz_actiondate | filterDateTimeN }}
              </span>
            </template>
          </el-table-column>
          <!-- 3 -->
          <el-table-column label="対応者">
            <template slot-scope="scope">
              <span class="ellipsis">
                {{ scope.row.action_by_user ? scope.row.action_by_user.name : '' }}
              </span>
            </template>
          </el-table-column>
          <!-- 4 -->
          <el-table-column label="対応ステータス" width="220px">
            <template slot-scope="scope">
              <span class="ellipsis">
                {{ scope.row.snz_actionstatus | filterActionStatus }}
              </span>
            </template>
          </el-table-column>
          <!-- 5 -->
          <el-table-column label="詳細編集" align="center" width="95px">
            <template slot-scope="scope">
              <el-button v-if="ableRole(['system', 'school'])" class="btn-edit" size="mini" @click="editAction(scope.row.id)">
                <svg-icon icon-class="_edit" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button class="btn-add" :disabled="checkRole(['callcenter','viewonly'],'cant')" plain icon="el-icon-circle-plus" @click="add()">
          対応履歴を追加
        </el-button>
        <custom-pagination
          v-show="paginate2.last_page > 1"
          :total="paginate2.total"
          :page.sync="paginate2.page"
          :limit.sync="paginate2.limit"
          layout="prev, pager, next"
          prev-text="<"
          next-text=">"
          class="text-center custom-pagination"
          @pagination="getLetterList(id, paginate2)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
import Letter from '@/api/letter';
import role from '@/directive/role';
import toiawaseStatus from '@/const/ToiawaseStatus';
import filterOption from '@/filters/parseData';

const letter = new Letter();

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
    filterDocumentSent: value => {
      let result = null;
      if (value != null) {
        toiawaseStatus.OPTION_SNZ_DOCUMENTSENT.forEach(element => {
          if (element.value === value) {
            result = element.label;
          }
        });
      }
      return result;
    },
    filterInquiryType: value => {
      return filterOption(value, toiawaseStatus.OPTION_SNZ_INQUIRYTYPE);
    },
    filterActionStatus: value => {
      return filterOption(value, toiawaseStatus.OPTION_SNZ_ACTIVESTATUS, 'ー');
    },
    filterApproachend: value => {
      return filterOption(value, toiawaseStatus.OPTION_SNZ_APPROACHEND, 'ー');
    },
    filterDateTimeN: value => {
      if (!value) {
        return 'ー';
      }
      return moment(value).format('YYYY/MM/DD');
    },
  },
  directives: { role },
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      id: null,
      listLoading1: true,
      listLoading2: true,
      roles: null,
      paginate1: {
        total: 0,
        page: 1,
        limit: 10,
        last_page: null,
      },
      paginate2: {
        total: 0,
        page: 1,
        limit: 10,
        last_page: null,
      },
      tabPosition: 'top',
      tableData1: null,
      tableData2: null,
      internalCode: null,
      BrotherInfoRecode: null,
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.init();
    this.fullscreenLoading = false;
    this.roles = this.$store.getters.roles;
  },
  methods: {
    init() {
      this.getRequestList();
      this.getLetterList();
    },
    async getRequestList() {
      this.listLoading1 = true;
      this.paginate1.studentCode = this.id;
      this.paginate1.internalCode = this.form.snz_internalcode;
      this.paginate1.tableName = 'SnzToiawase';
      const resRequestList = await letter.getRequestList(this.paginate1);
      this.tableData1 = resRequestList.original.data.data;
      this.paginate1.total = resRequestList.original.data.total;
      this.paginate1.page = resRequestList.original.data.current_page;
      this.paginate1.limit = Number(resRequestList.original.data.per_page);
      this.paginate1.last_page = resRequestList.original.data.last_page;
      this.listLoading1 = false;
      this.scrollTopTable();
    },
    async getLetterList() {
      this.listLoading2 = true;
      this.paginate2.studentCode = this.id;
      this.paginate2.internalCode = this.form.snz_internalcode;
      this.paginate2.tableName = 'SnzAction';
      const resLetterList = await letter.getLetterList(this.paginate2);
      this.tableData2 = resLetterList.original.data.data;
      this.paginate2.total = resLetterList.original.data.total;
      this.paginate2.page = resLetterList.original.data.current_page;
      this.paginate2.limit = Number(resLetterList.original.data.per_page);
      this.paginate2.last_page = resLetterList.original.data.last_page;
      this.listLoading2 = false;
      this.scrollTopTable();
    },
    add() {
      this.$router.push({
        name: 'actions-add',
        query: { studentCode: this.id, fullName: this.form.fullname },
        params: { redirect: true },
      });
    },
    async editAction(id) {
      this.$router.push({
        name: 'actions-detail',
        params: { id: id, redirect: true },
      });
    },
    async editToiawase(id) {
      this.$router.push({
        name: 'toiawase-detail',
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
<style lang="scss" scoped>
.header-sm{
  margin: 0px;
  font: normal normal normal 10px/12px Hiragino Sans;
  letter-spacing: 0.16px;
  color: #FF20F5;
  opacity: 1;
  font-weight: 600;
}
.header-md{
  margin-bottom: 20px;
}
.line{
  margin: 0px;
  color: #9a9a9a;
}
.tab-custom {
  .app-container{
    padding-top: 0px;
  }
  .card-body ::v-deep {
    padding: 19px 30px 0px 30px !important;
    .txt-center{
      text-align: center;
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
      h3 {
        padding-bottom: 19px !important;
      }
      .el-table {
        height: 265px;
        .cell {
          height: 30px;
          padding-right: 0;
          padding-left: 0;
          display: table-cell;
          vertical-align: middle;
        }
        .el-table__body-wrapper{
          overflow-y: auto;
        }
        .el-table__body{
          .el-table__row{
            td:last-child{
              .cell{
                padding-left: 16px;
              }
            }
          }
        }
      }
      .table-1{
        margin-bottom: 13px;
        height: 267px;
        .el-table__body-wrapper{
          height: 235px;
        }
        .el-table__header{
          .cell{
            height: 27px;
          }
          th:nth-child(9){
            .cell{
              font-size: 9px;
            }
          }
        }
      }
      .table-2{
        height: 255px;
        .el-table__body-wrapper{
          height: 224px;
        }
        .el-table__header{
          .cell{
            height: 27px;
          }
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
            color: #ffffff;
            padding: 0 20px;
            // height: 30px;
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
            text-align: left;
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

    .el-button:hover{
      opacity: 0.8;
    }

    .btn-add {
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

  .el-pagination:nth-child(2){
    margin-bottom: 10px;
  }
}
</style>
