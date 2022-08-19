<template>
  <div class="student-detail">
    <div class="card-body">
      <h3>
        科目
      </h3>
      <el-form ref="tableForm" :model="tableForm">
        <el-table
          v-loading="listLoading"
          class="table-content editable-table"
          :data="tableForm.data"
          row-key="id"
          height="calc(100% - 0px)"
        >
          <el-table-column width="240px" label="科目">
            <template slot-scope="scope">
              <el-form-item
                :ref="`subject_${scope.$index}`"
                :prop="`data.${scope.$index}.snz_subject_id`"
                :rules="rules.snz_subject_id"
              >
                <search-select-box
                  v-model="scope.row.snz_subject_id"
                  :search-function="searchSubjectMst"
                  :default-data="defaultSubjectMst"
                  :default-value="scope.row.subject_mst"
                  placeholder=""
                  key-name="snz_name"
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                  class="custom-select__caret"
                  @onChange="handleChange(`data.${scope.$index}.snz_subject_id`)"
                  @visibleChange="visible($event,`subject_${scope.$index}`)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="240px" label="デフォルト選択">
            <template slot-scope="scope">
              <el-form-item>
                <el-select
                  v-model="scope.row.snz_default_section"
                  filterable
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                >
                  <el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="240px" label="開始月">
            <template slot-scope="scope">
              <el-form-item
                :ref="`start_${scope.$index}`"
                :prop="`data.${scope.$index}.snz_startmonth_period_id`"
                :rules="rules.snz_startmonth_period_id"
              >
                <search-select-box
                  :ref="`targetPeriod${scope.$index}`"
                  v-model="scope.row.snz_startmonth_period_id"
                  :search-function="searchTargetPeriod"
                  :default-data="defaultTargetPeriod"
                  :default-value="scope.row.start_month_period"
                  :append-query="{pattern_id:subjectRegisters.snz_calendar_pattern_id}"
                  placeholder=""
                  key-name="snz_name"
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                  class="custom-select__caret"
                  @onChange="handleChange(`data.${scope.$index}.snz_startmonth_period_id`)"
                  @visibleChange="visible($event,`start_${scope.$index}`)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="240px" label="終了月">
            <template slot-scope="scope">
              <el-form-item
                :ref="`end_${scope.$index}`"
                :prop="`data.${scope.$index}.snz_endmonth_period_id`"
                :rules="rules.snz_endmonth_period_id"
              >
                <search-select-box
                  :ref="`endPeriod${scope.$index}`"
                  v-model="scope.row.snz_endmonth_period_id"
                  :search-function="searchTargetPeriod"
                  :default-data="defaultTargetPeriod"
                  :default-value="scope.row.end_month_period"
                  :append-query="{pattern_id:subjectRegisters.snz_calendar_pattern_id}"
                  placeholder=""
                  key-name="snz_name"
                  popper-class="select-inside-table"
                  :popper-append-to-body="false"
                  class="custom-select__caret"
                  @onChange="handleChange(`data.${scope.$index}.snz_endmonth_period_id`)"
                  @visibleChange="visible($event,`end_${scope.$index}`)"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" label="削除" width="35px">
            <template slot-scope="scope">
              <el-button v-if="scope.$index !==0" class="btn-delete" @click="deleteRow(scope.$index)">
                <svg-icon icon-class="_trash" />
              </el-button>
            </template>
          </el-table-column>
          <template slot="append">
            <tr>
              <td rowspan="4" style="padding: 0">
                <el-button icon="el-icon-circle-plus" class="add" @click="addRow">
                  科目を追加
                </el-button>
              </td>
            </tr>
          </template>
        </el-table>
      </el-form>
    </div>
  </div>
</template>
<script>
import ContractSubjectMstResource from '../../../api/contractSubjectMst';
import SearchSelectBox from '../../../components/Common/SearchSelectBox';
import { SubjectSetDetail } from '@/views/subject-set/assets/validate';
import TargetPeriodRequest from '@/api/TargetPeriodRequest';

