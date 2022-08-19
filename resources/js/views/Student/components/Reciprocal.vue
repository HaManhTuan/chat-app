<template>
  <div v-loading="fullscreenLoading">
    <el-card class="reciprocal box-card">
      <el-form ref="form" label-width="150px" :model="formReciprocal" :rules="rules">
        <el-row>
          <el-col :span="16">
            <div class="card-box top">
              <h3>学力診断</h3>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="学力診断(日程)">
                    <el-date-picker
                      v-model="formReciprocal.snz_testdate"
                      type="date"
                      :editable="false"
                      format="yyyy/MM/dd"
                      value-format="yyyy-MM-dd"
                      clearable
                      :disabled="disableRole(['viewonly', 'callcenter'])"
                      prefix-icon="abc"
                    />
                    <span class="icon-input__calendar">
                      <svg-icon icon-class="_calendar" style="font-size: 18px" />
                    </span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="custom-date" label="英語" prop="snz_testenglish">
                    <input-number
                      ref="snz_testenglish"
                      v-model="formReciprocal.snz_testenglish"
                      :maxlength="100"
                      clearable
                      :disabled="disableRole(['viewonly', 'callcenter'])"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="custom-date" label="学力診断(連絡)">
                    <el-select v-model.number="formReciprocal.snz_testcontact" filterable class="style-placeholder" placeholder="ー" :disabled="disableRole(['viewonly', 'callcenter'])">
                      <el-option :value="0" label="ー" />
                      <el-option :value="1" label="✓">
                        <span class="el-checkbox__inner" />
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="custom-date" label="数学・算数" prop="snz_testmathematics">
                    <input-number
                      ref="snz_testmathematics"
                      v-model="formReciprocal.snz_testmathematics"
                      :maxlength="100"
                      clearable
                      :disabled="disableRole(['viewonly', 'callcenter'])"
                      @keydown.space.native.prevent
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="国語" prop="snz_testlanguage">
                    <input-number
                      ref="snz_testlanguage"
                      v-model="formReciprocal.snz_testlanguage"
                      :maxlength="100"
                      clearable
                      :disabled="disableRole(['viewonly', 'callcenter'])"
                      @keydown.space.native.prevent
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-box top">
              <h3>入会選抜</h3>
              <el-form-item label="入会意思(生徒)">
                <el-select v-model="formReciprocal.snz_enterstudent" class="style-placeholder" filterable placeholder="" clearable :disabled="disableRole(['viewonly', 'callcenter'])">
                  <el-option v-for="(item,index) in enterstudentOptions" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="入会意思(保護者)">
                <el-select v-model="formReciprocal.snz_enterguardian" class="style-placeholder" filterable placeholder="" clearable :disabled="disableRole(['viewonly', 'callcenter'])">
                  <el-option v-for="(item,index) in enterstudentOptions" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <div class="card-box bot">
              <h3>アンケート</h3>
              <el-col :span="12">
                <el-form-item label="第１志望校" prop="snz_choiceschool">
                  <el-input ref="snz_choiceschool" v-model="formReciprocal.snz_choiceschool" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item class="custom-date" label="第２志望校" prop="snz_choiceschool2">
                  <el-input ref="snz_choiceschool2" v-model="formReciprocal.snz_choiceschool2" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item label="第３志望校" prop="snz_choiceschool3">
                  <el-input ref="snz_choiceschool3" v-model="formReciprocal.snz_choiceschool3" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item label="第４志望校" prop="snz_choiceschool4">
                  <el-input ref="snz_choiceschool4" v-model="formReciprocal.snz_choiceschool4" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item label="第５志望校" prop="snz_choiceschool5">
                  <el-input ref="snz_choiceschool5" v-model="formReciprocal.snz_choiceschool5" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item label="部活動・習い事等" prop="new_bukasudo">
                  <el-input ref="new_bukasudo" v-model="formReciprocal.new_bukasudo" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="custom-date" label="習い事(日)" prop="snz_learningsun">
                  <el-input ref="snz_learningsun" v-model="formReciprocal.snz_learningsun" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item class="custom-date" label="習い事(月)" prop="snz_learningmon">
                  <el-input ref="snz_learningmon" v-model="formReciprocal.snz_learningmon" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item class="custom-date" label="習い事(火)" prop="snz_learningtue">
                  <el-input ref="snz_learningtue" v-model="formReciprocal.snz_learningtue" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item class="custom-date" label="習い事(水)" prop="snz_learningwed">
                  <el-input ref="snz_learningwed" v-model="formReciprocal.snz_learningwed" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item class="custom-date" label="習い事(木)" prop="snz_learningthu">
                  <el-input ref="snz_learningthu" v-model="formReciprocal.snz_learningthu" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item class="custom-date" label="習い事(金)" prop="snz_learningfri">
                  <el-input ref="snz_learningfri" v-model="formReciprocal.snz_learningfri" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
                <el-form-item label="習い事(土)" prop="snz_learningsat">
                  <el-input ref="snz_learningsat" v-model="formReciprocal.snz_learningsat" clearable :disabled="disableRole(['viewonly', 'callcenter'])" />
                </el-form-item>
              </el-col>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="card-box bot">
              <h3>入会選抜試験結果</h3>
              <el-form-item label="英語" prop="snz_selectionscoreenglish">
                <input-number
                  ref="snz_selectionscoreenglish"
                  v-model="formReciprocal.snz_selectionscoreenglish"
                  :maxlength="100"
                  clearable
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                  @keydown.space.native.prevent
                />
              </el-form-item>
              <el-form-item label="数学" prop="snz_selectionscoremathematics">
                <input-number
                  ref="snz_selectionscoremathematics"
                  v-model="formReciprocal.snz_selectionscoremathematics"
                  :maxlength="100"
                  clearable
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                  @keydown.space.native.prevent
                />
              </el-form-item>
              <el-form-item label="国語" prop="snz_selectionscorelanguage">
                <input-number
                  ref="snz_selectionscorelanguage"
                  v-model="formReciprocal.snz_selectionscorelanguage"
                  :maxlength="100"
                  clearable
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                  @keydown.space.native.prevent
                />
              </el-form-item>
              <el-form-item label="理科" prop="snz_selectionscorescience">
                <input-number
                  ref="snz_selectionscorescience"
                  v-model="formReciprocal.snz_selectionscorescience"
                  :maxlength="100"
                  clearable
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                  @keydown.space.native.prevent
                />
              </el-form-item>
              <el-form-item label="社会" prop="snz_selectionscorescociety">
                <input-number
                  ref="snz_selectionscorescociety"
                  v-model="formReciprocal.snz_selectionscorescociety"
                  :maxlength="100"
                  clearable
                  :disabled="disableRole(['viewonly', 'callcenter'])"
                  @keydown.space.native.prevent
                />
              </el-form-item>
              <el-form-item label="試験結果連絡" prop="snz_selectionresultcontact">
                <el-select v-model.number="formReciprocal.snz_selectionresultcontact" filterable :disabled="disableRole(['viewonly', 'callcenter'])">
                  <el-option v-for="(item,index) in resultContactOptions" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import toiawaseStatus from '@/const/ToiawaseStatus';
