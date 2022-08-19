<template>
  <div class="app-container">
    <div class="card-body__content">
      <el-form ref="tableForm" :model="tableForm">
        <el-table
          v-loading="listLoading"
          class="table-content editable-table"
          :data="tableForm.arr"
          fit
          highlight-current-row
          header-cell-class-name="my-header"
          height="100%"
          :empty-text="CommonTxt.tableEmptyTxt"
          row-key="id"
        >
          <el-table-column width="200px" label="開講コースコード">
            <template slot-scope="scope">
              <el-form-item
                :prop="`arr.${scope.$index}.snz_coursecode`"
                :rules="rules.snz_coursecode"
              >
                <half-size-number v-model="scope.row.snz_coursecode" :maxlength="8" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="410px" label="コース名">
            <template slot-scope="scope">
              <el-form-item
                :prop="`arr.${scope.$index}.snz_name`"
                :rules="rules.snz_name"
              >
                <el-input v-model="scope.row.snz_name" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="150px" label="コース区分">
            <template slot-scope="scope">
              <el-form-item
                :prop="`arr.${scope.$index}.snz_coursetype`"
                :rules="rules.snz_coursetype"
              >
                <el-select
                  v-model="scope.row.snz_coursetype"
                  class="table-select"
                  placeholder=""
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                >
                  <el-option v-for="item in courseTypes" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column min-width="195px" label="表示画面">
            <template slot-scope="scope">
              <el-form-item
                :prop="`arr.${scope.$index}.snz_list_display`"
                :rules="rules.snz_list_display"
              >
                <el-select
                  v-model="scope.row.snz_list_display"
                  multiple
                  placeholder=""
                  class="table-select multiselectstatus"
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="125px" label="受講終了フラグ">
            <template slot-scope="scope">
              <el-form-item>
                <el-switch
                  v-model="scope.row.snz_cantractinfo_finish_flag"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="100px" label="変則フラグ">
            <template slot-scope="scope">
              <el-form-item>
                <el-switch
                  v-model="scope.row.anomalous_change_flag"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" width="60px" label="保存" row-class-name="action">
            <template slot-scope="scope">
              <el-button class="btn-edit" size="mini" @click.prevent="updateData(scope.$index,scope.row)">
                <svg-icon icon-class="_save" />
              </el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="削除" width="67px">
            <template slot-scope="scope">
              <el-button class="btn-delete" @click.prevent="deleteData(scope.$index,scope.row)">
                <svg-icon icon-class="_trash" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
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
            :page.sync="query.page"
            :limit.sync="query.limit"
            layout="prev, pager, next"
            class="position-center"
            prev-text="<"
            next-text=">"
            @pagination="getList"
          />
        </el-col>
        <el-col :span="6">
          <div class="group-button">
            <button-export :loading="exportLoading" type="excel" @export="exportIntoCSV" />
            <button-create @create="addRowTable()" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import CustomPagination from '../../components/Common/Pagination/CustomPagination';
import CourseResource from '@/api/course';
import { Message } from 'element-ui';
import { ListCourse } from './assets/validate';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import ButtonCreate from '../../components/Common/Button/ButtonCreate';
import { optionsCourse, optionsDisplayFlag } from '@/const/OptionCourse';
import CommonSettings from '../../const/CommonSettings';
import HalfSizeNumber from '@/components/Common/HalfSizeNumber';
import { isArrayEqual } from '@/helpers/mixins/Compare';

