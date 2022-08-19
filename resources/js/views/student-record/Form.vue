<template>
  <div v-loading="loading" class="app-container">
    <div v-if="record.id" class="header">
      <el-row>
        <el-col :span="16">
          <h1 class="header__name">{{ record.snz_year + '年度' }}{{ record.snz_schoolscorename | getSemesterLabel }}</h1>
        </el-col>
        <el-col :span="8" class="page-title">
          <label>学校内申・情報</label>
        </el-col>
      </el-row>
    </div>
    <el-form v-if="record.id" :model="record" label-width="120px" label-position="left">
      <el-scrollbar class="scroll-content">
        <el-row class="student-record__item">
          <el-card class="box-card" shadow="no">
            <div class="card-header">
              <span>学校内申情報</span>
            </div>
            <div class="component-item">
              <el-col :span="8">
                <el-form-item label="生徒氏名" required>
                  <el-select v-model="record.student.fullname" :placeholder="record.student.fullname" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学年">
                  <el-select
                    v-model="record.grade.snz_name"
                    :value="record.grade.snz_name"
                    :placeholder="record.grade.snz_name"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学校名">
                  <el-select
                    v-model="record.school.snz_name"
                    :value="record.school.snz_name"
                    :placeholder="record.school.snz_name"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年度" required>
                  <el-select
                    v-model="record.snz_year"
                    :value="record.snz_year"
                    :placeholder="record.snz_year + '年度'"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学期" required>
                  <el-select
                    :value="record.snz_schoolscorename | getSemesterLabel"
                    :placeholder="record.snz_schoolscorename | getSemesterLabel"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </div>
          </el-card>
          <el-card class="box-card" shadow="no">
            <div class="card-header">
              <span>学校内申合計</span>
            </div>
            <div class="component-item">
              <el-col :span="8" :offset="8">
                <el-form-item label="合計成績">
                  <el-input :value="record.total_point" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合計得点満点">
                  <el-input :value="record.pefect_point" disabled />
                </el-form-item>
              </el-col>
            </div>
          </el-card>
          <el-card class="box-card" shadow="no">
            <div class="card-header">
              <span>科目別成績</span>
            </div>
            <div class="component-item">
              <el-col :span="8">
                <el-row>
                  <el-col v-for="index in 9" :key="index" :span="24">
                    <el-form-item :label="'科目0' + index">
                      <el-select
                        :value="record.school_score_results_limit | getSubjectName(index)"
                        placeholder="―"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-for="(item, index) in extraSubjects" :key="index" :span="24">
                    <el-form-item :label="'科目' + (index < 10 ? '1' + (index) : (10 + index))">
                      <el-select :value="item.snz_subject_name" :placeholder="item.snz_subject_name" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <el-col v-for="index in 9" :key="index" :span="24">
                    <el-form-item :label="'成績0' + index">
                      <el-input
                        :value="record.school_score_results_limit | getSubjectScore(index)"
                        placeholder="―"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-for="(item, index) in extraSubjects" :key="index" :span="24">
                    <el-form-item :label="'成績' + (index < 10 ? '1' + (index) : (10 + index))">
                      <el-input :value="item.snz_subjectscore" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <el-col v-for="index in 9" :key="index" :span="24">
                    <el-form-item :label="'満点0' + index">
                      <el-input
                        :value="record.school_score_results_limit | getSubjectPefectScore(index)"
                        placeholder="―"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-for="(item, index) in extraSubjects" :key="index" :span="24">
                    <el-form-item :label="'満点' + (index < 10 ? '1' + (index) : (10 + index))">
                      <el-input :value="item.snz_subjectperfectscore" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </div>
          </el-card>
          <el-card v-role="['system']" class="box-card" shadow="no">
            <div class="card-header">
              <span>システム</span>
            </div>
            <div class="component-item">
              <!-- ngay tao -->
              <el-col :span="8">
                <el-form-item label="作成日" class="date-picker-item">
                  <el-date-picker v-model="record.created_at" format="yyyy/MM/dd" disabled prefix-icon="none" />
                  <span class="icon-input__calendar">
                    <svg-icon icon-class="_calendar_x" />
                  </span>
                </el-form-item>
              </el-col>
              <!-- Ngay sua -->
              <el-col :span="8">
                <el-form-item label="修正日" class="date-picker-item">
                  <el-date-picker v-model="record.updated_at" format="yyyy/MM/dd" disabled prefix-icon="none" />
                  <span class="icon-input__calendar">
                    <svg-icon icon-class="_calendar_x" />
                  </span>
                </el-form-item>
              </el-col>
              <!-- status -->
              <el-col :span="8">
                <el-form-item label="ステータス" required>
                  <el-select :value="record.status" :model="record.status" :placeholder="''" disabled />
                </el-form-item>
              </el-col>
              <!-- nguoi tao -->
              <el-col :span="8">
                <el-form-item label="作成者">
                  <el-select :value="record.user !== null ? record.user.name: ''" :placeholder="record.user !== null ? record.user.name: ''" disabled />
                </el-form-item>
              </el-col>
              <!-- nguoi sua -->
              <el-col :span="8">
                <el-form-item label="修正者">
                  <el-select
                    :value="''"
                    :placeholder="record.edit_user !== null ? record.edit_user.name : ''"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <div class="clearfix" />
            </div>
          </el-card>
        </el-row>
      </el-scrollbar>
    </el-form>
    <div v-if="record.id" v-role="['system']" class="group-button text-right">
      <button-delete @delete="handleDelete" />
    </div>
  </div>
