<template>
  <div class="student-detail">
    <div class="card-body">
      <h3>
        全般
      </h3>
      <!-- FIRST ROW -->
      <el-form ref="formData" label-width="125px" class="form-update search" :model="formData" :rules="rules">
        <!-- FIRST ROW -->
        <el-row type="flex" justify="left" style="margin-left: 24px;">
          <el-col :span="8">
            <el-form-item prop="snz_name" label="学校名">
              <el-input v-model="formData.snz_name" style="width: 263px;" clearable placeholder="" @change="handleChange('snz_name')" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="学校種別">
              <el-select v-model="formData.snz_school_type_id" clearable no-data-text="データはありません。" placeholder="">
                <el-option
                  v-for="item in schoolOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="学期区分">
              <el-select v-model="formData.snz_semester" clearable no-data-text="データはありません。" placeholder="">
                <el-option
                  v-for="item in semesters"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <el-row type="flex" justify="left" style="margin-left: 24px; margin-top: -10px;">
          <el-col :span="8">
            <el-form-item prop="snz_schoolcode" label="学校コード">
              <input-number
                v-model="formData.snz_schoolcode"
                placeholder=""
                style="width: 263px"
                @onChange="handleChange('snz_schoolcode')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- END FIRST ROW -->
    </div>
  </div>
</template>
<script>
import { validate } from '../assets/validate';
import CalendarPatternRequest from '../../../api/CalendarPatternRequest';
import InputNumber from '../../../components/Common/InputNumber';
const calendarPatternRequest = new CalendarPatternRequest();
export default {
  components: { InputNumber },
  mixins: [validate],
  props: {
    school: {
      type: Object,
      default() {
        return {};
      },
    },
    schoolOptions: {
      type: Array,
      default() {
        return {};
      },
    },
    semesters: {
      type: Array,
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
        school_type: null,
        snz_semester: null,
        snz_schoolcode: '',
      },
    };
  },
  watch: {
    $props: {
      handler() {
        this.formData = this.school;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
  },
  methods: {
    async getOptionCalendar(query) {
      return calendarPatternRequest.searchName(query);
    },
    handleChange(prop) {
      this.$refs.formData.clearValidate(prop);
    },
  },
};
</script>
<style lang="scss" scoped>

/deep/ .w-370 .icon-input__calendar + .el-form-item__error {
  letter-spacing: -1px;
}

/deep/ .w-370 .el-form-item__content {
  width: 370px;
}

/deep/ .w-285 {
  margin-left: 10px;

  .el-form-item__content {
    width: 285px;
  }
}

.block_1::v-deep{
  height: 100%;
  font: normal normal normal 14px Noto Sans JP;
  padding-top: 10px;
  .block-title{
    font: normal normal normal 18px/45px Noto Sans JP;
    font-weight: 500 !important;
    letter-spacing: 0.29px;
    color: #1A1714;
    margin-left: 30px;
    font-weight: bold;
  }
  .form-update{
    margin-top: 25px;
  }
  .el-col-7 .el-select .el-input{
    width: 225px;
  }
  .el-form-item__label{
    font: normal normal normal 14px Noto Sans JP;
    padding: 0 10px 0 0;
    font-weight: 400;
  }
  .el-form-item__label:before{
    font-size: 18px;
  }
}

</style>
