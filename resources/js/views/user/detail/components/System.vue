<template>
  <div class="body-content">
    <el-form ref="formData" class="search card-body scroll-content" label-width="127px" :rules="searchRules" :model="formData">
      <h3>
        システム
      </h3>
      <!-- FIRST ROW -->
      <el-row>
        <el-col :span="8">
          <el-form-item label="作成日">
            <el-date-picker
              v-model="data.created_at"
              format="yyyy/MM/dd"
              value-format="yyyy/MM/dd"
              prefix-icon="abc"
              type="date"
              disabled
              placeholder=""
            />
            <span class="icon-input__calendar calendar__disable">
              <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="修正日">
            <el-date-picker
              v-model="data.updated_at"
              format="yyyy/MM/dd"
              value-format="yyyy/MM/dd"
              prefix-icon="abc"
              type="date"
              disabled
              placeholder=""
            />
            <span class="icon-input__calendar calendar__disable">
              <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="ステータス" prop="status">
            <el-select v-model="formData.status" placeholder="" disabled>
              <el-option
                v-for="item in getStatus"
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
      <el-row>
        <el-col :span="8">
          <el-form-item label="作成者">
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
          <el-form-item label="修正者">
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
        <el-col :span="8">
          <el-form-item label="締め後修正可否フラグ" label-width="150px">
            <el-switch
              v-model="formData.can_change_after_closing_flag"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- END SECOND ROW -->
    </el-form>
  </div>
</template>
<script>
import { validate } from '../../assets/validate';
import UserResource from '@/api/user';
const userResource = new UserResource();
export default {
  mixins: [validate],
  props: {
    user: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      data: {
        created_at: '',
        updated_at: '',
        created_by_user_id: '',
        modified_by_user_id: '',
      },
      formData: {
        status: 1,
        can_change_after_closing_flag: 0,
      },
      saveLoading: false,
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
    user: {
      immediate: true,
      handler(newVal) {
        this.data = newVal;
        this.formData.can_change_after_closing_flag = newVal.can_change_after_closing_flag;
      },
    },
  },
  methods: {
    async searchUser(query) {
      return await userResource.searchName(query);
    },
  },
};
</script>
<style lang="scss" scoped>
.body-content {
  height: calc(100vh - 210px);
  /deep/.scroll-content {
    height: 100%;
  }
}
.f-button{
  padding-top: 23px !important;
  padding-bottom: 25px;
  font-size: 14px;
  span{
    vertical-align: middle !important;
    font-size: 15px;
  }
}
.f-button::v-deep{
  padding-top: 23px;
  padding-bottom: 22px;
  font-size: 14px;
  span{
    vertical-align: middle !important;
  }
}
.icon-input__calendar{
  position: absolute;
  top: 0;
  right: 11px;
  pointer-events: none;
}
.body-content::v-deep {
  .el-form{
    .el-form-item__label{
      font: normal normal normal 14px Noto Sans JP;
      font-weight: 400;
    }
  }
  .card-body{
    h3{
      font-weight: 500 !important;
      padding: 19px 30px;
      margin: 0px;
    }
    .el-col-8{
      .el-form-item{
        margin-bottom: 13px;
      }
      .el-form-item__content{
        width: 225px;
      }
      .el-form-item__label{
        padding: 0 10px 0 0;
      }
    }
    .el-col-10,.el-col-14{
      .el-form-item{
        margin-bottom: 13px;
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
  .group-button {
    text-align: right;
    padding-top: 15px;
    height: 90px;
    background-color: #f0f0f0;
    button {
      border-radius: 100px;
      color: #fff;
      padding: 0 26px;
      height: 45px;
      border: 0px;
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
    }
  }
}
</style>
