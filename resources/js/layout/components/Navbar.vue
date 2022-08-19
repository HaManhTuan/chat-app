<template>
  <div class="navbar popper">
    <div class="navbar-logo">
      <Logo />
    </div>
    <!--    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />-->
    <div class="navbar-container">
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
      <div class="right-menu">
        <!--  -->
        <div class="avatar-container right-menu-item search-form">
          <el-input
            v-model="form.keyword"
            placeholder="生徒を検索"
            @keyup.native.enter="doSearch"
          >
            <template slot="append">
              <svg-icon icon-class="_search" @click="doSearch" />
            </template>
          </el-input>
        </div>
        <!--  -->
        <!--  -->
        <div class="avatar-container right-menu-item approval-notification">
          <ApprovalNotification />
        </div>
        <!--  -->
        <!--  -->
        <div
          class="
          avatar-container
          right-menu-item
          hover-effect
          icon-notification"
        >
          <div
            class="avatar-wrapper"
            @mouseover="showAlert"
            @mouseleave="closeAlert"
          >
            <!--            <router-link to="/approval/?page=1&snz_approve_status=2&limit=20&tab=approved">-->
            <!--              <span v-if="totalNotification" class="notification">{{ totalNotification }}</span>-->
            <!--              <svg-icon icon-class="_noti" class="top-icon bell" />-->
            <!--            </router-link>-->
            <span v-if="totalNotification" class="notification">{{ totalNotification }}</span>
            <svg-icon icon-class="_noti" class="top-icon bell" />
            <div v-if="isAlert" class="content-alert">
              <p>承認依頼がありません。</p>
            </div>
            <NotificationList />
          </div>
        </div>
        <!--  -->
        <!--  -->
        <div class="avatar-container right-menu-item hover-effect user-avatar">
          <ElDropdown
            ref="dropdownAvatar"
            class="avatar-container right-menu-item"
            trigger="click"
          >
            <div class="avatar-wrapper">
              <svg-icon icon-class="_user" class="top-icon" />
            </div>
            <ElDropdownMenu slot="dropdown" class="popup-menu">
              <div>
                <h3>{{ authUser.name }}</h3>
                <p class="text-popup">
                  <span class="ellipsis">所属：{{ defaultOrg }}</span>
                  <br>
                  <span>権限：{{ defaultRole }}</span>
                </p>
                <div class="custom-btn-group">
                  <!-- show modal change role -->
                  <button class="btn-switch" @click="showModalChangeRole">
                    所属の切替
                  </button>
                  <!-- logout -->
                  <ButtonLogout @click="logout" />
                </div>
              </div>
            </ElDropdownMenu>
          </ElDropdown>
          <div class="avatar-wrapper">
            <svg-icon icon-class="user" class="top-icon" />
          </div>
        </div>
        <!--  -->
      </div>
    </div>
    <ModalRole
      ref="modalRole"
      class="model-role"
      :show="showModalRole"
      @close="closeModalChangeRole"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Breadcrumb from '@/components/Breadcrumb';
import Logo from '../../views/auth/login/components/Logo';
import ButtonLogout from '../../components/Common/Button/ButtonLogout';
import ModalRole from './NavBar/Modal';
import NotificationList from './NavBar/NotificationList';

// import Hamburger from '@/components/Hamburger';
import ApprovalNotification from './ApprovalNotification/ApprovalNotification.vue';
import ApprovalAcceptedResource from '@/api/ApprovalNotification/ApprovalAccepted';
const approvalAccepted = new ApprovalAcceptedResource();

export default {
  components: {
    ButtonLogout,
    Logo,
    Breadcrumb,
    ModalRole,
    // Hamburger,
    ApprovalNotification,
    NotificationList,
  },
  data() {
    return {
      showModalRole: false,
      defaultOrg: null,
      defaultRole: null,
      form: {
        keyword: '',
      },
      isAlert: false,
    };
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device',
      'authUser',
      'userId',
      'totalNotification',
    ]),
  },

  async created() {
    // Get count notification
    this.defaultOrg =
      this.$store.getters.defaultOrg != null
        ? this.$store.getters.defaultOrg.name
        : '';
    this.defaultRole = this.$store.getters.arrRoles.filter(
      role => role.name === this.$store.getters.roles[0]
    )[0]['name_jp'];
    const res = await approvalAccepted.countNotification();
    const data = res.original.data ? res.original.data : {};
    const total = res.original.total ? res.original.total : null;
    await this.$store.dispatch('app/setDataNotification', data);
    await this.$store.dispatch('app/setTotalNotification', total);
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      // location.reload();
      location.href = '/login';
    },
    doSearch() {
      if (this.form.keyword) {
        this.$router.push({
          name: 'Student.Search',
          query: { phrase: this.form.keyword, tz: moment().valueOf() },
        });
      }
    },
    showModalChangeRole() {
      this.$refs.dropdownAvatar.hide();
      this.showModalRole = true;
      this.$refs.modalRole.getMyRole();
    },
    closeModalChangeRole() {
      // this.$refs.dropdownAvatar.show();
      this.showModalRole = false;
    },
    showAlert() {
      if (this.totalNotification === 0 || !(this.totalNotification)) {
        this.isAlert = true;
      }
    },
    closeAlert(){
      this.isAlert = false;
    },
  },
};
</script>

