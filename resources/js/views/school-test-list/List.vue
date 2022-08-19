<template>
  <div id="app-container" v-loading="loading" class="app-container">
    <div class="block-search">
      <el-form ref="searchForm" class="form-search" :model="searchForm">
        <div class="div-left">
          <el-form-item label-width="90px" label="上位の部署">
            <SearchSelectBox
              v-model="searchForm.parentbusinessunitid"
              :search-function="searchArea"
              key-name="snz_area"
              key-id="snz_area_code"
              placeholder=""
              :popper-append-to-body="false"
            />
          </el-form-item>
          <el-form-item label-width="86px" label="事業本部">
            <SearchSelectBox
              v-model="searchForm.snz_headdivision"
              :search-function="searchHeadDivision"
              key-name="snz_headdivision"
              key-id="snz_headdivision_code"
              placeholder=""
              :popper-append-to-body="false"
              @onChange="getDivision"
            />
          </el-form-item>
          <el-form-item label-width="75px" label="事業部">
            <SearchSelectBox
              ref="selectDivision"
              v-model="searchForm.snz_divisionnm"
              :disabled="divisionDisable"
              :search-function="searchDivision"
              key-name="snz_division"
              key-id="snz_division_code"
              placeholder=""
              :popper-append-to-body="false"
              @onChange="getArea"
            />
          </el-form-item>
          <el-form-item label-width="75px" label="エリア">
            <SearchSelectBox
              ref="selectArea"
              v-model="searchForm.snz_area"
              :search-function="searchArea"
              :disabled="areaDisable"
              key-name="snz_area"
              key-id="snz_area_code"
              placeholder=""
              :popper-append-to-body="false"
            />
          </el-form-item>
        </div>
        <div class="div-right">
          <div class="d-left">
            <el-form-item label-width="64px" label="校舎名">
              <el-input v-model="searchForm.name" maxlength="100" clearable />
            </el-form-item>
            <el-form-item label-width="102px" label="教室コード">
              <el-input v-model="searchForm.snz_code" maxlength="100" clearable />
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
      >
        <el-table-column min-width="90px" label="校舎名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="70px" label="上位の部署">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.parent_organzation ? scope.row.parent_organzation.snz_area : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80px" label="事業本部">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.headdivision ? scope.row.headdivision.snz_headdivision : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="160px" label="事業部">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.division ? scope.row.division.snz_division : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80px" label="エリア">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.area ? scope.row.area.snz_area : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="50px">
          <template slot="header">
            <p style="font-size: 9px; margin: 0;">教室<br>コード</p>
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_code }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="50px" label="締め月">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.target_period ? scope.row.target_period.snz_name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="60px">
          <template slot="header">
            <p style="padding: 0 20px; margin: 0px;">教室長</p>
          </template>
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.school_manager ? scope.row.school_manager.name : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="ableRole(['system'])" align="center" min-width="50px" label="詳細編集" row-class-name="action">
          <template slot-scope="scope">
            <router-link :to="{name:'EditBusiness',params:{id:scope.row.id, query: formQuery}}">
              <el-button class="btn-edit" size="mini">
                <svg-icon icon-class="_edit" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column v-if="ableRole(['system'])" align="center" label="削除" width="70px">
          <template slot-scope="scope">
            <el-button class="btn-delete" @click.prevent="deleteData(scope.row.id)">
              <svg-icon icon-class="_trash" />
            </el-button>
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
            <button-export v-if="ableRole(['system'])" :loading="exportLoading" type="excel" @export="handleExport" />
            <router-link v-if="ableRole(['system'])" :to="{ name: 'AddBusiness'}">
              <el-button class="btn-create" icon="el-icon-circle-plus-outline">
                <span>新規作成</span>
              </el-button>
            </router-link>
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
import SchoolTestList from '@/api/SchoolTestList';
import loadmore from '@/directive/selection';
import role from '@/directive/role';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import { options } from '../../const/BrandOption';
import CommonSettings from '../../const/CommonSettings';
import BusinessUnitRequest from '../../api/BusinessUnitRequest';
import { Message } from 'element-ui';

const schoolTestList = new SchoolTestList();
const businessResource = new BusinessUnitRequest();

export default {
  name: 'List',
  metaInfo: {
    title: '校舎',
  },
  directives: { loadmore, role },
  components: {
    CustomPagination,
    ButtonExport,
    ButtonSearch,
    SearchSelectBox,
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
  },
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
        parentbusinessunitid: '',
        snz_headdivision: '',
        snz_divisionnm: '',
        snz_area: '',
        name: '',
        snz_code: '',
        snz_schoolmanager_user_id: '',
      },
      formQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        name: '',
        snz_code: '',
        snz_headdivision: '',
        snz_divisionnm: '',
        snz_area: '',
        snz_closing_month_period_id: '',
        snz_schoolmanager_user_id: '',
      },
      remoteGrade: false,
      remoteCourse: false,
      pageGrade: 1,
      pageCourse: 1,
      divisionDisable: true,
      areaDisable: true,
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
    if (this.formQuery.snz_divisionnm !== ''){
      this.divisionDisable = false;
      this.areaDisable = false;
    }
    await this.getList();
    this.loading = false;
  },
  methods: {
    async getList() {
      this.listLoading = true;
      const query = this.buildQuery(this.formQuery);
      window.history.replaceState(null, null, `?${query}`);
      const res = await schoolTestList.list({ ...this.formQuery });
      this.list = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.listLoading = false;
      this.scrollTopTable();
    },
    async searchBusiness(query) {
      return await businessResource.searchName(query);
    },
    async searchHeadDivision(query){
      return await businessResource.searchHeadDivisionName(query);
    },
    async searchDivision(query){
      const data = {
        snz_headdivision_code: this.searchForm.snz_headdivision,
        ...query,
      };
      return await businessResource.searchDivisionName(data);
    },
    async searchArea(query){
      const data = {
        snz_headdivision_code: this.searchForm.snz_headdivision,
        snz_division_code: this.searchForm.snz_divisionnm,
        ...query,
      };
      return await businessResource.searchAreaName(data);
    },
    async submitSearch() {
      this.listLoading = true;
      this.formQuery = JSON.parse(JSON.stringify(this.searchForm));
      await this.getList();
      this.listLoading = false;
    },
    getDivision(){
      this.setNullOrg();

      if (!this.searchForm.snz_headdivision) {
        this.divisionDisable = true;
      } else {
        this.$refs.selectDivision.init();
        this.divisionDisable = false;
      }
      this.areaDisable = true;
      this.unitDisable = true;
    },
    setNullOrg() {
      this.searchForm.snz_divisionnm = '';
      this.searchForm.snz_area = '';
    },
    async getArea(){
      this.areaLoading = true;
      this.unitDisable = true;
      this.searchForm.snz_area = null;
      if (!this.searchForm.snz_divisionnm) {
        this.areaDisable = true;
      } else {
        await this.$refs.selectArea.init();
        this.areaLoading = false;
        this.areaDisable = false;
      }
    },
    deleteData(id){
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        schoolTestList.destroy(id).then(response => {
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
      await schoolTestList.exportResource(this.formQuery).then(data => {
        this.createDownloadXlsFile('校舎', data);
        this.exportLoading = false;
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "./styles/index";
</style>
