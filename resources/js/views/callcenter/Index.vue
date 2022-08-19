<template>
  <div class="app-container">
    <el-card shadow="false" class="rounded search-container">
      <el-form
        ref="searchForm"
        class="search"
        :model="searchForm"
        label-position="left"
      >
        <el-row class="top" justify="space-around">
          <el-col :span="9" class="no-border">
            <div style="display: flex" class="date-range">
              <el-form-item label-width="55px" label="作成日">
                <el-date-picker
                  v-model="searchForm.created_start"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  :editable="false"
                  prefix-icon="abc"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
                </span>
              </el-form-item>
              <span class="between-date">〜</span>
              <el-form-item>
                <el-date-picker
                  v-model="searchForm.created_end"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  :editable="false"
                  prefix-icon="abc"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
                </span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="83px" label="問合せ方法">
              <el-select
                v-model="searchForm.snz_inquirytype"
                clearable
                placeholder=""
                class="multiselect"
                :multiple="true"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
              >
                <el-option
                  v-for="item in inquiryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- DIVISION -->
          <el-col :span="6">
            <el-form-item label="事業部" label-width="53px">
              <SearchSelectBox
                v-model="searchForm.snz_divisionnm"
                :search-function="searchDivision"
                key-name="snz_division"
                class="multiselect"
                key-id="snz_division_code"
                :multiple="true"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <!-- business -->
          <!-- GRADE -->
        </el-row>
        <el-row class="top" justify="space-around">
          <!-- business -->
          <el-col :span="6">
            <el-form-item label-width="42px" label="校舎">
              <el-input
                v-model="searchForm.business_unit"
                maxlength="200"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <!-- GRADE -->
          <el-col :span="6">
            <el-form-item label-width="42px" label="学年">
              <el-select
                v-model="searchForm.grade"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                filterable
                :multiple="true"
                class="multiselect"
                clearable
              >
                <el-option
                  v-for="(item, index) in selectBox.grade"
                  :key="index"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- Fullname -->
          <el-col :span="6">
            <el-form-item label-width="70px" label="生徒氏名">
              <el-input
                v-model="searchForm.fullname"
                maxlength="200"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="67px" label="フリガナ">
              <el-input
                v-model="searchForm.furigana"
                maxlength="200"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="bot" justify="space-between">

          <el-col :span="6">
            <el-form-item label-width="70px" label="電話番号">
              <input-number
                v-model="searchForm.telephone"
                :maxlength="100"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <!-- USERINCHARGE -->
          <el-col :span="6">
            <el-form-item label="担当者" label-width="53px">
              <SearchSelectBox
                v-model="searchForm.userincharge"
                :search-function="searchUser"
                key-name="name"
                class="multiselect"
                key-id="id"
                :multiple="true"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="70px" label="架電状況">
              <el-select
                v-model="searchForm.call_status"
                class="multiselect"
                placeholder=""
                :multiple="true"
              >
                <el-option
                  v-for="item in callLogOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="40px" label="結果">
              <el-select
                v-model="searchForm.call_result"
                class="multiselect"
                placeholder=""
                :multiple="true"
              >
                <el-option
                  v-for="item in callResultOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" class="search-btn-col">
            <el-form-item label="">
              <span @click="handleSearch">
                <ButtonSearch />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div id="page-body" ref="pageBody" class="container page-body">
      <ListDatatable
        ref="datatable"
        :register-status-prop="searchForm.register_status"
        @setCurrentPageRecord="currentPageRecord = $event"
      />
    </div>
  </div>
</template>

<script>
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ListDatatable from './components/ListDatatable';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import BusinessUnitRequest from '@/api/BusinessUnitRequest';
import GradeRequest from '@/api/gradeRequest';
import InputNumber from '../../components/Common/InputNumber';
import UserResource from '../../api/user';
import CommonSettings from '../../const/CommonSettings';
import { options as inquiryOptions } from '@/const/InquiryType';
import dateMethod from '@/mixins/date';
// import _ from 'lodash';
import callLogStatus from '@/const/CallLogStatus';
const businessUnitRequest = new BusinessUnitRequest();
const gradeRequest = new GradeRequest();
const userResource = new UserResource();
export default {
  name: 'Index',
  metaInfo: {
    title: 'コールセンター',
  },
  components: { ListDatatable, ButtonSearch, SearchSelectBox, InputNumber },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger',
      };
      return statusMap[status];
    },
  },
  mixins: [dateMethod],
  data() {
    return {
      list: null,
      currentPageRecord: CommonSettings.DEFAULT_PAGE_RECORD,
      total: 0,
      listLoading: true,
      inquiryOptions: inquiryOptions,
      callLogOptions: _.concat(callLogStatus.OPTION_SNZ_CALL_STATUS, [{ value: 'new', label: 'NEW' }]),
      callResultOptions: callLogStatus.OPTION_SNZ_CALL_RESULT,
      listQuery: {
        page: 1,
        limit: 20,
      },
      selectBox: {
        businessUnit: [],
        schoolYear: this.getSchoolYearOption(),
        course: [],
        grade: [],
      },
      searchForm: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        business_unit: null,
        grade: null,
        inquirytype: null,
        divisionnm: null,
        userincharge: null,
        call_status: null,
        call_result: null,
        created_start: null,
        created_end: null,
        fullname: null,
        furigana: null,
        telephone: null,

      },
      formQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        business_unit: null,
        grade: null,
        inquirytype: null,
        divisionnm: null,
        userincharge: null,
        call_status: null,
        call_result: null,
        created_start: null,
        created_end: null,
        fullname: null,
        furigana: null,
        telephone: null,
      },
    };
  },
  async created() {
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.formQuery = this.copyAttributes(this.$route.query, this.formQuery);
    this.formQuery = JSON.parse(JSON.stringify(this.searchForm));
    this.selectBox.grade = await gradeRequest.gradeOptions();
    await this.$refs.datatable.getList(this.formQuery);
  },
  methods: {
    async searchDivision(query){
      return await businessUnitRequest.searchDivisionName(query);
    },
    searchBusiness(query) {
      return businessUnitRequest.searchName(query);
    },
    async searchUser(query) {
      return await userResource.searchName(query);
    },
    async searchGrade() {
      this.selectBox.grade = await gradeRequest.gradeOptions();
    },
    handleSearch() {
      this.formQuery = JSON.parse(JSON.stringify(this.searchForm));
      this.$refs.datatable.getList(this.formQuery);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-container{

  /deep/.el-card__body {
    padding-bottom: 20px!important;

  }
  input {

  }
  .bot{
    .el-col:last-child{
      position: absolute;
      right: 0px;
      bottom: 0px;
    }
  }
}
.multiselect{
  width: 174px !important;
  padding-right: 10px;
}
.date-range{
  .icon-input__calendar{
    top: 9px;
  }
  .between-date{
    padding: 10px 2px;
  }
}
#page-body {
  height: calc(100% - 278px);
}
.edit-input {
  padding-right: 100px;
}
/deep/ .el-card__body {
  padding-bottom: 0 !important;
}
/deep/ .search-container {
}

.container {
  /deep/ div.statistics {
    span {
      font-size: 13px;
      padding-right: 25px;
      font-weight: 400;
    }
  }
}

/deep/ .paging {
  margin-top: 14px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
