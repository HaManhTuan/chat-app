<template>
  <div class="body-content">
    <div class="block_1 search-container">
      <el-form
        ref="formData"
        :model="formData"
        :rules="searchRules"
        class="form-update search"
      >
        <span class="block-title">
          全般
        </span>
        <!-- FIRST ROW -->
        <el-row
          type="flex"
          justify="left"
          style="padding-top: 13px;height: 50px;"
        >
          <el-col :span="8">
            <el-form-item prop="snz_name" label="学年名" label-width="124px">
              <el-input v-model="formData.snz_name" clearable placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="snz_actualgrade"
              label="実学年"
              label-width="125px"
            >
              <el-select
                v-model="formData.snz_actualgrade"
                placeholder=""
                clearable
                filterable
                remote
                :remote-method="searchGradeActual"
                :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                @change="change"
                @focus="focus"
                @visible-change="visible"
              >
                <el-option
                  v-for="(item, index) in actualGradeOptions"
                  :key="index"
                  :label="item"
                  :value="Number(index)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="snz_next_grade_id"
              label="次学年"
              label-width="103px"
            >
              <SearchSelectBox
                v-model="formData.snz_next_grade_id"
                placeholder=""
                :search-function="searchGrade"
                key-name="snz_name"
                :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          type="flex"
          class="bot"
          justify="left"
          style="margin-top: 13px;"
        >
          <el-col :span="8">
            <el-form-item
              prop="snz_gradecode"
              label="学年コード"
              label-width="124px"
            >
              <el-input
                v-model="formData.snz_gradecode"
                clearable
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="priority_display"
              label="選択フィルター"
              label-width="124px"
            >
              <el-select
                v-model="formData.priority_display"
                placeholder=""
                clearable
                :no-data-text="CommonTxt.selectboxEmptyTxt"
              >
                <el-option
                  v-for="(item, index) in gradeFilterOptions"
                  :key="index"
                  :label="item"
                  :value="Number(index)"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="snz_school_type_id"
              label="学校区分"
              label-width="103px"
            >
              <el-select
                v-model="formData.snz_school_type_id"
                class="filterable-select"
                placeholder=""
                clearable
                :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
              >
                <el-option
                  v-for="item in schoolTypeOptions"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          class="bot"
          justify="left"
          style="margin-top: 13px;"
        >
          <div style="display: flex" class="date-range">
            <el-form-item label-width="124px" label="生年月日">
              <el-date-picker
                v-model="formData.start_birthday"
                type="date"
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
                v-model="formData.end_birthday"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                :editable="false"
                prefix-icon="abc"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
              </span>
            </el-form-item>
          </div>
        </el-row>
        <!-- END FIRST ROW -->
      </el-form>
    </div>
  </div>
</template>
<script>
import { validate } from '../../assets/validate.js';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import GradeRequest from '@/api/gradeRequest';
const gradeRequest = new GradeRequest();
export default {
  metaInfo: {
    title: '学年',
  },
  components: {
    SearchSelectBox,
  },
  mixins: [validate],
  props: {
    grade: {
      type: Object,
      default() {
        return {};
      },
    },
    schoolTypeOptions: {
      type: Array,
      default() {
        return [];
      },
    },
    gradeFilterOptions: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {
        id: null,
        snz_name: '',
        snz_actualgrade: '',
        snz_next_grade_id: '',
        snz_gradecode: '',
        priority_display: '',
        snz_school_type_id: '',
        start_birthday: null,
        end_birthday: null,
      },
      actualGradeOptions: [],
      defaultGradeActualOptions: [],
    };
  },
  watch: {
    $props: {
      handler() {
        this.formData.id = this.grade.id;
        this.formData.snz_name = this.grade.snz_name;
        this.formData.snz_actualgrade = this.grade.snz_actualgrade;
        this.formData.snz_next_grade_id = this.grade.snz_next_grade_id;
        this.formData.snz_gradecode = this.grade.snz_gradecode;
        this.formData.priority_display = this.grade.priority_display;
        this.formData.snz_school_type_id = this.grade.snz_school_type_id;
        this.formData.start_birthday = this.grade.start_birthday;
        this.formData.end_birthday = this.grade.end_birthday;
      },
      deep: true,
      immediate: true,
    },
  },
  async created() {
    this.actualGradeOptions = await gradeRequest.fetchActualGrade();
    this.defaultGradeActualOptions = this.actualGradeOptions;
  },
  methods: {
    async searchGrade(query) {
      const params = {
        master_grade_screen: 1,
        not_id: null,
      };
      if (typeof this.$route.params.id !== 'undefined') {
        params.not_id = this.$route.params.id;
      } else {
        params.not_id = null;
      }
      return await gradeRequest.gradeSearchName({ ...query, ...params });
    },
    async searchGradeActual(query) {
      this.actualGradeOptions = await gradeRequest.gradeActualSearchName({
        name: query,
      });
    },
    focus() {
      this.actualGradeOptions = this.defaultGradeActualOptions;
    },
    change() {
      this.focus();
    },
    visible(show) {
      if (show) {
        this.focus();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.date-range{
  .icon-input__calendar{
    top: 2px;
  }
  .between-date{
    padding: 10px 2px;
  }
}
.block_1::v-deep {
  height: 100%;
  font: normal normal normal 14px;
  padding-top: 19px;
  .block-title {
    font-size: 18px;
    font-weight: 45px;
    letter-spacing: 0.29px;
    color: #1a1714;
    margin-left: 30px;
    font-weight: bold;
  }
  .el-form-item__label {
    font: normal normal normal 14px;
    padding: 0 10px 0 0;
    font-weight: 400;
  }
  .el-form-item__label:before {
    font-size: 18px;
  }
  .el-row {
    .el-col-8:nth-child(1) {
      width: 389px;
    }
    .el-col-8:nth-child(2) {
      width: 377px;
    }
    .el-col-8:nth-child(3) {
      width: 330px;
    }
  }
  .bot {
    .el-col-8:nth-child(3) {
      .el-form-item__content {
        height: 37.5px;
      }
    }
  }
}
</style>
