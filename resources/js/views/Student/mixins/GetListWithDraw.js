import WithDrawResource from '@/api/WithDraw';
import { Message } from 'element-ui';
import moment from 'moment';

const withDrawResource = new WithDrawResource();
import TargetPeriodRequest from '@/api/TargetPeriodRequest';
const targetPeriodRequest = new TargetPeriodRequest();
export const GetListWithDrawMixin = {
  data() {
    return {
      originFormRegister: {
        id: undefined,
        snz_withdrawalmonth_period_id: '',
        snz_withdrawalreasonoption: '',
        snz_withdrawalreason: '',
        status: 1,
      },
    };
  },
  methods: {
    async getListWithDraw() {
      this.loadingWithDraw = true;
      await withDrawResource.getWithDrawWithStudentCode(this.paginate2.listQuery, this.studenCode).then(res => {
        this.tableDataWithDraw = res.original.data.data || [];
        this.paginate2.total = res.original.data.total;
        this.paginate2.lastPage = res.original.data.last_page;
        this.paginate2.listQuery.limit = Number(res.original.data.per_page);
        // this.scrollTopTable();
        document.getElementsByClassName('el-table__body-wrapper')[1].scrollTop = 0;
        this.loadingWithDraw = false;
      }).catch(e => {
        this.loadingWithDraw = false;
        console.log(e.response);
      }).finally(() => {
        this.loadingWithDraw = false;
      });
    },
    async saveWithDraw() {
      await this.$refs['withdraw'].$refs.form.validate().then(async valid => {
        if (valid) {
          if (this.dialogStatus === 'create') {
            withDrawResource.store(this.originFormRegister).then(async res => {
              if (res) {
                this.dialogFormVisible = false;
                await this.getDetailInfoStudent();
                await this.getListAbsent();
                await this.getListWithDraw();
                this.$message({
                  type: 'success',
                  message: '退塾情報を登録しました',
                });
              }
            }).catch(e => {
              this.$refs['withdraw'].$refs.form.injectFormValidates(e.response);
              console.log(e.response);
            });
          }
          if (this.dialogStatus === 'update') {
            if (this.originFormRegister.status === 0) {
              this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
                confirmButtonText: 'はい',
                cancelButtonText: 'キャンセル',
                type: 'warning',
              }).then(async() => {
                await this.updateWithDrawal();
              });
            } else {
              await this.updateWithDrawal();
            }
          }
        }
      }).catch(() => {});
    },

    async updateWithDrawal() {
      await withDrawResource.update(this.originFormRegister.id, this.originFormRegister).then(async res => {
        if (res) {
          this.dialogFormVisible = false;
          await this.getDetailInfoStudent();
          await this.getListAbsent();
          await this.getListWithDraw();
          this.$message({
            type: 'success',
            message: '退塾情報を修正しました。',
          });
        }
      }).catch(e => {
        this.$refs['withdraw'].$refs.form.injectFormValidates(e.response);
        console.log(e.response);
      });
    },

    async editRegister(data) {
      this.idWithDraw = data.id;
      this.dialogStatus = 'update';
      const newData = {
        id: data.id,
        snz_businessunit_id: data.contact.business_unit.name || null,
        snz_grade_name: data.contact.grade.snz_name || null,
        snz_studentcode: data.snz_studentcode || null,
        fullname: data.contact.student.fullname || null,
        user_id: data.created_by_user_id || null,
        modified_by_user_id: data.modified_by_user_id || null,
        created_at: moment().format('yyyy/MM/DD') || null,
        updated_at: data.modified_by_user_id ? moment().format('yyyy/MM/DD') : null,
        snz_withdrawalmonth_period_id: data.snz_withdrawalmonth_period_id,
        snz_withdrawalreasonoption: data.snz_withdrawalreasonoption,
        snz_withdrawalreason: data.snz_withdrawalreason,
        status: data.status,
        patternId: data.contact ? (data.contact.business_unit ? data.contact.business_unit.snz_calendar_pattern_id : null) : null,
      };
      this.originFormRegister = newData;
      this.defaultTargetPeriod = await targetPeriodRequest.getOption({ snz_calendar_pattern_id: this.patternId });
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['withdraw'].$refs['form'].clearValidate();
      });
    },
    deleteData(id){
      if (typeof id !== 'undefined') {
        this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
          confirmButtonText: 'はい',
          cancelButtonText: 'キャンセル',
          type: 'warning',
        }).then(async() => {
          this.listLoading = true;
          this.dialogFormVisible = false;
          await withDrawResource.delete(id).then(async res => {
            if (res) {
              await this.getListWithDraw();
              Message({
                message: '退塾情報を削除しました。',
                type: 'success',
                duration: 1500,
              });
            }
          }).catch(() => {
            this.dialogFormVisible = false;
          });
          this.listLoading = false;
        }).catch(() => {
          return false;
        });
      }
    },
  },
};
