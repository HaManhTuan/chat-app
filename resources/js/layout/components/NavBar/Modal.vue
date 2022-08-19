<template>
  <div>
    <el-dialog title="所属の切替" :visible.sync="show" :before-close="closeModal" top="52px" class="custom-dialog" :append-to-body="true">
      <h3 class="mt-0 title-2">現在の権限</h3>
      <div class="label-role">
        <div class="label-role-item">
          <div class="label-role-item_label">
            <span>所属</span>
          </div>
          <div class="label-role-item_content">
            <span>{{ defaultOrg }}</span>
          </div>
        </div>
        <div class="label-role-item">
          <div class="label-role-item_label">
            <span>権限</span>
          </div>
          <div class="label-role-item_content">
            <span>{{ defaultRole }}</span>
          </div>
        </div>
      </div>
      <hr class="hr-modal-role">
      <h3 class="mt-0 title-2">保持権限</h3>
      <el-table v-loading="listLoading" class="table-role" :data="dataTable" :empty-text="CommonTxt.tableEmptyTxt" fit highlight-current-row header-cell-class-name="my-header">
        <!-- 1 -->
        <el-table-column :label="defaultOrgTitle" width="320px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.organization != null ? scope.row.organization.name : '' }}</span>
          </template>
        </el-table-column>
        <!-- 2 -->
        <el-table-column :label="defaultRoleTitle" width="330px">
          <template slot-scope="scope">
            <span class="ellipsis">{{ scope.row.role != null ? scope.row.role.name_jp : '' }}</span>
          </template>
        </el-table-column>
        <!-- 3 -->
        <el-table-column width="116px">
          <template slot-scope="scope">
            <el-button class="btn-switch" sze="mini" @click="changeRole(scope.row.id, 'switch')">
              <svg-icon icon-class="transfer_role" />
              権限切替
            </el-button>
          </template>
        </el-table-column>
        <!-- 4 -->
        <el-table-column width="100px">
          <template slot="header">
            <span class="title-2line">ログイン時の<br>権限に設定する</span>
          </template>
          <template slot-scope="scope">
            <el-button
              class="btn-config"
              size="mini"
              @click="changeRole(
                scope.row.id,
                'config',
                scope.row.organization != null ? scope.row.organization.name : '',
                scope.row.role != null ? scope.row.role.name_jp : ''
              )"
            >
              設定
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <custom-pagination
        :total="paginate.total"
        :page.sync="paginate.page"
        :limit.sync="paginate.limit"
        layout="prev, pager, next"
        prev-text="<"
        next-text=">"
        class="text-center custom-pagination mb-3"
        @pagination="getMyRole"
      />
    </el-dialog>
  </div>
</template>
<script>
import CustomPagination from '../../../components/Common/Pagination/CustomPagination';
import UserApi from '@/api/user';

const userApi = new UserApi();

export default {
  name: 'ModalRole',
  components: {
    CustomPagination,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      listLoading: true,
      defaultOrg: null,
      defaultRole: null,
      organizations: null,
      defaultOrgTitle: null,
      defaultRoleTitle: null,
      userId: null,
      rolesOrgs: null,
      dataTable: null,
      roles: null,
      paginate: {
        total: 0,
        limit: 5,
        page: 1,
      },
    };
  },
  created() {
    this.userId = this.$store.getters.userId;
    this.init();
  },
  methods: {
    init(){
      this.defaultOrg = this.truncate(this.$store.getters.defaultOrg != null ? this.$store.getters.defaultOrg.name : '', 30);
      this.defaultRole = this.$store.getters.arrRoles.filter(role => role.name === this.$store.getters.roles[0])[0]['name_jp'];
      this.defaultOrgTitle = _.clone(this.defaultOrg);
      this.defaultRoleTitle = _.clone(this.defaultRole);
      this.paginate.total = Number(this.$store.getters.orgs.length);
      this.getMyRole();
    },
    async getMyRole() {
      this.listLoading = true;
      const res = await userApi.getMyRole(this.userId, this.paginate);
      this.dataTable = res.data;
      this.paginate.total = res.total;
      this.paginate.page = res.current_page;
      this.listLoading = false;
    },
    closeModal() {
      this.paginate.page = 1;
      this.getMyRole();
      this.$emit('close');
    },
    async changeRole(id, type, org, role) {
      await userApi.changeRole(id).then((valid) => {
        if (valid) {
          this.$message({
            message: '変更しました。',
            type: 'success',
          });
          if (type === 'switch'){
            this.closeModal();
            this.$router.go();
          } else {
            // this.defaultOrgTitle = this.truncate(org, 30);
            // this.defaultRoleTitle = role;
            // console.log(this.defaultOrgTitle, this.defaultRoleTitle);
          }
        }
      });
    },
    truncate(str, n){
      n = 100;
      return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
    },
  },
};
</script>
<style lang="scss" scoped>
  @import '../styles/modalRole.scss';
</style>