import studentReciprocal from '@/const/StudentStatus';
import StudentResource from '@/api/student';
import CommonSettings from '@/const/CommonSettings';
import { StudentReciprocal } from '../assets/validate';
import InputNumber from '@/components/Common/InputNumber';

const studentResource = new StudentResource();

export default {
  components: {
    InputNumber,
  },
  mixins: [StudentReciprocal],
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fullscreenLoading: true,
      commonText: CommonSettings.COMMON_TXT,
      enterstudentOptions: toiawaseStatus.OPTION_SNZ_ENTERSTUDENT,
      resultContactOptions: studentReciprocal.OPTION_SNZ_RESULT_CONTACT,
      selectTestContact: [],
      formReciprocal: {},
      formOrigin: null,
    };
  },
  async created() {
    await this.init();
    this.fullscreenLoading = false;
  },
  methods: {
    async init() {
      const data = await studentResource.getReciprocalInfo(this.id);
      this.formReciprocal = data.original.data;
      this.formOrigin = _.cloneDeep(this.formReciprocal);
    },
    async updateReciprocalStudent() {
      await studentResource.updateReciprocal(this.id, this.formReciprocal).catch(err => {
        if (err.response.status === 422) {
          this.$refs.form.injectFormValidates(err.response);
          this.scrollTop();
        }
      }).finally(() => {
        this.$emit('stopLoading');
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.style-placeholder {
  ::placeholder {
    color: #1a1714;
  }
}
.icon-input__calendar{
  position: absolute;
  top: 0;
  right: 11px;
  pointer-events: none;
}
.el-checkbox__inner {
  background: none !important;
  border: none !important;

  &:after {
    border-color: #1a1714 !important;
    border-width: 4px !important;
    top: 0 !important;
    width: 8px !important;
    height: 15px !important;
    left: 0;
    transform: rotate(45deg) scaleY(1);
    box-sizing: content-box;
    content: '';
  }
}
.reciprocal::v-deep {
  .el-card__body {
    padding: 0;
  }

  .el-form-item__label {
    padding: 0 10px 0 0;
  }

  .el-row {
    margin: 34px 0 61px;

    &:last-child {
      margin-top: 0;
    }

    .card-box.top {
      height: 269px;
    }

    .card-box.bot {
      height: 524px;
    }

    .card-box {
      border: 1px solid rgba(0, 0, 0, 0.06);
      padding-right: 30px;
      margin: 0 22px;

      h3 {
        margin: 20px 30px;
        font-size: 18px;
        font-weight: 500;
        color: #1A1714;
        padding-bottom: 20px;
        font-family: Noto Sans JP, sans-serif;
      }

      .el-col:last-child {
        float: right;
      }
    }
  }
}
</style>
