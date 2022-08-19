<template>
  <div class="app-container">
    <el-tabs
      v-model="activeTab"
      type="border-card"
      class="tab-custom"
      @tab-click="tabClick"
    >
      <el-tab-pane name="register" :lazy="true">
        <span slot="label">
          自分が申請した書類
        </span>
        <el-scrollbar class="scroll-content">
          <ApprovalNotificationOwnerRegister ref="tabRegister" />
        </el-scrollbar>
      </el-tab-pane>
      <el-tab-pane name="approved" :lazy="true">
        <span slot="label">
          自分が承認した書類
        </span>
        <!-- <el-scrollbar class="scroll-content"> -->
        <ApprovalNotificationOwnerApproved ref="tabApproved" />
        <!-- </el-scrollbar> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CommonSettings from '@/const/CommonSettings';

import ApprovalNotificationOwnerRegister from './modal/ApprovalNotificationOwnerRegister.vue';
import ApprovalNotificationOwnerApproved from './modal/ApprovalNotificationOwnerApproved.vue';

import { Tab } from './mixins/Index/Tab';

export default {
  name: 'Notification',
  components: {
    ApprovalNotificationOwnerRegister,
    ApprovalNotificationOwnerApproved,
  },
  metaInfo: {
    title: '承認一覧',
  },
  mixins: [Tab],
  data() {
    return {
      commonText: CommonSettings.COMMON_TXT,
    };
  },
  methods: {
    //
  },
};
</script>

<style lang="scss" scoped>
@import './styles/Index/tab-panel.scss';
</style>
