<template>
  <div class="app-container">
    <div class="card-body">
      <el-form v-if="inputForm.id" ref="inputForm" class="search" :rules="rules" :model="inputForm" label-position="left">
        <el-card v-loading="loadingForm" shadow="false" class="search-container container-1">
          <h3 class="mt-0">兄弟情報</h3>
          <el-row class="top">
            <!-- họ -->
            <el-col :span="10" class="el-col-1-t">
              <el-form-item label-width="70px" label="姓" prop="snz_lastname">
                <el-input v-model="inputForm.snz_lastname" :disabled="checkRole(['callcenter','viewonly'],'cant')" placeholder="" clearable @change="onChange()" />
              </el-form-item>
            </el-col>
            <!-- Mối quan hệ người giới thiệu -->
            <el-col :span="10" class="el-col-2-t">
              <el-form-item label-width="95px" label="紹介者続柄" prop="snz_relationship">
                <el-select v-model="inputForm.snz_relationship" :disabled="checkRole(['callcenter','viewonly'],'cant')" placeholder="" clearable>
                  <el-option v-for="item in relaOptions" :key="item.value" :value="item.value" :label="item.label" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="top">
            <!-- tên -->
            <el-col :span="10" class="el-col-1-t">
              <el-form-item label-width="70px" label="名" prop="snz_firstname">
                <el-input v-model="inputForm.snz_firstname" placeholder="" :disabled="checkRole(['callcenter','viewonly'],'cant')" clearable @change="onChange()" />
              </el-form-item>
            </el-col>
            <!-- năm học -->
            <el-col :span="10" class="el-col-2-t">
              <el-form-item label-width="95px" class="el-input-t mb-0" label="学年" prop="snz_grade_id">
                <el-select
                  ref="selectGrade"
                  v-model="inputForm.snz_grade_id"
                  placeholder=""
                  width="174px"
                  :no-data-text="CommonTxt.selectboxEmptyTxt"
                  clearable
                  filterable
                  :disabled="checkRole(['callcenter','viewonly'],'cant')"
                  :change="onChangeSelectBox()"
                >
                  <el-option
                    v-for="item in optionGrades"
                    :key="item.id"
                    :label="item.snz_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="top">
            <!-- Họ katakana -->
            <el-col :span="10" class="el-col-1-t">
              <el-form-item label-width="70px" label="姓カナ" prop="snz_yomilastname">
                <el-input v-model="inputForm.snz_yomilastname" :disabled="checkRole(['callcenter','viewonly'],'cant')" placeholder="" clearable @change="onChange()" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="top">
            <!-- tên katakana -->
            <el-col :span="10" class="el-col-1-t">
              <el-form-item label-width="70px" label="名カナ" prop="snz_yomifirstname">
                <el-input v-model="inputForm.snz_yomifirstname" :disabled="checkRole(['callcenter','viewonly'],'cant')" placeholder="" clearable @change="onChange()" />
              </el-form-item>
            </el-col>
            <el-col :span="6" class="el-col-2-t">
              <el-button class="search-btn" :disabled="checkRole([],'cant')" @click="showModal=true">
                <svg-icon icon-class="_search_w" />
                兄弟検索
              </el-button>
              <ModalSearchBrother :show="showModal" :internalcode="inputForm.snz_registered_internalcode" @fill-brother="fillBrotherInput" @close="showModal=false" />
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="false" class="search-container container-2">
          <h3 class="mt-0">内部コード</h3>
          <!-- mã interalcode cho thằng ae -->
          <el-row class="top">
            <el-col :span="10" class="el-col-1-t">
              <el-form-item label-width="150px" label="登録先内部コード" prop="snz_register_for_internalcode">
                <el-input v-model="inputForm.snz_register_for_internalcode" :disabled="true" placeholder="" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- mã interalcode của thằng đăng ký -->
          <el-row class="top">
            <el-col :span="10" class="el-col-1-t">
              <el-form-item label-width="150px" label="登録元内部コード" prop="snz_registered_internalcode">
                <el-input v-model="inputForm.snz_registered_internalcode" placeholder="" clearable readonly :disabled="true" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <div class="group-button el container-3">
          <ButtonDelete v-show="type == 'edit' ? true : false" v-role="['system']" :loading="deleteLoading" :disabled="checkRole(['callcenter','viewonly'],'cant')" @delete="destroy()" />
          <ButtonSave :loading="saveLoading" :disabled="checkRole(['callcenter','viewonly'],'cant')" @save="saveBrotherInfo()" />
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import ModalSearchBrother from './modal/ModalSearchBrother';
import { options as RelationshipBroOptions } from '@/const/RelationshipBro';
import BrotherInfo from '@/api/brother';
import GradeRequest from '@/api/gradeRequest';
import load_more from '@/directive/selection';
import { BrotherInformation } from './assets/validate';
import role from '@/directive/role';
import CommonSettings from '@/const/CommonSettings';
import ButtonSave from '@/components/Common/Button/ButtonSave';
import ButtonDelete from '@/components/Common/Button/ButtonDelete';