<style lang="scss" scoped>

.btn-switch {
  background: #f4f8fd 0% 0% no-repeat padding-box !important;
  color: #1467b3;
  opacity: 1;
  font-family: Noto Sans JP;
  border: none !important;
  border-radius: 5px;
  min-width: 55px;
  height: 34px;
  width: 118px;
  margin-right: 13px;
  &:hover {
    opacity: 0.8;
  }
  span {
    font-size: 15px;
    font-weight: 500 !important;
  }
}
.btn-switch:hover {
  background: #f4f8fd 0% 0% no-repeat padding-box !important;
  color: #1467b3;
}
.popup-menu {
  transform-origin: center top;
  z-index: 2003 !important;
  position: absolute;
  top: 63px !important;
  width: 289px;
  min-height: 165px;
  padding: 20px;
  border-radius: 10px;
  h3 {
    font-size: 18px;
    font-weight: 500;
    margin-top: 0;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
  }
  .custom-btn-group {
    display: flex;
  }
  /deep/ .popper__arrow {
    &::after {
      width: 0px !important;
      border-width: 0px 10px 20px 10px !important;
      top: -14px !important;
    }
  }
}
.text-popup {
  font-size: 15px;
  font-weight: 400;
  color: #919191;
  letter-spacing: 0.24px;
  line-height: 25px;
}
.navbar {
  height: 55px;
  overflow: hidden;
  position: relative;
  background: #5b8fbf;
  line-height: 55px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  color: #fff;
  min-width: 1366px;
  .navbar-logo {
    width: 151px;
    height: 55px;
    padding: 2px 0;
    display: inline-block;
    float: left;
    background: #004b9e 0% 0% no-repeat padding-box;
    text-align: center;
    line-height: 55px;
    svg {
      height: 51px;
    }
  }
  .navbar-container {
    width: calc(100% - 151px);
    display: inline-block;
    float: left;
    color: #fff;
    line-height: 55px;
    height: 55px;
    background: #5b8fbf 0% 0% no-repeat padding-box;
  }
  .hamburger-container {
    line-height: 55px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 52px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .search-form::v-deep {
      input.el-input__inner {
        height: 38px !important;
        line-height: 38px !important;
        border: none !important;
        padding: 8px 20px 8px 22px;
      }
      .el-input-group {
        background: #ffffff 0% 0% no-repeat padding-box;
        border-radius: 25px;
        opacity: 1;
        overflow: hidden;
        width: 225px;
        height: 38px;
      }
      .el-input-group__append {
        background: transparent;
        cursor: pointer;
        border: none;
        line-height: 16px;
        svg {
          width: 24px;
          height: 24px;
          color: #1a1714;
        }
      }
    }
    .avatar-container {
      &.search-form {
        margin-right: 10px;
        .el-input-group--append.el-input--mini {
          background: #ffffff 0% 0% no-repeat padding-box;
          border-radius: 25px;
          height: 37px;
          width: 225px;
          overflow: hidden;
        }
      }
      &.approval-notification {
        //
      }
      &.icon-notification {
        .avatar-wrapper {
          &:hover .list-notification{
            display: block;
          }

        }
      }
      &.user-avatar {
        .avatar-wrapper {
          background: #2969a3;
        }
      }
      .avatar-wrapper {
        position: relative;
        width: 55px;
        height: 55px;
        text-align: center;
        padding: 8px 0;
        .content-alert {
          position: fixed;
          cursor: pointer;
          width: 300px;
          top: 55px;
          right: 0;
          background-color: #f4f8fc;
          p{
            padding: 0;
            margin: 0;
            color: black;
          }
        }
        svg.top-icon {
          height: 31px;
          width: 31px;
          color: #fff;
        }
        .notification {
          background-color: #c70000;
          font-size: 10px;
          font-weight: 600;
          height: 14px;
          padding: 0 4px;
          position: absolute;
          left: 29px;
          top: 10px;
          border-radius: 10px;
          line-height: 13px;
          color: #fff;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          //display: inline-block;
          //position: absolute;
          //border-radius: 50px;
          //right: 3px;
          //top: -10px;
          //font-size: 16px;
          //color: #c70000;
          //font-weight: 600;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
