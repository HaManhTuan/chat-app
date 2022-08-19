<template>
  <div id="app-container" class="app-container">
    <div class="block-search">
      <el-form ref="searchForm" class="form-search" :model="searchForm">
        <div class="div-left">
          <el-form-item label-width="40px" label="学年">
            <el-select
              v-model="searchForm.snz_grade"
              placeholder=""
              :no-data-text="CommonTxt.selectboxEmptyTxt"
              :no-match-text="CommonTxt.selectboxEmptyTxt"
              filterable
              clearable
              popper-class="select-inside-table"
              :popper-append-to-body="false"
              class="custom-select__caret"
            >
              <el-option
                v-for="item in grades"
                :key="item.value"
                :label="item.snz_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label-width="116px" label="科目セット名">
            <el-input v-model="searchForm.snz_name" maxlength="100" clearable />
          </el-form-item>
          <el-form-item label-width="90px" label="ブランド">
            <el-select
              v-model="searchForm.snz_brand"
              placeholder=""
              clearable
              :no-data-text="CommonTxt.selectboxEmptyTxt"
              popper-class="select-inside-table"
              :popper-append-to-body="false"
              class="custom-select__caret"
            >
              <el-option
                v-for="item in optionBrand"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="div-right">
          <div class="d-left">
            <el-form-item
              label-width="54px"
              label="コース"
              prop="snz_course_id"
            >
              <search-select-box
                v-model="searchForm.snz_course"
                :search-function="searchCourse"
                placeholder=""
                key-name="snz_name"
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                class="custom-select__caret"
              />
            </el-form-item>
            <el-form-item label-width="88px" label="変則受講">
              <el-select
                v-model="searchForm.snz_update_subject_flag"
                placeholder=""
                clearable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                class="custom-select__caret"
              >
                <el-option :value="0" label="ー" />
                <el-option :value="1" label="✓">
                  <span class="el-checkbox__inner" />
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="d-right">
            <button-search @search="submitSearch" />
          </div>
        </div>
      </el-form>
    </div>
    <!--    height="calc(100% - 20px)"-->
    <div class="card-body__content">
      <el-table
        v-loading="listLoading"
        :empty-text="CommonTxt.tableEmptyTxt"
        class="table-content"
        :data="list"
        fit
        highlight-current-row
        header-cell-class-name="my-header"
        height="100%"
      >
        <el-table-column min-width="183px" label="科目セット正式名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_name }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="169px" label="画面表示名">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_display_name }}</span>
          </template>
        </el-table-column>
        <el-table-column width="95px" label="ブランド">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.snz_brand | getBrandName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="78px" label="コース">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.course ? scope.row.course.snz_name : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column width="82px" label="年度">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_schoolyear }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="166px" label="カレンダーパターン">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.calendar_pattern
                ? scope.row.calendar_pattern.snz_name
                : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="85px" label="学年">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.grade ? scope.row.grade.snz_name : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="102px" label="変則受講" align="center">
          <template slot-scope="scope">
            <span
              v-if="scope.row.snz_update_subject_flag === 1"
              class="el-checkbox__inner"
            />
            <span v-else>ー</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="60px"
          label="詳細編集"
          row-class-name="action"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                name: 'SubjectSetEdit',
                params: { id: scope.row.id, query: formQuery },
              }"
            >
              <el-button class="btn-edit" size="mini">
                <svg-icon icon-class="_edit" />
              </el-button>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="削除" width="67px">
          <template slot-scope="scope">
            <el-button
              class="btn-delete"
              @click.prevent="deleteData(scope.row)"
            >
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
          <custom-pagination
            v-show="lastPage > 1"
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
            <button-export
              :loading="exportLoading"
              type="excel"
              @export="exportIntoCSV"
            />
            <router-link :to="{ name: 'SubjectSetCreate' }">
              <button-create />
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
import ButtonCreate from '../../components/Common/Button/ButtonCreate';
import SubjectSet from '@/api/SubjectSet';
import SearchSelectBox from '../../components/Common/SearchSelectBox';
import GradeRequest from '../../api/gradeRequest';
import { Message } from 'element-ui';
import { options } from '../../const/BrandOption';
import CommonSettings from '../../const/CommonSettings';
import CourseResource from '../../api/CourseRequest';

