<template>
  <div v-if="!loading && form.id">
    <div class="card-body">
      <el-row type="flex" justify="space-between">
        <h3>システム</h3>
      </el-row>
    </div>
    <el-form ref="inputContract" class="form-search" :model="form">
      <div class="card-body">
        <el-row type="flex" justify="start">
          <el-form-item label-width="53px" label="作成日" prop="created_at">
            <el-date-picker
              v-model="form.created_at"
              prefix-icon="abc"
              format="yyyy/MM/dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder=""
              :editable="false"
              disabled
            />
            <span class="icon-input__calendar">
              <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
            </span>
          </el-form-item>
          <el-form-item label-width="162px" label="連携済みフラグ" prop="updated_at">
            <el-select
              v-model="form.snz_state_sentdata"
              placeholder=""
              no-data-text="データはありません。"
              @change="changeSentDataFlag"
            >
              <el-option
                v-for="item in stateSendDataOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label-width="163px" label="ステータス" required>
            <el-select
              v-model="form.status"
              :disabled="disableRole(['parttime', 'employee'])"
              placeholder=""
              no-data-text="データはありません。"
            >
              <el-option
                v-for="item in statusOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="start">
          <el-form-item label-width="53px" label="作成者">
            <SearchSelectBox
              v-model="form.created_by_user_id"
              :search-function="searchUser"
              :default-value="form.create_user"
              :default-data="userOption"
              placeholder=""
              disabled
              :popper-append-to-body="false"
            />
          </el-form-item>
          <el-form-item label-width="162px" label="連携情報変更フラグ">
            <el-select
              v-model="form.snz_state_sentdatapdated"
              placeholder=""
              no-data-text="データはありません。"
              @change="changeSentDataFlag"
            >
              <el-option
                v-for="item in stateSendDataUpdateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label-width="163px" label="模試キャンセル">
            <el-select
              v-model="form.snz_exam_cancel"
              placeholder=""
              no-data-text="データはありません。"
            >
              <el-option :value="0" label="ー" />
              <el-option :value="1" label="✓">
                <span class="el-checkbox__inner" />
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="start">
          <el-form-item label-width="53px" label="修正日" prop="updated_at">
            <el-date-picker
              v-model="form.updated_at"
              prefix-icon="abc"
              value-format="yyyy-MM-dd"
              format="yyyy/MM/dd"
              type="date"
              placeholder=""
              :editable="false"
              disabled
            />
            <span class="icon-input__calendar">
              <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
            </span>
          </el-form-item>
          <el-form-item label-width="162px" label="ブランド区分">
            <el-select
              v-model="form.snz_brand"
              disabled
              placeholder=""
              no-data-text="データはありません。"
            >
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label-width="163px" label="体験処理対象フラグ">
            <el-select
              v-model="form.snz_experienceprocessed"
              placeholder=""
              no-data-text="データはありません。"
            >
              <el-option :value="0" label="ー" />
              <el-option :value="1" label="✓">
                <span class="el-checkbox__inner" />
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="start">
          <el-form-item label-width="53px" label="修正者">
            <SearchSelectBox
              v-model="form.modified_by_user_id"
              :search-function="searchUser"
              :default-value="form.edit_user"
              :default-data="userOption"
              placeholder=""
              disabled
              :popper-append-to-body="false"
            />
          </el-form-item>
          <el-form-item label-width="162px" label="保留フラグ">
            <el-select
              v-model="form.snz_application_pending_flag"
              disabled
              placeholder=""
              no-data-text="データはありません。"
            >
              <el-option :value="0" label="ー" />
              <el-option :value="1" label="✓">
                <span class="el-checkbox__inner" />
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>

import UserResource from '@/api/user';
import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';
import loadmore from '@/directive/selection';
import { options as brandOptions } from '@/const/BrandOption';
import { stateSendDataOptions, stateSendDataUpdateOptions } from '@/const/CantractInfo';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import { InputCantractInfoMixin } from '@/views/cantractinfo/mixins/InputCantractInfo';

const userResource = new UserResource();

export default {
  name: 'System',
  metaInfo: {
    title: '受講情報詳細',
  },
  directives: { permission, role, loadmore },
  components: { SearchSelectBox },
  filters: {
  },
  mixins: [InputCantractInfoMixin],
  props: {
    form: {
      type: Object,
      required: true,
    },
    disabledField: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      statusOption: [
        {
          value: 1,
          label: 'アクティブ',
        },
        {
          value: 0,
          label: '非アクティブ',
        },
      ],
      brandOptions: brandOptions,
      stateSendDataUpdateOptions: stateSendDataUpdateOptions,
      stateSendDataOptions: stateSendDataOptions,
      originForm: null,
      gradeOptions: [],
      loadMore: {
        create_user_option: { query: null, page: 1 },
        edit_user_option: { query: null, page: 1 },
        create_on_be_haft_user_option: { query: null, page: 1 },
        edit_on_be_haft_user_option: { query: null, page: 1 },
      },
      loading: false,
      disableAll: false,
      userOption: [],
    };
  },
  computed: {
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      await this.detailModel();
      this.loading = false;
    },
    async searchUser(params) {
      if (!_.isEmpty(params)) {
        return await userResource.searchName(params);
      }
    },
    async detailModel() {
      this.originForm = JSON.parse(JSON.stringify(this.form));
      if (this.form.create_user) {
        var userOptions = [this.form.create_user];
      }
      if (this.form.edit_user) {
        userOptions.push(this.form.edit_user);
      }
      this.userOption = userOptions;
    },
    async changeSentDataFlag() {
      this.$emit('changeDisableField');
    },
  },
};
</script>
<style lang="scss" scoped>
.icon-input__calendar {
  position: absolute;
  top: 8px;
  right: 11px;
  pointer-events: none;
  svg {
    font-size: 20px !important;
  }
}
.el-row::v-deep {
  .no-border {
    input.el-input__inner {
      background: #F0F0F0 0 0 no-repeat padding-box;
      border-radius: 6px !important;
      border: none !important;
    }

    ::placeholder {
      text-align: left;
      font: normal normal normal 15px/45px Noto Sans JP;
      letter-spacing: 0.24px;
      color: #7B7B7B !important;
      opacity: 1;
    }
  }
}
</style>
<style lang="scss" scoped>
@import './resources/js/views/cantractinfo/styles/detail.scss';
</style>
