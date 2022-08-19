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
            <el-form-item label-width="150px" label="期間名" class="w_input w-370" prop="snz_name">
              <el-input v-model="formData.snz_name" clearable @change="handleChange('snz_name')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="150px" label="年コード" class="w-285" prop="snz_yearcode">
              <input-number v-model="formData.snz_yearcode" :maxlength="4" @onChange="handleChange('snz_yearcode')" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <!-- SECOND ROW -->
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="150px" label="開始日" class="w_input w-370" prop="snz_date_start">
              <el-date-picker
                v-model="formData.snz_date_start"
                prefix-icon="none"
                format="yyyy/MM/dd"
                type="date"
                value-format="yyyy-MM-dd"
                :editable="false"
                :append-to-body="false"
                popper-class="select-inside-table"
                @change="handleChange('snz_date_start')"
              />
              <span class="icon-input__calendar calendar__able">
                <svg-icon icon-class="_calendar" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="150px" label="月コード" class="w-285" prop="snz_monthcode">
              <input-number v-model="formData.snz_monthcode" :maxlength="2" @change="handleChange('snz_monthcode')" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END SECOND ROW -->
        <!-- THIRD ROW -->
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="150px" label="終了日" class="w_input w-370" prop="snz_date_end">
              <el-date-picker
                v-model="formData.snz_date_end"
                prefix-icon="none"
                format="yyyy/MM/dd"
                type="date"
                value-format="yyyy-MM-dd"
                :editable="false"
                :append-to-body="false"
                popper-class="select-inside-table"
                @change="handleChange('snz_date_end')"
              />
              <span class="icon-input__calendar calendar__able">
                <svg-icon icon-class="_calendar" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="150px" label="対象締め年月" class="w-285" prop="snz_closingyearmonth">
              <el-date-picker
                v-model="formData.snz_closingyearmonth"
                prefix-icon="abc"
                format="yyyy/MM"
                type="month"
                value-format="yyyy-MM"
                :editable="false"
                :append-to-body="false"
                popper-class="select-inside-table"
                @change="handleChange('snz_closingyearmonth')"
              />
              <span class="icon-input__calendar calendar__able">
                <svg-icon icon-class="_calendar" />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END THIRD ROW -->
        <!-- FOURTH ROW -->
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="150px" label="カレンダーパターン" class="w_input w-370" prop="snz_calendar_pattern_id">
              <search-select-box
                v-if="typeof $route.params.id === 'undefined' "
                v-model="formData.snz_calendar_pattern_id"
                :search-function="getOptionCalendar"
                :popper-append-to-body="false"
                key-name="snz_name"
                placeholder=""
                popper-class="select-inside-table"
                class="custom-select__caret"
                @onchange="handleChange('snz_calendar_pattern_id')"
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
                  v-for="item in [formData.calendar_pattern?formData.calendar_pattern:{}]"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FOURTH ROW -->
      </div>
    </el-form>
  </div>
</template>
<script>
import { TargetPeriodDetail } from '../assets/validate';
import SearchSelectBox from '../../../components/Common/SearchSelectBox';
import CalendarPatternRequest from '../../../api/CalendarPatternRequest';
import InputNumber from '@/components/Common/InputNumber';

const calendarPatternRequest = new CalendarPatternRequest();
export default {
  components: { InputNumber, SearchSelectBox },
  mixins: [TargetPeriodDetail],
  props: {
    targetPeriod: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        snz_name: '',
        snz_date_start: '',
        snz_date_end: '',
        snz_calendar_pattern_id: '',
        snz_yearcode: '',
        snz_monthcode: '',
        snz_closingyearmonth: '',
      },
    };
  },
  watch: {
    $props: {
      handler() {
        this.formData = this.targetPeriod;
      },
      deep: true,
      immediate: true,
    },
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

/deep/ .el-form-item {
  margin-bottom: 13px;
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
  color: #C70000;
  padding-left: 4px;
  font-size: 10px !important;
  padding-top: 1px !important;
  line-height: 1;
}

/deep/ .w-370 .el-form-item__content {
  width: 370px;

  .select-inside-table {
    width: 100%;

    .el-select-dropdown__item {
      width: 370px;

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

    .el-picker-panel__content {
      width: auto;
    }
  }
}

/deep/ .w-285 {
  margin-left: 10px;

  .el-form-item__content {
    width: 285px;

    .select-inside-table {
      width: 100%;

      .el-picker-panel__content {
        width: auto;
      }
    }
  }
}

.icon-input__calendar {
  pointer-events: none;
}

</style>
