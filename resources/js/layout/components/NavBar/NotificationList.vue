<template>
  <div v-if="!ableRole(['callcenter','viewonly']) && dataNotification.length > 0" class="list-notification">
    <div class="content-notification">
      <ul class="list-group">
        <el-scrollbar view-style="max-height: 270px">
          <li v-for="data in dataNotification" :key="data.id" class="list-group-item">
            <span class="noti-item" @click="redirect">
              {{ data.name }}
              未承認 {{ data.count }}件
            </span>
          </li>
        </el-scrollbar>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NotificationList',
  computed: {
    ...mapGetters([
      'isShowNotificationList',
      'dataNotification',
    ]),
  },
  methods: {
    mouseleave() {
      this.$store.dispatch('app/setIsShowNotificationList', false);
    },
    redirect() {
      const resolved = this.$router.resolve({
        name: 'approval',
        query: {
          tab: 'approved',
        },
      });
      window.location.href = resolved.href;
    },
  },
};
</script>
<style lang="scss" scoped>
.navbar .right-menu .avatar-container .icon-notification svg.top-icon::v-deep {
  font-size: 20px;
}

/deep/ .el-scrollbar__wrap {
  margin-bottom: 0 !important;
}

.list-notification {
  display: none;
  position: fixed;
  top: 55px;
  right: 0;
  width: 400px;
  z-index: 99999;

  .list-group {
    border: 1px solid #D6D6D6;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    padding-left: 0;
    margin-bottom: 0;
    margin-block-start: 0px;
    margin-inline-end: 55px;
    text-align: left;

    .list-group-item:first-child {
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
    }

    .list-group-item {
      color: #1a1714;
      position: relative;
      //padding: 0px 15px;
      display: block;
      margin-bottom: -1px;
      background-color: #fff;
      border: 1px solid rgba(0, 0, 0, .125);

      &:hover {
        cursor: pointer;
        background: #a0bad2 0% 0% no-repeat padding-box;
      }
    }

    .list-group-item:last-child {
      margin-bottom: 0;
      border-bottom-right-radius: 0.25rem;
      border-bottom-left-radius: 0.25rem;
    }
  }
}

.noti-item {
  display: inline-block;
  width: 100%;
  padding: 0px 15px;
}
</style>
