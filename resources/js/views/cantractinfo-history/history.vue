<template>
  <div v-loading="fullscreenLoading" class="app-container">
    <el-tabs
      v-model="activeTab"
      type="border-card"
      class="tab-custom"
      :style="!ableRole(['system'])?'height:100%':''"
    >
      <el-tab-pane :key="1" label="全般" name="general">
        <el-scrollbar class="scroll-content">
          <general-component v-if="dataLoaded" :cantract-history="cantractHistory" />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane v-if="ableRole(['system'])" :key="2" label="システム" name="system">
        <el-scrollbar class="scroll-content">
          <system-component v-if="dataLoaded" :cantract-history="cantractHistory" />
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <div v-if="ableRole(['system'])" class="group-button">
      <button-delete
        class="delete"
        :loading="deleting"
        :disabled="acting"
        @delete="deleteData(false)"
      />
      <button-save :loading="acting" :disabled="deleting" @save="saveData" />
    </div>
  </div>
</template>

<script>
import ButtonSave from '../../components/Common/Button/ButtonSave';
import GeneralComponent from './components/GeneralComponent';
import SystemComponent from './components/SystemComponent';
import CantractInfoResource from '@/api/contractInfoHistory';
import { Message } from 'element-ui';
import { isEquivalent } from '@/mixins/object';
import { isArrayEqual } from '@/helpers/mixins/Compare';
import ButtonDelete from '@/components/Common/Button/ButtonDelete';

const cantractInfoResource = new CantractInfoResource();
export default {
  components: {
    ButtonDelete,
    ButtonSave,
    GeneralComponent,
    SystemComponent,
  },
  metaInfo: {
    title: '受講変更履歴詳細',
  },
  data() {
    return {
      activeTab: 'general',
      dataLoaded: false,
      fullscreenLoading: true,
      cantractHistory: {},
      acting: false,
      deleting: false,
      dataOriginal: {},
    };
  },
  async created() {
    this.cantractHistory = await cantractInfoResource.cantractInfoHistory(this.$route.params.id);
    this.dataOriginal = JSON.parse(JSON.stringify(this.cantractHistory));
    this.dataLoaded = true;
    this.fullscreenLoading = false;
  },
  beforeRouteLeave(to, from, next) {
    if (to.params.redirect) {
      return next();
    }
    if (this.dataLoaded) {
      if (!_.isEmpty(this.dataOriginal) && (!isEquivalent(this.dataOriginal, this.cantractHistory) ||
        !isArrayEqual(this.dataOriginal.subjects, this.cantractHistory.subjects))) {
        this.$confirm('このページを終了する前に、変更を保存しますか', '保存されていない変更', {
          confirmButtonText: '保存して続行',
          cancelButtonText: '変更の破棄',
          type: 'warning',
          distinguishCancelAndClose: true,
        }).then(() => {
          if (typeof this.$route.params.id !== 'undefined') {
            cantractInfoResource.updateHistorySubject(this.$route.params.id,
              {
                arr: this.cantractHistory.subjects,
                status: this.cantractHistory.status,
              }
            ).then(() => {
              Message({
                message: this.CommonTxt.saveSuccess,
                type: 'success',
                duration: 1500,
              });
              return next();
            }).catch(err => {
              if (err.response.status === 424) {
                Message({
                  message: this.CommonTxt.deleteNotPermission,
                  type: 'error',
                  duration: 1500,
                });
              }
              if (err.response.status === 410) {
                this.redirectPage({ 'name': 'err_404', params: { redirect: true }});
              }
            });
          }
        }).catch((action) => {
          if (action === 'cancel') {
            return next();
          }
          return next(false);
        });
      } else {
        return next();
      }
    } else {
      return next();
    }
  },
  methods: {
    async saveData() {
      if (this.cantractHistory.status === 0) {
        // DELETE
        this.deleteData(true);
        return;
      } else {
        // SAVE
        this.acting = true;
        await this.update();
      }
      this.acting = false;
    },
    deleteData(saveDelete = false) {
      this.$confirm(this.CommonTxt.deleteConfirmTxt, '警告', {
        confirmButtonText: 'はい',
        cancelButtonText: 'キャンセル',
        type: 'warning',
      }).then(async() => {
        if (saveDelete){
          this.acting = true;
        } else {
          this.deleting = true;
        }
        await cantractInfoResource.deleteCantractInfoHistory(this.$route.params.id).then(() => {
          Message({
            message: this.CommonTxt.deleteSuccess,
            type: 'success',
            duration: 1500,
          });
          this.dataOriginal = {};
          const query = this.$route.params.query;
          if (typeof query !== 'undefined' && typeof query.redirect !== 'undefined' && typeof query.id !== 'undefined') {
            const redirect = query.redirect;
            const id = query.id;
            delete query.redirect;
            delete query.id;
            this.redirectPage({ 'name': redirect, params: { id: id, redirect: true }, query: query });
          } else {
            this.$router.push({ path: '/' }, onAbort => {
            });
          }
        }).catch((err) => {
          if (err.response.status === 424) {
            Message({
              message: this.CommonTxt.deleteNotPermission,
              type: 'error',
              duration: 1500,
            });
          }
          if (err.response.status === 410) {
            this.redirectPage({ 'name': 'err_404', params: { redirect: true }});
          }
        }).finally(() => {
          this.acting = false;
          this.deleting = false;
        });
      }).catch(() => {
        return false;
      });
    },
    async update() {
      await cantractInfoResource.updateHistorySubject(this.$route.params.id,
        {
          arr: this.cantractHistory.subjects,
          status: this.cantractHistory.status,
        }
      ).then((res) => {
        Message({
          message: this.CommonTxt.saveSuccess,
          type: 'success',
          duration: 1500,
        });
        this.cantractHistory = res;
        this.dataOriginal = JSON.parse(JSON.stringify(this.cantractHistory));
      }).catch(err => {
        if (err.response.status === 424) {
          Message({
            message: this.CommonTxt.deleteNotPermission,
            type: 'error',
            duration: 1500,
          });
        }
        if (err.response.status === 410) {
          this.redirectPage({ 'name': 'err_404', params: { redirect: true }});
        }
      }).finally(() => {
        this.acting = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./styles/edit";
</style>
