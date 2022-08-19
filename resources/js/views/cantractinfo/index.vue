<template>
  <div id="app-container" v-loading="loading" class="app-container">
    <div class="block-search">
      <el-form ref="searchForm" class="form-search" :model="searchForm">
        <div class="div-left">
          <el-form-item label-width="40px" label="校舎">
            <search-select-box
              v-model="searchForm.snz_school_id"
              :search-function="searchBusiness"
              placeholder=""
              popper-class="select-inside-table"
              :popper-append-to-body="false"
            />
          </el-form-item>
          <el-form-item label-width="63px" label="学年">
            <el-select
              v-model="searchForm.snz_grade_id"
              placeholder=""
              :no-data-text="CommonTxt.selectboxEmptyTxt"
              clearable
              filterable
              popper-class="select-inside-table"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in grades"
                :key="item.value"
                :label="item.snz_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label-width="65px" label="年度">
            <el-select
              v-model="searchForm.snz_schoolyear"
              :no-data-text="CommonTxt.selectboxEmptyTxt"
              clearable
              value-key="value"
              placeholder=""
            >
              <el-option
                v-for="item in years"
                :key="item.value"
                class="medium-select__option"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="div-right">
          <div class="d-left">
            <el-form-item label-width="55px" label="生徒名">
              <el-input v-model="searchForm.fullname" placeholder="" maxlength="100" clearable />
            </el-form-item>
            <el-form-item label-width="75px" label="コース">
              <SearchSelectBox
                ref="searchCourse"
                v-model="searchForm.course"
                :search-function="searchCourse"
                key-name="snz_name"
                placeholder=""
                clearable
              />
            </el-form-item>
            <el-form-item label-width="107px" label="生徒コード">
              <input-number
                v-model="searchForm.snz_studentcode"
                :maxlength="100"
                placeholder=""
                clearable
              />
            </el-form-item>
          </div>
          <div class="d-right">
            <button-search @search="submitSearch" />
          </div>
        </div>
      </el-form>
    </div>
    <div class="card-body__content">
      <el-table
        v-loading="listLoading"
        :empty-text="CommonTxt.tableEmptyTxt"
        class="table-content"
        :data="list"
        fit
        highlight-current-row
        header-cell-class-name="my-header"
        height="calc(100% - 20px)"
        :row-class-name="tableRowClassName"
      >
        <el-table-column min-width="75px" label="生徒氏名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student ? scope.row.student.fullname : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px" label="学年">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade ? scope.row.grade.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="90px" label="生徒コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.contact ? scope.row.contact.snz_studentcode : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80px">
          <template slot="header">
            <p style="font-size: 9px; margin: 0;">生徒<br>ステータス</p>
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.contact ? scope.row.contact.snz_studentstatus : '' | getStatusLabel }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80px" label="受講区分">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_contract_type ? scope.row.snz_contract_type : '' | getContractType }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="90px" label="受講開始月">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.contract_start_month ? scope.row.contract_start_month.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="90px" label="受講終了月">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.contract_end_month ? scope.row.contract_end_month.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px" label="年度">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_schoolyear ? scope.row.snz_schoolyear : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px" label="コース">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.course ? scope.row.course.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="90px" label="科目セット">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.subject_set ? scope.row.subject_set.snz_display_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="60px" label="校舎">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.business_unit ? scope.row.business_unit.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80px" label="詳細編集" row-class-name="action">
          <template slot-scope="scope">
            <router-link :to="{name:'StudentDetail',params:{id: scope.row.contact ? scope.row.contact.snz_studentcode : '', formQuery: formQuery }, query: {tab: 'tab2'}}">
              <el-button class="btn-edit" size="mini">
                <svg-icon icon-class="_edit" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-row class="footer__group">
        <el-col :span="6">
          <div />
        </el-col>
        <el-col :span="12">
          <CustomPagination
            v-show="total > 1"
            :total="total"
            :page.sync="formQuery.page"
            :limit.sync="formQuery.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination"
            @pagination="getList"
          />
        </el-col>
        <el-col :span="6">
          <div class="group-button">
            <button-export :loading="exportLoading" type="excel" @export="handleExport" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ContractInfo from '@/api/contractInfo';
import loadmore from '@/directive/selection';
import role from '@/directive/role';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import { options } from '../../const/BrandOption';
import CommonSettings from '../../const/CommonSettings';
import BusinessUnitRequest from '../../api/BusinessUnitRequest';
import { Message } from 'element-ui';
import CourseRequest from '@/api/CourseRequest';
import { applicationOptions } from '@/const/CantractInfo';
import GradeRequest from '../../api/gradeRequest';
import _ from 'lodash';
import StudentStatus from '../../const/StudentStatus';
import Contact from '../../const/Contact';
import InputNumber from '../../components/Common/InputNumber';
import dateMethod from '@/mixins/date';

const contractInfo = new ContractInfo();
const businessResource = new BusinessUnitRequest();
const gradeRequest = new GradeRequest();
const courseRequest = new CourseRequest();

