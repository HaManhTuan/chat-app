<template>
  <div class="student-detail">
    <el-form ref="formData" label-width="95px" :rules="rules" :model="history">
      <div class="card-body">
        <h3>
          システム
        </h3>
        <!-- FIRST ROW -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="作成日" class="w_input">
              <el-date-picker
                v-model="history.created_at"
                disabled
                prefix-icon="abc"
                type="date"
                format="yyyy/MM/dd"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" />
              </span>
            </el-form-item>
            <el-form-item label-width="95px" label="作成者">
              <el-select
                v-model="history.created_by_user_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.user?history.user:{}]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="113px" label="修正日" class="w_input">
              <el-date-picker
                v-model="history.updated_at"
                disabled
                prefix-icon="abc"
                type="date"
                format="yyyy/MM/dd"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" />
              </span>
            </el-form-item>
            <el-form-item label-width="113px" label="修正者">
              <el-select
                v-model="history.modified_by_user_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [history.edit_user?history.edit_user:{}]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="104px" label="ステータス" prop="status">
              <el-select v-model="history.status" placeholder="">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
      </div>
    </el-form>
  </div>
</template>
<script>
import { CantractHistorySystem } from '@/views/cantractinfo-history/assets/validate';

export default {
  mixins: [CantractHistorySystem],
  props: {
    cantractHistory: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      history: {},
      options: [
        {
          value: 1,
          label: 'アクティブ',
        },
        {
          value: 0,
          label: '非アクティブ',
        },
      ],
    };
  },
  watch: {
    cantractHistory: {
      immediate: true,
      handler(newVal) {
        this.history = newVal;
      },
    },
  },
};
</script>
<style lang="scss" scoped>
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

.student-detail::v-deep {
  .card-body {
    .el-col-8 {
      .el-form-item {
        margin-bottom: 13px;
      }

      .el-form-item__content {
        width: 225px;
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

/deep/ .icon-input__calendar {
  svg {
    font-size: 20px !important;
    vertical-align: -5px;
  }
}
</style>
