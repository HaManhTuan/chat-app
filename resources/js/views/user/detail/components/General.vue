<template>
  <div class="body-content">
    <el-scrollbar class="scroll-content">
      <div class="block_1 search-container">
        <el-form ref="formData" :model="formData" :rules="searchRules" class="form-update search">
          <span class="block-title">
            全般
          </span>
          <!-- FIRST ROW -->
          <el-row type="flex" justify="left" style="margin-left: -98px;">
            <el-col :span="11">
              <el-form-item prop="name" label="名前" label-width="220px">
                <el-input v-model="formData.name" style="width: 285px;" placeholder="" clearable @change="handleChange('name')" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="email" label="メールアドレス" label-width="220px">
                <el-input
                  v-model="formData.email"
                  style="width: 285px;"
                  placeholder=""
                  clearable
                  @keydown.space.native="(event) => event.preventDefault()"
                  @change="handleChange('email')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1" />
          </el-row>
          <el-row type="flex" justify="left" style="margin-left: -99px;margin-top: 10px;">
            <el-col :span="11">
              <el-form-item prop="is_locked" label="ロック状態" label-width="220px">
                <el-switch
                  v-model="formData.is_locked"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleChange('is_locked')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="1" />
          </el-row>
          <!-- END FIRST ROW -->
          <hr style="margin-top: 20px;border: 1px solid whitesmoke;margin-bottom: 10px;">
          <span class="block-title">
            所属組織
          </span>
          <div class="bot">
            <div class="orginization">
              <el-row type="flex" justify="left" style="margin-left: 35px;">
                <el-col :span="8">
                  <span>所属組織</span>
                </el-col>
                <el-col :span="8">
                  <span>該当ロール</span>
                </el-col>
                <el-col :span="7">
                  <span>削除</span>
                </el-col>
              </el-row>
              <el-row v-for="(item, index) in filteredAffiliatedOrg" :key="index" type="flex" justify="left" style="margin-left: 35px;margin-top: 13px">
                <el-col :span="8">
                  <el-form-item
                    :prop="'affiliatedOrg.'+ index +'.organization_id'"
                    :rules="searchRules.organization"
                  >
                    <SearchSelectBox
                      v-model="item.organization_id"
                      key-name="name"
                      key-id="id"
                      :search-function="searchOrganizationName"
                      popper-class="select-inside-table"
                      :popper-append-to-body="false"
                      :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                      :no-data-text="CommonTxt.selectboxEmptyTxt"
                      placeholder=""
                      @onChange="handleChange(`affiliatedOrg${index}organization_id`)"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="'affiliatedOrg.'+ index +'.role_id'"
                    :rules="searchRules.role"
                  >
                    <el-select
                      v-model="item.role_id"
                      clearable
                      no-data-text="データはありません。"
                      :popper-append-to-body="false"
                      popper-class="select-inside-table"
                      placeholder=""
                      @change="handleChange(`affiliatedOrg${index}role_id`)"
                    >
                      <el-option
                        v-for="item2 in roleOptions"
                        :key="item2.id"
                        style="padding-left:20px;padding-top: 7px;width: 285px;"
                        :label="item2.name_jp"
                        :value="item2.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <ButtonDeleteChild v-if="index!==0" @delete="handleDeleteOrg(item.model_id, item.role_id, item.organization_id)" />
                </el-col>
              </el-row>
              <el-row
                v-for="(name, i) in formData.names"
                :key="'A'+i"
                type="flex"
                justify="left"
                style="margin-left: 35px;margin-top: 13px;height:37px;"
              >
                <el-col :span="8">
                  <el-form-item
                    :prop="'names.'+ i +'.organization_id'"
                    :rules="searchRules.organization"
                  >
                    <SearchSelectBox
                      v-model="name.organization_id"
                      key-name="name"
                      key-id="id"
                      :search-function="searchOrganizationName"
                      popper-class="select-inside-table"
                      :popper-append-to-body="false"
                      :no-match-text="CommonTxt.selectboxSearchEmptyTxt"
                      :no-data-text="CommonTxt.selectboxEmptyTxt"
                      placeholder=""
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="'names.'+ i +'.role_id'"
                    :rules="searchRules.role"
                  >
                    <el-select
                      v-model="name.role_id"
                      clearable
                      no-data-text="データはありません。"
                      popper-class="select-inside-table"
                      :popper-append-to-body="false"
                      placeholder=""
                    >
                      <el-option
                        v-for="item2 in roleOptions"
                        :key="item2.id"
                        style="padding-left:20px;padding-top: 7px;width: 285px;"
                        :label="item2.name_jp"
                        :value="item2.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <ButtonDeleteChild v-if=" i !== 0 || filteredAffiliatedOrg.length > 0" @click.native="deleteInput(i)" />
                </el-col>
              </el-row>
              <el-row type="flex" justify="left" style="margin-left: 35px;margin-top: 13px;margin-bottom: 20px;">
                <el-col :span="13" style="height: 43px;">
                  <ButtonAddOrganization @click.native="addInput" />
                </el-col>
                <div class="el-form-item__error">
                  {{ printErrorAddOrg }}
                </div>
              </el-row>
            </div>
          </div>
        </el-form>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import { validate } from '../../assets/validate.js';
