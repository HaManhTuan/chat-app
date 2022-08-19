<template>
  <div v-loading="loading" class="body-content">
    <div class="block_1 search-container">
      <el-form ref="formData" :model="formData" :rules="searchRules" class="form-update search">
        <span class="block-title">
          全般
        </span>
        <!-- FIRST ROW -->
        <el-row type="flex" justify="left">
          <el-col class="first-col-row" :span="9">
            <el-form-item prop="snz_name" label="割引名" label-width="122px">
              <el-input v-model="formData.snz_name" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col class="second-col-row" :span="10">
            <el-form-item prop="snz_discountcd" label="割引コード" label-width="192px">
              <half-size-input v-model="formData.snz_discountcd" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="3" />
        </el-row>
        <el-row type="flex" justify="left">
          <el-col class="first-col-row" :span="9">
            <el-form-item prop="snz_headdivision" label="事業本部" label-width="122px">
              <SearchSelectBox
                v-model="formData.snz_headdivision"
                placeholder=""
                :search-function="searchHeadDivision"
                key-name="snz_headdivision"
                key-id="snz_headdivision_code"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                @onChange="getDivision"
              />
            </el-form-item>
          </el-col>
          <el-col class="second-col-row" :span="10">
            <el-form-item prop="snz_area" label="エリア" label-width="192px">
              <SearchSelectBox
                ref="selectArea"
                v-model="formData.snz_area"
                :disabled="areaDisable"
                placeholder=""
                :search-function="searchArea"
                key-name="snz_area"
                key-id="snz_area_code"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                :remove-focus="focusDivision"
                @onChange="getUnit"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="left">
          <el-col class="first-col-row" :span="9">
            <el-form-item prop="snz_divisionnm" label="事業部" label-width="122px">
              <SearchSelectBox
                ref="selectDivision"
                v-model="formData.snz_divisionnm"
                :disabled="divisionDisable"
                :search-function="searchDivision"
                key-name="snz_division"
                key-id="snz_division_code"
                placeholder=""
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                :loading="divisionLoading"
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                :remove-focus="focusDivision"
                @onChange="getArea"
              />
            </el-form-item>
          </el-col>
          <el-col class="second-col-row" :span="10">
            <el-form-item prop="snz_unit_code" label="ユニット" label-width="192px">
              <SearchSelectBox
                ref="selectUnit"
                v-model="formData.snz_unit_code"
                :disabled="unitDisable"
                :search-function="searchUnit"
                key-name="snz_unit"
                key-id="snz_unit_code"
                :no-data-text="CommonTxt.selectboxEmptyTxt"
                popper-class="select-inside-table"
                :popper-append-to-body="false"
                :remove-focus="focusDivision"
                placeholder=""
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="left">
          <el-col class="first-col-row" :span="9">
            <el-form-item label="学年" label-width="122px">
              <el-select
                v-model="formData.grades"
                multiple
                placeholder=""
                class="multiselect"
                filterable
                :no-data-text="CommonTxt.selectboxEmptyTxt"
              >
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.id"
                  :label="item.snz_name"
                  :value="item.id"
                >
                  <span class="select-option">{{ item.snz_name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="second-col-row" :span="10">
            <el-form-item prop="snz_schoolyear" label="年度" label-width="192px">
              <half-size-number v-model="formData.snz_schoolyear" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="first-col-row" :span="9">
            <el-form-item label="有効期限" class="date-picker-item" label-width="122px">
              <el-date-picker
                v-model="formData.expired_date"
                popper-class="select-inside-table"
                :append-to-body="false"
                :editable="false"
                :automatic-dropdown="true"
                format="yyyy/MM/dd"
                value-format="yyyy-MM-dd"
                prefix-icon="abc"
                type="date"
              />
              <span class="icon-input__calendar calendar_able">
                <svg-icon icon-class="_calendar" style="font-size: 18px;" />
              </span>
            </el-form-item>
          </el-col>
          <el-col class="second-col-row" :span="10" />
          <el-col :span="3" />
        </el-row>
        <!-- END FIRST ROW -->
      </el-form>
    </div>
  </div>
</template>
<script>
import { validate } from '../../assets/validate.js';
import HalfSizeNumber from '@/components/Common/InputNumber';
import HalfSizeInput from '@/components/Common/HalfSizeNumber';
import DiscountRequest from '@/api/DiscountRequest';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import loadmore from '@/directive/selection';
const discountRequest = new DiscountRequest();
import GradeRequest from '@/api/gradeRequest';
const gradeRequest = new GradeRequest();
export default {
  metaInfo: {
    title: '割引詳細',
  },
  directives: { loadmore },
  components: {
    HalfSizeNumber,
    HalfSizeInput,
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
      formData: {
        id: null,
        snz_name: '',
        snz_discountcd: null,
        snz_headdivision: null,
        snz_divisionnm: null,
        snz_area: null,
        snz_unit_code: null,
        grades: [],
        snz_schoolyear: '',
        expired_date: '',
      },
      gradeOptions: [],
      pageGrade: 1,
      queryGrade: null,
      divisionLoading: true,
      areaLoading: true,
      loading: true,
      unitLoading: true,
      divisionDisable: true,
      areaDisable: true,
      unitDisable: true,
      focusDivision: false,
    };
  },
  computed: {
    isEditing: function(){
      return !!this.$route.params.id;
    },
  },
  watch: {
    async discount(){
      this.formData.id = this.discount.id;
      this.formData.snz_name = this.discount.snz_name;
      this.formData.snz_discountcd = this.discount.snz_discountcd;
      this.formData.snz_headdivision = this.discount.snz_headdivision;
      this.formData.snz_divisionnm = this.discount.snz_divisionnm;
      this.formData.snz_area = this.discount.snz_area;
      this.formData.snz_unit_code = this.discount.snz_unit_code;
      this.formData.snz_schoolyear = this.discount.snz_schoolyear;
      this.formData.grades = [];
      this.formData.expired_date = this.discount.expired_date ? this.discount.expired_date : '';
      this.discount._grades.forEach((element) => {
        this.formData.grades.push(element.id);
      });
      await this.getOptionGrade();
      if (this.discount.snz_headdivision) {
        this.divisionDisable = false;
        this.$refs.selectDivision.init();
      }
      if (this.discount.snz_divisionnm) {
        this.areaDisable = false;
        this.$refs.selectArea.init();
      }
      if (this.discount.snz_area) {
        this.unitDisable = false;
        this.$refs.selectUnit.init();
      }
      this.loading = false;
      this.divisionLoading = false;
      this.areaLoading = false;
      this.unitLoading = false;
    },
  },
  async created(){
    this.getOptionGrade();
    if (!this.isEditing){
      this.loading = false;
    }
  },
  methods: {
    setNullOrg() {
      this.formData.snz_divisionnm = null;
      this.formData.snz_area = null;
      this.formData.snz_unit_code = null;
    },
    async searchHeadDivision(query){
      return await discountRequest.searchHeadDivisionName(query);
    },
    async searchDivision(query){
      const data = {
        snz_headdivision_code: this.formData.snz_headdivision,
        ...query,
      };
      const res = await discountRequest.searchDivisionName(data);
      return res;
    },
    async searchArea(query){
      const data = {
        snz_headdivision_code: this.formData.snz_headdivision,
        snz_division_code: this.formData.snz_divisionnm,
        ...query,
      };
      const res = await discountRequest.searchAreaName(data);
      return res;
    },
    async searchUnit(query){
      const data = {
        snz_headdivision_code: this.formData.snz_headdivision,
        snz_division_code: this.formData.snz_divisionnm,
        snz_area_code: this.formData.snz_area,
        ...query,
      };
      const res = await discountRequest.searchUnitName(data);
      return res;
    },
    async getDivision(){
      this.divisionLoading = true;
      this.setNullOrg();
      if (!this.formData.snz_headdivision) {
        this.divisionDisable = true;
      } else {
        this.$refs.selectDivision.init();
        this.divisionDisable = false;
        this.divisionLoading = false;
      }
      this.areaDisable = true;
      this.unitDisable = true;
    },
    async getArea(){
      this.areaLoading = true;
      this.unitDisable = true;
      this.formData.snz_area = null;
      this.formData.snz_unit_code = null;
      if (!this.formData.snz_divisionnm) {
        this.areaDisable = true;
      } else {
        this.$refs.selectArea.init();
        this.areaLoading = false;
        this.areaDisable = false;
      }
    },
    async getUnit() {
      this.unitLoading = true;
      this.formData.snz_unit_code = null;
      this.unitDisable = true;
      if (!this.formData.snz_area) {
        this.unitDisable = true;
      } else {
        this.$refs.selectUnit.init();
        this.unitLoading = false;
        this.unitDisable = false;
      }
    },
    async getOptionGrade() {
      this.gradeOptions = await gradeRequest.gradeOptions({
        select_add_id: this.formData.grades,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.block_1::v-deep{
  height: 100%;
  font: normal normal normal 14px Noto Sans JP;
  padding-top: 7px;
  .block-title{
    font: normal normal normal 18px/45px Noto Sans JP;
    letter-spacing: 0.29px;
    color: #1A1714;
    margin-left: 30px;
    font-weight: bold;
  }
  .form-update{
    .el-row{
      height: 50px;
      .el-select__input {
        border: none !important;
      }
      .el-col {
        height: 50px;
      }
      .first-col-row {
        width: 494px;
      }
      .second-col-row {
        width: 479px;
      }
    }
    .icon-input__calendar {
      svg {
        position: absolute;
        top: 9px;
        right: 0px;
      }
    }
    .button-action {
      height: 36px;
      width: 36px;
      border-radius: 6px;
      font-size: 18.22px;
      margin-left: 0px;
    }
    .button-add-org {
      margin-bottom: 24px;
    }
    .multiselect.el-select {
      width: 100% !important;
    }
  }
  .el-form-item__label{
    font: normal normal normal 14px Noto Sans JP;
    padding: 0 10px 0 0;
    font-weight: 400;
  }
  .el-form-item__label:before{
    font-size: 18px;
  }
}
/deep/ .el-select__tags {
  margin-left: 5px;
}
</style>
