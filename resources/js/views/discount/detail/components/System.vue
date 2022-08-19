<template>
  <div class="student-detail body-content">
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
            <span class="icon-input__calendar">
              <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
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
            <span class="icon-input__calendar">
              <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="ステータス" prop="status">
            <el-select v-model="formData.status" placeholder="">
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
            <search-select-box
              v-model="data.created_by_user_id"
              :search-function="searchUser"
              popper-class="select-inside-table"
              :popper-append-to-body="false"
              placeholder=""
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="修正者">
            <search-select-box
              v-model="data.modified_by_user_id"
              :search-function="searchUser"
              popper-class="select-inside-table"
              :popper-append-to-body="false"
              placeholder=""
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" />
      </el-row>
      <!-- END SECOND ROW -->
    </el-form>
  </div>
</template>
<script>
import { validate } from '../../assets/validate';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import UserResource from '@/api/user';
const userResource = new UserResource();
export default {
  components: {
    SearchSelectBox,
  },
  mixins: [validate],
  props: {
    discount: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      data: {},
      formData: {
        status: 1,
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
    discount: {
      immediate: true,
      handler(newVal) {
        this.data = newVal;
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
.icon-input__calendar{
  position: absolute;
  top: 0;
  right: 11px;
  pointer-events: none;
}
.student-detail::v-deep {
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
}
</style>
