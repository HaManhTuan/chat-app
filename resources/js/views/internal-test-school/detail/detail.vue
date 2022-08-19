<template>
  <div v-loading="loading" class="app-container">
    <div class="schooltest-detail">
      <el-form label-width="127px" :model="form" :rules="formRules">
        <div class="card-body">
          <h3>
            テスト情報
          </h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="テスト名" prop="testName">
                <el-input v-model="form.testName" disabled placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="8" style="height: 36px;" />
            <el-col :span="8">
              <el-form-item label="採点区分">
                <el-select v-model="form.scoringType" disabled placeholder="">
                  <el-option
                    v-for="item in scoringTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- END FIRST ROW -->
          <!-- SECOND ROW -->
          <el-row class="bot">
            <el-col :span="8">
              <el-form-item label="生徒氏名" prop="studentName">
                <el-select v-model="form.studentName" disabled placeholder="">
                  <el-option
                    :key="form.studentName"
                    :label="form.studentName"
                    :value="form.studentName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="科目" prop="subjectName">
                <el-select v-model="form.subjectName" disabled placeholder="">
                  <el-option
                    :key="form.subjectName"
                    :label="form.subjectName"
                    :value="form.subjectName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="受験フラグ">
                <el-select v-model="form.takeTestFlg" disabled placeholder="">
                  <el-option
                    v-for="item in takeTestFlagOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="line" />
        <div class="card-body">
          <h3>
            合計得点
          </h3>
          <el-row class="bot">
            <el-col :span="8">
              <el-form-item label="合計得点">
                <el-input
                  v-model="form.total"
                  placeholder=""
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合計配点">
                <el-input
                  v-model="form.snz_max_scoring"
                  placeholder=""
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" style="height: 36px;" />
          </el-row>
        </div>
        <div class="line" />
        <div class="card-body loop-item">
          <h3>
            設問別得点
          </h3>
          <el-row v-for="(item, index) in form.test_result" :key="index">
            <el-col :span="8">
              <el-form-item :label="`問0${item.order}`">
                <el-input v-model="item.snz_question" disabled placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`得点0${item.order}`">
                <el-input v-model="item.snz_scoring" disabled placeholder="" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`配点0${item.order}`">
                <el-input v-model="item.snz_max_scoring" disabled placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-role="['system']" class="line" />
        <div v-role="['system']" class="card-body">
          <h3>
            システム
          </h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="作成日" class="date-picker-item">
                <el-date-picker
                  v-model="form.create_date"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                  prefix-icon="none"
                  type="date"
                  disabled
                  placeholder=""
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar_x" style="font-size: 18px;" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修正日" prop="firstName" class="date-picker-item">
                <el-date-picker
                  v-model="form.update_date"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                  prefix-icon="none"
                  type="date"
                  disabled
                  placeholder=""
                />
                <span class="icon-input__calendar">
                  <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="ステータス" prop="testName">
                <el-select v-model="form.status" disabled placeholder="">
                  <el-option
                    v-for="item in statuss"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- END FIRST ROW -->
          <!-- SECOND ROW -->
          <el-row>
            <el-col :span="8">
              <el-form-item label="作成者">
                <el-select v-model="form.creator" disabled placeholder="">
                  <el-option
                    :label="form.creator"
                    :value="form.creator"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="修正者">
                <el-select v-model="form.corrector" disabled placeholder="">
                  <el-option
                    :label="form.corrector"
                    :value="form.corrector"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" />
          </el-row>
          <el-row class="bot">
            <el-col :span="8" />
            <el-col :span="8" />
            <el-col :span="8" />
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <el-button v-role="['system']" class="delete" :disabled="isActive" @click="handleDelete()">
        <svg-icon icon-class="_trash_w" />
        <span>削除</span>
      </el-button>
    </div>
  </div>
