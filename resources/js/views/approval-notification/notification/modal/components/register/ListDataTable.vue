<template>
  <div class="page-body">
    <!-- TABLE -->
    <el-form ref="tableForm" :model="tableForm">
      <el-table
        :key="keyComponent"
        ref="singleTable"
        v-loading="listLoading"
        class="block-table editable-table"
        :data="tableForm.list"
        fit
        height="100%"
        highlight-current-row
        style="width: 100%"
        :cell-style="tableRowStyle"
        :header-cell-style="tableHeaderColor"
        :empty-text="CommonTxt.tableEmptyTxt"
      >
        <!-- STUDENT NAME -->
        <el-table-column label="生徒氏名" min-width="70px" fixed>
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{ scope.row.student.fullname | filterBlank }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END STUDENT NAME -->
        <!-- APPLICATION DATE -->
        <el-table-column label="申請日" min-width="60px">
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{ scope.row.created_at | filterBlank | formatDate }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END APPLICATION DATE -->
        <!-- CATEGORY -->
        <el-table-column label="カテゴリ" min-width="60px">
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{
                  scope.row.snz_application_category
                    | filterCategory
                    | filterBlank
                }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END CATEGORY -->
        <!-- COURSE -->
        <el-table-column width="100px">
          <template slot="header">コース</template>
          <template slot-scope="scope">
            <el-form-item>
              <span v-if="scope.row.course" class="ellipsis">
                {{ scope.row.course.snz_name }}
              </span>
              <span v-else>
                ー
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END COURSE -->

        <!-- YEAR ROUND APPLICATION -->
        <el-table-column label="通年申請" width="100px">
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{ scope.row.year_round_application | filterBlank }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END YEAR ROUND APPLICATION -->

        <!-- REQUEST FROM BUSINESS -->
        <el-table-column label="申請校舎" min-width="70px">
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{ scope.row.request_from_business.name | filterBlank }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END REQUEST FROM BUSINESS -->

        <!-- APPLICANT -->
        <el-table-column label="申請者" min-width="70px">
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{ scope.row.application_created_user.name | filterBlank }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END APPLICANT -->

        <!-- PROCESSING STATUS -->
        <el-table-column label="処理ステータス" min-width="100px">
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{ scope.row.snz_approve_status | filterStatus | filterBlank }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END PROCESSING STATUS -->
        <!-- DETAIL BUTTON -->
        <el-table-column
          label="詳細"
          width="102px"
          align="center"
        >
          <template slot-scope="scope">
            <el-form-item class="flex justify-content-center align-item-center">
              <el-button
                round
                type="text"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                class="btn__action"
                size="mini"
                @click="handleClickDetail(scope.row.id)"
              >
                確認
              </el-button>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END DETAIL BUTTON -->
      </el-table>
    </el-form>
    <!-- END TABLE -->
    <!-- FOOTER -->
    <div class="footer">
      <el-row class="footer__group">
        <el-col :span="24">
          <CustomPagination
            v-show="listQuery.last_page > 1 && tableForm.list.length > 0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            layout="prev, pager, next"
            prev-text="<"
            next-text=">"
            class="text-center custom-pagination"
            @pagination="getList(paramsSearch)"
          />
        </el-col>
      </el-row>
    </div>
    <!-- END FOOTER -->
    <Detail
      :id="dialog.id"
      :show-dialog="dialog.showDialog"
      @close="dialog.showDialog = false"
    />
  </div>
</template>

<script>
import { getList } from '../../../mixins/modal/register/list/getList';
import { eventsDetail } from '../../../mixins/modal/register/list/eventsDetail';
import { filter } from '../../../mixins/filter';
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import Detail from '../../dialog/register/Detail.vue';

export default {
  name: 'ListDataTable',
  components: { CustomPagination, Detail },
  mixins: [getList, eventsDetail, filter],
  props: {
    paramsSearch: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      keyComponent: 0,
      showModel: false,
    };
  },
  methods: {
    tableHeaderColor() {
      return 'background-color: #535353;color:#fff;padding-left:10px';
    },
    tableRowStyle() {
      return 'padding-left:10px';
    },
    needUpdate() {
      this.keyComponent++;
      this.getList(this.paramsSearch);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../styles/modal/register/list-area.scss';
</style>
