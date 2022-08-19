<template>
  <div v-loading="loading">
    <div class="app-container">
      <div class="header">
        <h2>{{ form.year + '年度' }}{{ form.schoolTestName ? schoolTestNames[form.schoolTestName] :'' }}</h2>
        <h4 style="padding-top: 10px;">学校試験・情報</h4>
      </div>
      <div class="schooltest-detail">
        <el-form label-width="127px" :model="form" :rules="formRules">
          <div class="card-body">
            <h3>
              学校試験情報
            </h3>
            <el-row class="top">
              <el-col :span="8">
                <el-form-item label="生徒氏名" prop="studentName">
                  <el-select v-model="form.fullname" disabled placeholder="">
                    <el-option
                      :key="form.fullname"
                      :label="form.fullname"
                      :value="form.fullname"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年度" prop="grade">
                  <el-input
                    v-model="form.year"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学校名">
                  <el-select v-model="form.school_name" disabled placeholder="">
                    <el-option
                      :key="form.school_name"
                      :label="form.school_name"
                      :value="form.school_name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- END FIRST ROW -->
            <!-- SECOND ROW -->
            <el-row class="top">
              <el-col :span="8">
                <el-form-item label="学年">
                  <el-select v-model="form.grade_name" disabled placeholder="">
                    <el-option
                      :key="form.grade_name"
                      :label="form.grade_name"
                      :value="form.grade_name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学期" prop="testName">
                  <el-select v-model="form.schoolTestName" disabled placeholder="">
                    <el-option
                      v-for="(item, index) in schoolTestNames"
                      :key="index"
                      :label="item"
                      :value="index"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="試験種類" prop="testType">
                  <el-select v-model="form.schoolTestType" disabled placeholder="">
                    <el-option
                      v-for="(item, index) in schoolTestTypes"
                      :key="index"
                      :label="item"
                      :value="index"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="line" />
          <div class="card-body">
            <h3>
              成績合計
            </h3>
            <el-row>
              <el-col :span="8" style="height: 36px;" />
              <el-col :span="8">
                <el-form-item label="合計得点">
                  <el-input
                    v-model="form.sumSubjectScore"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8" style="margin-left: -44px;">
                <el-form-item label="合計得点満点">
                  <el-input
                    v-model="form.sumSubjectperfectscore"
                    placeholder=""
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>

          </div>
          <div class="line" />
          <div class="card-body">
            <h3>
              科目別成績
            </h3>
            <el-row v-for="index in 5" :key="index" class="top">
              <el-col :span="8">
                <el-form-item :label="`科目0${index}`">
                  <el-select :value="getSubjectName(form.school_test_result, index)" disabled placeholder="―">
                    <el-option
                      :key="getSubjectName(form.school_test_result, index)"
                      :label="getSubjectName(form.school_test_result, index)"
                      :value="getSubjectName(form.school_test_result, index)"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`成績0${index}`">
                  <el-input :value="getSubjectScore(form.school_test_result, index)" disabled placeholder="―" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="`満点0${index}`">
                  <el-input :value="getSubjectPefectScore(form.school_test_result, index)" disabled placeholder="―" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="line" />
          <div v-role="['system']" class="card-body">
            <h3>
              システム
            </h3>
            <el-row class="top">
              <el-col :span="8">
                <el-form-item label="作成日" class="date-picker-item">
                  <el-date-picker
                    v-model="form.create_date"
                    format="yyyy/MM/dd"
                    value-format="yyyy/MM/dd"
                    prefix-icon="none"
                    type="date"
                    disabled
                  />
                  <span class="icon-input__calendar">
                    <svg-icon icon-class="_calendar_x" />
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
                  />
                  <span class="icon-input__calendar">
                    <svg-icon icon-class="_calendar_x" />
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="ステータス" prop="status">
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
            <el-row class="top">
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
          </div>
        </el-form>
      </div>
      <div class="footer">
        <button-delete v-role="['system']" @delete="deleteSchoolTest()" />
      </div>
    </div>
  </div>
</template>
<script>
import { validate } from '../assets/validate';
import SchoolTestResultResource from '@/api/schoolTestResult';
import ButtonDelete from '../../../components/Common/Button/ButtonDelete';
import { SubjectOrder } from '../../../const/SubjectMaster';
import role from '@/directive/role';
const schoolResource = new SchoolTestResultResource();

