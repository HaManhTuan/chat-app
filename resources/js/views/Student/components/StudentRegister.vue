<template>
  <div v-loading="fullscreenLoading">
    <div class="card-body">
      <div class="card-body__header">
        <h3>休塾情報</h3>
        <div class="title">
          <el-button
            v-if="(ableRole(['system', 'employee','parttime'])
              || (form.snz_studentstatus && form.snz_studentstatus==StudentStatus.INTERNAL_RAW) && isShowBtnStart)"
            plain
            :disabled="checkRole(['callcenter','viewonly'],'cant')"
            icon="el-icon-circle-plus"
            @click="showPopupStartAbsent"
          >
            休塾<span class="tx-green">開始</span>を登録
          </el-button>
          <el-button
            v-if="(ableRole(['system', 'employee','parttime']))
              || (! ableRole(['system', 'employee','parttime']) && !isShowBtnStart)"
            :disabled="checkRole(['callcenter','viewonly'],'cant')"
            plain
            icon="el-icon-circle-plus"
            @click="showPopupEndAbsent"
          >
            休塾<span class="tx-green">終了</span>を登録
          </el-button>
        </div>
      </div>
      <div class="card-body__content">
        <el-table
          v-loading="loadingAbsent"
          class="table-content"
          :data="tableDataAbsent"
          :empty-text="CommonTxt.tableEmptyTxt"
          fit
          highlight-current-row
          header-cell-class-name="my-header"
          height="calc(100%)"
        >
          <el-table-column label="生徒氏名" width="228px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.contact.student ? scope.row.contact.student.fullname : null }}</span>
            </template>
          </el-table-column>
          <el-table-column label="休塾開始月" width="130px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.target_period_start_month ? scope.row.target_period_start_month.snz_name : null }}</span>
            </template>
          </el-table-column>
          <el-table-column label="休塾終了月" width="142px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.target_period_end_month ? scope.row.target_period_end_month.snz_name : null }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="休塾理由" label="休塾理由" width="210px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_absentreasonoption | mapOptions(selectDataReasonAbsent) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="休塾理由その他" label="休塾理由その他">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_absentreasonother }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="ableRole(['system', 'employee','parttime'])" label="詳細編集" align="center" width="95px">
            <template slot-scope="scope">
              <el-button class="btn-edit" size="mini" @click="editAbsent(scope.row)">
                <svg-icon icon-class="_edit" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="card-body__footer">
        <custom-pagination
          v-show="paginate1.lastPage>1"
          :total="paginate1.total"
          :page.sync="paginate1.listQuery.page"
          :limit.sync="paginate1.listQuery.limit"
          layout="prev, pager, next"
          prev-text="<"
          next-text=">"
          class="text-center custom-pagination"
          @pagination="func => getListAbsent()"
        />
      </div>
    </div>
    <div class="line custom-register" />
    <div class="card-body">
      <div class="card-body__header">
        <h3>退塾情報</h3>
        <div
          v-if="ableRole(['system', 'employee','parttime'])
            || (form.snz_studentstatus && (form.snz_studentstatus==StudentStatus.INTERNAL_RAW || form.snz_studentstatus==StudentStatus.KYU_JUNIOR_COLLEGE_STUDENT))"
          class="title"
        >
          <el-button plain icon="el-icon-circle-plus" :disabled="checkRole(['callcenter','viewonly'],'cant')" @click="showPopupRegister">
            退塾情報を登録
          </el-button>
        </div>
      </div>
      <div class="card-body__content">
        <el-table
          v-loading="loadingWithDraw"
          class="table-content second-table"
          :data="tableDataWithDraw"
          fit
          highlight-current-row
          style="width: 100%"
          height="calc(100%)"
        >
          <el-table-column prop="生徒氏名" label="生徒氏名" width="215px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.contact.student ? scope.row.contact.student.fullname : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="学年" label="学年" width="145px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.contact.grade ? scope.row.contact.grade.snz_name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="校舎" label="校舎" width="185px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.contact.business_unit ? scope.row.contact.business_unit.name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="退塾年月" label="退塾年月" width="125px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.target_period ? scope.row.target_period.snz_name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="退塾理由" label="退塾理由" width="185px">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_withdrawalreasonoption | mapOptions(selectDataReasonWithDrawal) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="退塾理由その他" min-width="130px" label="退塾理由その他">
            <template slot-scope="scope">
              <span class="ellipsis">{{ scope.row.snz_withdrawalreason }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="ableRole(['system', 'employee','parttime'])" label="詳細編集" align="center" width="95px">
            <template slot-scope="scope">
              <el-button
                class="btn-edit"
                size="mini"
                @click="editRegister(scope.row)"
              >
                <svg-icon icon-class="_edit" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="card-body__footer pb-2">
        <custom-pagination
          v-show="paginate2.lastPage>1"
          :total="paginate2.total"
          :page.sync="paginate2.listQuery.page"
          :limit.sync="paginate2.listQuery.limit"
          layout="prev, pager, next"
          prev-text="<"
          next-text=">"
          class="text-center custom-pagination"
          @pagination="func => getListWithDraw()"
        />
      </div>
    </div>
    <!--Dialog bắt đầu nghỉ học-->
    <ModalStartAbsent
      ref="startAbsent"
      :dialog-form-start-absent-visible="dialogFormStartAbsentVisible"
      :origin-form-start-absent="originFormStartAbsent"
      :dialog-start-absent-status="dialogStartAbsentStatus"
      :data-target-period="defaultTargetPeriod"
      :data-status="dataStatus"
      :data-status-system="dataStatusSystem"
      :user-created="userCreated"
      :is-inter-raw="isInterRaw"
      :is-retired="isRetired"
      @closeStartAbsent="closePopupStartAbsent"
      @saveStartAbsentClick="saveStartAbsentClick"
      @deleteAbsent="deleteAbsent(idAbsent)"
    />
    <!--Dialog kết thúc nghỉ học-->
    <ModalEndAbsent
      ref="endAbsent"
      :dialog-form-end-absent-visible="dialogFormEndAbsentVisible"
      :origin-form-end-absent="originFormEndAbsent"
      :dialog-end-absent-status="dialogEndAbsentStatus"
      :data-target-period="defaultTargetPeriod"
      :data-status="dataStatus"
      :user-created="userCreated"
      :is-inter-raw="isInterRaw"
      :is-retired="isRetired"
      @closePopupEndAbsent="closePopupEndAbsent"
      @saveEndAbsentClick="saveEndAbsentClick"
    />
    <!--Dialog edit nghỉ học-->
    <ModalEditAbsent
      ref="editAbsent"
      :dialog-form-edit-absent-visible="dialogFormEditAbsentVisible"
      :origin-form-edit-absent="originFormEditAbsent"
      :data-target-period="defaultTargetPeriod"
      :data-status="dataStatus"
      :user-created="userCreated"
      @closeEditAbsent="closePopupEditAbsent"
      @saveEditAbsentClick="saveEditAbsentClick"
      @deleteEditAbsent="deleteAbsent(idAbsent)"
    />
    <!--Dialog thôi học-->
    <ModalWithDraw
      ref="withdraw"
      :dialog-form-visible="dialogFormVisible"
      :origin-form-register.sync="originFormRegister"
      :dialog-status="dialogStatus"
      :data-target-period="defaultTargetPeriod"
      :data-status="dataStatus"
      :data-status-system="dataStatusSystem"
      :user-created="userCreated"
      @close="dialogFormVisible = false"
      @saveWithDraw="saveWithDraw"
      @deleteWithDraw="deleteData(idWithDraw)"
    />
  </div>
</template>
<script>

import { ModalRegister } from '../assets/validate';
import { CreateFormDataMixin } from '../mixins/CreateFormData';
import { GetListAbsentMixin } from '../mixins/GetListAbsent';
import { GetListWithDrawMixin } from '../mixins/GetListWithDraw';
import ModalWithDraw from '../modal/ModalWithDraw';
import ModalStartAbsent from '../modal/ModalStartAbsent';
import ModalEndAbsent from '../modal/ModalEndAbsent';
import ModalEditAbsent from '../modal/ModalEditAbsent';
import role from '@/directive/role';
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
import { STATUS_REASON_ABSENT as statusReasonAbsent } from '../../../const/ImportStatus';
import { STATUS_REASON_WITHDRAW as statusReasonWithDrawal } from '../../../const/ImportStatus';
import AbsentResource from '@/api/Absent';
import UserResource from '@/api/user';
import { mapOptions } from '@/filters/mapOptions';
import withdrawReasonInfoStatus from '@/const/ReasonInfo';
import StudentStatus from '@/const/StudentStatus';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
import { Message } from 'element-ui';

const absentResource = new AbsentResource();
const userResource = new UserResource();
const targetPeriodRequest = new TargetPeriodRequest();

export default {
  components: {
    CustomPagination, ModalWithDraw, ModalStartAbsent, ModalEndAbsent, ModalEditAbsent,
  },
  filters: {
    mapOptions: mapOptions,
  },
  directives: { role },
  mixins: [ModalRegister, CreateFormDataMixin, GetListAbsentMixin, GetListWithDrawMixin],
  props: {
    id: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      roles: null,
      withdrawReasonInfoStatus: withdrawReasonInfoStatus,
      dataTargetPeriod: [],
      selectDataReasonAbsent: statusReasonAbsent,
      selectDataReasonWithDrawal: statusReasonWithDrawal,
      dialogFormVisible: false,
      dialogFormStartAbsentVisible: false,
      dialogFormEndAbsentVisible: false,
      dialogFormEditAbsentVisible: false,
      studenCode: null,
      fullscreenLoading: true,
      listLoading: true,
      form: {},
      paginate1: {
        total: 0,
        lastPage: 0,
        listQuery: {
          page: 1,
          limit: 7,
        },
      },
      paginate2: {
        total: 0,
        lastPage: 0,
        listQuery: {
          page: 1,
          limit: 7,
        },
      },
      tabPosition: 'top',
      tableDataAbsent: [],
      tableDataWithDraw: [],
      userCreated: [],
      dataStatus: [
        {
          value: 1,
          label: 'アクティブ',
        },
        {
          value: 0,
          label: '非アクティブ',
        },
      ],
      dataStatusSystem: [
        {
          value: 1,
          label: 'アクティブ',
        },
      ],
      dialogStatus: '',
      dialogStartAbsentStatus: '',
      dialogEndAbsentStatus: '',
      isShowBtnStart: false,
      isShowBtnEnd: false,
      StudentStatus,
      idWithDraw: null,
      baseForm: {},
      checkEndMonth: null,
      idAbsent: null,
      isInterRaw: null,
      isRetired: null,
      patternId: null,
      loadingWithDraw: true,
      loadingAbsent: true,
      defaultTargetPeriod: [],
    };
  },
  async created() {
    this.studenCode = this.$route.params.id || null;
    this.roles = this.$store.getters.roles;
    await this.init();
    this.fullscreenLoading = false;
  },
  methods: {
    async init() {
      await this.getDetailInfoStudent();
      await userResource.getAllListUser().then(res => {
        if (res) {
          this.userCreated = res || [];
        }
      });
      await this.getListAbsent(true);
      await this.getListWithDraw();
    },

    async getDetailInfoStudent() {
      const resStudent = await absentResource.getBasicInfoContact(this.studenCode);
      this.form = resStudent.original.data;
      this.patternId = resStudent.original.data.business_unit ? resStudent.original.data.business_unit.snz_calendar_pattern_id : null;
      this.createBaseForm();
    },

    async showPopupRegister() {
      if (!this.checkRole(['callcenter', 'viewonly'], 'cant')) {
        this.dialogStatus = 'create';
        this.defaultTargetPeriod = await targetPeriodRequest.getOption({ snz_calendar_pattern_id: this.patternId });
        this.dialogFormVisible = true;
        this.resetOriginFormRegister();
        this.$nextTick(() => {
          this.$refs['withdraw'].$refs.form.clearValidate();
        });
      }
    },
    closePopup() {
      this.dialogFormVisible = false;
    },
    closePopupStartAbsent() {
      this.dialogFormStartAbsentVisible = false;
    },
    closePopupEndAbsent() {
      this.dialogFormEndAbsentVisible = false;
    },
    closePopupEditAbsent() {
      this.$nextTick(() => {
        this.$refs['editAbsent'].$refs.formEditAbsent.clearValidate();
      });
      this.dialogFormEditAbsentVisible = false;
    },
    async showPopupStartAbsent() {
      // check popup start absent
      await absentResource.checkOpenModalStartAbsent(this.studenCode).then(async() => {
        if (this.startDate){
          Message.error('開始していない休塾情報が既に登録されています。');
        } else {
          if (!this.checkRole(['callcenter', 'viewonly'], 'cant')) {
            this.dialogStartAbsentStatus = 'create';
            this.defaultTargetPeriod = await targetPeriodRequest.getOption({ snz_calendar_pattern_id: this.patternId });
            this.dialogFormStartAbsentVisible = true;
            this.resetOriginFormStartAbsent();
            this.$nextTick(() => {
              this.$refs.startAbsent.$refs['formStartAbsent'].clearValidate();
            });
          }
        }
      }).catch(error => {
        if (error.response.status === 424) {
          Message.error(error.response.data.original.message);
        }
      });
    },
    async showPopupEndAbsent() {
      if (!this.startDate){
        Message.error('終了していない休塾情報が既に登録されています。');
      } else {
        if (!this.checkRole(['callcenter', 'viewonly'], 'cant')) {
          this.dialogEndAbsentStatus = 'create';
          this.defaultTargetPeriod = await targetPeriodRequest.getOption({ snz_calendar_pattern_id: this.patternId });
          this.dialogFormEndAbsentVisible = true;
          this.resetOriginFormEndAbsent();
          this.$nextTick(() => {
            this.$refs.endAbsent.$refs['formEndAbsent'].clearValidate();
          });
        }
      }
    },
    // showPopupEditAbsent() {
    //   this.dialogFormEditAbsentVisible = true;
    //   this.resetOriginFormEditAbsent();
    //   this.$nextTick(() => {
    //     this.$refs.editAbsent.$refs['formEditAbsent'].clearValidate();
    //   });
    // },
    checkFullDataAbsent(data) {
      this.checkEndMonth = data.find(item =>
        item.snz_endmonth_period_id === null
      );
      const checkFullMonth = data.find(item =>
        item.snz_startmonth_period_id != null && item.snz_endmonth_period_id != null
      );
      this.isShowBtnStart = !!this.checkEndMonth;
      this.isShowBtnEnd = !!checkFullMonth;
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
  },
};
</script>
<style lang="scss">

</style>
<style lang="scss" scoped>
.custom-register{
  margin-top: 40px;
  margin-bottom: 20px;
}
@import '../styles/studentRegister';
</style>
