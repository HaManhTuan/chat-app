<template>
  <div id="app-container" class="app-container">
    <div class="block-search">
      <el-form ref="searchForm" class="form-search" :model="searchForm">
        <div class="div-left">
          <el-form-item label-width="40px" label="校舎">
            <search-select-box
              ref="businessSelectBox"
              v-model="searchForm.businessId"
              :search-function="searchBusiness"
              placeholder=""
              popper-class="select-inside-table"
              :popper-append-to-body="false"
              class="custom-select__caret"
            />
          </el-form-item>
          <el-form-item label-width="65px" label="学校">
            <search-select-box
              v-model="searchForm.schoolId"
              :search-function="searchSchool"
              placeholder=""
              popper-class="select-inside-table"
              :popper-append-to-body="false"
              key-name="snz_name"
              class="custom-select__caret"
            />
          </el-form-item>
          <el-form-item label-width="65px" label="学年">
            <el-select
              v-model="searchForm.gradeId"
              placeholder=""
              :no-data-text="CommonTxt.selectboxEmptyTxt"
              clearable
              filterable
              popper-class="select-inside-table"
              :popper-append-to-body="false"
            >
              <el-option v-for="item in grades" :key="item.value" :label="item.snz_name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="135px" label="生徒ステータス">
            <el-select
              v-model="searchForm.studentStatus"
              :no-data-text="CommonTxt.selectboxEmptyTxt"
              value-key="value"
              multiple
              class="multiselect"
              placeholder=""
              popper-class="select-inside-table"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in studentStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="div-right">
          <div class="d-left">
            <el-form-item label-width="54px" label="生徒名">
              <el-input v-model="searchForm.fullName" maxlength="200" clearable />
            </el-form-item>
            <el-form-item label-width="106px" label="生徒コード">
              <el-input v-model="searchForm.studentCode" maxlength="200" clearable />
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
        height="calc(100% - 0px)"
      >
        <el-table-column min-width="121px" label="氏名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student ? scope.row.student.fullname : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="131px" label="氏名(フリガナ)">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student ? scope.row.student.yomifullname : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="131px" label="エリア">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              (scope.row.business_unit && scope.row.business_unit.organization) ? scope.row.business_unit.organization.snz_area : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="98px" label="学年">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.grade ? scope.row.grade.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="96px" label="内部コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student ? scope.row.student.snz_internalcode : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="97px" label="生徒コード">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_studentcode }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="78px">
          <template slot="header">
            生徒<br>ステータス
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_studentstatus | getStatusLabel }}</span>
          </template>
        </el-table-column>
        <el-table-column width="89px" label="学校名" row-class-name="action">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              (scope.row.student && scope.row.student.school) ? scope.row.student.school.snz_name : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column width="130px" label="電話番号" row-class-name="action">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.student ? scope.row.student.telephone1 : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="96px" label="校舎" row-class-name="action">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.business_unit ? scope.row.business_unit.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="詳細編集" width="80px" row-class-name="action">
          <template slot-scope="scope">
            <router-link :to="{name:'StudentDetail',params:{id:scope.row.snz_studentcode, query: formQuery}}">
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
          <custom-pagination
            v-show="lastPage>1"
            :total="total"
            :page.sync="formQuery.page"
            :limit.sync="formQuery.limit"
            layout="prev, pager, next"
            class="position-center"
            prev-text="<"
            next-text=">"
            @pagination="getList"
          />
        </el-col>
        <el-col :span="6">
          <div class="group-button">
            <button-export :loading="exportLoading" type="excel" @export="exportIntoExcel" />
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
import SearchSelectBox from '../../components/Common/SearchSelectBox';
import StudentStatus from '../../const/StudentStatus';
import CommonSettings from '../../const/CommonSettings';
import BusinessUnitRequest from '../../api/BusinessUnitRequest';
import SchoolResource from '../../api/school';
import GradeRequest from '../../api/gradeRequest';
import StudentResource from '../../api/student';
import _ from 'lodash';