export default {
  metaInfo: {
    title: '学校試験詳細',
  },
  directives: { role },
  components: { ButtonDelete },
  mixins: [validate],
  data() {
    return {
      roles: [],
      isActive: true,
      form: {
        id: null,
        fullname: '',
        grade_name: '',
        school_name: '',
        year: '',
        schoolTestName: '',
        schoolTestType: '',
        sumSubjectScore: null,
        sumSubjectperfectscore: null,
        school_test_result: [],
        create_date: '',
        update_date: '',
        creator: null,
        corrector: null,
        creator_proxy: null,
        corrector_proxy: null,
        status: null,
      },
      schoolTestNames: [],
      schoolTestTypes: [],
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
    await this.getData();
    this.roles = this.$store.getters.roles;
    this.isDisabled();
    this.loading = false;
  },
  methods: {
    async getData() {
      const res = await schoolResource.get(this.$route.params.id);
      this.schoolTestTypes = res.original.schoolTestType;
      this.schoolTestNames = res.original.schoolTestName;
      if (res.original.schoolTestResult !== null){
        this.form.sumSubjectScore = res.original.sum.sumSubjectScore;
        this.form.sumSubjectperfectscore = res.original.sum.sumSubjectPerfect;
        this.setData(res.original.schoolTestResult);
      } else {
        this.$router.replace('/404');
      }
    },
    setData(schoolTestResult){
      this.form.id = schoolTestResult.id;
      this.form.fullname = schoolTestResult.student.fullname;
      this.form.grade_name = schoolTestResult.grade.snz_name;
      this.form.school_name = schoolTestResult.school.snz_name;
      this.form.year = schoolTestResult.snz_year;
      this.form.school_test_result = schoolTestResult.school_test_result;
      this.form.schoolTestName = schoolTestResult.snz_schooltestname.toString();
      this.form.schoolTestType = schoolTestResult.snz_schooltesttype.toString();
      this.form.create_date = schoolTestResult.created_at;
      this.form.update_date = schoolTestResult.updated_at;
      this.form.creator = schoolTestResult.user ? schoolTestResult.user.name : '';
      this.form.corrector = schoolTestResult.edit_user ? schoolTestResult.edit_user.name : '';
      this.form.creator_proxy = schoolTestResult.behalf_user ? schoolTestResult.behalf_user.name : '';
      this.form.corrector_proxy = schoolTestResult.edit_behalf_user ? schoolTestResult.edit_behalf_user.name : '';
      this.form.status = schoolTestResult.status;
    },
    deleteSchoolTest(){
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(() => {
        schoolResource.destroy(this.$route.params.id).then(response => {
          this.$message({
            type: 'success',
            message: '削除しました。',
          });
          const query = this.$route.params.query;
          this.redirectPage({ 'name': 'SchoolTest', params: { redirect: true }, query: query });
        }).catch(err => {
          if (err.response.status === 410) {
            this.$router.push({ name: 'err_404' });
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
    getSubjectName(schoolTestResult, index) {
      const subject = schoolTestResult.find((item) => {
        return item.order === index;
      });
      if (subject) {
        return subject.snz_subject_name;
      } else {
        return SubjectOrder[index - 1];
      }
    },
    getSubjectScore(schoolTestResult, index) {
      const subject = schoolTestResult.find((item) => {
        return item.order === index;
      });
      if (subject) {
        return subject.snz_subjectscore;
      } else {
        return '';
      }
    },
    getSubjectPefectScore(schoolTestResult, index) {
      const subject = schoolTestResult.find((item) => {
        return item.order === index;
      });
      if (subject) {
        return subject.snz_subjectperfectscore;
      } else {
        return '';
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
  overflow-y: hidden;
    .header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 50px;
        h2{
          font-size: 26px;
          font-weight: 500 !important;
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
        background-color: #ffffff;
        height: calc(100% - 130px);
        overflow-y: scroll;
        margin-top: 17px;
        h3{
            margin: 0px;
            font-size: 18px;
            font-weight: 500 !important;
            color: #1A1714;
            padding-bottom: 19px;
            padding-left: 30px;
            padding-top: 19px;
            font-family: Noto Sans JP, sans-serif;
        }
        .line{
            background-color: #f0f0f0;
            height: 1px;
        }
        .card-body{
            .el-col-8{
            .el-form-item{
                margin-bottom: 20px;
            }
            .el-form-item__content{
                width: 213px;
            }
            }
            .el-col-10,.el-col-14{
            .el-form-item{
                margin-bottom: 20px;
            }
            .el-form-item__content{
                width: 313px;
            }
            }
            .last-row {
            .el-form-item{
                margin-bottom: 20px;
            }
            }
            &:last-child{
            margin-bottom: 30px;
            }
        }
        .el-row{
          &.top{
            .el-col:nth-child(2) {
              margin-left: -38px;
            }
            .el-col:nth-child(3) {
              margin-left: -5px;
            }
          }
        }
    }
    .footer{
        text-align: right;
        margin-top: 20px;
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
            font-size: 17px;
            vertical-align: bottom;
        }

        &:hover {
            opacity: 0.8;
        }
        }
    }
}
</style>
