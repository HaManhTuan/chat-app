<template>
  <div class="app-container">
    <div class="filter-container block-search">
      <el-form ref="searchForm" class="form-search" :model="searchForm" label-width="130px">
        <el-col :span="6">
          <el-form-item label="校舎">
            <el-select v-model="searchForm.codeType" placeholder="">
              <el-option
                v-for="item in numberOptions"
                :key="item.id"
                style="padding-left:20px;"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="margin-left: -20px;">
          <el-form-item label="コード種別">
            <el-select v-model="searchForm.school" placeholder="">
              <el-option
                v-for="item in schoolOptions"
                :key="item.id"
                style="padding-left:20px;"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item style="text-align: right;margin-right: 5px;">
            <el-button class="button-search" @click="submitForm('searchForm')">
              <svg-icon style="width: 17.49px;height: 17.49px;" icon-class="search" />
              <span class="text-button-search">検索</span>
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="card-body__content">
      <el-table
        v-loading="listLoading"
        class="block-table"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%"
        height="465px"
      >
        <el-table-column width="230px" label="コード種別">
          <template slot-scope="scope">
            <span>{{ getNameCodeType(scope.row.snz_codetype) }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="248px" label="校舎">
          <template slot-scope="scope">
            <span>{{ scope.row.business_unit ? scope.row.business_unit.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column width="238px" label="現在値">
          <template slot-scope="scope">
            <span>{{ thousandSeprator(scope.row.snz_currentvalue) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="90px" align="center" label="詳細編集">
          <template slot-scope="scope">
            <router-link :to="'/number-assignment/edit/'+scope.row.id">
              <el-button class="button-action-edit">
                <svg-icon icon-class="_edit" style="width: 30px;height: 30px;" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column width="70px" label="削除">
          <template slot-scope="scope">
            <el-button class="button-action" icon="el-icon-delete action-icon" @click="deleteNumbering(scope.row.id)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" layout="prev, pager, next" class="position-center" @pagination="typePaginate" />
    <div class="div-button">
      <a href="/api/number-assignment/export-csv" type="button">
        <el-button class="button-export">
          <svg-icon icon-class="csv" style="width: 24px;height: 17px;" />
          <span style="font-size:15px;line-height:35px;margin-left: 5px;">出力</span>
        </el-button>
      </a>
      <el-button class="button-create" icon="el-icon-circle-plus-outline custom-icon-create">
        <span style="font-size:13px;line-height:35px">新規作成</span>
      </el-button>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import { fetchNumberAssignment, exportCSV } from '@/api/numberAssignment';
import Resource from '@/api/resource';
const numberAssignmentResource = new Resource('number-assignment');

export default {
  name: 'NumberAssignment',
  components: { Pagination },
  data(){
    return {
      list: [],
      total: 0,
      check: 0,
      listLoading: true,
      query: {
        page: 1,
        limit: 10,
      },
      numberOptions: [{ id: 0, name: '—' }],
      schoolOptions: [{ id: 0, name: '—' }],
      searchForm: {
        codeType: 0,
        school: 0,
        page: 1,
      },
    };
  },
  created() {
    this.schoolOptions.length = 1;
    this.numberOptions.length = 1;
    this.getList();
  },
  methods: {
    thousandSeprator(amount) {
      if (amount !== '' || amount !== undefined || amount !== 0 || amount !== '0' || amount !== null) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        return amount;
      }
    },
    getNameCodeType(codeType){
      return this.numberOptions.find(e => Number(e.id) === codeType).name;
    },
    async getList() {
      this.listLoading = true;
      const { data } = await numberAssignmentResource.list(this.query);
      this.setData(data);
      this.listLoading = false;
    },
    async search(){
      this.listLoading = true;
      const { success, data } = await fetchNumberAssignment(this.searchForm);
      if (success === true){
        this.setData(data);
      }
      this.listLoading = false;
    },
    typePaginate(){
      if (this.check === 0){
        this.getList(this.query);
      } else {
        this.searchForm.page = this.query.page;
        this.search();
      }
    },
    async submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.listLoading = true;
          this.query.page = 1;
          this.searchForm.page = this.query.page;
          this.search();
          if (this.searchForm.codeType === 0 && this.searchForm.school === 0){
            this.check = 0;
          } else {
            this.check = 1;
          }
          this.listLoading = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async deleteNumbering(id){
      this.$confirm('This will permanently delete number assignment. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        numberAssignmentResource.destroy(id).then(response => {
          this.$message({
            type: 'success',
            message: 'Delete completed',
          });
          this.list = this.list.filter((i) => i.id !== id);
          this.total -= 1;
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled',
        });
      });
    },
    setData(data){
      this.schoolOptions.length = 1;
      this.numberOptions.length = 1;
      this.list = data.numberAssignments.data;
      data.schools.unshift(this.schoolOptions[0]);
      this.schoolOptions = data.schools;
      const codeTypes = this.numberOptions;
      for (const [key, value] of Object.entries(data.codeTypes)) {
        codeTypes.push({ id: key, name: value });
      }
      this.numberOptions = codeTypes;
      this.total = data.numberAssignments.total;
    },
    async exportIntoCSV(){
      await exportCSV();
    },
  },
};
</script>
<style lang="scss" scoped>
*{
  margin: 0px;
  padding: 0px;
  font: normal normal normal;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Noto Sans JP GB, Microsoft YaHei, Arial, sans-serif;
}
.app-main {
   background-color: #eff1f4;
}
.app-container{
  min-height:657px;
  background-color: #eff1f4;
}
.block-search::v-deep {
    height: 76px;
    background-color: #ffffff;
    border-radius: 10px;
    .form-search{
      padding-top: 20px;
      margin-left: -70px;
      .button-search{
          width: 105px;
          height: 45px;
          color: #FFFFFF;
          margin-top: -5px;
          border-radius: 30px;
          background-color: #1467B3;
          cursor: pointer;
          &:hover{
            opacity: 0.8;
          }
          .text-button-search{
              font: normal normal normal 15px/45px Noto Sans JP;
              color: #FFFFFF;
          }
      }
      .el-form-item__label:before{
        display: none;
      }
    }
    .el-form-item__label{
      font: normal normal normal 14px/45px Noto Sans JP;
      color: #1A1714;
    }
    .el-input{
      width: 174px;
    }
}
.card-body__content::v-deep{
    margin-top: 26px;
    .block-table {
      table {
        th {
          color: #FFFFFF;
          padding: 0 5px;
          padding-left: 10px;
          height: 30px;
          background: #535353;
          border-bottom: 2px solid #ebeaeb;
          font-size: 13px;
          font-weight: 400;
          & > .cell{
            font: normal normal normal 13px Noto Sans JP;
            color: #FFFFFF;
          }
          &.el-table_1_column_5 .cell{
            margin-left: -10px;
          }
        }
        td{
          padding: 0 5px;
          padding-left: 10px;
          border-bottom: 1px solid #e5e5e5;
          height: 44px;
        }
        .cell{
          font: normal normal normal 14px Noto Sans JP;
          color: #1A1714;
        }
      .button-action{
          font-size: 12.22px;
          background-color: #f4f8fd;
          border-color: #f4f8fd;
          width:30px;
          height: 30px;
          margin-left: -10px;
          &:hover{
            opacity: 0.8;
          }
      }
      .button-action-edit{
        border: none;
        &:hover{
          opacity: 0.8;
        }
      }
    }
  }
}
.position-center{
    text-align: center;
    margin:0px;
    padding-top: 26px;
    height: 60px;
    background-color: #eff1f4;;
}
.div-button::v-deep{
    text-align: right;
    min-height: 100px;
    max-height: auto;
    margin-top: -44px;
    .button-export{
        color: #FFFFFF;
        height: 45px;
        width: 105px;
        border-radius: 25px;
        background: #343434 0% 0% no-repeat padding-box;
        &:hover{
          opacity: 0.8;
        }
    }
    .button-create{
        color: #FFFFFF;
        border-radius: 25px;
        height:45px;
        width: 129px;
        cursor: pointer;
        background: #1467B3 0% 0% no-repeat padding-box;
        &:hover{
          opacity: 0.8;
        }
        .custom-icon-create{
          font-size: 18.86px;
          vertical-align: middle;
        }
    }
}
.position-center::v-deep{
    .el-pagination.is-background .btn-prev, .position-center >>> .el-pagination.is-background .btn-next, .position-center >>> .el-pagination.is-background .el-pager li {
        margin: 0 5px;
        background-color: white;
        color: #606266;
        min-width: 30px;
        border-radius: 2px;
    }
    .el-pagination.is-background .el-pager li.active{
      background-color: #409eff;
      color: #fff;
    }
}
</style>
