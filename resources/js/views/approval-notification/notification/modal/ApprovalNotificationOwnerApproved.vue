<template>
  <div class="app-container">
    <div class="block-search">
      <el-form ref="searchForm" class="form-search" :model="searchForm">
        <el-row justify="space-around" class="top">
          <el-col :span="6">
            <el-form-item label-width="67px" label="生徒名">
              <el-input
                v-model="searchForm.studentName"
                class="input-text"
                placeholder=""
                maxlength="100"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="82px" label="カテゴリ">
              <el-select
                v-model="searchForm.snz_application_category"
                multiple
                class="multiselect"
                clearable
                placeholder=""
                no-data-text="データはありません。"
              >
                <el-option
                  v-for="item in categoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9" class="no-border">
            <div style="display: flex">
              <el-form-item label-width="70px" label="申請日">
                <el-date-picker
                  v-model="searchForm.date_start"
                  type="date"
                  placeholder="開始日"
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
                  v-model="searchForm.date_end"
                  type="date"
                  format="yyyy/MM/dd"
                  value-format="yyyy-MM-dd"
                  placeholder="終了日"
                  :editable="false"
                  prefix-icon="abc"
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
                </span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row justify="space-between" class="bot">
          <el-col :span="9">
            <el-radio-group
              v-model="searchForm.snz_approve_status"
              size="medium"
            >
              <el-radio :label="1">全て</el-radio>
              <el-radio :label="2">未処理</el-radio>
              <el-radio :label="3">処理済み</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="2">
            <el-form-item class="search-button">
              <ButtonSearch @search="submitSearch" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="card-body__content page-body">
      <el-table
        :key="keyTableComponent"
        ref="mainTable"
        v-loading="listLoading"
        class="table-content"
        :data="list"
        fit
        highlight-current-row
        header-cell-class-name="my-header"
        height="calc(100%)"
        empty-text="データはありません。"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          width="50px"
          type="selection"
          :selectable="checkboxSelectable"
          :disabled="true"
        />
        <el-table-column label="生徒氏名" min-width="60px">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.student ? scope.row.student.fullname : null
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申請日" min-width="45px">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.created_at | parseTime('{y}/{m}/{d}')
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="カテゴリ">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.snz_application_category | mapOptions(categoryOption)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="コース" min-width="50px">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.course ? scope.row.course.snz_name : 'ー'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="通年申請" min-width="45px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row | request_year }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申請校舎" min-width="60px">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.request_from_business
                ? scope.row.request_from_business.name
                : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申請者" min-width="45px">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.grade ? scope.row.grade.snz_name : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="処理ステータス" min-width="65px">
          <template slot-scope="scope">
            <span class="ellipsis">{{
              scope.row.snz_approve_status | mapOptions(approveStatus)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="詳細"
          min-width="30px"
          class="text-center"
        >
          <template slot-scope="scope">
            <el-button
              round
              class="confirm"
              :disabled="disableRole(['viewonly'])"
              @click="openDiaLogDetail(scope.row)"
            >
              確認
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-row class="footer__group">
        <el-col :span="24">
          <CustomPagination
            :total="total"
            :page.sync="paginateForm.page"
            :limit.sync="paginateForm.limit"
            layout="prev, pager, next"
            class="position-center"
            prev-text="<"
            next-text=">"
            @pagination="func => getList(paginateForm)"
          />
        </el-col>
      </el-row>
    </div>
    <div class="d-fa">
      <ButtonSaveChecked :disabled="listLoading" @save="save" />
    </div>
    <ApproveDetail
      :id="id"
      ref="approveDetail"
      :show-dialog="showDialog"
      :status-student="statusStudent"
      :application-category="applicationCategory"
      @close="closeApproveDetail"
      @openAbsent="showAbsent"
      @openWithdrawal="showWithDrawal"
    />
    <AbsentModal
      ref="startAbsent"
      :dialog-form-start-absent-visible="dialogFormStartAbsentVisible"
      :data-target-period="defaultTargetPeriod"
      :origin-form-start-absent="originFormStartAbsent"
      @closeStartAbsent="closePopupStartAbsent"
      @saveStartAbsentClick="saveStartAbsentClick"
    />
    <WithDralwal
      ref="withdrawal"
      :dialog-form-with-drawal-visible="dialogFormWithDrawalVisible"
      :data-target-period="defaultTargetPeriod"
      :origin-form-with-draw-register="originFormWithDrawRegister"
      @saveWithDrawalClick="saveWithDrawal"
      @closeModalWithDrawal="closePopupWithDrawal"
    />
  </div>
</template>

<script>
import ButtonSearch from '@/components/Common/Button/ButtonSearch';
import ApprovalAcceptedResource from '@/api/ApprovalNotification/ApprovalAccepted';
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import ButtonSaveChecked from '@/components/Common/Button/ButtonSaveChecked';
import { mapOptions } from '@/filters/mapOptions';
import { CategoryOption } from '@/const/ApprovalNotification/Category';
import ApproveDetail from './dialog/ApproveDetail';
import AbsentModal from './AbsentModal';
import WithDralwal from './WithDrawal';

import { mapGetters } from 'vuex';
import { request_year } from '../../filters/index';
import { Message } from 'element-ui';
import AppCategory from '@/const/ApprovalNotification/AppCategory';
import { APPROVE_STATUS } from '@/const/ApprovalNotification/Status';
import { checkExistApproval } from '../mixins/modal/checkExistApproval';
import { Category } from '../../../../const/ApprovalNotification/Category';

const approvalAccepted = new ApprovalAcceptedResource();

export default {
  name: 'ApprovalNotificationOwnerApproved',
  components: {
    ButtonSearch,
    CustomPagination,
    ButtonSaveChecked,
    ApproveDetail,
    AbsentModal,
    WithDralwal,
  },
  filters: {
    mapOptions: mapOptions,
    request_year: request_year,
  },
  mixins: [checkExistApproval],
  data() {
    return {
      keyTableComponent: 0,
      categoryOption: CategoryOption,
      searchForm: {
        page: 1,
        snz_approve_status: 2,
        limit: 20,
        tab: 'approved',
        snz_application_category: [
          Category.SUBJECT_IRREGULARITIES.value,
          Category.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL.value,
        ],
      },
      paginateForm: {
        page: 1,
        limit: 20,
      },
      total: 1,
      list: [],
      multipleSelection: [],
      listLoading: false,
      showDialog: false,
      id: null,
      categoryOptions: [
        {
          value: 1,
          label: '科目変則',
        },
        {
          value: 4,
          label: '移籍・併塾',
        },
      ],
      approveStatus: [
        {
          value: 1,
          label: '１段階承認待ち',
        },
        {
          value: 2,
          label: '2段階承認待ち',
        },
        {
          value: 3,
          label: '授業料収受の承認待ち',
        },
        {
          value: 4,
          label: '承認済み',
        },
        {
          value: 5,
          label: '却下',
        },
      ],
      dialogFormStartAbsentVisible: false,
      defaultTargetPeriod: [],
      originFormStartAbsent: {},
      dialogFormWithDrawalVisible: false,
      originFormWithDrawRegister: {},
      statusStudent: null,
      applicationCategory: null,
      dataCurrentRow: {},
      AppCategory,
      APPROVE_STATUS,
    };
  },
  computed: {
    ...mapGetters(['currentRole']),
  },
  created() {
    this.searchForm = this.copyAttributes(this.$route.query, this.searchForm);
    if (_.isArray(this.searchForm.snz_application_category)) {
      this.searchForm.snz_application_category.map((item, index) => {
        this.searchForm.snz_application_category[index] = parseInt(item);
      });
    } else {
      const temp = _.clone(this.searchForm.snz_application_category);
      this.searchForm.snz_application_category = [];
      this.searchForm.snz_application_category.push(parseInt(temp));
    }
    this.submitSearch(this.searchForm.page ?? 1);
  },
  methods: {
    async submitSearch(page) {
      this.searchForm.page = page || 1;
      await this.getList();
      this.paginateForm = this.$_.clone(this.searchForm);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    checkboxSelectable(row, index) {
      if (row.snz_approve_status === APPROVE_STATUS.APPROVED || row.snz_approve_status === APPROVE_STATUS.REJECTED) {
        return 0;
      }
      // if ((this.currentRole === 'employee' || this.currentRole === 'parttime') && row.snz_approve_status === APPROVE_STATUS.WAITING_FOR_APPROVAL_TO_COLLECT_TUTTION_FEES) {
      //   return 1;
      // }
      // if (this.currentRole === 'school' && row.snz_application_category === AppCategory.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL) {
      //   return 1;
      // }
      if (
        row.snz_application_category === AppCategory.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL ||
        (row.snz_approve_status !== APPROVE_STATUS.WAITING_FOR_1ST_STAGE_APPROVAL && row.snz_approve_status !== APPROVE_STATUS.WAITING_FOR_2ST_STAGE_APPROVAL)
      ) {
        return 0;
      } else {
        if (row.snz_approve_status === APPROVE_STATUS.WAITING_FOR_1ST_STAGE_APPROVAL && this.currentRole === 'subject') {
          return 1;
        }
        if (
          row.snz_approve_status === APPROVE_STATUS.WAITING_FOR_2ST_STAGE_APPROVAL &&
          this.currentRole === 'organization'
        ) {
          return 1;
        }
        return 0;
      }
    },
    openDiaLogDetail(row) {
      this.id = row.id;
      this.statusStudent = row.contact?.snz_studentstatus || null;
      this.applicationCategory = row.snz_application_category || null;
      this.dataCurrentRow = row;
      this.showDialog = true;
    },
    async save() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        this.$message({
          type: 'error',
          message: '保存するレコードがありません。',
        });
      } else {
        this.listLoading = true;
        const id = this.multipleSelection.map(row => {
          return row.id;
        });
        await approvalAccepted
          .approval({ id: id })
          .then(() => {
            this.$message({
              type: 'success',
              message: '選択した承認依頼が承認されました。',
            });
          })
          .catch(res => {
            if (res.response && res.response.status === 424) {
              this.$message({
                type: 'error',
                message: res.response.data.original.message,
              });
            }
          })
          .finally(() => {
            this.listLoading = false;
            this.getList();
          });
      }
    },
    async saveStartAbsentClick() {
      await this.$refs.startAbsent.$refs.formStartAbsent
        .validate()
        .then(async valid => {
          if (valid) {
            await approvalAccepted
              .createAbsentApproval(this.originFormStartAbsent)
              .then(async res => {
                if (res) {
                  this.dialogFormStartAbsentVisible = false;
                  Message.success('休塾情報を登録しました');
                  this.listLoading = false;
                  await this.getList();
                  // Count Notification
                  const resCount = await approvalAccepted.countNotification();
                  const data = resCount.original.data ? resCount.original.data : {};
                  const total = resCount.original.total ? resCount.original.total : null;
                  await this.$store.dispatch('app/setDataNotification', data);
                  await this.$store.dispatch('app/setTotalNotification', total);
                }
              })
              .catch(e => {
                const responseCode = e.response.status;
                if (responseCode === 422) {
                  this.$refs.startAbsent.$refs.formStartAbsent.injectFormValidates(
                    e.response
                  );
                }
                if (responseCode === 400 && e.response.data) {
                  Message.error(e.response.data.original.message);
                }
              });
          }
        })
        .catch(() => {});
    },
    closePopupStartAbsent() {
      this.dialogFormStartAbsentVisible = false;
    },

    async saveWithDrawal() {
      await this.$refs.withdrawal.$refs.formWithDraw
        .validate()
        .then(async valid => {
          if (valid) {
            await approvalAccepted
              .createWithDrawalApproval(this.originFormWithDrawRegister)
              .then(async res => {
                if (res) {
                  this.dialogFormWithDrawalVisible = false;
                  Message.success('退塾情報を登録しました');
                  this.listLoading = false;
                  await this.getList();
                  // Count Notification
                  const resCount = await approvalAccepted.countNotification();
                  const data = resCount.original.data ? resCount.original.data : {};
                  const total = resCount.original.total ? resCount.original.total : null;
                  await this.$store.dispatch('app/setDataNotification', data);
                  await this.$store.dispatch('app/setTotalNotification', total);
                }
              })
              .catch(e => {
                const responseCode = e.response.status;
                if (responseCode === 400 && e.response.data) {
                  this.dialogFormWithDrawalVisible = false;
                  Message.error(e.response.data.original.message);
                }
                if (responseCode === 422) {
                  this.$refs.withdrawal.$refs.formWithDraw.injectFormValidates(
                    e.response
                  );
                }
              });
          }
        })
        .catch(() => {});
    },
    closePopupWithDrawal() {
      this.dialogFormWithDrawalVisible = false;
    },
    async getList(forceQuery = null) {
      this.listLoading = true;
      this.multipleSelection = [];
      this.searchForm.page = this.paginateForm.page;
      const query = this.buildQuery(forceQuery || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      const res = await approvalAccepted.list({
        ...this.query,
        ...(forceQuery || this.searchForm),
      });
      this.list = res.data;
      this.total = res.total;
      this.lastPage = res.last_page;
      this.$refs.mainTable.bodyWrapper.scrollTop = 0;
      this.listLoading = false;
    },
    closeApproveDetail() {
      this.showDialog = false;
      this.getList();
    },
    async needUpdate() {
      this.keyTableComponent++;
      await this.getList();
    },
  },
};
</script>
<style scoped lang="scss">
@import '@/styles/common-form';
.card-body__content::v-deep {
  .table-content {
    border-left: 1px solid #d6d6d6;
    border-right: 1px solid #d6d6d6;
    border-bottom: 1px solid #d6d6d6;
  }
}
/deep/ thead{
  .is-disabled{
    pointer-events: none;
  }
}
/deep/ tbody{
  .is-disabled {
    display: none;
  }
}
.app-container {
  padding: 0;
  background-color: white;
}
.position-center {
  background-color: white;
}
.block-search {
  background-color: #f4f8fc;
  /deep/.el-radio__input.is-checked {
    .el-radio__inner {
      border-color: #1467b3;
      background: #ffffff;
    }
    .el-radio__inner::after {
      background-color: #1467b3;
      width: 10px;
      height: 10px;
      left: 9px;
      top: 9px
    }
  }
  /deep/ .el-radio__input.is-checked + .el-radio__label {
    color: #1a1714;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    border: 1px solid #C7C7C7;
    border-radius: 6px;
  }
}

/deep/ .page-body {
  height: calc(100% - 368px);
}

.icon-input__calendar {
  position: absolute;
  top: 0;
  right: 11px;
  pointer-events: none;
}

/deep/ .table-content table td {
  padding: 0px 10px 0px 20px !important;
  height: 47px;
}

.table-content {
  /deep/ td {
    &:last-child {
      padding-right: 26px;
    }
  }

  /deep/ .el-table__fixed-right {
    right: -5px !important;
  }
  /deep/ .el-checkbox__inner {
    width: 19px;
    height: 19px;
    border: #1a1714 solid 1px;
  }
  /deep/ .el-checkbox__input{
    margin-bottom: 2px;
  }
}

.el-row::v-deep {
  &.top {
    .el-col:first-child {
      width: 214px;
    }

    .el-col:nth-child(2) {
      width: 256px;
      margin-left: 21px;
    }

    .el-col:nth-child(3) {
      width: 464px;
      margin-left: 26px;
    }

    .el-col:nth-child(4) {
      width: 264px;
      margin-left: 26px;
    }
    .no-border {
      .el-date-editor input.el-input__inner {
        background: #f0f0f0 0 0 no-repeat padding-box;
        border-radius: 6px !important;
        border: none !important;
      }

      ::placeholder {
        text-align: left;
        font: normal normal normal 15px/45px Noto Sans JP;
        letter-spacing: 0.24px;
        color: #7b7b7b !important;
        opacity: 1;
      }
    }
  }

  &.bot {
    padding-top: 20px;
    .el-col:nth-child(1) {
      padding-left: 10px;
      .el-radio__inner {
        width: 20px;
        height: 20px;
      }
    }
    .el-col:nth-child(2) {
      float: right;
      &.el-form-item__content {
        text-align: right;
        width: 100%;
      }
    }
  }
}

.form-search::v-deep {
  .el-form-item__label {
    padding: 0 10px 0 0 !important;
  }
}

.between-date {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
}

.search-button {
  margin-top: -8px;
  float: right;
}

/deep/ .el-table__fixed::before,
.el-table__fixed-right::before {
  background-color: unset !important;
}
.d-fa {
  display: flex;
  justify-content: flex-end;
}
.multiselect {
  width: 162px !important;
}
.confirm {
  width: 51px;
  height: 25px;
  background: #f4f8fd;
  border-radius: 5px;
  opacity: 1;
  color: #1467b3;
  font-size: 15px;
  font-family: Noto Sans JP, serif;
  padding: 0;
  border: 0;
  margin-left: -10px;
}
</style>