const courseResource = new CourseResource();
export default {
  name: 'OpenCourse',
  components: {
    HalfSizeNumber,
    CustomPagination,
    ButtonExport,
    ButtonCreate,
  },
  metaInfo: {
    title: '開講コース',
  },
  mixins: [ListCourse],
  data() {
    return {
      tableForm: {
        arr: [],
      },
      total: 0,
      lastPage: 1,
      listLoading: true,
      query: {
        page: 1,
        limit: CommonSettings.DEFAULT_PAGE_RECORD,
      },
      courseTypes: optionsCourse,
      watchTracker: [],
      dataWaitingUpdate: { arr: [], index: null },
      acting: false,
      exportLoading: null,
      options: optionsDisplayFlag,
      waitSaving: false,
      dataOrigin: [],
    };
  },
  watch: {
    'tableForm.arr': function() {
      return this.updateWatchers();
    },
  },
  created() {
    this.query = this.copyAttributes(this.$route.query, this.query);
    this.getList();
  },
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect) {
      return next();
    }
    if (this.dataWaitingUpdate.arr.length > 0 && !isArrayEqual(this.tableForm.arr, this.dataOrigin)) {
      this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
        confirmButtonText: '保存して続行',
        cancelButtonText: '変更の破棄',
        type: 'warning',
        distinguishCancelAndClose: true,
      }).then(() => {
        this.resetValidates();
        this.dataWaitingUpdate.index = null;
        this.tableForm['index'] = null;
        courseResource.updateAll(this.tableForm).then(() => {
          Message({
            message: this.CommonTxt.saveSuccess,
            type: 'success',
            duration: 1500,
          });
          return next();
        }).catch(err => {
          if (err.response.status === 422) {
            this.$refs.tableForm.injectFormValidates(err.response);
            this.$refs.tableForm.focusFieldError();
          } else {
            Message({
              message: this.CommonTxt.anotherError,
              type: 'error',
              duration: 1500,
            });
          }
        });
      }).catch((action) => {
        if (action === 'cancel') {
          return next();
        } else {
          return next(false);
        }
      });
    } else {
      return next();
    }
  },
  methods: {
    handleChange(newVal, oldVal) {
      let index = -1;
      for (let i = 0; i < this.dataWaitingUpdate.arr; i++) {
        if (typeof this.dataWaitingUpdate.arr[i] !== 'undefined' && this.dataWaitingUpdate.arr[i].id === newVal.id) {
          index = i;
          break;
        }
      }
      const vt = this.tableForm.arr.findIndex(item => {
        return (item.id === newVal.id);
      });
      if (index !== -1) {
        this.dataWaitingUpdate.arr.splice(index, 1, newVal);
      } else {
        this.dataWaitingUpdate.arr[vt] = newVal;
      }
    },
    updateWatchers() {
      const getItem = (val) => val.item || val;
      _.differenceBy(this.tableForm.arr, this.watchTracker, getItem).forEach((item) => {
        const unwatch = this.$watch(() => item, this.handleChange, { deep: true });
        this.watchTracker.push({ item: item, unwatch: unwatch });
      });
      _.differenceBy(this.watchTracker, this.tableForm.arr, getItem).forEach((watchObj) => {
        watchObj.unwatch();
      });
    },
    async getList() {
      this.listLoading = true;
      const query = this.buildQuery(this.query);
      window.history.replaceState(null, null, `?${query}`);
      const res = await courseResource.list(this.query);
      this.dataWaitingUpdate = { arr: [], index: null };
      this.tableForm.arr = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.listLoading = false;
      this.scrollTopTable();
      this.dataOrigin = JSON.parse(JSON.stringify(this.tableForm.arr));
      this.dataOrigin.map(item => {
        if (item.snz_list_display === null){
          item.snz_list_display = [];
        }
      });
    },
    async updateData(index, data) {
      this.listLoading = true;
      this.resetValidates();
      if (typeof data.id === 'undefined') {
        await this.createCourse(index);
      } else {
        await this.updateCourse(index, data);
      }
      this.listLoading = false;
    },
    deleteData(index, data) {
      if (typeof data.id !== 'undefined') {
        this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
          confirmButtonText: 'はい',
          cancelButtonText: 'キャンセル',
          type: 'warning',
        }).then(async() => {
          this.listLoading = true;
          await courseResource.destroy(data.id).then(async() => {
            this.tableForm.arr.splice(index, 1);
            this.dataOrigin.splice(index, 1);
            this.updateWaitingData(index);
            Message({
              message: this.CommonTxt.deleteSuccess,
              type: 'success',
              duration: 1500,
            });
          }).catch(async(err) => {
            if (err.response.status === 410) {
              await this.getList();
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
        }).catch(() => {
          return false;
        });
      } else {
        this.tableForm.arr.splice(index, 1);
        this.dataWaitingUpdate.arr.splice(index, 1);
        this.waitSaving = false;
      }
    },
    async exportIntoCSV() {
      this.exportLoading = true;
      await courseResource.exportCSV().then(data => {
        this.createDownloadXlsFile('開講コース', data);
      }).finally(() => {
        this.exportLoading = false;
      });
    },
    async addRowTable() {
      this.tableForm.arr.unshift({
        snz_coursecode: '',
        snz_name: '',
        snz_coursetype: 20,
        snz_list_display: [],
        snz_cantractinfo_finish_flag: 0,
      });
      this.dataWaitingUpdate.arr.unshift({
        snz_coursecode: '',
        snz_name: '',
        snz_coursetype: 20,
        snz_list_display: [],
        snz_cantractinfo_finish_flag: 0,
      });
    },
    async updateCourse(index, data) {
      this.tableForm['index'] = index;
      await courseResource.update(data.id, this.tableForm).then(() => {
        Message({
          message: this.CommonTxt.saveSuccess,
          type: 'success',
          duration: 1500,
        });
        this.dataOrigin.splice(index, 1, this.tableForm.arr[index]);
        this.updateWaitingData(index);
      }).catch(err => {
        if (err.response.status === 422) {
          this.$refs.tableForm.injectFormValidates(err.response);
          this.$refs.tableForm.focusFieldError();
        } else {
          Message({
            message: this.CommonTxt.anotherError,
            type: 'error',
            duration: 1500,
          });
        }
      });
    },
    async createCourse(index) {
      if (this.dataWaitingUpdate.arr.length > 0 && typeof this.dataWaitingUpdate.arr[index] !== 'undefined') {
        this.tableForm['index'] = index;
        await courseResource.store(this.tableForm).then((res) => {
          Message({
            message: this.CommonTxt.saveSuccess,
            type: 'success',
            duration: 1500,
          });
          this.tableForm.arr.splice(index, 1, res.original.item);
          this.dataOrigin.unshift(res.original.item);
          this.waitSaving = false;
          this.updateWaitingData(index);
        }).catch(err => {
          if (err.response.status === 422) {
            this.$refs.tableForm.injectFormValidates(err.response);
            this.$refs.tableForm.focusFieldError();
          } else {
            Message({
              message: this.CommonTxt.anotherError,
              type: 'error',
              duration: 1500,
            });
          }
        });
      } else {
        Message({
          message: this.CommonTxt.saveSuccess,
          type: 'success',
          duration: 1500,
        });
      }
    },
    updateWaitingData(index) {
      // Delete data waiting
      this.dataWaitingUpdate.arr.splice(index, 1, undefined);
      let flag = false;
      flag = this.dataWaitingUpdate.arr.every(item => {
        return typeof item === 'undefined';
      });
      if (flag) {
        this.dataWaitingUpdate.arr = [];
      }
    },
    resetValidates() {
      const props = this.$refs.tableForm.fields.map(field => {
        return field.prop;
      });
      this.$refs.tableForm.clearValidate(props);
    },
  },
};
</script>
<style scoped lang="scss">
@import "./styles/index";

/deep/ .el-form-item.is-error:hover {
  .el-form-item__error {
    visibility: visible;
    width: 1000px;
    z-index: 10000;
  }
}

/deep/ .el-form-item__error {
  visibility: hidden;
}

/deep/ .editable-table {
  .el-form-item__error {
    width: 100% !important;
  }
}
</style>