export default {
  name: 'List',
  metaInfo: {
    title: '受講情報',
  },
  directives: { loadmore, role },
  components: {
    CustomPagination,
    ButtonExport,
    ButtonSearch,
    SearchSelectBox,
    InputNumber,
  },
  filters: {
    limitWord(str, limit) {
      return String(str).substring(0, limit);
    },
    checkSubjectFlag(value) {
      if (value === 1) {
        return '';
      }
      return 'ー';
    },
    getBrandName(brand) {
      const x = options.filter(obj => {
        return brand === obj.value;
      });
      return x[0] ? x[0].label : '';
    },
    getStatusLabel(status) {
      const stt = _.filter(StudentStatus.OPTION_SNZ_STUDENTSTATUS, function(item) {
        return item.value === status;
      });
      return stt[0] ? stt[0].label : '';
    },
    getContractType(type) {
      const stt = _.filter(Contact.SNZ_CONTRACT_TYPE, function(item) {
        return item.value === type;
      });
      return stt[0] ? stt[0].label : '';
    },
  },
  mixins: [dateMethod],
  data() {
    return {
      list: [],
      total: 0,
      lastPage: 1,
      listLoading: true,
      checkQuerySearch: false,
      searchForm: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        snz_application_type: '',
        snz_school_id: '',
        snz_grade_id: '',
        snz_studentcode: '',
        fullname: '',
        snz_code: '',
        course: '',
        snz_schoolyear: this.getCurrentSchoolYear(),
      },
      formQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        snz_school_id: '',
        snz_grade_id: '',
        snz_studentcode: '',
        snz_studentstatus: '',
        fullname: '',
        snz_contract_type: '',
        snz_cantractstartmonth_period_id: '',
        snz_cantractendmonth_period_id: '',
        snz_schoolyear: this.getCurrentSchoolYear(),
        snz_course_id: '',
        snz_subjectset_id: '',
      },
      grades: [],
      course: [],
      years: this.getSchoolYearOption(),
      studentStatus: [],
      contractType: [],
      applicationOptions: applicationOptions,
      remoteGrade: false,
      remoteCourse: false,
      pageGrade: 1,
      pageCourse: 1,
      querySearchCourse: null,
      exportLoading: null,
      loading: false,
    };
  },
  computed: {
    isEditing: function(){
      return !!this.$route.params.id;
    },
  },
  async created() {
    this.loading = true;
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.formQuery = this.copyAttributes(this.$route.query, this.formQuery);
    await this.getOptionGrade();
    if (!_.some(this.grades, { id: this.formQuery.snz_grade_id })){
      delete this.formQuery.snz_grade_id;
      delete this.searchForm.snz_grade_id;
    }
    this.contractType = Contact.SNZ_CONTRACT_TYPE;
    this.studentStatus = StudentStatus.OPTION_SNZ_STUDENTSTATUS;
    await this.getList();
    this.loading = false;
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.snz_application_pending_flag === 1){
        return 'disabled-row';
      } else {
        return '';
      }
    },
    async getList() {
      this.listLoading = true;
      this.searchForm.snz_schoolyear = this.formQuery.snz_schoolyear;
      const query = this.buildQuery(this.formQuery);
      window.history.replaceState(null, null, `?${query}`);
      const res = await contractInfo.list({ ...this.formQuery, ...{ isConditionEndMonth: false }});
      this.list = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.listLoading = false;
      this.scrollTopTable();
    },
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    async getOptionGrade() {
      this.grades = await gradeRequest.gradeOptions();
    },
    async searchArea(query){
      return await businessResource.searchAreaName(query);
    },
    async searchCourse(query) {
      return courseRequest.searchName(query);
    },
    async submitSearch() {
      this.listLoading = true;
      Object.assign(this.formQuery, this.searchForm);
      await this.getList();
      this.listLoading = false;
    },
    deleteData(id){
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        contractInfo.destroy(id).then(response => {
          Message({
            message: this.CommonTxt.deleteSuccess,
            type: 'success',
            duration: 1500,
          });
          this.getList();
        }).catch(() => {
          Message({
            message: this.CommonTxt.deleteNotPermission,
            type: 'error',
            duration: 1500,
          });
        });
      });
    },
    async handleExport() {
      if (!this.exportLoading) {
        this.exportLoading = true;
      } else {
        return;
      }
      await contractInfo.exportResource(this.searchForm).then(data => {
        this.createDownloadXlsFile('受講情報', data);
        this.exportLoading = false;
      }).catch(() => {
        this.$message({
          message: '選択しているデータは多すぎます。出力のデータをもっと絞り込んでください。',
          type: 'error',
        });
      }).finally(() => {
        this.exportLoading = false;
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "./styles/index";
/deep/ .el-table .disabled-row{
  background-color: #f0f0f0 !important;
  &:hover > td{
    background-color: #f0f0f0 !important;
  }
}
</style>
