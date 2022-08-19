<template>
  <div class="student-detail">
    <el-form ref="formData" label-width="84px" :model="formData" :rules="rules">
      <div class="card-body">
        <h3>
          全般
        </h3>
        <!-- FIRST ROW -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="科目名" prop="snz_name" class="w_input">
              <el-input
                v-model="formData.snz_name"
                clearable
                :maxlength="100"
                @change="handleChange('snz_name')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="97px" label="科目コード" prop="snz_subjectcd" class="subjectcd">
              <half-size-number
                v-model="formData.snz_subjectcd"
                :maxlength="8"
                @onChange="handleChange('snz_subjectcd')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="90px" label="区分">
              <el-select
                v-model="formData.snz_section"
                placeholder=""
                :popper-append-to-body="false"
                popper-class="select-inside-table"
                class="custom-select__caret"
                clearable
              >
                <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <!-- SECOND ROW -->
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="85px" label="開始年月" class="w_input">
              <el-date-picker
                v-model="formData.snz_startmonth"
                prefix-icon="abc"
                format="yyyy/MM"
                type="month"
                value-format="yyyy-MM"
                :editable="false"
                :append-to-body="false"
                popper-class="select-inside-table"
              />
              <span class="icon-input__calendar calendar__able">
                <svg-icon icon-class="_calendar" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="97px" label="終了年月" prop="snz_endmonth">
              <el-date-picker
                v-model="formData.snz_endmonth"
                prefix-icon="abc"
                format="yyyy/MM"
                type="month"
                value-format="yyyy-MM"
                :editable="false"
                :append-to-body="false"
                popper-class="select-inside-table"
                @change="handleChange('snz_endmonth')"
              />
              <span class="icon-input__calendar calendar__able">
                <svg-icon icon-class="_calendar" />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END SECOND ROW -->
      </div>
    </el-form>
  </div>
</template>
<script>
import { SubjectDetail } from '../assets/validate';
import { SectionStatus } from '@/const/SubjectMaster';
import HalfSizeNumber from '@/components/Common/HalfSizeNumber';

export default {
  components: { HalfSizeNumber },
  mixins: [SubjectDetail],
  props: {
    subject: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        snz_name: '',
        snz_subjectcd: '',
        snz_section: '',
        snz_startmonth: '',
        snz_endmonth: '',
      },
      option: SectionStatus,
    };
  },
  watch: {
    subject: {
      immediate: true,
      handler(newVal) {
        this.formData = newVal;
      },
    },
  },
  methods: {
    handleChange(prop) {
      this.$refs.formData.clearValidate(prop);
    },
  },
};
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.icon-input__calendar {
  position: absolute;
  top: 0;
  right: 11px;
  pointer-events: none;
}

.input__error {
  position: absolute;
  top: 100%;
  left: 0;
  color: #C70000;
  padding-left: 4px;
  font-size: 10px !important;
  padding-top: 1px !important;
  line-height: 1;
}

/deep/ .el-form-item__error {
  //letter-spacing: -0.4px;
  position: relative;
}

//
///deep/ .subjectcd {
//  .el-form-item__error {
//    letter-spacing: -2.6px;
//  }
//}

.student-detail::v-deep {
  .card-body {
    .el-col-8 {
      .el-form-item {
        margin-bottom: 13px;
      }

      .el-form-item__content {
        width: 225px;
      }

      .w_input {
        .el-form-item__content {
          width: 263px;
        }
      }

      .select-inside-table {
        width: 100%;

        .el-picker-panel__content {
          width: auto;
        }
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
