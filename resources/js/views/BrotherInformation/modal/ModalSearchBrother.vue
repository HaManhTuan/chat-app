<template>
  <div>
    <el-dialog title="兄弟検索" :visible.sync="show" :before-close="closeModal" top="52px" class="custom-dialog">
      <!-- <el-form ref="form" :rules="rules" :model="form"> -->
      <el-form ref="form" :model="formSearch">
        <h3 class="mt-0 title-2 c-1a1714">情報</h3>
        <el-row class="top mb-4px">
          <!-- họ -->
          <el-col class="el-col-t">
            <el-form-item label="姓">
              <el-input v-model="formSearch.brotherLastName" placeholder="" :maxlength="100" clearable />
            </el-form-item>
          </el-col>
          <!-- tên -->
          <el-col class="el-col-t">
            <el-form-item label="名">
              <el-input v-model="formSearch.brotherName" placeholder="" :maxlength="100" clearable />
            </el-form-item>
          </el-col>
          <!-- họ katana -->
          <el-col class="el-col-t">
            <el-form-item label="姓カナ">
              <el-input v-model="formSearch.brotherKatanaLastName" placeholder="" :maxlength="100" clearable />
            </el-form-item>
          </el-col>
          <!-- tên katana -->
          <el-col class="el-col-t">
            <el-form-item label="名カナ">
              <el-input v-model="formSearch.brotherKatanaName" placeholder="" :maxlength="100" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="top">
          <!-- mã nội bộ -->
          <el-col class="el-col-t">
            <el-form-item label-width="" label="内部コード">
              <InputNumber v-model="formSearch.brotherCode" :maxlength="100" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <!-- SĐT -->
          <el-col class="el-col-t">
            <el-form-item label-width="" label="電話番号">
              <InputNumber v-model="formSearch.brotherPhone" :maxlength="11" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <ButtonSearch @search="clickSearchBrother()" />
        </el-row>
      </el-form>
      <el-table v-loading="listLoading" class="table-search" :data="tableData" :empty-text="CommonTxt.tableEmptyTxt" fit highlight-current-row header-cell-class-name="my-header">
        <el-table-column label="内部コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_internalcode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.lastname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.firstname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓カナ">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.yomilastname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="名カナ">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.yomifirstname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学年">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade == null ? '' : scope.row.grade.snz_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="電話番号">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.telephone1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" align="center" width="80px">
          <template slot-scope="scope">
            <el-button class="btn-choose" size="mini" :disabled="checkRole(['callcenter','viewonly'],'cant')" @click="choose(scope.row.snz_internalcode)">
              選択
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="formSearch.total"
        :page.sync="formSearch.page"
        :limit.sync="formSearch.per_page"
        layout="prev, pager, next"
        prev-text="<"
        next-text=">"
        class="text-center custom-pagination mt-2 mb-3"
        @pagination="searchBrotherPaginate"
      />
    </el-dialog>
  </div>
</template>
<script>
import ButtonSearch from '@/components/Common/Button/ButtonSearch';
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
import BrotherInfo from '@/api/brother';
import InputNumber from '@/components/Common/InputNumber';

const brotherInfo = new BrotherInfo();

export default {
  name: 'ModalSearchBrother',
  // directives: { role },
  components: {
    ButtonSearch,
    CustomPagination,
    InputNumber,
  },
  // mixins: [ModalRegister],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    internalcode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      internalCode: '',
      listLoading: false,
      formSearch: {
        myInternalCode: null,
        brotherLastName: '',
        brotherName: '',
        brotherKatanaLastName: '',
        brotherKatanaName: '',
        brotherCode: '',
        brotherPhone: '',
        total: 0,
        page: 1,
        per_page: 5,
      },
      formSearchNull: {
        myInternalCode: null,
        brotherLastName: '',
        brotherName: '',
        brotherKatanaLastName: '',
        brotherKatanaName: '',
        brotherCode: '',
        brotherPhone: '',
        total: 0,
        page: 1,
        per_page: 5,
      },
      tableData: null,
      formSearchSubmit: null,
    };
  },
  created() {
    this.formSearch.myInternalCode = this.internalcode;
    this.formSearchNull.myInternalCode = this.internalcode;
    this.formSearchSubmit = this.formSearch;
    this.roles = this.$store.getters.roles;
    this.searchBrother();
  },
  methods: {
    inputSearch: function(event){
      event.preventDefault();
      const key = event.keyCode;
      const value = event.key;
      console.log(event.keyCode);
      if (key >= 48 && key <= 57 && this.formSearch.brotherPhone.length <= 10) {
        this.formSearch.brotherPhone = this.formSearch.brotherPhone + value;
      }
    },
    closeModal() {
      this.resetTable();
      this.$emit('close');
    },
    async searchBrother() {
      this.listLoading = true;
      const resSearch = await brotherInfo.getSearchBrother(this.formSearch);
      this.tableData = resSearch.data;
      this.formSearch.total = resSearch.total;
      this.formSearch.per_page = Number(resSearch.per_page);
      this.formSearch.page = resSearch.current_page;
      this.formSearchSubmit = _.clone(this.formSearch);
      this.listLoading = false;
    },
    async searchBrotherPaginate() {
      this.listLoading = true;
      this.formSearchSubmit.page = this.formSearch.page;
      const resSearch = await brotherInfo.getSearchBrother(this.formSearchSubmit);
      this.tableData = resSearch.data;
      this.listLoading = false;
    },
    async clickSearchBrother(){
      this.formSearch.page = 1;
      await this.searchBrother();
    },
    choose(code) {
      const dataBro = this.tableData.filter((item) => {
        return item.snz_internalcode === code;
      });
      this.$emit('fill-brother', dataBro);
      this.resetTable();
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
    resetTable(){
      this.formSearch = _.clone(this.formSearchNull);
      this.clickSearchBrother();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/search.scss';
/deep/ .table-search{
  .cell{
    display: flex !important;
    align-items: center !important;
  }
  tr {
    td:last-child{
      .cell{
        padding-left: 10px !important;
        padding-right: 10px !important;
      }
    }
  }
}
</style>
