<template>
  <div>
    <el-dialog title="兄弟検索" center :visible.sync="show" :before-close="closeModal" class="custom-dialog">
      <el-form ref="form" :model="formSearch">
        <h3 class="mt-0 title-2">情報</h3>
        <el-row class="top mb-4px">
          <!-- họ -->
          <el-col class="el-col-t">
            <el-form-item label="姓">
              <el-input v-model="formSearch.lastname" placeholder="" :maxlength="100" clearable />
            </el-form-item>
          </el-col>
          <!-- tên -->
          <el-col class="el-col-t">
            <el-form-item label="名">
              <el-input v-model="formSearch.firstname" placeholder="" :maxlength="100" clearable />
            </el-form-item>
          </el-col>
          <!-- họ katana -->
          <el-col class="el-col-t">
            <el-form-item label="姓カナ">
              <el-input v-model="formSearch.yomilastname" placeholder="" :maxlength="100" clearable />
            </el-form-item>
          </el-col>
          <!-- tên katana -->
          <el-col class="el-col-t">
            <el-form-item label="名カナ">
              <el-input v-model="formSearch.yomifirstname" placeholder="" :maxlength="100" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="top">
          <!-- mã nội bộ -->
          <el-col class="el-col-t">
            <el-form-item label-width="" label="内部コード">
              <input-number
                v-model="formSearch.brotherCode"
                :maxlength="11"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <!-- SĐT -->
          <el-col class="el-col-t">
            <el-form-item label-width="" label="電話番号">
              <input-number
                v-model="formSearch.telephone1"
                :maxlength="100"
                placeholder=""
                clearable
              />
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
        <el-table-column label="紹介者続柄" min-width="90px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.relationship" placeholder="ー" clearable>
              <el-option v-for="item in relaOptions" :key="item.value" :value="item.value" :label="item.label" />
            </el-select>
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
        <el-table-column label="電話番号" width="120px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.telephone1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="" align="center">
          <template slot-scope="scope">
            <el-button :disabled="!scope.row.relationship || listLoading" class="btn-choose" size="mini" @click="save(scope.row)">
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
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import BrotherInfo from '@/api/brother';
import { options as RelationshipBroOptions } from '@/const/RelationshipBro';
import CommonSettings from '@/const/CommonSettings';
import InputNumber from '@/components/Common/InputNumber';

const brotherInfo = new BrotherInfo();

export default {
  name: 'BrotherInfo',
  components: {
    ButtonSearch,
    CustomPagination,
    InputNumber,
  },
  props: {
    internalCode: {
      type: [String, Number],
      required: true,
    },
    toiawaseId: {
      type: [String, Number],
      required: false,
      default: 0,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
      relaOptions: RelationshipBroOptions,
      listLoading: false,
      formSearch: {
        total: 0,
        page: 1,
        per_page: 5,
        not: this.internalCode,
      },
      tableData: null,
      formSearchSubmit: null,
    };
  },
  created() {
    this.formSearch.myInternalCode = this.internalcode;
    this.formSearchSubmit = this.formSearch;
    this.searchBrother();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async searchBrother() {
      this.listLoading = true;
      const resSearch = await brotherInfo.search(this.formSearch);
      this.tableData = resSearch.data;
      this.formSearch.total = resSearch.total;
      this.formSearchSubmit = _.clone(this.formSearch);
      this.listLoading = false;
    },
    async searchBrotherPaginate() {
      this.listLoading = true;
      this.formSearchSubmit.page = this.formSearch.page;
      const res = await brotherInfo.search(this.formSearchSubmit);
      this.tableData = res.data;
      this.listLoading = false;
    },
    async clickSearchBrother(){
      this.formSearch.page = 1;
      await this.searchBrother();
    },
    async save(row) {
      this.listLoading = true;
      const data = {
        snz_lastname: row.lastname,
        snz_firstname: row.firstname,
        snz_yomilastname: row.yomilastname,
        snz_yomifirstname: row.yomifirstname,
        snz_grade_id: row.snz_grade_id,
        snz_relationship: row.relationship,
        snz_register_for_internalcode: row.snz_internalcode,
        snz_registered_internalcode: this.internalCode,
      };
      await brotherInfo.create(data).then((valid) => {
        if (valid) {
          this.$message({
            message: this.commonText.saveSuccess,
            type: 'success',
          });
          this.redirectPage({ name: 'RegisterTrial', params: { redirect: true }});
        }
      }).catch((e) => {
        if (e.response.status === 422) {
          const err = e.response.data.errors;
          const att = Object.keys(err)[0];
          this.$message({
            message: err[att][0],
            type: 'error',
          });
        } else {
          this.$message({
            message: 'Error',
            type: 'error',
          });
        }
      }).finally(() => {
        this.listLoading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/views/BrotherInformation/styles/search.scss';
.el-col-24{
  width: auto;
}
/deep/.el-form-item {
  label.el-form-item__label{
    padding-left: 0 !important
  }
}
.search-btn{
  font-weight: 500;
}
.el-dialog__title {
  display: flex;
}
</style>