const targetPeriodRequest = new TargetPeriodRequest();
const contractSubjectMstResource = new ContractSubjectMstResource();
export default {
  components: { SearchSelectBox },
  mixins: [SubjectSetDetail],
  props: {
    subjectRegisters: {
      type: Object,
      required: true,
    },
    defaultSubjectMst: {
      type: Array,
      require: true,
      default: () => {
        return [];
      },
    },
    defaultTargetPeriod: {
      type: Array,
      require: true,
      default: () => {
        return [];
      },
    },
    listLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tableForm: {
        data: [],
      },
      showError: false,
      remoteSubjectMst: false,
      option: [
        {
          value: 1,
          label: '◯',
        },
        {
          value: 0,
          label: 'Ｘ',
        },
      ],
    };
  },
  watch: {
    $props: {
      handler() {
        this.tableForm.data = this.subjectRegisters.contract_subject_mst_subject_sets;
        if (this.tableForm.data.length === 0) {
          this.addRow();
        }
      },
      deep: true,
      immediate: true,
    },

  },
  methods: {
    searchSubjectMst(query) {
      return contractSubjectMstResource.searchName(query);
    },
    searchTargetPeriod(query) {
      return targetPeriodRequest.searchName(query);
    },
    addRow() {
      const data = {
        snz_subject_id: '',
        snz_default_section: 1,
        snz_startmonth_period_id: '',
        snz_endmonth_period_id: '',
      };
      this.tableForm.data.push(data);
    },
    deleteRow(index) {
      this.tableForm.data.splice(index, 1);
    },
    handleChange(prop) {
      this.$refs.tableForm.clearValidate(prop);
    },
    visible(show, ref) {
      if (this.$refs[ref].validateState === 'error') {
        const cl = this.$refs[ref].$el.querySelector('.el-form-item__error');
        if (show) {
          cl.style.visibility = 'hidden';
        } else {
          cl.style.visibility = '';
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/deep/ .el-table__body-wrapper {
  overflow-y: auto;
}

/deep/ .select-inside-table {
  .el-select-dropdown__item {
    width: 225px;
  }
}

/deep/ .bg-input__error {
  .el-input__inner {
    border-color: #ff4949 !important;
    background-color: #F7A1A4;
  }
}

/deep/ .el-form-item.is-error:hover {
  .el-form-item__error {
    visibility: visible;
    width: 1000px;
    z-index: 10000;
  }
}

/deep/ .el-form-item__error {
  visibility: hidden;
}

/deep/ .editable-table {
  .el-form-item__error {
    width: 100% !important;
  }
}

.app-container {
  .tab-custom {
    .card-body {
      padding: 20px 0 0 30px !important;
    }
  }
}

.input__error {
  position: relative !important;
  top: 100%;
  left: 0;
  color: #C70000;
  padding-left: 4px;
  font-size: 10px !important;
  padding-top: 1px !important;
  line-height: 1;
}

.icon-input__calendar {
  position: absolute;
  top: 0;
  right: 11px;
}

.card-body {
  padding: 20px 35px 0;

  h3 {
    padding-bottom: 10px !important;
  }
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

/deep/ .el-scrollbar__view {
  height: 100%;
}

.student-detail::v-deep {
  height: 100%;

  .el-form {
    height: calc(100% - 31px);
  }

  .card-body {
    height: 100%;

    .el-table__header-wrapper {
      height: 33px;
    }

    .el-form-item__content, {
      width: 225px !important;
    }

    .w-225 {
      width: 225px !important;
      margin-right: 10px;
    }

    .el-form-item {

      margin: 0;
      float: left;
    }
  }

  .cell {
    font-family: Noto Sans JP, sans-serif;
    font-weight: 400;
    padding: 0;
    color: #1a1714 !important;
    height: 49px;
  }

  th, td {
    border: none;
    background: none;
  }

  .el-table {
    &:before {
      display: none;
    }
  }

  table {
    td {
      padding: 0 !important;
    }

    tr:hover > td {
      background: none;
    }

    button.btn-delete {
      width: 36px;
      height: 36px;
      border-radius: 5px;
      padding: 0;
      border: none;
      color: #1467b3;
      vertical-align: middle;

      svg {
        width: 18px;
        height: 18px;
      }

      &:hover {
        opacity: 0.8;
      }
    }

    button.btn-delete {
      background: #f4f8fd;
    }
  }
}

button.add::v-deep {
  margin-top: 0;
  margin-bottom: 33px;
  padding: 5px 20px;
  border-radius: 25px;
  background: #F8F8F8;
  color: #1A1714;
  font-family: Noto Sans JP, sans-serif;
  font-size: 15px;
  width: 994px;
  height: 43px;
  border: 1px solid #D6D6D6;

  &:hover {
    border: 1px solid #D6D6D6;
    opacity: 0.8;
  }

  i {
    vertical-align: middle;
    font-size: 22px;
    color: #1467B3;
  }

  span {
    vertical-align: middle;
    margin-left: 2px;
  }
}
</style>