import ButtonAddOrganization from '../../../../components/Common/Button/ButtonAddOrganization';
import ButtonDeleteChild from '../../../../components/Common/Button/ButtonDeleteChild';
import SearchSelectBox from '@/components/Common/SearchSelectBox';
import UserResource from '@/api/user';

const userResource = new UserResource();
export default {
  metaInfo: {
    title: 'ユーザー詳細',
  },
  components: {
    ButtonDeleteChild,
    ButtonAddOrganization,
    SearchSelectBox,
  },
  mixins: [validate],
  props: {
    user: {
      type: Object,
      default() {
        return {};
      },
    },
    roleOptions: {
      type: Array,
      default() {
        return {};
      },
    },
    organizationOptions: {
      type: Array,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      formData: {
        id: null,
        name: '',
        email: '',
        is_locked: 0,
        affiliatedOrg: [],
        names: [],
        deleteRole: [],
      },
      printErrorAddOrg: '',
      saveLoading: false,
      deleteLoading: false,
      inquiryFormError: false,
    };
  },
  computed: {
    isEditing: function(){
      return !!this.$route.params.id;
    },
    filteredAffiliatedOrg() {
      return this.formData.affiliatedOrg.filter(element => {
        return this.organizationOptions.some(el => el.id === element.organization_id);
      });
    },
  },
  watch: {
    $props: {
      handler() {
        this.formData.id = this.user.id;
        this.formData.name = this.user.name;
        this.formData.email = this.user.email;
        this.formData.is_locked = this.user.is_locked;
        this.formData.affiliatedOrg = [];
        this.user.roles.forEach((element) => {
          if (this.organizationOptions.some(el => el.id === element.pivot.organization_id)) {
            this.formData.affiliatedOrg.push({
              id: element.pivot.id,
              role_id: element.pivot.role_id,
              model_id: element.pivot.model_id,
              organization_id: element.pivot.organization_id,
              default_select: element.pivot.default_select,
            });
          }
        });
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // if (!this.$route.params.id) {
    //   this.addInput();
    // }
    if (this.formData.names.length === 0 && this.formData.affiliatedOrg.length === 0 && !this.$route.params.id) {
      this.addInput();
    }
  },
  methods: {
    handleDeleteOrg(model_id, role_id, organization_id){
      const indx = this.formData.affiliatedOrg.findIndex(element => {
        if (element.model_id === model_id && element.organization_id === organization_id && element.role_id === role_id) {
          this.formData.deleteRole.push(element.id);
          return true;
        }
        return false;
      });
      this.formData.affiliatedOrg.splice(indx, indx >= 0 ? 1 : 0);
    },
    addInput() {
      this.formData.names = this.formData.names.concat({ role_id: null, organization_id: null });
    },
    handleInput(name, idx) {
      this.formData.names = this.formData.names.map((n, i) => i === idx ? name : n);
    },
    deleteInput(index) {
      this.formData.names.splice(index, 1);
    },
    handleChange(prop) {
      this.$refs.formData.clearValidate(prop);
    },
    searchOrganizationName(query) {
      return userResource.searchOrgName(query);
    },
  },
};
</script>
<style lang="scss" scoped>
.body-content {
  height: calc(100vh - 210px);
  /deep/ .scroll-content {
    height:  100%;
  }
}
*{
  margin: 0px;
  padding: 0px;
  font: normal normal normal 14px Noto Sans JP;
}
.f-button::v-deep{
  padding-top: 23px;
  padding-bottom: 22px;
  font-size: 14px;
  span{
    vertical-align: middle !important;
  }
}
.block_1::v-deep{
  padding-top: 17px;
  .block-title{
    font-size:  18px;
    letter-spacing: 0.29px;
    color: #1A1714;
    margin-left: 30px;
    font-weight: bold;
  }
  .form-update{
    // margin-top: 25px;
      .bot{
        padding-top: 15px;
        .el-row{
          .el-col-8:nth-child(2) {
            margin-left: 15px;
          }
          .el-col-7:nth-child(3) {
            margin-left: 15px;
          }
          .el-col-8{
          width: 285px;
          .el-select{
            .el-input {
              width: 285px;
            }
          }
        }
        .el-col-13{
          width: 633px;
        }
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
.group-button::v-deep {
  text-align: right;
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
</style>

