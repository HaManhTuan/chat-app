<template>
  <div class="page-body">
    <!-- TABLE -->
    <el-form ref="tableForm" :model="tableForm">
      <el-table
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
        @selection-change="handleSelectionChange"
      >
        <!-- SELECTION -->
        <el-table-column
          type="selection"
          width="45px"
          fixed
          :selectable="checkboxSelectable"
        />
        <!-- END SELECTION -->
        <!-- FULLNAME -->
        <el-table-column label="生徒氏名" min-width="116px">
          <template slot-scope="scope">
            <el-form-item>
              <span class="ellipsis">
                {{ scope.row.contact.student.fullname }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END FULLNAME -->
        <!-- STUDENT CODE -->
        <el-table-column label="生徒コード" min-width="87px">
          <template slot-scope="scope">
            <el-form-item>
              <span>{{ scope.row.snz_studentcode }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END STUDENT CODE -->
        <!-- SCHOOL YEAR -->
        <el-table-column label="年度" min-width="56px">
          <template>
            <el-form-item>
              <span>
                {{ schoolYearProp }}
              </span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END SCHOOL YEAR -->
        <!-- GRADE -->
        <el-table-column label="学年" min-width="66px">
          <template slot-scope="scope">
            <el-form-item>
              <span>{{ scope.row.update_grade.snz_name }}</span>
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END GRADE -->
        <!-- UPDATE STATUS -->
        <el-table-column min-width="77px">
          <template slot="header">年次<br>更新状況</template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_update`"
              :rules="rules.snz_update"
              :show-message="showError"
              :error="getErrorPayload('update_status', scope.$index)"
            >
              <SelectBox
                v-model="scope.row.snz_update"
                :options="selectBox.updateStatus"
                :row="scope.row"
                :popper-class="'select-inside-table'"
                :filterable="true"
                :placeholder="'ー'"
                :key-label="'label'"
                :key-value="'value'"
                :disabled="disableRole(['viewonly', 'callcenter'])"
                @onChange="handleChangeUpdateStatus"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END UPDATE STATUS -->
        <!-- UPDATE BUSINESS -->
        <el-table-column min-width="97px">
          <template slot="header">年次更新校舎</template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_update_businessunit_id`"
              :rules="rules.snz_update_businessunit_id"
              :show-message="showError"
              :error="getErrorPayload('update_business_unit_id', scope.$index)"
            >
              <SelectBox
                v-model="scope.row.snz_update_businessunit_id"
                :options="selectBox.businessUnit"
                :row="scope.row"
                :popper-class="'select-inside-table'"
                :filterable="true"
                :placeholder="'ー'"
                :key-label="'name'"
                :key-value="'id'"
                :disabled="
                  disableRole(['viewonly', 'callcenter']) ||
                    scope.row.disable.snz_update_businessunit_id
                "
                :auto-size="true"
                @onChange="handleChangeBusinessUnit"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END UPDATE BUSINESS -->
        <!-- UPDATE COURSE -->
        <el-table-column min-width="110px">
          <template slot="header">年次更新コース</template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_update_course_id`"
              :rules="rules.snz_update_course_id"
              :show-message="showError"
              :error="getErrorPayload('update_course_id', scope.$index)"
            >
              <SelectBox
                v-model="scope.row.snz_update_course_id"
                :options="scope.row.option_course_of_student"
                :row="scope.row"
                :popper-class="'select-inside-table'"
                :filterable="true"
                :placeholder="'ー'"
                :key-label="'snz_name'"
                :key-value="'id'"
                :disabled="
                  disableRole(['viewonly', 'callcenter']) ||
                    scope.row.disable.snz_update_course_id
                "
                :auto-size="true"
                @onChange="handleChangeCourse"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END UPDATE COURSE -->
        <!-- UPDATE SUBJECT SET -->
        <el-table-column min-width="120px">
          <template slot="header">年次更新科目セット</template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.snz_update_subject_set_id`"
              :rules="rules.snz_update_subject_set_id"
              :show-message="showError"
              :error="getErrorPayload('update_subject_set_id', scope.$index)"
            >
              <SelectBox
                v-model="scope.row.snz_update_subject_set_id"
                :options="scope.row.option_subject_set_of_student"
                :popper-class="'select-inside-table'"
                :filterable="true"
                :placeholder="'ー'"
                :key-label="'snz_display_name'"
                :key-value="'id'"
                :disabled="
                  disableRole(['viewonly', 'callcenter']) ||
                    scope.row.disable.snz_update_subject_set_id
                "
                :auto-size="true"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END SUBJECT SET -->
        <!-- UPDATE MAIN SCHOOL -->
        <el-table-column min-width="97px">
          <template slot="header">年次更新学校</template>
          <template slot-scope="scope">
            <el-form-item>
              <SelectBox
                v-model="scope.row.snz_update_main_school_id"
                :options="
                  selectBox.school[scope.row.update_grade.snz_school_type_id]
                "
                :popper-class="'select-inside-table'"
                :filterable="true"
                :clearable="true"
                :placeholder="'ー'"
                :key-label="'snz_name'"
                :key-value="'id'"
                :disabled="
                  disableRole(['viewonly', 'callcenter']) ||
                    scope.row.disable.snz_update_main_school_id
                "
                :auto-size="true"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END UPDATE MAIN SCHOOL -->
        <!-- ENDREASON -->
        <el-table-column min-width="97px">
          <template slot="header">終了理由</template>
          <template slot-scope="scope">
            <el-form-item>
              <SelectBox
                v-model="scope.row.snz_endreason"
                :options="selectBox.reason"
                :popper-class="'select-inside-table'"
                :filterable="true"
                :clearable="true"
                :placeholder="'ー'"
                :key-label="'label'"
                :key-value="'value'"
                :disabled="
                  disableRole(['viewonly', 'callcenter']) ||
                    scope.row.disable.snz_endreason
                "
                :auto-size="true"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END ENDREASON -->
        <!-- UPDATE ENDREASON2 -->
        <el-table-column min-width="97px">
          <template slot="header">終了理由その他</template>
          <template slot-scope="scope">
            <el-form-item
              :prop="`list.${scope.$index}.end_reason_2`"
              :rules="rules.end_reason_2"
              :show-message="showError"
              :error="getErrorPayload('end_reason_2', scope.$index)"
            >
              <el-input
                v-model="scope.row.snz_endreason2"
                placeholder="ー"
                clearable
                :disabled="
                  disableRole(['viewonly', 'callcenter']) ||
                    scope.row.disable.snz_endreason2
                "
              />
            </el-form-item>
          </template>
        </el-table-column>
        <!-- END ENDREASON2 -->
      </el-table>
    </el-form>
    <!-- END TABLE -->
    <!-- FOOTER -->
    <div class="footer">
      <el-row class="footer__group">
        <el-col :span="6" />
        <el-col :span="12">
          <CustomPagination
            v-show="listQuery.last_page > 1"
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
        <el-col :span="6">
          <div class="group-button">
            <ButtonExport
              :loading="exportLoading"
              :disabled="
                exportLoading || disableRole(['viewonly', 'callcenter'])
              "
              type="excel"
              @export="handleExport"
            />
            <ButtonSave
              :loading="saveLoading"
              :disabled="disableRole(['viewonly', 'callcenter'])"
              @save="saveTable"
            />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- END FOOTER -->
  </div>
</template>

<script>
import CustomPagination from '@/components/Common/Pagination/CustomPagination';
import SelectBox from './SelectBox';
import ButtonExport from '@/components/Common/Button/ButtonExport';
import ButtonSave from '@/components/Common/Button/ButtonSave';

import { Validation } from '../assets/validate';

import { studentStatusLabel } from '@/filters/studentStatus';
import { filterUpdateStatus } from '@/helpers/mixins/Contact';

import { ErrorMixin } from '../mixins/list/ErrorMixin';
import { ChangeMixin } from '../mixins/list/ChangeMixin';
import { FetchDataMixin } from '../mixins/list/FetchDataMixin';
import { GetListMixin } from '../mixins/list/GetListMixin';
import { SaveMixin } from '../mixins/list/SaveMixin';
import { BeforeLeave } from '../mixins/list/BeforeLeaveMixin';
import { ExportMixin } from '../mixins/list/ExportMixin';
import { TableMixin } from '../mixins/list/TableMixin';
import permission from '@/directive/permission/index.js';
import role from '@/directive/role/index.js';

export default {
  name: 'ListDatatable',
  directives: { permission, role },

  components: { ButtonExport, ButtonSave, CustomPagination, SelectBox },
  filters: {
    getStatusLabel: studentStatusLabel,
    filterUpdateStatus: filterUpdateStatus,
  },
  mixins: [
    Validation,
    ErrorMixin,
    ChangeMixin,
    FetchDataMixin,
    GetListMixin,
    SaveMixin,
    BeforeLeave,
    ExportMixin,
    TableMixin,
  ],
  props: {
    paramsSearch: { type: Object, default: null },
    exportLoading: { type: Boolean, default: false },
    schoolYearProp: { type: Number, default: null },
  },
  data() {
    return {
      showError: true,
      errors: [],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        last_page: 1,
      },
      total: 0,
    };
  },

  methods: {
    checkboxSelectable(row, index) {
      return this.disableRole(['viewonly', 'callcenter']) === false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/list.scss';
</style>
