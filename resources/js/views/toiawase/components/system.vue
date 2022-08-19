<template>
  <div>
    <div class="card-body">
      <el-row type="flex" justify="space-between">
        <h3>システム</h3>
      </el-row>
    </div>
    <el-form ref="inquiryForm" :rules="rules" class="form-search" :model="form">
      <div class="card-body">
        <el-row type="flex" justify="start">
          <el-form-item label-width="146px" label="作成日" prop="created_at">
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
              <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
            </span>
          </el-form-item>
          <el-form-item label-width="146px" label="修正日" prop="updated_at">
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
              <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
            </span>
          </el-form-item>
          <el-form-item label-width="146px" label="ステータス" required>
            <el-select
              v-model="form.status"
              :disabled="disableRole(['viewonly'])"
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
          <el-form-item label-width="146px" label="作成者">
            <el-select
              v-model="form.created_by_user_id"
              v-loadmore="() => loadMoreUser('create_user_option')"
              :remote-method="data => searchUser(data,form.created_by_user_id, 'create_user_option')"
              :loading="loading"
              filterable
              remote
              clearable
              placeholder=""
              no-data-text="データはありません。"
              disabled
            >
              <el-option
                v-for="item in form.create_user_option"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label-width="146px" label="修正者">
            <el-select
              v-model="form.modified_by_user_id"
              v-loadmore="() => loadMoreUser('edit_user_option')"
              :remote-method="data => searchUser(data, form.modified_by_user_id, 'edit_user_option')"
              :loading="loading"
              filterable
              remote
              clearable
              disabled
              placeholder=""
              no-data-text="データはありません。"
            >
              <el-option
                v-for="item in form.edit_user_option"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>

import ToiawaseResource from '@/api/toiawase';
import UserResource from '@/api/user';
import { StudentDetail } from '../assets/validate';
import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';
import loadmore from '@/directive/selection';

const toiawaseResource = new ToiawaseResource();
const userResource = new UserResource();

export default {
  name: 'System',
  metaInfo: {
    title: '入会前の問合せ詳細',
  },
  directives: { permission, role, loadmore },
  components: {},
  filters: {
  },
  mixins: [StudentDetail],
  props: {
    id: {
      type: [String, Number, Boolean],
      required: false,
      default: null,
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
      form: {},
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
    };
  },
  computed: {
    isCreating(){
      return this.$route.name === 'toiawase-create';
    },
    isEditing(){
      return this.$route.name !== 'toiawase-create';
    },
  },
  created() {
    if (this.isEditing) {
      this.init();
    } else {
      this.statusOption = [
        {
          value: 1,
          label: 'アクティブ',
        },
      ];
      this.form.status = 1;
    }
  },
  methods: {
    async init() {
      this.listLoading = true;
      await this.detailModel();
      this.listLoading = false;
    },
    updateSystem() {
      const form = this.form;
      delete form.edit_on_be_haft_user_option;
      delete form.create_user_option;
      delete form.create_on_be_haft_user_option;
      delete form.edit_user_option;
      return toiawaseResource.updateSystem(this.form.id, form);
    },
    async updateToiawase(redirect = true) {
      try {
        await this.updateSystem();
        this.$message({
          message: '変更しました。',
          type: 'success',
        });
      } finally {
        this.$emit('closeLoading');
      }
    },
    async searchUser(name, id, att) {
      if (name) {
        this.loadMore[att].query = name;
        this.loadMore[att].page = 1;
        const res = await userResource.searchName({ name: name, id: id });
        this.form[att] = res.data;
      }
    },
    async loadMoreUser(att) {
      if (this.loadMore[att].query && this.loadMore[att].page) {
        const res = await userResource.searchName({ name: this.loadMore[att].query, page: this.loadMore[att].page });
        this.form[att] = this.form[att].concat(res.data);
        if (res.current_page >= res.last_page) {
          this.loadMore[att].page = 0;
        }
      }
    },
    async detailModel() {
      const form = await toiawaseResource.systemDetail(this.id);
      this.form = form.original.data;
      this.originForm = JSON.parse(JSON.stringify(form.original.data));
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