</template>
<script>
import { validate } from '../assets/validate';
import InternalTestSchool from '@/api/internalTestSchool';
import role from '@/directive/role';
import { name as takeTestFlagName, options as takeTestFlagOptions } from '@/const/TakeTestFlag';
import { name as scoringTypeName, options as scoringTypeOptions } from '@/const/ScoringType';
const internalTestResource = new InternalTestSchool();
export default {
  metaInfo: {
    title: '塾内テスト詳細',
  },
  // eslint-disable-next-line no-undef
  directives: { role },
  mixins: [validate],
  data() {
    return {
      roles: [],
      isActive: true,
      id: null,
      takeTestFlagName: takeTestFlagName,
      takeTestFlagOptions: takeTestFlagOptions,
      scoringTypeName: scoringTypeName,
      scoringTypeOptions: scoringTypeOptions,
      form: {
        studentName: '',
        testName: '',
        subjectName: '',
        scoringType: '',
        total: null,
        takeTestFlg: '',
        test_result: [],
        create_date: '',
        update_date: '',
        creator: null,
        corrector: null,
        status: null,
      },
      statuss: [
        {
          id: 0,
          name: '非アクティブ',
        },
        {
          id: 1,
          name: 'アクティブ',
        },
      ],
      loading: true,
    };
  },
  async created(){
    this.roles = this.$store.getters.roles;
    this.isDisabled();
    this.id = this.$route.params.id;
    await this.getData();
    this.loading = false;
  },
  methods: {
    async getData() {
      const response = await internalTestResource.get(this.id);
      this.setData(response);
    },
    setData(test){
      this.form.studentName = test.student.fullname;
      this.form.testName = test.snz_testmanagementname;
      this.form.subjectName = test.snz_subject_name;
      this.form.scoringType = test.snz_scoringtype ? test.snz_scoringtype : '';
      this.form.total = test.snz_total;
      this.form.test_result = test.test_results;
      this.form.takeTestFlg = test.snz_taketestflg;
      this.form.create_date = test.created_at;
      this.form.update_date = test.updated_at;
      this.form.creator = test.user ? test.user.name : '';
      this.form.corrector = test.edit_user ? test.edit_user.name : '';
      this.form.status = test.status;
      this.form.snz_max_scoring = test.snz_max_scoring;
    },
    handleDelete(){
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        internalTestResource.destroy(this.id).then(response => {
          this.$message({
            type: 'success',
            message: '削除しました。',
          });
          this.$router.push('/internal-test');
        }).catch(error => {
          if (error.response.status === 410) {
            this.$router.push({ name: 'err_404' });
          } else {
            this.$message({
              type: 'error',
              message: 'この操作は実行できません。',
            });
          }
        });
      }).catch(() => {});
    },
    isDisabled(){
      if (this.roles.find(e => e === 'system')) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
    },
  },
};
</script>
<style lang="scss">
  .main-container{
    background: #F0F0F0;
  }
</style>
<style lang="scss" scoped>
.app-container::v-deep{
    .header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 50px;
        h2{
          font-size: 26px;
          font-weight: normal;
          color: #1A1714;
        }
        h4{
          font-size: 14px;
          font-weight: normal;
          color: #1A1714;
        }
    }
    .schooltest-detail {
      height: calc(100% - 75px);
      overflow-y: scroll;
      overflow-x: hidden;
        background-color: #ffffff;
        margin-top: 17px;
        h3{
            margin: 0px;
            font-size: 18px;
            font-weight: 500 !important;
            color: #1A1714;
            padding-bottom: 19px;
            padding-left: 30px;
            padding-top: 19px;
        }
        .line{
            background-color: #f0f0f0;
            height: 1px;
        }
        .card-body{
            .el-row{
              .el-form-item{
                margin-bottom: 13px;
                .el-input, .el-select{
                  max-width: 213px;
                  height: 36px;
                  line-height: 36px;
                  input {
                    height: 36px;
                    line-height: 36px;
                  }
                }
              }
              &.bot{
                height: 60px;
                .el-form-item{
                  margin-bottom: 20px !important;
                }
              }
            }
            .el-form-item__content{
                width: 213px;
            }
            .el-form-item{
                margin-bottom: 13px;
            }
        }
    }
    .footer{
        text-align: right;
        padding-top: 17px;
        background-color: #f0f0f0;
        button {
        border-radius: 100px;
        color: #fff;
        width: 105px;
        height: 45px;

        &.delete {
            background: #343434;
        }

        i,
        svg {
            font-size: 20px;
            vertical-align: middle;
        }

        &:hover {
            opacity: 0.8;
        }
        span {
          font-size: 15px;
          font-weight: 500 !important;
        }
        }
    }
}
</style>