const gradeRequest = new GradeRequest();
const businessResource = new BusinessUnitRequest();
const schoolResource = new SchoolResource();
const studentResource = new StudentResource();
export default {
  name: 'Index',
  metaInfo: {
    title: '生徒情報',
  },
  components: {
    CustomPagination,
    ButtonExport,
    ButtonSearch,
    SearchSelectBox,
  },
  filters: {
    getStatusLabel(status) {
      const stt = _.filter(StudentStatus.OPTION_SNZ_STUDENTSTATUS, function(item) {
        return item.value === status;
      });
      return stt[0] ? stt[0].label : '';
    },
  },
  data() {
    return {
      list: [],
      total: 0,
      lastPage: 1,
      listLoading: true,
      exportLoading: false,
      checkQuerySearch: false,
      searchForm: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        businessId: '',
        schoolId: '',
        gradeId: '',
        studentStatus: [StudentStatus.EXPERIENCE_STUDENT, StudentStatus.INTERNAL_RAW],
        fullName: '',
        studentCode: '',
      },
      formQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        businessId: '',
        schoolId: '',
        gradeId: '',
        studentStatus: [StudentStatus.EXPERIENCE_STUDENT, StudentStatus.INTERNAL_RAW],
        fullName: '',
        studentCode: '',
      },
      businessUnits: [],
      schools: [],
      grades: [],
      studentStatus: [],
      searching: false,
    };
  },
  async created() {
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.formQuery = this.copyAttributes(this.$route.query, this.formQuery);
    await this.getOptionGrade();
    if (this.searchForm.businessId){
      this.$nextTick(async() => {
        await this.$refs.businessSelectBox.init();
      });
    }
    if (!_.some(this.grades, { id: this.formQuery.gradeId })){
      delete this.formQuery.gradeId;
      delete this.searchForm.gradeId;
    }
    await this.setDefaultSearch();
    this.studentStatus = StudentStatus.OPTION_SNZ_STUDENTSTATUS;
    await this.getList();
  },
  methods: {
    async setDefaultSearch() {
      if (_.isEmpty(this.$route.query)) {
        this.searchForm.studentStatus = this.covertArrStringToInt(this.searchForm.studentStatus);
        this.formQuery.studentStatus = this.covertArrStringToInt(this.formQuery.studentStatus);
      } else if (_.has(this.$route.query, 'studentStatus')) {
        this.searchForm.studentStatus = this.covertArrStringToInt(this.$route.query.studentStatus);
        this.formQuery.studentStatus = this.covertArrStringToInt(this.$route.query.studentStatus);
      } else {
        this.searchForm.studentStatus = [];
        this.formQuery.studentStatus = [];
      }
    },

    async getOptionGrade() {
      this.grades = await gradeRequest.gradeOptions();
    },
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    async fetchBusiness() {
      await this.searchBusiness();
    },
    async searchSchool(query) {
      return await schoolResource.searchName(query);
    },
    async fetchSchools() {
      await this.searchSchool();
    },
    async searchGrade(query) {
      return await gradeRequest.gradeSearchName(query);
    },
    async fetchGrades() {
      await this.searchGrade();
    },
    //
    async submitSearch() {
      if (this.searching) {
        return;
      }
      this.searching = true;
      this.searchForm.page = 1;
      Object.assign(this.formQuery, this.searchForm);
      await this.getList();
      this.searching = false;
    },
    async getList() {
      this.listLoading = true;
      const query = this.buildQuery(this.formQuery);
      window.history.replaceState(null, null, `?${query}`);
      const res = await studentResource.list({ ...this.formQuery });
      this.list = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.lastPage = res.last_page;
      this.listLoading = false;
      this.scrollTopTable();
    },
    async exportIntoExcel() {
      this.exportLoading = true;
      await studentResource.exportResource(this.formQuery).then(data => {
        this.createDownloadXlsFile('生徒情報', data);
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
</style>
