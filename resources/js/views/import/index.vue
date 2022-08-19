<template>
  <div v-loading="loading" class="app-container">
    <div class="block-search">
      <el-form ref="searchForm" class="form-search" :model="searchForm" label-position="left">
        <el-row justify="space-around" class="top">
          <el-col :span="4">
            <el-form-item label-width="85px" label="ステータス">
              <el-select
                v-model="searchForm.status"
                clearable
                placeholder=""
                class="filterable-select selected-import"
              >
                <el-option
                  v-for="item in statusImport"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="no-border">
            <div style="display: flex">
              <el-form-item label-width="55px" label="作成日">
                <el-date-picker
                  v-model="searchForm.start_created"
                  type="date"
                  placeholder="開始日"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  :editable="false"
                  prefix-icon="abc"
                  class="datepicker-import"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
                </span>
              </el-form-item>
              <span class="between-date">〜</span>
              <el-form-item>
                <el-date-picker
                  v-model="searchForm.end_created"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  placeholder="終了日"
                  :editable="false"
                  prefix-icon="abc"
                  class="datepicker-import"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
                </span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row justify="space-between" class="bot">
          <el-col :span="4">
            <el-form-item label-width="95px" label="インポート名">
              <el-input v-model="searchForm.import_name" placeholder="" clearable class="selected-import" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="55px" label="作成者">
              <SearchSelectBox
                v-model="searchForm.user_created"
                :search-function="searchUser"
                width="174px"
                key-name="name"
                placeholder=""
                :popper-append-to-body="false"
                class="filterable-select remove-mb-el-select"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="40px" label="対象">
              <el-select
                v-model="searchForm.target"
                clearable
                placeholder=""
                class="filterable-select selected-import"
              >
                <el-option
                  v-for="item in dataTarget"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item class="search-button">
              <ButtonSearch @search="submitSearch" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="block-button-import">
      <el-button class="import-btn" @click="showPopupUpload"> インポート</el-button>
    </div>
    <div class="card-body__content page-body">
      <el-table
        ref="mainTable"
        v-loading="listLoading"
        class="table-content"
        :data="tableForm"
        fit
        header-cell-class-name="my-header"
        height="calc(100%)"
        empty-text="データはありません。"
      >
        <el-table-column align="left" label="インポート名" fixed="left" min-width="121px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_name }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="対象" fixed="left" min-width="100px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_import_target | mapOptions(dataTarget) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="ステータス" fixed="left" width="110px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_import_status | mapOptions(statusImport) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="成功" fixed="left" min-width="85px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_success_record_count }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="エラー" fixed="left" min-width="85px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_error_record_count }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="合計" fixed="left" min-width="85px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.snz_total }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="作成日" fixed="left" width="110px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.created_at | parseTime('{y}/{m}/{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="作成者" fixed="left" width="100px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.user ? scope.row.user.name : null }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="ログ詳細" fixed="left" width="150px">
          <template slot-scope="scope">
            <el-button
              v-if="showLog(scope.row.snz_import_status, scope.row.snz_error_record_count)"
              class="btn-download-file"
              @click="downloadFileLog(scope.row)"
            ><svg-icon icon-class="Downloadicon" />ダウンロード</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left" label="インポートファイル" fixed="left" width="170px">
          <template slot-scope="scope">
            <el-button
              v-if="showOrigin(scope.row.snz_import_status)"
              class="btn-download-file"
              @click="downloadOrigin(scope.row)"
            ><svg-icon icon-class="Downloadicon" />ダウンロード</el-button>
          </template>
        </el-table-column>
        <el-table-column align="left" label="削除" fixed="left" width="67px">
          <template slot-scope="scope">
            <el-button class="btn-delete" size="mini" @click.prevent="deleteData(scope.row)">
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
        <el-col :span="10">
          <CustomPagination
            v-show="lastPage>1"
            :total="total"
            :page.sync="paginateForm.page"
            :limit.sync="query.limit"
            layout="prev, pager, next"
            class="position-center"
            prev-text="<"
            next-text=">"
            @pagination="func => getList(paginateForm)"
          />
        </el-col>
        <el-col :span="8">
          <div class="group-button">
            <button-export :loading="exportLoading" type="excel" @export="exportIntoCSV" />
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :visible.sync="showPopup"
      title="Excelからのインポート"
      top="150px"
      class="custom-dialog"
    >
      <el-form ref="form" :model="formUpload" label-position="left">
        <el-row>
          <el-col :span="12">
            <el-form-item label="エンティティ" label-width="105px" prop="target">
              <el-select v-model="formUpload.target" class="selected-target-popup" popper-class="custom-class-popup" placeholder="ー">
                <el-option v-for="(item,index) in dataTarget" :key="index" :label="item.label" :value="item.value" />
              </el-select>
              <div v-if="errorTarget" class="el-form-item__error">
                エンティティ入力してください
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ファイルを選択" label-width="115px" class="pdl-20" prop="file">
              <input id="input-file" ref="excel-upload-input" type="file" class="real-file" hidden="hidden" accept=".xlsx, .xls" @change="onFileChange">
              <el-button class="btn-upload-file" @click="handleUpload">
                <svg-icon icon-class="Upload_icon" />
                <span>ファイルを選択</span>
              </el-button>
              <el-progress v-if="showProgress" :percentage="percentage" :show-text="false" class="progress-file" />
              <div v-if="errorFileEmpty" class="el-form-item__error">
                Excel添付入力してください
              </div>
              <div class="file-name-selected">{{ formUpload.file ? formUpload.file.name : null }}</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <el-button class="cancel" @click="closeModal">
          <svg-icon icon-class="_cancel" />
          <span>キャンセル</span>
        </el-button>
        <el-button class="button-save" :loading="loadingBtn" :disabled="isDisable(formUpload.target, formUpload.file)" @click="uploadFile">
          <svg-icon icon-class="_save_w" />
          <span>保存</span>
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import ButtonSearch from '../../components/Common/Button/ButtonSearch';
import ButtonExport from '../../components/Common/Button/ButtonExport';
import { isExcel } from '../../utils/validate';
import ImportResource from '@/api/import';
import UserResource from '@/api/user';
import {
  DATA_TARGET_IMPORT as dataTarget,
  IMPORT_STATUS as statusImport,
  IMPORT_STATUS_VALUE,
} from '../../const/ImportStatus';
import { Message } from 'element-ui';
import { mapOptions } from '@/filters/mapOptions';
import SearchSelectBox from '@/components/Common/SearchSelectBox';

