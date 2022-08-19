<template>
  <!-- Form -->
  <div>
    <el-dialog
      v-loading="loading"
      title="承認依頼"
      :visible.sync="showDialog"
      :before-close="closeModal"
      class="custom-dialog"
      @open="init"
    >
      <h3 v-if="form" class="btn-dual">#{{ form.id }}</h3>
      <el-form ref="form" :model="form">
        <!-- PART 1-->
        <div>
          <el-row justify="space-around">
            <el-col :span="8">
              <el-form-item v-if="form" label="生徒氏名" prop="" label-width="">
                <router-link
                  v-if="form.student"
                  :to="{
                    name: 'StudentDetail',
                    params: { id: form.snz_student_code },
                  }"
                  class="input-link"
                >
                  {{ form.student.fullname }}
                </router-link>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                v-if="form"
                label="学年"
                prop="grade.snz_name"
                label-width=""
              >
                <el-input
                  v-if="form.grade"
                  v-model="form.grade.snz_name"
                  placeholder="ー"
                  class="i-small"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if="form" label="校舎" prop="" label-width="">
                <el-input
                  v-if="form.request_from_business"
                  v-model="form.request_from_business.name"
                  placeholder="ー"
                  class="i-small"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- END PART 1-->
        <hr>
        <el-scrollbar class="scroll-content">
          <!-- PART 2 -->
          <div>
            <!-- ROW 2.1 -->
            <el-row justify="space-around">
              <!-- CATEGORY -->
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="カテゴリ"
                  prop=""
                  label-width=""
                >
                  <router-link
                    v-if="
                      form.snz_application_category ===
                        category.SUBJECT_IRREGULARITIES.value
                    "
                    :to="{
                      name: 'cantractinfo-detail',
                      params: { id: form.snz_cantractinfo_id },
                    }"
                    class="input-link"
                    :disabled="disableRole(['callcenter', 'viewonly'])"
                  >
                    {{
                      form.snz_application_category | mapOptions(categoryOption)
                    }}
                  </router-link>
                  <span v-else class="input-disable">
                    {{
                      form.snz_application_category | mapOptions(categoryOption)
                    }}
                  </span>
                </el-form-item>
              </el-col>
              <!-- END CATEGORY -->
              <!-- START MONTH -->
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="受講開始月"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-if="form.start_month"
                    v-model="form.start_month.snz_name"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END START MONTH -->
              <!-- REQUEST TO BUSINESS -->
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="移籍元校舎"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-if="form.request_to_business"
                    v-model="form.request_to_business.name"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                  <el-input
                    v-else
                    v-model="form.request_to_business"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END REQUEST TO BUSINESS -->
            </el-row>
            <!-- END ROW 2.1 -->
            <!-- ROW 2.2 -->
            <el-row justify="space-around">
              <!-- COURSE -->
              <el-col :span="8">
                <el-form-item v-if="form" label="コース" prop="" label-width="">
                  <el-input
                    v-if="form.course"
                    v-model="form.course.snz_name"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END COURSE -->
              <!-- SCHEDULE END MONTH -->
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="変則終了予定月"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-if="form.scheduled_end_month"
                    v-model="form.scheduled_end_month.snz_name"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END SCHEDULE END MONTH -->
              <el-col :span="8" />
            </el-row>
            <!-- END ROW 2.2-->
            <!-- ROW 2.3 -->
            <el-row justify="start">
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="通年申請"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-model="form.year_round_application"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- APPLICATION REASON -->
              <el-col :span="16">
                <el-form-item
                  v-if="form"
                  label="申請理由"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-model="form.snz_application_reason"
                    placeholder="ー"
                    disabled
                    class="request-year"
                  />
                </el-form-item>
              </el-col>
              <!-- END APPLICATION REASON -->
            </el-row>
            <!-- END ROW 2.3 -->
          </div>
          <!-- END PART 2 -->
          <hr>
          <!-- PART 3 -->
          <div>
            <!-- ROW 3.1 -->
            <el-row justify="space-between">
              <!-- SNZNOTE -->
              <el-col>
                <el-form-item
                  v-if="form"
                  label="承認者コメント"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-model="form.snz_note"
                    placeholder="ー"
                    class="i-comment"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END SNZNOTE -->
            </el-row>
            <!-- END ROW 3.1 -->
          </div>
          <!-- END PART 3 -->
          <hr>
          <!-- PART 4 -->
          <div>
            <!-- ROW 4.1 -->
            <el-row justify="space-around">
              <!-- APPROVE STATUS -->
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="処理ステータス"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-model="form.snz_approve_status_text"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- APPROVE STATUS -->
              <!-- 1st APPROVER -->
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="1段階承認者"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-if="form.stage1st_approver_user"
                    v-model="form.stage1st_approver_user.name"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                  <el-input
                    v-else
                    v-model="form.stage1st_approver_user"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END 1st APPROVER -->
              <!-- 2st APPROVER -->
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="2段階承認者"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-if="form.stage2st_approver_user"
                    v-model="form.stage2st_approver_user.name"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                  <el-input
                    v-else
                    v-model="form.stage2st_approver_user"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END 2st APPROVER -->
            </el-row>
            <!-- END ROW 4.1 -->
            <!-- ROW 4.2 -->
            <el-row justify="space-around">
              <!-- CREATED USER -->
              <el-col :span="8">
                <el-form-item v-if="form" label="申請者" prop="" label-width="">
                  <el-input
                    v-if="form.course"
                    v-model="form.application_created_user.name"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END CREATED USER -->
              <!-- CREATED AT -->
              <el-col :span="8">
                <el-form-item v-if="form" label="申請日" prop="" label-width="">
                  <el-input
                    v-model="created_at"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END CREATED AT -->
              <!-- LAST APPROVE DATE -->
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="最終承認日"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-model="form.last_approve_date"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END LAST APPROVE DATE -->
            </el-row>
            <!-- END ROW 4.2-->
            <!-- ROW 4.3 -->
            <el-row justify="start">
              <!-- TRANSFER PROCESSING RESULT -->
              <el-col :span="8">
                <el-form-item
                  v-if="form"
                  label="移籍ステータス"
                  prop=""
                  label-width=""
                >
                  <el-input
                    v-model="form.transfer_processing_result_text"
                    placeholder="ー"
                    class="i-small"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <!-- END TRANSFER PROCESSING RESULT -->
              <!-- APPLICATION REASON -->
              <el-col :span="16" />
              <!-- END APPLICATION REASON -->
            </el-row>
            <!-- END ROW 4.3 -->
          </div>
          <!-- END PART 4 -->
        </el-scrollbar>
      </el-form>
      <div slot="footer" class="dialog-footer custom-footer__button">
        <el-button
          v-if="
            form &&
              form.snz_application_category ===
              category.SUBJECT_IRREGULARITIES.value
          "
          class="btn-check"
          :disabled="form.course_fee === null"
          :loading="exportLoading"
          @click="handleExport"
        >
          <svg-icon icon-class="_export" />
          <span>受講費用をダウンロード</span>
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import role from '@/directive/role';
// import CommonSettings from '@/const/CommonSettings';
import { mapOptions } from '@/filters/mapOptions';
import {
  Category,
  CategoryOption,
} from '@/const/ApprovalNotification/Category';
import { filter } from '../../../mixins/filter';

import { Init } from './mixinDialog/Init';
import { Export } from './mixinDialog/Export';

export default {
  name: 'RegisterDetail',
  directives: { role },
  components: {},
  filters: {
    mapOptions: mapOptions,
  },
  mixins: [Init, Export, filter],
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    id: {
      type: [String, Number],
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      category: Category,
      categoryOption: CategoryOption,
      saveLoading: false,
    };
  },
  computed: {
    created_at() {
      if (this.form) {
        return moment(this.form.created_at).format('yyyy/MM/DD');
      } else {
        return null;
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
      this.$refs.form.clearValidate();
    },
  },
};
</script>
<style lang="scss" scoped>
@import '../../../styles/modal/modal';
@import '../../../styles/modal/register/dialog.scss';
</style>