const courseResource = new CourseResource();
const gradeRequest = new GradeRequest();
const subjectSet = new SubjectSet();
export default {
  name: 'Index',
  metaInfo: {
    title: '科目セット',
  },
  components: {
    ButtonCreate,
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
        snz_grade: '',
        snz_name: '',
        snz_update_subject_flag: 0,
        snz_brand: '',
        snz_course: '',
      },
      formQuery: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
        snz_grade: '',
        snz_name: '',
        snz_update_subject_flag: 0,
        snz_brand: '',
        snz_course: '',
        flag: 1,
      },
      grades: [],
      optionBrand: options,
      exportLoading: null,
      searching: false,
    };
  },
  async created() {
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    this.formQuery = this.copyAttributes(this.$route.query, this.formQuery);
    if (this.formQuery.flag === 1) {
      this.formQuery.snz_update_subject_flag = 0;
      this.searchForm.snz_update_subject_flag = 0;
    } else if (this.formQuery.flag === 2) {
      this.formQuery.snz_update_subject_flag = 1;
      this.searchForm.snz_update_subject_flag = 1;
    } else {
      this.formQuery.snz_update_subject_flag = '';
      this.searchForm.snz_update_subject_flag = '';
    }
    await this.getOptionGrade();
    await this.getList();
  },
  methods: {
    async getOptionGrade() {
      this.grades = await gradeRequest.gradeOptions({
        subject_set_screen: 1,
      });
    },
    async searchCourse(query) {
      return await courseResource.searchName(query);
    },
    async submitSearch() {
      if (this.searching) {
        return;
      }
      this.searching = true;
      this.searchForm.page = 1;
      Object.assign(this.formQuery, this.searchForm);
      if (this.formQuery.snz_update_subject_flag === 0) {
        this.formQuery.flag = 1;
      } else if (this.formQuery.snz_update_subject_flag === 1) {
        this.formQuery.flag = 2;
      } else {
        this.formQuery.flag = 3;
      }
      await this.getList();
      this.searching = false;
    },
    async getList() {
      this.listLoading = true;
      const query = this.buildQuery(this.formQuery);
      window.history.replaceState(null, null, `?${query}`);
      const res = await subjectSet.list({ ...this.formQuery });
      this.list = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.lastPage = res.last_page;
      this.listLoading = false;
      this.scrollTopTable();
    },
    deleteData(data) {
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      })
        .then(async() => {
          this.listLoading = true;
          await subjectSet
            .destroy(data.id)
            .then(res => {
              this.updateArrayData(data.id);
              Message({
                message: this.CommonTxt.saveSuccess,
                type: 'success',
                duration: 1500,
              });
            })
            .catch(err => {
              if (err.response.status === 410) {
                this.getList();
                Message({
                  message: this.CommonTxt.deleteFail,
                  type: 'error',
                  duration: 1500,
                });
              }
              if (err.response.status === 424) {
                Message({
                  message: this.CommonTxt.deleteNotPermission,
                  type: 'error',
                  duration: 1500,
                });
              }
            });
          this.listLoading = false;
        })
        .catch(() => {
          return false;
        });
    },
    updateArrayData(id, item = null) {
      const index = this.list.findIndex(item => {
        return id === item.id;
      });
      if (item) {
        this.list.splice(index, 1, item);
      } else {
        this.list.splice(index, 1);
      }
    },
    async exportIntoCSV() {
      this.exportLoading = true;
      await subjectSet.exportCSV(this.formQuery).then(data => {
        this.createDownloadXlsFile('科目セット', data);
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
@import './styles/index';
</style>