const importResource = new ImportResource();
const userResource = new UserResource();

export default {
  name: 'Index',
  components: {
    ButtonSearch,
    ButtonExport,
    CustomPagination,
    SearchSelectBox,
  },
  metaInfo: {
    title: 'インポート',
  },
  filters: {
    mapOptions: mapOptions,
  },
  data() {
    return {
      loading: false,
      searchForm: {
        sort: null,
        page: 1,
        status: '',
        start_created: null,
        end_created: null,
        import_name: null,
        user_created: null,
        target: null,
      },
      exportLoading: null,
      btnDownloadLog: false,
      btnDownloadOrigin: false,
      dataTarget: dataTarget,
      statusImport: statusImport,
      userCreated: [],
      tableForm: [],
      paginateForm: {
        page: 1,
      },
      total: 10,
      lastPage: 10,
      query: {
        limit: 20,
      },
      showPopup: false,
      formUpload: {
        target: undefined,
        file: undefined,
      },
      disableSave: true,
      loadingBtn: false,
      showProgress: false,
      percentage: 0,
      errorTarget: false,
      errorFileEmpty: false,
      listLoading: true,
    };
  },
  async created() {
    this.loading = true;
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    await this.submitSearch(this.searchForm.page ?? 1);
    this.loading = false;
  },
  methods: {
    async searchUser(query) {
      return await userResource.searchName(query);
    },
    async submitSearch(page) {
      this.searchForm.page = page || 1;
      await this.getList();
      this.paginateForm = this.$_.clone(this.searchForm);
    },
    async getList(forceQuery = null) {
      this.listLoading = true;
      const query = this.buildQueryCustom(forceQuery || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);

      const res = await importResource.list({ ...this.query, ...forceQuery || this.searchForm });
      this.tableForm = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.listLoading = false;
      this.scrollTopTable();
    },
    isDisable(target, file){
      if (target && file) {
        return false;
      }
      return true;
    },
    showPopupUpload() {
      this.showPopup = true;
      this.clearFile();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    closeModal() {
      this.showPopup = false;
      this.clearFile();
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click();
    },
    onFileChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      this.formUpload.file = files[0] || null;
      if (this.formUpload.file && !isExcel(this.formUpload.file)) {
        this.$message.error('Excelファイルをアップロードしてください。', 1500);
        this.clearFile();
      }
    },
    clearFile() {
      const valueInput = document.querySelectorAll('input#input-file');
      if (valueInput.length > 0) {
        document.querySelectorAll('input#input-file')[0].value = '';
      }
      this.formUpload.file = undefined;
      this.formUpload.target = null;
    },
    async uploadFile() {
      this.loadingBtn = true;
      if (this.formUpload.target && this.formUpload.file) {
        const data = new FormData();
        data.append('target', this.formUpload.target);
        data.append('file', this.formUpload.file);
        await importResource.upload(data).then(async res => {
          this.formUpload.target = null;
          this.formUpload.file = null;
          this.clearFile();
          this.closeModal();
          Message({
            message: ' インポートに成功しました。',
            type: 'success',
            duration: 1500,
          });
          await this.submitSearch(this.searchForm.page ?? 1);
          this.loadingBtn = false;
        }).catch((err) => {
          if (err.response.status === 422) {
            this.$refs.form.injectFormValidates(err.response);
            return;
          }
          this.loadingBtn = false;
          this.closeModal();
          if (err.response.status === 400) {
            Message({
              message: err.response.data.original.message,
              type: 'error',
              duration: 1500,
            });
          }
        }).finally(() => {
          this.loadingBtn = false;
        });
      }
    },

    async downloadOrigin(data) {
      this.btnDownloadOrigin = true;
      await importResource.downloadOrigin(data.id).then(res => {
        const filename = data.snz_name + '.xlsx';
        const url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.btnDownloadOrigin = false;
      }).catch(err => {
        this.btnDownloadOrigin = false;
        console.log(err);
      }).finally(() => {
        this.btnDownloadOrigin = false;
      });
    },

    async downloadFileLog(data) {
      this.btnDownloadLog = true;
      await importResource.downloadFileLog(data.id).then(res => {
        this.createDownloadXlsFile(data.snz_name + ' - log', res);
        this.btnDownloadLog = false;
      }).catch(err => {
        this.btnDownloadLog = false;
        console.log(err);
      }).finally(() => {
        this.btnDownloadLog = false;
      });
    },

    async deleteData(data) {
      if (typeof data.id !== 'undefined') {
        this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
          confirmButtonText: 'はい',
          cancelButtonText: 'キャンセル',
          type: 'warning',
        }).then(async() => {
          this.listLoading = true;
          await importResource.delete(data.id).then(async res => {
            await this.getList(this.paginateForm);
            Message({
              message: this.CommonTxt.deleteSuccess,
              type: 'success',
              duration: 1500,
            });
          }).catch((err) => {
            if (err.response.status === 410) {
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
        this.arrErrors = [];
        this.showError = false;
        this.tableForm.list.splice(0, 1);
        this.dataWaitingUpdate.arr.splice(0, 1);
        this.waitSaving = false;
      }
    },
    async exportIntoCSV() {
      this.exportLoading = true;
      await importResource.exportCSV(this.searchForm).then(data => {
        this.createDownloadXlsFile('インポート', data);
        this.exportLoading = false;
      });
    },
    showOrigin(snz_import_status) {
      if (snz_import_status) {
        if (snz_import_status === IMPORT_STATUS_VALUE['done']) {
          return true;
        }
      }
      return false;
    },
    showLog(snz_import_status, snz_error_record_count) {
      if (snz_import_status && snz_error_record_count) {
        return (snz_import_status === IMPORT_STATUS_VALUE['done'] && snz_error_record_count > 0);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "./styles/index";
</style>
