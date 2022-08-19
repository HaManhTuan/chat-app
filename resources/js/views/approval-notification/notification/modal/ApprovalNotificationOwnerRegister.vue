<template>
  <div>
    <el-card
      shadow="false"
      :class="{
        rounded: true,
        'search-container': true,
        popper: currentPageRecord > popperMaxRecord,
      }"
    >
      <el-form
        ref="searchForm"
        class="search"
        :model="searchForm"
        label-position="left"
      >
        <!-- TOP ROW -->
        <el-row class="top" justify="space-around" align="middle">
          <!-- STUDENT NAME -->
          <el-col :span="4">
            <el-form-item label-width="55px" label="生徒名">
              <el-input
                v-model="searchForm.studentName"
                maxlength="100"
                placeholder=""
                clearable
              />
            </el-form-item>
          </el-col>
          <!-- END STUDENT NAME -->
          <!-- CATEGORY -->
          <el-col :span="4">
            <el-form-item label-width="67px" label="カテゴリ">
              <el-select
                v-model="searchForm.category"
                multiple
                class="multiselect"
                value-key="value"
                placeholder=""
                loading-text="データなし"
                :no-match-text="CommonTxt.selectboxEmptyTxt"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                clearable
              >
                <el-option
                  v-for="item in selectBoxOption.category"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- END CATEGORY -->
          <!-- START APPLY DATE -->
          <el-col :span="6">
            <el-form-item
              label-width="52px"
              label="申請日"
              prop="startApplyDate"
            >
              <el-date-picker
                v-model="searchForm.startApplyDate"
                prefix-icon="_calendar"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                placeholder="開始日"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :editable="false"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
          <!-- END START APPLY DATE -->
          <!-- END APPLY DATE -->
          <el-col :span="6">
            <el-form-item label-width="25px" label="〜" prop="endApplyDate">
              <el-date-picker
                v-model="searchForm.endApplyDate"
                prefix-icon="_calendar"
                type="date"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                placeholder="終了日"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                :editable="false"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 18px" />
              </span>
            </el-form-item>
          </el-col>
          <!-- END END APPLY DATE -->
          <!-- BUTTON SEARCH -->
          <el-col :span="4" class="search-btn-col">
            <el-form-item label="">
              <span @click="handleSearch">
                <ButtonSearch />
              </span>
            </el-form-item>
          </el-col>
          <!-- END BUTTON SEARCH -->
        </el-row>
        <!-- END TOP ROW -->
      </el-form>
    </el-card>
    <div class="container">
      <ListDataTable
        ref="listDataTableElement"
        :params-search="buildParamsRequest()"
        @setCurrentPageRecord="currentPageRecord = $event"
      />
    </div>
  </div>
</template>

<script>
import CommonSettings from '@/const/CommonSettings';
import { Category } from '@/const/ApprovalNotification/Category';

import ButtonSearch from '@/components/Common/Button/ButtonSearch';
import ListDataTable from './components/register/ListDataTable.vue';

import { validation } from '../asset/register/validation';
import { search } from '../mixins/modal/register/search';
import { handleChange } from '../mixins/modal/register/handleChange';

export default {
  name: 'ApprovalNotificationOwnerRegister',
  components: {
    ButtonSearch,
    ListDataTable,
  },
  mixins: [validation, search, handleChange],
  data() {
    return {
      currentPageRecord: CommonSettings.DEFAULT_PAGE_RECORD,
      selectBoxOption: {
        category: [
          Category.SUBJECT_IRREGULARITIES,
          Category.TRANSFER_OR_CONCURRENT_CRAM_SCHOOL,
        ],
      },
    };
  },
  mounted() {
    this.parseParamUrl();
  },
  methods: {
    parseParamUrl() {
      const queryCamelCase = _.mapKeys(this.$route.query, (value, key) =>
        _.camelCase(key)
      );
      const query = this.buildQuery(queryCamelCase || this.searchForm);
      window.history.replaceState(null, null, `?${query}`);
      this.searchForm = this.copyAttributes(queryCamelCase, this.searchForm);
      if (_.isArray(this.searchForm.category)) {
        this.searchForm.category.map((item, index) => {
          this.searchForm.category[index] = parseInt(item);
        });
      } else {
        const temp = _.clone(this.searchForm.category);
        this.searchForm.category = [];
        this.searchForm.category.push(parseInt(temp));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/common-form.scss';
@import '../styles/modal/register/search-area.scss';
@import '../styles/modal/register/styles.scss';
</style>
