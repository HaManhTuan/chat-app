<template>
  <!-- Form -->
  <div>
    <el-dialog
      title="退塾情報を登録"
      :visible.sync="showDialog"
      :before-close="closeModal"
      top="52px"
      class="custom-dialog"
    >
      <el-form ref="form" :rules="rules" :model="form">
        <!-- ROW 1-->
        <el-row>
          <el-col :span="12">
            <el-form-item class="custom-date" label="年度" prop="name">
              <el-date-picker
                v-model="form.date1"
                disabled
                type="year"
                placeholder="Pick a year"
                prefix-icon="abc"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" label="作成日">
              <el-date-picker
                v-model="form.date2"
                format="yyyy/MM/dd"
                disabled
                type="date"
                prefix-icon="abc"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 1-->
        <!-- ROW 2-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="校舎" prop="name">
              <el-input v-model="form.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" label="作成者">
              <el-select v-model="form.region" disabled>
                <el-option v-for="(item,index) in selectData" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- END ROW 2-->
        <el-row>
          <el-col :span="12">
            <el-form-item label="学年" prop="name">
              <el-input v-model="form.name2" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" label="作成者 (代理)">
              <el-select v-model="form.region2" disabled>
                <el-option v-for="(item,index) in selectData" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒コード" prop="name">
              <el-input v-model="form.name3" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" class="custom-date" label="修正日">
              <el-date-picker
                v-model="form.date1"
                disabled
                type="date"
                format="yyyy/MM/dd"
                prefix-icon="abc"
              />
              <span class="icon-input__calendar">
                <svg-icon icon-class="_calendar_x" style="font-size: 17px" />
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生徒氏名" prop="name">
              <el-input v-model="form.name4" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" label="修正者">
              <el-select v-model="form.region3" disabled>
                <el-option v-for="(item,index) in selectData" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="custom-date" label="退塾年月" prop="region">
              <el-select v-model="form.region4">
                <el-option v-for="(item,index) in selectData" :key="index" :label="item.label" :value="item.value" />
              </el-select>
              <span class="des">生徒の最終在籍月を入力</span>
              <span class="des">例)2021年6月末退塾なら、2106神とする</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" label="作成者 (代理)">
              <el-select v-model="form.region5" disabled>
                <el-option v-for="(item,index) in selectData" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="退塾理由" prop="region">
              <el-select v-model="form.region6">
                <el-option v-for="(item,index) in selectData" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-role="['parttime', 'system', 'employee']" label="ステータス" prop="region">
              <el-select v-model="form.region7" prop="region">
                <el-option v-for="(item,index) in selectData" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="退塾理由その他">
              <el-input v-model="form.name5" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer custom-footer__button">
        <el-button class="cancel" @click="closeModal">
          <svg-icon icon-class="_cancel" />
          <span>キャンセル</span>
        </el-button>
        <el-button v-if="!disableRole(['school'])" class="delete">
          <svg-icon icon-class="_trash_w" />
          <span>削除</span>
        </el-button>
        <button-save />
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ButtonSave from '../../../components/Common/Button/ButtonSave';
import { ModalRegister } from '../assets/validate';
import role from '@/directive/role';

export default {
  name: 'ModalRegister',
  directives: { role },
  components: {
    ButtonSave,
  },
  mixins: [ModalRegister],
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectData: [
        {
          value: 1,
          label: 'Option 1',
        },
        {
          value: 2,
          label: 'Option 2',
        },
        {
          value: 3,
          label: 'Option 3',
        },
      ],
      form: {
        name: '小中_最難関コース南浦和東口',
        name2: '中学3年',
        name3: '10100001',
        name4: '湘南',
        name5: '',
        region: '永井 祐輔',
        region2: '渡邊 美咲',
        region3: '永井 祐輔',
        region4: 'ー',
        region5: '渡邊 美咲',
        region6: 'ー',
        region7: 'ー',
        date1: '2021',
        date2: '2021/02/09',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      value3: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../styles/modal';
</style>