const brotherInfo = new BrotherInfo();
const gradeRequest = new GradeRequest();

export default {
  name: 'BrotherInformationAdd',
  directives: { load_more, role },
  components: {
    ButtonSave,
    ButtonDelete,
    ModalSearchBrother,
  },
  filters: {
  },
  mixins: [BrotherInformation],
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect || to.name === 'err_404') {
      return next();
    }
    if (to.params.redirect || to.name === 'err_403') {
      return next();
    }
    this.inputFormCompare = JSON.stringify(_.clone(this.inputForm));
    if (this.inputFormOrigin !== this.inputFormCompare) {
      console.log('diff', this.inputFormOrigin, this.inputFormCompare);
      this.$confirm(
        'このページを終了する前に、変更を保存しますか？',
        '保存されていない変更',
        {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }
      ).then(async() => {
        if (this.type === 'edit') {
          await this.update();
          next();
        } else if (this.type === 'add'){
          await this.create(false);
        }
      }).catch(action => {
        if (action === 'cancel') {
          next();
        } else {
          next(false);
        }
      }
      );
    } else {
      console.log('next', this.inputFormOrigin, this.inputFormCompare);
      next();
    }
  },
  data() {
    return {
      roles: null,
      commonText: CommonSettings.COMMON_TXT,
      list: null,
      total: 0,
      loadingForm: true,
      listLoading: true,
      deleteLoading: false,
      disableDelete: false,
      saveLoading: false,
      disableSave: false,
      showModal: false,
      type: null,
      urlId: null,
      relaOptions: RelationshipBroOptions,
      listQuery: {
        page: 1,
        limit: 20,
      },
      inputForm: {
        id: '',
        snz_lastname: '',
        snz_firstname: '',
        snz_yomilastname: '',
        snz_yomifirstname: '',
        snz_grade_id: '',
        snz_relationship: '',
        snz_register_for_internalcode: '',
        snz_registered_internalcode: '',
      },
      dataForChange: null,
      optionGrades: [],
    };
  },
  async created() {
    this.urlId = this.$route.params.id;
    this.fullscreenLoading = false;
    this.roles = this.$store.getters.roles;
    this.studentCode = this.$route.query.studentCode;
    this.loadingForm = true;
    await this.init();
    await this.getOptionGrade();
    this.inputFormOrigin = JSON.stringify(_.clone(this.inputForm));
    this.loadingForm = false;
  },
  metaInfo: {
    title: '兄弟情報',
  },
  methods: {
    async init(){
      this.type = (window.location.pathname.indexOf('add') > -1) ? 'add' : 'edit';
      if (this.type === 'edit') {
        const result = await brotherInfo.getBrotherInfoById(this.urlId);
        this.inputForm = result;
        this.dataForChange = result.snz_grade_id;
      } else if (this.type === 'add'){
        this.inputForm.snz_registered_internalcode = this.urlId;
      }
      this.inputForm.id = this.urlId;
    },
    onChange() {
      console.log('onChange');
      this.inputForm.snz_register_for_internalcode = '';
    },
    onChangeSelectBox() {
      if (this.dataForChange !== this.inputForm.snz_grade_id){
        this.inputForm.snz_register_for_internalcode = '';
      }
    },
    showModalSearch() {
      this.showModal = true;
    },
    fillBrotherInput(data) {
      this.showModal = false;
      this.dataForChange = data[0].snz_grade_id;
      this.inputForm.snz_lastname = data[0].lastname;
      this.inputForm.snz_firstname = data[0].firstname;
      this.inputForm.snz_yomilastname = data[0].yomilastname;
      this.inputForm.snz_yomifirstname = data[0].yomifirstname;
      this.inputForm.snz_relationship = null;
      this.inputForm.snz_grade_id = data[0].snz_grade_id;
      this.inputForm.snz_register_for_internalcode = data[0].snz_internalcode;
      // this.$refs.selectGrade.search({ id: data[0].snz_grade_id });
    },
    async searchGrade(query) {
      return await gradeRequest.gradeSearchName(query);
    },
    saveBrotherInfo() {
      this.$refs.inputForm.validate().then((valid) => {
        if (valid) {
          if (this.type === 'edit') {
            this.update();
          } else if (this.type === 'add'){
            this.create();
          }
        }
      });
    },
    async update() {
      this.saveLoading = true;
      this.disableSave = true;
      this.disableDelete = true;
      await brotherInfo.update(this.inputForm.id, this.inputForm).then((valid) => {
        if (valid) {
          this.$message({
            message: '変更しました。',
            type: 'success',
          });
        }
      }).catch((error) => {
        if (error.response.status === 422) {
          this.$refs.inputForm.injectFormValidates(error.response);
        }
      }).finally(() => {
        this.saveLoading = false;
        this.disableSave = false;
        this.disableDelete = false;
      });
    },
    async create(redirect = true) {
      this.saveLoading = true;
      this.disableSave = true;
      await brotherInfo.create(this.inputForm).then((valid) => {
        if (valid) {
          this.$message({
            message: '変更しました。',
            type: 'success',
          });
          if (redirect === true) {
            this.$router.push({
              name: 'BrotherInformationEdit',
              params: { id: valid.id, redirect: true },
              query: { studentCode: this.studentCode },
            });
          }
        }
      }).catch((error) => {
        if (error.response.status === 422) {
          this.$refs.inputForm.injectFormValidates(error.response);
        } else if (error.response.status === 414) {
          this.$message({
            message: 'trùng bản ghi',
            type: 'error',
          });
        }
      }).finally(() => {
        this.saveLoading = false;
        this.disableSave = false;
      });
    },
    checkRole(btnRoles, type) {
      const myRoles = this.roles;
      const diff = myRoles.filter(x => btnRoles.includes(x));
      if (diff.length > 0) {
        if (type === 'can') {
          return false;
        } else {
          return true;
        }
      } else {
        if (type === 'can') {
          return true;
        } else {
          return false;
        }
      }
    },
    async destroy() {
      this.$confirm(this.commonText.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(async(valid) => {
        if (valid) {
          this.deleteLoading = true;
          await brotherInfo.delete(this.urlId);
          this.$message({
            message: '削除しました。',
            type: 'success',
          });
          this.$router.push({
            name: 'StudentDetail',
            params: { id: this.studentCode, redirect: true },
            query: { tab: 'tab6' },
          });
        }
      }).catch(() => {
        return false;
      }).finally(() => {
        this.deleteLoading = false;
      });
    },
    async getOptionGrade() {
      this.optionGrades = await gradeRequest.gradeOptions({
        select_add_id: [this.inputForm.snz_grade_id],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-body {

}
.mt-0 {
  margin-top: 0px;
}
.el-col-1-t{
  width: 44.66666667% !important;
}
.el-col-2-t{
  width: 390px !important;
}
.mb-0 {
  margin-bottom: 0px !important;
}
.edit-input {
  padding-right: 100px;
}
.el-form{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.app-container{
  padding: 25px 25px 0 25px;
}
.card-body{
  height: 100%;
}

/deep/ .el-card__body {
  padding: 19px 30px 5px 30px !important;
}

/deep/ .search-container {
  margin-bottom: 1px !important;
    .el-card{
      .el-col{
        width: none;
        .el-form-item .el-input{
          width: 285px !important;
        }
      }
    }
    .el-input{
      width: 285px !important;
    }
}

.container-1{
  height: 275px;
}
.container-2{
  height: calc(100% - 362px);
}
.container-3{
  height: 87px;
  .ml-5{
    margin-left: 5px;
  }
}

/deep/ .search {
  .el-row {
    flex-wrap: wrap;
    label.el-form-item__label {
      text-align: right;
      font-weight: 400;
    }

    input.el-input__inner {
      &::placeholder {
        color: #1a1714;
      }
    }
  }
  .top {
    .el-form-item {
      margin-bottom: 15px;
    }
  }
  .bot {
    .el-form-item {
      margin-bottom: 20px;
    }
  }
}

.container {
  /deep/ div.statistics {
    span {
      font-size: 13px;
      padding-right: 25px;
      font-weight: 400;
    }
  }
}

/deep/ .paging {
  margin-top: 14px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}

button.el-button.search-btn {
  background: #1467B3 0% 0% no-repeat padding-box;
  border-radius: 25px;
  border: 0px;
  color: #fff;
  font-size: 15px;
  font-weight: 500 !important;
  padding-left:  20px;
  padding-right:  20px;
  width: 134px;
  height: 45px;
  float: right;
  border: none;
  font-family: Noto Sans JP;
  &:hover{
    opacity: 80%;
  }
  .svg-icon{
    height: 17px;
    width: 17px;
  }
}

</style>
