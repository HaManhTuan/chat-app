<template>
  <div class="student-detail">
    <el-form ref="formData" :model="formData" :rules="rules">
      <div class="card-body">
        <h3>
          全般
        </h3>
        <!-- FIRST ROW -->
        <el-row>
          <el-col :span="12">
            <el-form-item
              label-width="136px"
              label="科目セット正式名"
              prop="snz_name"
            >
              <el-input
                v-model="formData.snz_name"
                clearable
                @change="handleChange('snz_name')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="150px"
              label="年度"
              prop="snz_schoolyear"
            >
              <input-number
                v-model="formData.snz_schoolyear"
                :maxlength="4"
                @change="handleChange('snz_schoolyear')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <!-- SECOND ROW -->
        <el-row>
          <el-col :span="12">
            <el-form-item
              label-width="135px"
              label="画面表示名"
              prop="snz_display_name"
            >
              <el-input
                v-model="formData.snz_display_name"
                clearable
                @change="handleChange('snz_display_name')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="150px" label="学年" prop="snz_grade_id">
              <el-select
                v-model="formData.snz_grade_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                class="custom-select__caret"
                @change="handleChange('snz_grade_id')"
              >
                <el-option
                  v-for="item in optionGrades"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END SECOND ROW -->
        <!-- THIRD ROW -->
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="135px" label="ブランド" prop="snz_brand">
              <el-select
                v-model="formData.snz_brand"
                placeholder=""
                clearable
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                class="custom-select__caret"
                @change="handleChange('snz_brand')"
              >
                <el-option
                  v-for="item in optionBrand"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="150px" label="変則受講">
              <el-select
                v-model="formData.snz_update_subject_flag"
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                class="custom-select__caret"
                placeholder=""
              >
                <el-option :value="0" label="ー" />
                <el-option :value="1" label="✓">
                  <span class="el-checkbox__inner" />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END THIRD ROW -->
        <!-- FOUR ROW -->
        <el-row>
          <el-col :span="12">
            <el-form-item
              label-width="135px"
              label="コース"
              prop="snz_course_id"
            >
              <search-select-box
                v-model="formData.snz_course_id"
                :search-function="searchCourse"
                placeholder=""
                key-name="snz_name"
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                class="custom-select__caret"
                @onChange="handleChange('snz_course_id')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="150px"
              label="カレンダーパターン"
              prop="snz_calendar_pattern_id"
            >
              <search-select-box
                v-if="typeof $route.params.id === 'undefined'"
                v-model="formData.snz_calendar_pattern_id"
                :search-function="searchCalendar"
                placeholder=""
                key-name="snz_name"
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                class="custom-select__caret"
                @onChange="getCalendar"
              />
              <el-select
                v-else
                v-model="formData.snz_calendar_pattern_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [
                    formData.calendar_pattern ? formData.calendar_pattern : {},
                  ]"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FOUR ROW -->
      </div>
    </el-form>
  </div>
</template>
<script>
import { SubjectSetDetail } from '../assets/validate';
import SearchSelectBox from '../../../components/Common/SearchSelectBox';
import GradeRequest from '../../../api/gradeRequest';
import CourseResource from '../../../api/CourseRequest';
import CalendarPatternRequest from '../../../api/CalendarPatternRequest';
import { options } from '@/const/BrandOption';
import InputNumber from '@/components/Common/InputNumber';

const calendarPatternRequest = new CalendarPatternRequest();
const courseResource = new CourseResource();
const gradeRequest = new GradeRequest();
export default {
  components: { InputNumber, SearchSelectBox },
  mixins: [SubjectSetDetail],
  props: {
    subjectSet: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        snz_name: '',
        snz_schoolyear: '',
        snz_display_name: '',
        snz_grade_id: '',
        snz_brand: '',
        snz_update_subject_flag: 0,
        snz_course_id: '',
        snz_calendar_pattern_id: '',
        data: [],
        status: 1,
        contract_subject_mst_subject_sets: [],
      },
      optionGrades: [],
      optionBrand: options,
    };
  },
  watch: {
    $props: {
      handler() {
        this.formData = this.subjectSet;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getOptionGrade();
  },
  methods: {
    async getOptionGrade() {
      this.optionGrades = await gradeRequest.gradeOptions({
        subject_set_screen: 1,
      });
    },
    async searchCourse(query) {
      return courseResource.searchName(query);
    },
    async searchCalendar(query) {
      return calendarPatternRequest.searchName(query);
    },
    getCalendar(currentValue) {
      this.$refs.formData.clearValidate('snz_calendar_pattern_id');
      this.formData.snz_calendar_pattern_id = currentValue;
      this.$emit('getCalendar', this.formData.snz_calendar_pattern_id);
    },
    handleChange(prop) {
      this.$refs.formData.clearValidate(prop);
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .select-inside-table {
  .el-select-dropdown__item {
    width: 285px;

    &.selected {
      .el-checkbox__inner {
        &::after {
          border-color: #1890ff;
        }
      }
    }
  }

  .el-scrollbar__wrap {
    overflow: scroll !important;
  }
}

/deep/ .el-form-item__error {
  position: relative;
}

.icon-input__calendar {
  position: absolute;
  top: 0;
  right: 11px;
}

.input__error {
  position: absolute;
  top: 100%;
  left: 0;
  color: #c70000;
  padding-left: 4px;
  font-size: 10px !important;
  padding-top: 1px !important;
  line-height: 1;
}

.student-detail::v-deep {
  .card-body {
    .el-col-12 {
      .el-form-item {
        margin-bottom: 13px;
      }

      .el-form-item__content {
        width: 285px;
      }
    }

    .last-row {
      .el-form-item {
        margin-bottom: 20px;
      }
    }

    &:last-child {
      margin-bottom: 30px;
    }
  }
}
</style>
