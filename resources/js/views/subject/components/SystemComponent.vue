<template>
  <div class="student-detail">
    <el-form ref="formData" label-width="95px" :model="formData" :rules="rules">
      <div class="card-body">
        <h3>
          システム
        </h3>
        <!-- FIRST ROW -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="作成日" class="w_input">
              <el-date-picker
                v-model="data.created_at"
                disabled
                prefix-icon="abc"
                type="date"
                format="yyyy/MM/dd"
              />
              <span class="icon-input__calendar calendar__disable">
                <svg-icon icon-class="_calendar_x" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="113px" label="修正日" class="w_input">
              <el-date-picker
                v-model="data.updated_at"
                disabled
                prefix-icon="abc"
                type="date"
                format="yyyy/MM/dd"
              />
              <span class="icon-input__calendar calendar__disable">
                <svg-icon icon-class="_calendar_x" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="104px" label="ステータス" prop="status">
              <el-select
                v-model="formData.status"
                :popper-append-to-body="false"
                popper-class="select-inside-table"
              >
                <el-option v-for="item in getStatus" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END FIRST ROW -->
        <!-- SECOND ROW -->
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="95px" label="作成者">
              <el-select
                v-model="data.created_by_user_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [data.user?data.user:{}]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="113px" label="修正者">
              <el-select
                v-model="data.modified_by_user_id"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
                filterable
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                disabled
              >
                <el-option
                  v-for="item in [data.edit_user?data.edit_user:{}]"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" />
        </el-row>
        <!-- END SECOND ROW -->
      </div>
    </el-form>
  </div>
</template>
<script>
import { SubjectSystem } from '../assets/validate';
import UserResource from '@/api/user';

const userResource = new UserResource();
export default {
  mixins: [SubjectSystem],
  props: {
    subject: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      data: {},
      formData: {
        status: 1,
      },
      showError: false,
      errors: {},
      option: [
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
  computed: {
    getStatus() {
      return this.option.filter(item => {
        if (typeof this.$route.params.id === 'undefined') {
          return item.value === 1;
        } else {
          return item;
        }
      });
    },
  },
  watch: {
    subject: {
      immediate: true,
      handler(newVal) {
        this.data = newVal;
      },
    },
  },
  methods: {
    showMessageFrontEnd() {
      const err = document.getElementsByClassName('el-form-item__error');
      for (let k = 0; k < err.length; k++) {
        err[k].style.display = 'block';
      }
    },
    async searchUser(query) {
      return await userResource.searchName(query);
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