</template>

<script>
import ButtonDelete from '@/components/Common/Button/ButtonDelete';
import StudentRecordRequest from '@/api/studentRecordRequest';
import StudentStatus from '@/const/StudentStatus';
import CommonSettings from '@/const/CommonSettings';
import { SubjectOrder } from '../../const/SubjectMaster';
import role from '@/directive/role';
import _ from 'lodash';
const studentRecord = new StudentRecordRequest();
export default {
  metaInfo: {
    title: '学校内申詳細',
  },
  name: 'StudentRecordForm',
  components: { ButtonDelete },
  directives: { role },
  filters: {
    getScore(row, index) {
      if (row.length > 0 && typeof row[index] !== 'undefined' && typeof row[index].snz_subjectscore !== 'undefined') {
        return row[index].snz_subjectscore;
      }
    },
    getSemesterLabel(semester) {
      const stt = _.filter(StudentStatus.OPTION_SEMESTER, function(item) {
        return item.value === semester;
      });
      return typeof stt[0] !== 'undefined' ? stt[0].label : '';
    },
    getSubjectName(subjectScores, index) {
      const subject = _.chain(subjectScores).find((item) => {
        return item.order === index;
      }).value();
      if (subject) {
        return subject.snz_subject_name;
      } else {
        return SubjectOrder[index - 1];
      }
    },
    getSubjectScore(subjectScores, index) {
      const subject = _.chain(subjectScores).find((item) => {
        return item.order === index;
      }).value();
      if (subject) {
        return subject.snz_subjectscore;
      }
    },
    getSubjectPefectScore(subjectScores, index) {
      const subject = _.chain(subjectScores).find((item) => {
        return item.order === index;
      }).value();
      if (subject) {
        return subject.snz_subjectperfectscore;
      }
    },
  },
  data() {
    return {
      id: null,
      record: {
        snz_year: '',
      },
      loading: true,
      extraSubjects: [],
    };
  },
  async created() {
    this.id = this.$route.params.id;
    await this.getDetail();
    this.loading = false;
  },
  methods: {
    findSubject(subjectScores, index) {

    },
    async getDetail() {
      this.record = await studentRecord.get(this.id);
      let totalPoint = 0;
      let perfectPoint = 0;
      _.map(this.record.school_score_results_limit, (item) => {
        totalPoint += item.snz_subjectscore;
        perfectPoint += item.snz_subjectperfectscore;
      });
      this.record.school_score_results_limit = _.chain(this.record.school_score_results_limit)
        .sortBy('order')
        .filter((item) => {
          return parseInt(item.order) > 0;
        }).value();
      this.extraSubjects = _.chain(this.record.school_score_results_limit)
        .sortBy('order')
        .filter((item) => {
          return item.order > 9;
        }).value();
      this.record.status = CommonSettings.SNZ_STATUS_COMMON[this.record.status];
      this.$set(this.record, 'total_point', totalPoint);
      this.$set(this.record, 'pefect_point', perfectPoint);
    },
    handleDelete() {
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then((rs) => {
        studentRecord.destroy(this.id).then(response => {
          this.$message({
            type: 'success',
            message: '削除しました。',
          });
          const query = _.pickBy(this.$route.params.query, function(value, key) {
            return !(value === undefined || value === null || value === '');
          });
          this.redirectPage({ 'name': 'student_record', params: { redirect: true }, query: query });
        }).catch(err => {
          console.log(err.response.status);
          if (err.response.status === 410) {
            this.$router.push({ name: 'err_404' });
          }
        });
      }).catch(() => {});
    },
  },

};
</script>

<style lang="scss" scoped>
.el-form{
  height: calc(100% - 110px);
  overflow: hidden;
  background: #fff;
}
h1{
  font-size: 26px;
}
.page-title{
  text-align: right;
  font-size: 14px;
  padding-top: 28px;
}
/deep/ .scroll-content{
    height: calc(100% - 50px);
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
  .student-record__item{
    .box-card::v-deep{
      border-bottom: 1px solid #D6D6D6;
      &:last-child{
        border-bottom: none;
      }
      border-top: none;
      margin-bottom: 0px;
      .el-form-item{
        margin-bottom: 20px;
      }
      .el-form-item label.el-form-item__label
      {
        text-align: right;
        padding-right: 14px !important;
        padding-left: 0px;
      }
      .el-input{
        width: 213px !important;
        line-height: 36px;
        height: 36px;
        border-radius: 6px!important;
        &:disabled{
          background: #F0F0F0 0% 0% no-repeat padding-box;
        }
      }
      .el-card__body{
        padding: 20px 30px;
      }
      .card-header{
        margin-bottom: 20px;
        span {
          font-size: 18px;
          font-weight: 500 !important;
          color: #1a1714;
          font-family: Noto Sans JP, sans-serif;
        }
      }
    }

  }
</style>
