import AbsentResource from '@/api/Absent';
import { Message } from 'element-ui';
import moment from 'moment';
import StudentStatus from '@/const/StudentStatus';

import TargetPeriodRequest from '@/api/TargetPeriodRequest';
const absentResource = new AbsentResource();
const targetPeriodRequest = new TargetPeriodRequest();

export const GetListAbsentMixin = {
  data() {
    return {
      StudentStatus,
      startDate: null,
      originFormStartAbsent: {
        id: undefined,
        snz_startmonth_period_id: '',
        snz_absentreasonoption: '',
        snz_absentreasonother: '',
        status: 1,
      },
      originFormEndAbsent: {
        id: undefined,
        snz_endmonth_period_id: '',
        snz_absentreasonoption: '',
        snz_absentreasonother: '',
        status: 1,
      },
      originFormEditAbsent: {
        id: undefined,
        snz_studentStatus: null,
        snz_startmonth_period_id: '',
        snz_endmonth_period_id: '',
        snz_absentreasonoption: '',
        snz_absentreasonother: '',
        status: 1,
      },
    };
  },
  methods: {
    async getListAbsent(isLoading = null){
      if (isLoading) {
        this.loadingAbsent = true;
      }
      await absentResource.getAbsentWithStudentCode(this.paginate1.listQuery, this.studenCode).then(res => {
        this.tableDataAbsent = res.original.data.data || [];
        this.isShowBtnStart = res.original.isHaveEnd || null;
        this.startDate = res.original.startDate || null;
        this.paginate1.total = res.original.data.total;
        this.paginate1.lastPage = res.original.data.last_page;
        this.paginate1.listQuery.limit = Number(res.original.data.per_page);
        this.scrollTopTable();
        this.loadingAbsent = false;
      }).catch(e => {
        this.loadingAbsent = false;
        console.log(e.response);
      }).finally(() => {
        this.loadingAbsent = false;
      });
    },
    async saveStartAbsentClick() {
      if (this.originFormStartAbsent.statusStudent === StudentStatus.RETIRED_STUDENTS) {
        this.dialogFormStartAbsentVisible = false;
        Message.error('退塾生に休塾情報は登録できません。');
        return false;
      }
      await this.$refs.startAbsent.$refs.formStartAbsent.validate().then(async valid => {
        if (valid) {
          if (this.dialogStartAbsentStatus === 'create') {
            await absentResource.store(this.originFormStartAbsent).then(async res => {
              if (res) {
                this.dialogFormStartAbsentVisible = false;
                await this.getDetailInfoStudent();
                await this.getListAbsent(true);
                Message.success('休塾情報を登録しました');
              }
            }).catch(e => {
              this.$refs.startAbsent.$refs.formStartAbsent.injectFormValidates(e.response);
              console.log(e.response);
            });
          }
        }
      }).catch(() => {});
    },

    async saveEditAbsentClick() {
      if (this.originFormStartAbsent.statusStudent === StudentStatus.RETIRED_STUDENTS) {
        this.dialogFormEditAbsentVisible = false;
        Message.error('退塾生に休塾情報は登録できません。');
        return false;
      }
      if (this.originFormEditAbsent.status === 0) {
        this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
          confirmButtonText: 'はい',
          cancelButtonText: 'キャンセル',
          type: 'warning',
        }).then(async() => {
          await this.updateAbsent();
        });
        return false;
      } else {
        await this.$refs.editAbsent.$refs.formEditAbsent.validate().then(async valid => {
          if (valid) {
            await this.updateAbsent();
          }
        }).catch(() => {
        });
      }
    },
    async updateAbsent() {
      await absentResource.update(this.originFormEditAbsent.id, this.originFormEditAbsent).then(async res => {
        this.dialogFormEditAbsentVisible = false;
        await this.getDetailInfoStudent();
        await this.getListAbsent(true);
        Message.success('休塾情報を修正しました。');
      }).catch(e => {
        this.$refs.editAbsent.$refs.formEditAbsent.injectFormValidates(e.response);
        console.log(e.response);
      });
    },

    async editAbsent(data) {
      this.idAbsent = data.id;
      this.dialogStartAbsentStatus = 'update';
      const newData = {
        id: data.id,
        snz_studentStatus: data.contact ? String(data.contact.snz_studentstatus) : null,
        snz_businessunit_id: data.contact ? (data.contact.business_unit ? data.contact.business_unit.name : null) : null,
        snz_grade_name: data.contact ? data.contact.grade.snz_name : null,
        snz_studentcode: data.snz_studentcode || null,
        fullname: data.contact ? data.contact.student.fullname : null,
        user_id: data.created_by_user_id || null,
        modified_by_user_id: data.modified_by_user_id || null,
        created_at: moment().format('yyyy/MM/DD') || null,
        updated_at: data.modified_by_user_id ? moment().format('yyyy/MM/DD') : null,
        snz_startmonth_period_id: data.snz_startmonth_period_id || null,
        snz_endmonth_period_id: data.snz_endmonth_period_id || null,
        snz_absentreasonoption: data.snz_absentreasonoption || null,
        snz_absentreasonother: data.snz_absentreasonother || null,
        status: data.status,
        patternId: data.contact ? (data.contact.business_unit ? data.contact.business_unit.snz_calendar_pattern_id : null) : null,
      };
      this.originFormEditAbsent = newData;
      this.dialogFormEditAbsentVisible = true;
      this.isInterRaw = (this.dialogStartAbsentStatus === 'update') && (this.form.snz_studentstatus && this.form.snz_studentstatus !== parseInt(StudentStatus.INTERNAL_RAW));
      this.isRetired = (this.dialogStartAbsentStatus === 'update') && (this.form.snz_studentstatus && this.form.snz_studentstatus === parseInt(StudentStatus.RETIRED_STUDENTS));
      this.defaultTargetPeriod = await targetPeriodRequest.getOption({ snz_calendar_pattern_id: this.patternId });
      // this.$nextTick(() => {
      //   this.$refs.editAbsent.$refs['formEditAbsent'].clearValidate();
      // });
    },
    async saveEndAbsentClick() {
      if (this.originFormStartAbsent.statusStudent === StudentStatus.RETIRED_STUDENTS) {
        this.dialogFormEndAbsentVisible = false;
        Message.error('退塾生に休塾情報は登録できません。');
        return false;
      }
      await this.$refs.endAbsent.$refs.formEndAbsent.validate().then(async valid => {
        if (valid) {
          const snz_startmonth_period_id = { 'snz_startmonth_period_id': this.startDate || null };
          this.originFormEndAbsent = { ... this.originFormEndAbsent, ...snz_startmonth_period_id };
          absentResource.createEndDateAbsent(this.originFormEndAbsent).then(async res => {
            if (res) {
              this.dialogFormEndAbsentVisible = false;
              await this.getDetailInfoStudent();
              await this.getListAbsent(true);
              Message.success('休塾情報を登録しました');
            }
          }).catch(e => {
            this.$refs.endAbsent.$refs.formEndAbsent.injectFormValidates(e.response);
            if (e.response.status === 422) {
              const errorDatas = e.response.data.errors;
              if (errorDatas['snz_startmonth_period_id'] !== undefined && errorDatas['snz_startmonth_period_id'][0]) {
                this.dialogFormEndAbsentVisible = false;
                Message.error('休塾情報がないので、休塾終了を登録できません');
              }
            }
          });
        }
      }).catch(() => {});
    },
    async deleteAbsent(id) {
      if (typeof id !== 'undefined') {
        this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
          confirmButtonText: 'はい',
          cancelButtonText: 'キャンセル',
          type: 'warning',
        }).then(async() => {
          this.listLoading = true;
          this.dialogFormEditAbsentVisible = false;
          await absentResource.destroy(id).then(async res => {
            if (res) {
              await this.getListAbsent(true);
              Message({
                message: '休塾情報を削除しました。',
                type: 'success',
                duration: 1500,
              });
            }
          }).catch(() => {
            this.dialogFormEditAbsentVisible = false;
          });
          this.listLoading = false;
        }).catch(() => {
          return false;
        });
      }
    },
  },
};
